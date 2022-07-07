import { useQuery } from '@apollo/client';
import React, { useEffect } from 'react';

import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { GET_USUARIOS } from '../../graphql/users/queries';
import PrivateRoute from '../../components/PrivateRoute';

function UserIndex() {
  const { data, error, loading } = useQuery(GET_USUARIOS);

  useEffect(() => {
    console.log(data);
  }, [data]);

  useEffect(() => {
    if (error) {
      toast.error('Error al cargar');
    }
  }, [error]);

  if (loading) return <div>Cargando...</div>;
  return (
    <PrivateRoute roleList={['ADMINISTRADOR']}>
      <div>
        <table className='tabla'>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Apellidos</th>
              <th>Correo</th>
              <th>Identificación</th>
              <th>Rol</th>
              <th>Estado</th>
              <th>Editar</th>
            </tr>
          </thead>
          <tbody>
            {data && data.Usuarios ? (
              <>
                {data.Usuarios.map((u) => (
                  <tr key={u._id}>
                    <td>{u.nombre}</td>
                    <td>{u.apellido}</td>
                    <td>{u.correo}</td>
                    <td>{u.identificacion}</td>
                    <td>{u.rol}</td>
                    <td>{u.estado}</td>
                    <td>
                      <Link to={`editar/${u._id}`}>
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          className='h-6 w-6'
                          fill='none'
                          viewBox='0 0 24 24'
                          stroke='#FFA500'
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            d='M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z'
                          />
                        </svg>
                      </Link>
                    </td>
                  </tr>
                ))}
              </>
            ) : (
              <div>No autorizado</div>
            )}
          </tbody>
        </table>
      </div>
    </PrivateRoute>
  );
}

export default UserIndex;
