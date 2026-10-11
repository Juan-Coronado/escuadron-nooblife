import { ArrowDownIcon } from '@phosphor-icons/react/dist/csr/ArrowDown'
import './Portada del grupo.css'

export default function PortadaDelGrupo() {
  return (
    <header className="portadaDelGrupo">
      <div className="composicionDePortada">
        <div className="marcaDelGrupo">
          <p className="etiquetaDePortada">Un espacio que es nuestro</p>
          <h1 className="nombreDelGrupo">
            <span className="visualmenteOculto">Escuadrón Nooblife</span>
            <img
              className="imagenDePortada"
              src={`${import.meta.env.BASE_URL}images/Marca Escuadron Nooblife.png`}
              alt=""
              width="2169"
              height="725"
              fetchPriority="high"
              decoding="async"
              draggable="false"
            />
          </h1>
        </div>
        <div className="introduccionDelGrupo">
          <h2>Detrás del apodo,<br /><span>una historia.</span></h2>
          <p>
            Lo que estudiamos, lo que sabemos hacer, lo que nos gusta.
            Conoce a las personas que forman el escuadrón.
          </p>
          <a className="explorarElGrupo" href="#grupo">
            Conoce al grupo <ArrowDownIcon size={20} weight="regular" aria-hidden="true" />
          </a>
        </div>
      </div>
    </header>
  )
}
