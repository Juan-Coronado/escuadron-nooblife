import './Fondo de pagina.css'

export default function FondoDePagina() {
  return (
    <div className="fondo" aria-hidden="true">
      <img
        src={`${import.meta.env.BASE_URL}images/fondo-textura.png`}
        alt=""
        width="1536"
        height="1024"
        fetchPriority="high"
        decoding="async"
        draggable="false"
      />
    </div>
  )
}
