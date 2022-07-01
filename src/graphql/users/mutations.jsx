import { gql } from "@apollo/client";

export const EDITAR_USUARIO = gql`
  mutation EditarUsuario(
    $_id: String!
    $nombre: String!
    $correo: String!
    $apellido: String!
    $identificacion: String!
    $estado: Enum_EstadoUsuario!
  ) {
    editarUsuario(
      _id: $_id
      nombre: $nombre
      correo: $correo
      apellido: $apellido
      identificacion: $identificacion
      estado: $estado
    ) {
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
