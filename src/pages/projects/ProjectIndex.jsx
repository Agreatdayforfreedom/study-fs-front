import React, { useEffect, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import { styled } from "@mui/material/styles";
import { PROJECTS } from "../../graphql/projects/querys";
import PrivateComponent from "../../components/PrivateComponent";
import { Link } from "react-router-dom";
import { Dialog } from "@mui/material";
import DropDown from "../../components/Dropdown";
import { Enum_EstadoProyecto } from "../../utils/enums";
import ButtonLoading from "../../components/ButtonLoading";
import { EDITAR_PROYECTO } from "../../graphql/projects/mutations";
import { useAuth } from "../../context/authContext";
import useFormData from "../../hooks/useFormData";
import { CREAR_INSCRIPCION } from "../../graphql/inscriptions/mutations";
import { useUser } from "../../context/userContext";
import { toast } from "react-toastify";

const AccordionStyled = styled((props) => <Accordion {...props} />)(() => ({
  backgroundColor: "#919191",
}));
const AccordionSummaryStyled = styled((props) => (
  <AccordionSummary {...props} />
))(() => ({
  backgroundColor: "#919191",
}));
const AccordionDetailsStyled = styled((props) => (
  <AccordionDetails {...props} />
))(() => ({
  backgroundColor: "#ccc",
}));

const ProjectIndex = () => {
  const { data: queryData, loading } = useQuery(PROJECTS);

  console.log("projects here ", queryData);
  if (loading) return <div>Cargando...</div>;
  if (!queryData) return <div>No Hay Proyectos </div>;
  if (queryData.Proyectos) {
    return (
      <div className="p-10 flex flex-col">
        <div className="flex w-full items-center justify-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Lista de Proyectos
          </h1>
        </div>
        <PrivateComponent roleList={["ADMINISTRADOR", "LIDER"]}>
          <div className="my-2 self-end">
            <button
              type="button"
              className="bg-indigo-500 text-gray-50 p-2 rounded-lg shadow-lg hover:bg-indigo-400"
            >
              <Link to="/proyectos/nuevo">Crear nuevo proyecto</Link>
            </button>
          </div>
        </PrivateComponent>
        {queryData.Proyectos.map((proyecto) => (
          <AccordionProyecto key={proyecto._id} proyecto={proyecto} />
          //   <p>hello</p>
        ))}
      </div>
    );
  }
  return <></>;
};
const AccordionProyecto = ({ proyecto }) => {
  const [showDialog, setShowDialog] = useState(false);

  return (
    <>
      <AccordionStyled>
        <AccordionSummaryStyled>
          <div className="flex w-full justify-between">
            <div className="uppercase font-bold text-gray-100 ">
              {proyecto.nombre} - {proyecto.estado}
            </div>

            <button
              className="text-orange-400 font-bold"
              onClick={() => {
                setShowDialog(true);
              }}
            >
              Edit
            </button>
          </div>
        </AccordionSummaryStyled>
        <AccordionDetailsStyled>
          <PrivateComponent roleList={["ESTUDIANTE"]}>
            <InscripcionProyecto
              idProyecto={proyecto._id}
              estado={proyecto.estado}
              inscripciones={proyecto.inscripciones}
            />
          </PrivateComponent>
          <div className="flex">
            {proyecto.objetivos.length != 0 ? (
              proyecto.objetivos.map((objetivo, index) => (
                <Objetivo
                  key={objetivo._id}
                  index={index}
                  _id={objetivo._id}
                  idProyecto={proyecto._id}
                  tipo={objetivo.tipo}
                  descripcion={objetivo.descripcion}
                />
              ))
            ) : (
              <p>no hay objetivo</p>
            )}
          </div>
        </AccordionDetailsStyled>
      </AccordionStyled>
      <Dialog
        open={showDialog}
        onClose={() => {
          setShowDialog(false);
        }}
      >
        <FormEditProject _id={proyecto._id} />
      </Dialog>
    </>
  );
};

const FormEditProject = ({ _id }) => {
  const [editarProyecto, { data: dataMutation, loading, error }] =
    useMutation(EDITAR_PROYECTO);
  const { form, formData, updateFormData } = useFormData();
  const submitForm = (e) => {
    e.preventDefault();
    editarProyecto({
      variables: {
        _id,
        campos: formData,
      },
    });
  };
  return (
    <div className="p-4">
      <form
        ref={form}
        onChange={updateFormData}
        onSubmit={submitForm}
        className="flex flex-col items-center"
      >
        <DropDown
          label="Estado del Proyecto"
          name="estado"
          options={Enum_EstadoProyecto}
        />
        <ButtonLoading disabled={false} loading={false} text="Confirmar" />
      </form>
    </div>
  );
};

const Objetivo = ({ tipo, descripcion }) => {
  return (
    <div>
      <div>{tipo}</div>
      <div>{descripcion}</div>
    </div>
  );
};

const InscripcionProyecto = ({ idProyecto, estado, inscripciones }) => {
  const [isPendiente, setIsPendiente] = useState("");
  const [crearInscripcion, { data, loading, error }] =
    useMutation(CREAR_INSCRIPCION);
  const { userData } = useUser();

  useEffect(() => {
    if (userData && inscripciones) {
      const flt = inscripciones.filter(
        (e) => e.estudiante._id === userData._id
      );
      if (flt.length > 0) {
        setIsPendiente(flt[0]._id);
      }
    }
  }, [userData, inscripciones]);
  useEffect(() => {
    if (data) {
      console.log(data);
      toast.success("Inscripcion enviada");
    }
  }, [data]);

  const confirmarInscripcion = () => {
    crearInscripcion({
      variables: { proyecto: idProyecto, estudiante: userData._id },
    });
  };
  return isPendiente !== "" ? (
    <span className="font-bold border border-indigo-300 flex align-center justify-center p-2 my-2 text-indigo-400 text-xl">
      Tu solicitud esta pendiente
    </span>
  ) : (
    <ButtonLoading
      onClick={() => confirmarInscripcion()}
      disabled={estado === "INACTIVO"}
      loading={loading}
      text="Inscribirse al proyecto"
    />
  );
};

export default ProjectIndex;
