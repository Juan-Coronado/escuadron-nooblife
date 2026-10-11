import { useState } from 'react'
import type { Persona } from '../datos/Personas'
import { direccionDeFoto } from '../datos/Foto de persona'
import { inicialesDePersona, nombreDePersona } from '../datos/Presentacion de persona'
import './Retrato de persona.css'

export default function RetratoDePersona({ persona }: { persona: Persona }) {
  const direccion = direccionDeFoto(persona.foto)
  // Reiniciar el estado de carga al cambiar o retirar una foto permite reintentarla.
  return <RetratoActual key={direccion ?? ''} persona={persona} direccion={direccion} />
}

function RetratoActual({ persona, direccion }: { persona: Persona; direccion: string | undefined }) {
  const [fotoFallida, cambiarFotoFallida] = useState(false)
  const mostrarFoto = direccion && !fotoFallida
  const tono = Array.from(nombreDePersona(persona)).reduce((suma, letra) => suma + letra.codePointAt(0)!, 0) % 3

  return (
    <div className="retratoDePersona" data-tono={tono} data-sin-foto={mostrarFoto ? undefined : true}>
      {mostrarFoto ? (
        <img
          src={direccion}
          alt={`Retrato de ${nombreDePersona(persona)}`}
          width="400"
          height="400"
          loading="lazy"
          decoding="async"
          onError={() => cambiarFotoFallida(true)}
        />
      ) : (
        <span aria-hidden="true">{inicialesDePersona(persona)}</span>
      )}
    </div>
  )
}
