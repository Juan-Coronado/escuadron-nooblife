// Servicio de solo lectura para la web Escuadrón Nooblife.
// Insertar cada retrato dentro de la celda Foto, en la fila de su persona.
const idDeLaHojaNooblife = '1wdpvPkIsyjZUyDQefSE-yTGMmAqqHGuz7A5dxy4M8rs';
const idDeLaPestanaNooblife = 709021814;
const camposDeNooblife = [
  { columna: 2, titulo: 'Nombres', campo: 'nombres' },
  { columna: 3, titulo: 'Apellidos', campo: 'apellidos' },
  { columna: 4, titulo: 'Apodos', campo: 'apodos' },
  { columna: 8, titulo: 'Correo', campo: 'correo' },
  { columna: 9, titulo: 'Universidades / Institutos', campo: 'institucion' },
  { columna: 11, titulo: 'Carrera(s)', campo: 'carreras' },
  { columna: 12, titulo: 'Habilidades', campo: 'habilidades' },
  { columna: 14, titulo: 'Hobbies', campo: 'hobbies' },
  { columna: 15, titulo: 'Metas', campo: 'metas' },
  { columna: 16, titulo: 'Foto', campo: 'foto' },
  { columna: 17, titulo: 'Link de linkedin', campo: 'linkedin' },
];

function doGet() {
  try {
    return respuestaNooblife({ version: 1, estado: 'ok', personas: leerPresentacionesNooblife() });
  } catch (error) {
    console.error(error);
    return respuestaNooblife({ version: 1, estado: 'error' });
  }
}

function respuestaNooblife(datos) {
  return ContentService.createTextOutput(JSON.stringify(datos)).setMimeType(ContentService.MimeType.JSON);
}

function leerPresentacionesNooblife() {
  const libro = SpreadsheetApp.openById(idDeLaHojaNooblife);
  const hoja = libro.getSheets().find(pestana => pestana.getSheetId() === idDeLaPestanaNooblife);
  if (!hoja) throw new Error('No se encontró la pestaña de presentaciones.');
  const filas = Math.max(hoja.getLastRow(), 1);
  const columnas = camposDeNooblife.map(campo => {
    const rango = hoja.getRange(1, campo.columna, filas, 1);
    const textos = rango.getDisplayValues();
    if (normalizarTituloNooblife(textos[0][0]) !== normalizarTituloNooblife(campo.titulo)) {
      throw new Error('Cambió un encabezado de la hoja.');
    }
    return { campo: campo.campo, valores: campo.campo === 'foto' ? rango.getValues() : textos };
  });
  const personas = [];
  for (let fila = 1; fila < filas; fila += 1) {
    const persona = {};
    columnas.forEach(columna => {
      const valor = columna.valores[fila][0];
      persona[columna.campo] = columna.campo === 'foto' ? leerFotoNooblife(valor) : String(valor);
    });
    if (persona.nombres.trim() || persona.apellidos.trim()) personas.push(persona);
  }
  return personas;
}

function leerFotoNooblife(valor) {
  if (valor && valor.valueType === SpreadsheetApp.ValueType.IMAGE) return valor.getContentUrl();
  return typeof valor === 'string' && valor.trim().toLowerCase().startsWith('https://') ? valor.trim() : '';
}

function normalizarTituloNooblife(titulo) {
  return String(titulo).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
}
