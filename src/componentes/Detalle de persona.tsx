import { useEffect, useRef } from 'react'
import { XIcon } from '@phosphor-icons/react/dist/csr/X'
import { ArrowUpRightIcon } from '@phosphor-icons/react/dist/csr/ArrowUpRight'
import type { Persona } from '../datos/Personas'
import { enlaceDeLinkedIn, esCorreoValido, nombreDePersona } from '../datos/Presentacion de persona'
import RetratoDePersona from './Retrato de persona'
import './Detalle de persona.css'

interface DetalleDePersonaProps {
  persona: Persona | null
  alCerrar: () => void
}

export default function DetalleDePersona({ persona, alCerrar }: DetalleDePersonaProps) {
  const ventana = useRef<HTMLDialogElement>(null)
  const botonDeCerrar = useRef<HTMLButtonElement>(null)
  const personaId = persona?.id
  const linkedin = enlaceDeLinkedIn(persona?.linkedin)

  useEffect(() => {
    const elemento = ventana.current
    if (!elemento) return
    if (!personaId) {
      if (elemento.open) elemento.close()
      return
    }
    if (!elemento.open) elemento.showModal()
    botonDeCerrar.current?.focus({ preventScroll: true })
    const desplazamientoAnterior = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = desplazamientoAnterior }
  }, [personaId])

  const grupos = persona ? [
    { titulo: 'Habilidades', texto: persona.habilidades },
    { titulo: 'Hobbies', texto: persona.hobbies },
    { titulo: 'Metas', texto: persona.metas },
  ].filter(grupo => grupo.texto) : []

  return (
    <dialog
      className="detalleDePersona"
      ref={ventana}
      aria-labelledby="nombreDelPerfil"
      onClose={alCerrar}
      onKeyDown={evento => {
        if (evento.key !== 'Tab') return
        const controles = Array.from(evento.currentTarget.querySelectorAll<HTMLElement>('button:not([disabled]), a[href]'))
        const primero = controles[0]
        const ultimo = controles.at(-1)
        if (evento.shiftKey && document.activeElement === primero) {
          evento.preventDefault()
          ultimo?.focus()
        } else if (!evento.shiftKey && document.activeElement === ultimo) {
          evento.preventDefault()
          primero?.focus()
        }
      }}
      onClick={evento => {
        if (evento.target !== evento.currentTarget) return
        const limites = evento.currentTarget.getBoundingClientRect()
        if (evento.clientX < limites.left || evento.clientX > limites.right
          || evento.clientY < limites.top || evento.clientY > limites.bottom) {
          evento.currentTarget.close()
        }
      }}
    >
      {persona && (
        <div className="contenidoDelPerfil">
          <button
            className="cerrarPerfil"
            type="button"
            ref={botonDeCerrar}
            aria-label="Cerrar perfil"
            onClick={() => ventana.current?.close()}
          >
            <XIcon size={22} weight="regular" aria-hidden="true" />
          </button>
          <header className="cabeceraDelPerfil">
            <RetratoDePersona persona={persona} />
            <div>
              <p className="etiquetaDelPerfil">Presentación</p>
              <h2 id="nombreDelPerfil">{nombreDePersona(persona)}</h2>
              {persona.apodos && <p className="apodoDelPerfil">{persona.apodos}</p>}
              {persona.descripcion && <p className="descripcionDelPerfil">{persona.descripcion}</p>}
            </div>
          </header>
          <dl className="datosDelPerfil">
            {persona.institucion && (
              <div><dt>Universidad o instituto</dt><dd>{persona.institucion}</dd></div>
            )}
            {persona.carreras && (
              <div><dt>Carrera</dt><dd>{persona.carreras}</dd></div>
            )}
            {persona.correo && (
              <div className="correoDelPerfil">
                <dt>Correo</dt>
                <dd>
                  {esCorreoValido(persona.correo) ? (
                    <a href={`mailto:${persona.correo}`}>
                      {persona.correo}<ArrowUpRightIcon size={17} weight="regular" aria-hidden="true" />
                    </a>
                  ) : persona.correo}
                </dd>
              </div>
            )}
            {persona.linkedin?.trim() && (
              <div className="linkedinDelPerfil">
                <dt>LinkedIn</dt>
                <dd>
                  {linkedin ? (
                    <a
                      href={linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Ver LinkedIn de ${nombreDePersona(persona)} (abre en otra pestaña)`}
                    >
                      Ver perfil en LinkedIn<ArrowUpRightIcon size={17} weight="regular" aria-hidden="true" />
                    </a>
                  ) : persona.linkedin}
                </dd>
              </div>
            )}
          </dl>
          {grupos.length > 0 && (
            <div className="textosDelPerfil">
              {grupos.map(grupo => (
                <section className="grupoDelPerfil" key={grupo.titulo} aria-label={grupo.titulo}>
                  <h3>{grupo.titulo}</h3>
                  <p>{grupo.texto}</p>
                </section>
              ))}
            </div>
          )}
        </div>
      )}
    </dialog>
  )
}
