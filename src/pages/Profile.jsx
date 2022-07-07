import { useEffect } from 'react';
import { useMutation } from '@apollo/client';
import { toast } from 'react-toastify';
import Input from '../components/Input';
import ButtonLoading from '../components/ButtonLoading';
import useFormData from '../hooks/useFormData';
import { uploadFormData } from '../utils/uploadFormData';
import { EDITAR_PERFIL } from '../graphql/users/mutations';
import { useUser } from '../context/userContext';

function Profile() {
  const { form, formData, updateFormData } = useFormData();
  const { userData, setUserData } = useUser();
  const [
    editarPerfil,
    { data: dataMutation, error: errorMutation, loading: loadingMutation },
  ] = useMutation(EDITAR_PERFIL);

  useEffect(() => {
    console.log('DM', dataMutation);
    if (dataMutation) {
      setUserData({ ...userData, foto: dataMutation.editarPerfil.foto });
      toast.success('Profile has been updated succesfully');
    }
  }, [dataMutation]);
  const submitForm = async (e) => {
    e.preventDefault();
    const formUploaded = await uploadFormData(formData);
    console.log(formUploaded);
    editarPerfil({ variables: { _id: userData._id, campos: formUploaded } });
  };
  return (
    <div className='p-10 flex flex-col items-center justify-center w-full'>
      <h1 className='font-bold text-2xl text-gray-900'>Perfil del usuario</h1>
      <form ref={form} onChange={updateFormData} onSubmit={submitForm}>
        <Input label='Nombre' name='nombre' type='text' required />
        <Input label='Apellido' name='apellido' type='text' required />
        <Input
          label='Indentificacion'
          name='identificacion'
          type='text'
          required
        />
        <Input label='Foto' name='foto' type='file' required />
        <ButtonLoading
          text='Confirmar'
          loading={loadingMutation}
          disabled={false}
        />
      </form>
    </div>
  );
}

export default Profile;
