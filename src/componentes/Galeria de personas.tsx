import { useRef, useState } from 'react'
import { MagnifyingGlassIcon } from '@phosphor-icons/react/dist/csr/MagnifyingGlass'
import { XIcon } from '@phosphor-icons/react/dist/csr/X'
import type { Persona } from '../datos/Personas'
import { compararPersonas, textoParaBuscar } from '../datos/Presentacion de persona'
import PerfilDePersona from './Perfil de persona'
import DetalleDePersona from './Detalle de persona'
import './Galeria de personas.css'

interface GaleriaDePersonasProps {
  personas: readonly Persona[]
  aviso?: string
}

export default function GaleriaDePersonas({ personas, aviso }: GaleriaDePersonasProps) {
  const [busqueda, cambiarBusqueda] = useState('')
  const [seleccionadaId, seleccionarPersona] = useState<string | null>(null)
  const seleccionada = personas.find(persona => persona.id === seleccionadaId) ?? null
  const campoDeBusqueda = useRef<HTMLInputElement>(null)

  function limpiarBusqueda() {
    cambiarBusqueda('')
    campoDeBusqueda.current?.focus()
  }

  const consulta = textoParaBuscar(busqueda)
  const visibles = personas.filter(persona =>
    textoParaBuscar([
      persona.nombres, persona.apellidos, persona.apodos, persona.institucion, persona.carreras,
    ].join(' ')).includes(consulta),
  ).sort(compararPersonas)

  return (
    <section id="grupo" className="presentaciones" aria-labelledby="tituloDelGrupo">
      <div className="herramientasDelGrupo">
        <div>
          <p className="etiquetaDeSeccion">Nuestras presentaciones</p>
          <div className="tituloDelGrupo">
            <h2 id="tituloDelGrupo">Nuestra gente.</h2>
            <p role="status" aria-live="polite" aria-atomic="true">
              {consulta ? `${visibles.length} de ${personas.length}` : personas.length}{' '}
              {personas.length === 1 ? 'persona' : 'personas'}
            </p>
          </div>
        </div>
        <div className="buscadorDePersonas">
          <label htmlFor="buscarPersona">Encuentra a alguien</label>
          <div className="campoDeBusqueda">
            <MagnifyingGlassIcon size={20} weight="regular" aria-hidden="true" />
            <input
              id="buscarPersona"
              ref={campoDeBusqueda}
              type="search"
              placeholder="Nombre, apodo o carrera"
              value={busqueda}
              onChange={evento => cambiarBusqueda(evento.target.value)}
            />
            {busqueda && (
              <button type="button" aria-label="Limpiar búsqueda" onClick={limpiarBusqueda}>
                <XIcon size={18} weight="regular" aria-hidden="true" />
              </button>
            )}
          </div>
        </div>
      </div>
      {aviso && <p className="avisoDeDatos" role="status">{aviso}</p>}
      {visibles.length > 0 ? (
        <div className="galeriaDePersonas">
          {visibles.map(persona => (
            <PerfilDePersona key={persona.id} persona={persona} alSeleccionar={persona => seleccionarPersona(persona.id)} />
          ))}
        </div>
      ) : (
        <div className="resultadoVacio">
          <h3>{personas.length ? 'No encontramos a esa persona' : 'Aún no hay presentaciones'}</h3>
          {personas.length > 0 && (
            <>
              <p>Prueba con otro nombre, apodo o carrera.</p>
              <button type="button" onClick={limpiarBusqueda}>Ver todo el grupo</button>
            </>
          )}
        </div>
      )}
      <DetalleDePersona persona={seleccionada} alCerrar={() => seleccionarPersona(null)} />
    </section>
  )
}
