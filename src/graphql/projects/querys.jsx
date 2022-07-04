import { gql } from "@apollo/client";

const PROJECTS = gql`
  query Proyectos {
    Proyectos {
      _id
      nombre
      presupuesto
      estado
      lider {
        correo
      }
      objetivos {
        _id
        descripcion
        tipo
      }
    }
  }
`;

export { PROJECTS };
