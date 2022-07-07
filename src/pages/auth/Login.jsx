import React, { useEffect } from 'react';
import { useMutation } from '@apollo/client';
import { Link, useNavigate } from 'react-router-dom';
import ButtonLoading from '../../components/ButtonLoading';
import Input from '../../components/Input';
import useFormData from '../../hooks/useFormData';
import { LOGIN } from '../../graphql/auth/mutations';
import { useAuth } from '../../context/authContext';

function Login() {
  const navigate = useNavigate();
  const { form, formData, updateFormData } = useFormData(null);
  const { setToken } = useAuth();
  const [login, { data: dataMutation, loading: mutationLoading }] =
    useMutation(LOGIN);

  const submitForm = (e) => {
    e.preventDefault();
    login({
      variables: formData,
    });
  };

  useEffect(() => {
    if (dataMutation) {
      console.log(dataMutation);
      if (dataMutation.login.token) {
        setToken(dataMutation.login.token);
        navigate('/');
      }
    }
  }, [dataMutation, setToken, navigate]);
  return (
    <div className='flex flex-col items-center justify-center w-full h-full p-10'>
      <h1 className='text-xl font-bold text-gray-900'>Iniciar sesión</h1>
      <form
        className='flex flex-col'
        onSubmit={submitForm}
        onChange={updateFormData}
        ref={form}
      >
        <Input name='correo' type='email' label='Correo' required />
        <Input name='password' type='password' label='Contraseña' required />
        <ButtonLoading
          disabled={Object.keys(formData).length === 0}
          loading={false}
          text='Iniciar Sesión'
        />
      </form>
      <span>¿No tienes una cuenta?</span>
      <Link to='/auth/register'>
        <span className='text-blue-700'>Regístrate</span>
      </Link>
    </div>
  );
}

export default Login;
