import { ArrowUpRightIcon } from '@phosphor-icons/react/dist/csr/ArrowUpRight'
import type { Persona } from '../datos/Personas'
import { nombreDePersona } from '../datos/Presentacion de persona'
import RetratoDePersona from './Retrato de persona'
import './Perfil de persona.css'

interface PerfilDePersonaProps {
  persona: Persona
  alSeleccionar: (persona: Persona) => void
}

export default function PerfilDePersona({ persona, alSeleccionar }: PerfilDePersonaProps) {
  const nombre = nombreDePersona(persona)

  return (
    <article className="perfilDePersona" aria-label={`Presentación de ${nombre}`}>
      <RetratoDePersona persona={persona} />
      <div className="identidadDePersona">
        <h3>{nombre}</h3>
        {persona.apodos && <p className="apodoDePersona">{persona.apodos}</p>}
        {(persona.institucion || persona.carreras) && (
          <p className="estudiosDePersona">
            {persona.institucion && <span>{persona.institucion}</span>}
            {persona.carreras && <span>{persona.carreras}</span>}
          </p>
        )}
        <div className="accionDePersona">
          <button
            className="botonDePerfil"
            type="button"
            onClick={() => alSeleccionar(persona)}
            aria-label={`Ver perfil de ${nombre}`}
            aria-haspopup="dialog"
          >
            Ver perfil <ArrowUpRightIcon size={18} weight="regular" aria-hidden="true" />
          </button>
        </div>
      </div>
    </article>
  )
}
