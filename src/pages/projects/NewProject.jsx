import { useMutation, useQuery } from "@apollo/client";
import { nanoid } from "nanoid";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ButtonLoading from "../../components/ButtonLoading";
import DropDown from "../../components/Dropdown";
import Input from "../../components/Input";
import { ObjContext, useObj } from "../../context/objContext";
import { CREAR_PROYECTO } from "../../graphql/projects/mutations";
import { GET_USUARIOS } from "../../graphql/users/queries";
import useFormData from "../../hooks/useFormData";
import { Enum_TipoObjetivo } from "../../utils/enums";

const NewProject = () => {
  const { form, formData, updateFormData } = useFormData();
  const [listaUsuarios, setListaUsuarios] = useState({});
  const { data, loading, error } = useQuery(GET_USUARIOS, {
    variables: { filtro: { rol: "LIDER", estado: "AUTORIZADO" } },
  });
  const [
    crearProyecto,
    { data: mutationData, loading: mutationLoading, error: mutationError },
  ] = useMutation(CREAR_PROYECTO);
  //   const [crearProyecto] = useMutation(CREAR_PROYECTO);

  useEffect(() => {
    // console.log("OBJETIVOS", objetivos);
    if (data) {
      const lu = {};
      data.Usuarios.forEach((d) => {
        lu[d._id] = d.correo;
      });
      console.log(lu);
      setListaUsuarios(lu);
    }
  }, [data]);

  const submitForm = (e) => {
    e.preventDefault();

    console.log(formData);
    // formData.nested.objetivos = Object.values(formData.nested.objetivos);
    formData.presupuesto = parseInt(formData.presupuesto);

    crearProyecto({ variables: formData });
  };

  useEffect(() => {
    console.log(mutationData);
  }, []);

  if (loading) return <div>Loading ....</div>;
  return (
    <div className="p-10 flex flex-col items-center">
      <div className="self-start">
        <Link to="/projects">Return</Link>
      </div>

      <h1 className="font-bold">Crear Nuevo Proyecto</h1>
      <form ref={form} onChange={updateFormData} onSubmit={submitForm}>
        <Input
          name="nombre"
          label="Nombre del Proyecto"
          required={true}
          type="text"
        />
        <Input
          name="presupuesto"
          label="Presupuesto del Proyecto"
          required={true}
          type="number"
        />
        <Input
          name="fechaInicio"
          label="Fecha de Inicio"
          required={true}
          type="date"
        />
        <Input
          name="fechaFin"
          label="Fecha de Fin"
          required={true}
          type="date"
        />
        <DropDown
          label="Lider"
          options={listaUsuarios}
          name="lider"
          required={true}
        />
        {/* <Objetivo /> */}
        <ButtonLoading disabled={false} loading={false} text="Crear" />
      </form>
    </div>
  );
};

const Objetivo = () => {
  const [objetivos, setObjetivos] = useState([]);
  console.log(objetivos);

  //add input
  const objetivoAgreado = () => {
    const id = nanoid();
    return <FormObjetivo key={id} id={id} />;
  };

  // remove input
  const eliminarObjetivo = (id) => {
    setObjetivos(objetivos.filter((obj) => obj.props.id !== id));
  };

  return (
    <ObjContext.Provider value={{ eliminarObjetivo, objetivos }}>
      <div>
        <p>Nuevo objetivo</p>
        <button onClick={() => setObjetivos([...objetivos, objetivoAgreado()])}>
          mas
        </button>

        {objetivos.map((obj) => obj)}
      </div>
    </ObjContext.Provider>
  );
};
//TODO: REFATORIZE CREATION OBJECT
const FormObjetivo = ({ id }) => {
  const { eliminarObjetivo } = useObj();
  return (
    <div className="flex">
      <Input
        name={`nested||objetivos||${id}||descripcion`}
        label="Descripcion"
        type="text"
        required={true}
      />
      <DropDown
        name={`nested||objetivos||${id}||tipo`}
        options={Enum_TipoObjetivo}
        label="Tipo de Objetivo"
        required={true}
      />
      <button onClick={() => eliminarObjetivo(id)}>menos</button>
    </div>
  );
};

export default NewProject;
