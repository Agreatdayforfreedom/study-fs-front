import { gql } from "@apollo/client";

const PROJECTS = gql`
  query Proyectos {
    Proyectos {
      _id
      nombre
      presupuesto
      estado
      lider {
        _id
        correo
      }
      objetivos {
        _id
        descripcion
        tipo
      }
      inscripciones {
        estado
        estudiante {
          _id
        }
      }
    }
  }
`;

export { PROJECTS };
