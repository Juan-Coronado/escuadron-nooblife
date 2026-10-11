import { ArrowUpIcon } from '@phosphor-icons/react/dist/csr/ArrowUp'
import FondoDePagina from './componentes/Fondo de pagina'
import PortadaDelGrupo from './componentes/Portada del grupo'
import GaleriaDePersonas from './componentes/Galeria de personas'
import { usePersonasActualizadas } from './hooks/Usar personas actualizadas'
import './estilos/Pagina principal.css'

export default function App() {
  const { personas, aviso } = usePersonasActualizadas()
  return (
    <>
      <FondoDePagina />
      <main id="inicio" className="pagina">
        <PortadaDelGrupo />
        <GaleriaDePersonas personas={personas} aviso={aviso} />
        <footer className="pieDelGrupo">
          <p>Escuadrón Nooblife · Un espacio entre amigos.</p>
          <a href="#inicio">Volver arriba <ArrowUpIcon size={18} weight="regular" aria-hidden="true" /></a>
        </footer>
      </main>
    </>
  )
}
