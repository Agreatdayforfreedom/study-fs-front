import { useMutation, useQuery } from '@apollo/client';
import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import ButtonLoading from '../../components/ButtonLoading';
import DropDown from '../../components/Dropdown';
import Input from '../../components/Input';
import { EDITAR_USUARIO } from '../../graphql/users/mutations';
import { GET_USUARIO } from '../../graphql/users/queries';
import useFormData from '../../hooks/useFormData';
import { Enum_EstadoUsuario, Enum_Rol } from '../../utils/enums';

function Editar() {
  const { _id } = useParams();
  const { form, formData, updateFormData } = useFormData(null);
  const {
    data: queryData,
    error: queryError,
    loading: queryLoading,
  } = useQuery(GET_USUARIO, {
    variables: { _id },
  });

  const [
    editarUsuario,
    { data: mutationData, loading: mutationLoading, error: mutationError },
  ] = useMutation(EDITAR_USUARIO);

  const submitForm = (e) => {
    e.preventDefault();
    editarUsuario({
      variables: { _id, ...formData, rol: 'ADMINISTRADOR' },
    });
  };

  useEffect(() => {
    if (mutationData) {
      toast.success('Usuario modificado con exito');
    }
  }, [mutationData]);

  useEffect(() => {
    if (mutationError) {
      toast.error('Error al actualizar');
    }

    if (queryError) {
      toast.error('Error al consultar');
    }
  }, [queryError, mutationError]);

  if (queryLoading) return <div>Cargando...</div>;
  return (
    <div className='flew flex-col w-full h-full items-center justify-center p-10'>
      <Link to='/'>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          className='h-6 w-6'
          fill='none'
          viewBox='0 0 24 24'
          stroke='currentColor'
          strokeWidth={2}
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            d='M11 17l-5-5m0 0l5-5m-5 5h12'
          />
        </svg>
      </Link>
      <h1 className='m-4 text-3xl text-gray-800 font-bold text-center'>
        Editar Usuario
      </h1>
      <form
        onSubmit={submitForm}
        onChange={updateFormData}
        ref={form}
        className='flex flex-col items-center justify-center'
      >
        <Input
          label='Nombre de la persona:'
          type='text'
          name='nombre'
          defaultValue={queryData?.Usuario.nombre}
          required
        />

        <Input
          label='Apellido de la persona:'
          type='text'
          name='apellido'
          defaultValue={queryData?.Usuario.apellido}
          required
        />
        <Input
          label='Correo de la persona:'
          type='email'
          name='correo'
          defaultValue={queryData?.Usuario.correo}
          required
        />
        <Input
          label='Identificación de la persona:'
          type='text'
          name='identificacion'
          defaultValue={queryData?.Usuario.identificacion}
          required
        />
        <DropDown
          label='Estado de la persona:'
          name='estado'
          defaultValue={queryData?.Usuario.estado}
          required
          options={Enum_EstadoUsuario}
        />
        <span>Rol del usuario: {queryData?.Usuario.rol}</span>
        <ButtonLoading
          disabled={Object.keys(formData).length === 0}
          loading={mutationLoading}
          text='Confirmar'
        />
      </form>
    </div>
  );
}

export default Editar;
