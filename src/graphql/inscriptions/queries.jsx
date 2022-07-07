import { gql } from '@apollo/client';

const INSCRIPCIONES = gql`
  query Inscripciones {
    inscripciones {
      _id
      estado
      proyecto {
        _id
        nombre
        estado
      }
      estudiante {
        _id
        nombre
        correo
      }
    }
  }
`;

export { INSCRIPCIONES };
