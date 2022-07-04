import { gql } from "@apollo/client";

export const GET_USUARIOS = gql`
  query Usuarios($filtro: filtroUsuarios) {
    Usuarios(filtro: $filtro) {
      _id
      nombre
      correo
      apellido
      identificacion
      estado
      rol
    }
  }
`;

export const GET_USUARIO = gql`
  query Usuario($_id: String!) {
    Usuario(_id: $_id) {
      _id
      nombre
      correo
      apellido
      identificacion
      estado
      rol
    }
  }
`;
