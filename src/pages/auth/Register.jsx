import { Link } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import React, { useEffect } from 'react';
import Input from '../../components/Input';
import DropDown from '../../components/Dropdown';
import ButtonLoading from '../../components/ButtonLoading';
import { Enum_Rol } from '../../utils/enums';
import useFormData from '../../hooks/useFormData';
import { REGISTRO } from '../../graphql/auth/mutations';

function Register() {
  const { form, formData, updateFormData } = useFormData(null);

  const [
    registro,
    { data: dataMutation, loading: loadingMutation, error: errorMutation },
  ] = useMutation(REGISTRO);
  const submitForm = (e) => {
    e.preventDefault();
    registro({ variables: formData });
  };

  useEffect(() => {
    if (dataMutation) {
      console.log(dataMutation);
      if (dataMutation.registro.token) {
        localStorage.setItem('token', dataMutation.registro.token);
      }
    }
  }, [dataMutation]);

  return (
    <div className='flex flex-col h-full w-full items-center justify-center'>
      <h1 className='text-3xl font-bold my-4'>Regístrate</h1>
      <form
        className='flex flex-col'
        onSubmit={submitForm}
        onChange={updateFormData}
        ref={form}
      >
        <div className='grid grid-cols-2 gap-5'>
          <Input label='Nombre:' name='nombre' type='text' required />
          <Input label='Apellido:' name='apellido' type='text' required />
          <Input
            label='Documento:'
            name='identificacion'
            type='text'
            required
          />
          <DropDown
            label='Rol deseado:'
            name='rol'
            required
            options={Enum_Rol}
          />
          <Input label='Correo:' name='correo' type='email' required />
          <Input label='Contraseña:' name='password' type='password' required />
        </div>
        <ButtonLoading
          //   disabled={Object.keys(formData).length === 0}
          loading={false}
          text='Registrarme'
        />
      </form>
      <span>¿Ya tienes una cuenta?</span>
      <Link to='/auth/login'>
        <span className='text-blue-700'>Inicia sesión</span>
      </Link>
    </div>
  );
}

export default Register;
