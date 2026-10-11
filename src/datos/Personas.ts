export interface Persona {
  id: string
  nombres: string
  apellidos: string
  apodos: string
  correo: string
  institucion: string
  carreras: string
  habilidades: string
  hobbies: string
  metas: string
  descripcion?: string
  /** Ruta relativa a public, por ejemplo: images/Nombre de la persona.jpg. */
  foto?: string
  linkedin?: string
}

// Solo los campos elegidos por el usuario. Valores de la recopilación del 11/10/2026.
// Los campos vacíos y los textos originales se conservan sin completar ni corregir.
export const personas: readonly Persona[] = [
  {
    "id": "persona2",
    "nombres": "Marco",
    "apellidos": "Pillaca",
    "apodos": "El pisado de Santa Anita",
    "correo": "",
    "institucion": "USIL",
    "carreras": "ingenieria civil",
    "habilidades": "",
    "hobbies": "",
    "metas": ""
  },
  {
    "id": "persona3",
    "nombres": "Neil",
    "apellidos": "",
    "apodos": "El Conejo",
    "correo": "",
    "institucion": "",
    "carreras": "",
    "habilidades": "",
    "hobbies": "",
    "metas": ""
  },
  {
    "id": "persona4",
    "nombres": "Jefferson",
    "apellidos": "Sanchez",
    "apodos": "Gabs",
    "correo": "",
    "institucion": "",
    "carreras": "",
    "habilidades": "",
    "hobbies": "",
    "metas": ""
  },
  {
    "id": "persona5",
    "nombres": "Joseph",
    "apellidos": "Ccana",
    "apodos": "Zorro",
    "correo": "joseph200345@gmail.com",
    "institucion": "UNI",
    "carreras": "Ingenieria civil",
    "habilidades": "Modelador REVIT BIM, Dibujante Autocad, Etabs e Investigador y experiencia en visitas en obras",
    "hobbies": "Leer, videojuegos, ver resumenes de peliculas, show, irme de trecking( visitar nuevos lugares), ir a mi escuela de filosofia, videos de reflexiones de la vida, ponerme a pensar mucho y dormir",
    "metas": "Terminar el ciclo bien, realizar practicas en obras grandes, terminar mi semillero de investigacion, Crear automatizacion con IA aplicado a mi carrera solucionando problemas y desposar a mi diosa ;3"
  },
  {
    "id": "persona6",
    "nombres": "Andre",
    "apellidos": "Mestanza",
    "apodos": "Gato",
    "correo": "gatoxkeren@hotmail.com",
    "institucion": "UPN",
    "carreras": "",
    "habilidades": "",
    "hobbies": "",
    "metas": ""
  },
  {
    "id": "persona7",
    "nombres": "Diego",
    "apellidos": "Colquichagua",
    "apodos": "Colcax",
    "correo": "diego.colquichagua07@gmail.com",
    "institucion": "TECSUP",
    "carreras": "Mechatronics Technician,  Tecnico en instrumentacion",
    "habilidades": "Mecanico, Electrico, Diseño CAD/CAM,  Automatizacion y control automatico, paciencia,  inteligencia emocional, flexibilidad, pensamiento analitico, proactivo, creativo,",
    "hobbies": "Tocar instrumento, editar videos en general, videojuegos, Tocar instrumento, futbol, leer, pasear",
    "metas": "ser youtuber con ramon"
  },
  {
    "id": "persona8",
    "nombres": "Ramón",
    "apellidos": "Jean Paul",
    "apodos": "Mimiru",
    "correo": "",
    "institucion": "",
    "carreras": "Ingeniería en prompt",
    "habilidades": "Mucha IA",
    "hobbies": "Crear",
    "metas": "ser vtuber"
  },
  {
    "id": "persona9",
    "nombres": "Luis",
    "apellidos": "Cuellar",
    "apodos": "El Sonic",
    "correo": "cuellarangel121999@gmail.com",
    "institucion": "ULIMA",
    "carreras": "Ingeniería de sistemas",
    "habilidades": "Análisis de datos, ciencia de datos(en desarrollo :V), mejora continua, algo de software xd, nociones de gastronomia",
    "hobbies": "Cocinar, jugar, explorar, dormir",
    "metas": "Ser cientifico de datos, crear una empresa(proyexto restaurante tecnologico xdddd)"
  },
  {
    "id": "persona10",
    "nombres": "Juan",
    "apellidos": "Coronado",
    "apodos": "Juan 🐴",
    "correo": "pasa prompt fast",
    "institucion": "",
    "carreras": "Ingeniería en prompt",
    "habilidades": "Usar IA",
    "hobbies": "",
    "metas": ""
  },
  {
    "id": "persona11",
    "nombres": "Cristhian",
    "apellidos": "Chujutalli",
    "apodos": "Chujutak",
    "correo": "cual de los 3?",
    "institucion": "PUCP",
    "carreras": "Ingeniería en prompt",
    "habilidades": "Saber de IA",
    "hobbies": "Usar IA",
    "metas": "Ser desbaneado de Claude"
  },
  {
    "id": "persona12",
    "nombres": "Keren",
    "apellidos": "Mayhua",
    "apodos": "Panquesito",
    "correo": "kerenmayhuaquinto07@gmail.com",
    "institucion": "UTP",
    "carreras": "Arquitectura",
    "habilidades": "",
    "hobbies": "Bailar , cantar , dibujar , pintar leer, jugar videojuegos, escuchar musica",
    "metas": "viajar a varios paises con mi personita :3"
  },
  {
    "id": "persona13",
    "nombres": "Joseph",
    "apellidos": "Quispe",
    "apodos": "Quispe :v",
    "correo": "",
    "institucion": "",
    "carreras": "",
    "habilidades": "",
    "hobbies": "",
    "metas": ""
  },
  {
    "id": "persona14",
    "nombres": "Gabriela",
    "apellidos": "Garay Salinas",
    "apodos": "Gabs (La dueña de Jeff)",
    "correo": "gabylolicious@gmail.com",
    "institucion": "ULIMA",
    "carreras": "Ingeniería de Sistemas",
    "habilidades": "IB bilingüe , A2 DELF (francés) , experiencia en data science y ML, IoT y SQL. Orientada a gestión de proyectos… ",
    "hobbies": "Tocar piano, dibujar a tinta y lapicero, journaling, juegos de ritmo, escuchar/mezclar/producir música , dormir, jugar Fisch, leer, bailar coreos, antes hacía más deporte como nadar, basket y volley, tmb soy hábil editando videos (?) lmao",
    "metas": "tener mi casita de playa </3"
  },
  {
    "id": "persona15",
    "nombres": "Sergio",
    "apellidos": "Ayuque",
    "apodos": "Fonsi",
    "correo": "",
    "institucion": "",
    "carreras": "",
    "habilidades": "",
    "hobbies": "",
    "metas": ""
  },
  {
    "id": "persona16",
    "nombres": "Nicoll",
    "apellidos": "Saldaña",
    "apodos": "Nikotina",
    "correo": "",
    "institucion": "OTRO, Calletano, UTP, PUCP",
    "carreras": "Ciencias de la Comunicación, Psicologia forence.",
    "habilidades": "",
    "hobbies": "Dormir, Practicar deportes, tocar violin y piano, leer, escribir, redactar, editar.",
    "metas": ""
  },
  {
    "id": "persona17",
    "nombres": "Fredy",
    "apellidos": "Peña",
    "apodos": "Freddy (fnaf) xD",
    "correo": "",
    "institucion": "",
    "carreras": "",
    "habilidades": "",
    "hobbies": "",
    "metas": ""
  },
  {
    "id": "persona18",
    "nombres": "Celeste",
    "apellidos": "Ygnacio Díaz",
    "apodos": "CELE",
    "correo": "",
    "institucion": "",
    "carreras": "",
    "habilidades": "",
    "hobbies": "",
    "metas": ""
  }
]
