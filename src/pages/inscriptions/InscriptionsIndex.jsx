import { useMutation, useQuery } from "@apollo/client";
import React, { useEffect } from "react";
import ButtonLoading from "../../components/ButtonLoading";
import { toast } from "react-toastify";
import PrivateRoute from "../../components/PrivateRoute";
import { APROBAR_INSCRIPCION } from "../../graphql/inscriptions/mutations";
import { INSCRIPCIONES } from "../../graphql/inscriptions/queries";
import {
  AccordionDetailsStyled,
  AccordionStyled,
  AccordionSummaryStyled,
} from "../../components/Accordion";

const InscriptionsIndex = () => {
  const { data, loading, error } = useQuery(INSCRIPCIONES);

  useEffect(() => {
    console.log(data, "FARA");
  }, [data]);
  if (loading) return <div>Loading..</div>;
  return (
    <PrivateRoute roleList={["ADMINISTRADOR", "LIDER"]}>
      <div className="flex flex-col">
        <div>InscriptionsIndex</div>;
        <div className="mt-4">
          <>
            <InscripcionesAprobadas
            // data={data.inscripciones.filter((e) => e.estado === "APROBADO")}
            />
            <InscripcionesPendientes
              data={data.inscripciones.filter((e) => e.estado === "PENDIENTE")}
            />
            <InscripcionesRechazadas />
          </>
        </div>
      </div>
    </PrivateRoute>
  );
};

const InscripcionesAprobadas = ({ data }) => {
  return (
    <AccordionStyled>
      <AccordionSummaryStyled>Aprobadas</AccordionSummaryStyled>
      <AccordionDetailsStyled>
        {data &&
          data.inscripciones.map((inscripcion) => (
            <Inscripcion inscripcion={inscripcion} />
          ))}
      </AccordionDetailsStyled>
    </AccordionStyled>
  );
};

const InscripcionesPendientes = ({ data }) => {
  console.log(data, "DATA PENDIENTE");
  return (
    <AccordionStyled>
      <AccordionSummaryStyled>Pendientes</AccordionSummaryStyled>
      <AccordionDetailsStyled>
        {data &&
          data.inscripciones.map((inscripcion) => (
            <Inscripcion inscripcion={inscripcion} />
          ))}
      </AccordionDetailsStyled>
    </AccordionStyled>
  );
};

const InscripcionesRechazadas = () => {
  return (
    <AccordionStyled>
      <AccordionSummaryStyled>Rechazadas</AccordionSummaryStyled>
      <AccordionDetailsStyled>Detalles rechazadas</AccordionDetailsStyled>
    </AccordionStyled>
  );
};

const Inscripcion = ({ inscripcion }) => {
  const [aprobarInscripcion, { data, loading, error }] =
    useMutation(APROBAR_INSCRIPCION);

  useEffect(() => {
    if (data) {
      toast.success("Inscripcion aprobada");
    }
  }, [data]);

  useEffect(() => {
    if (error) {
      toast.success("Error al aprobar la inscripcion");
    }
  }, [error]);

  const cambiarEstadoInscripcion = () => {
    aprobarInscripcion({
      variables: {
        aprobarInscripcionId: inscripcion._id,
      },
    });
  };

  return (
    <div className="p-2 rounded-lg bg-gray-900 text-white">
      <p>{proyecto.nombre}</p>
      <p>{estudiante.nombre}</p>
      <p>{estado}</p>

      <ButtonLoading
        disabled={false}
        loading={false}
        text="Aprobar"
        onClick={() => cambiarEstadoInscripcion()}
      />
    </div>
  );
};

export default InscriptionsIndex;
