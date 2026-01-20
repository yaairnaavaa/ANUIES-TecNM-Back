/**
 * Mapeo de nombres completos de carreras a sus abreviaciones
 * Este mapeo se usa tanto en el backend como en el frontend
 */

const careerAbbreviations = {
  // Ingenierías
  "Ingeniería en Sistemas Computacionales": "ISC",
  "Ingeniería en Tecnologías de la Información y Comunicaciones": "ITIC",
  "Ingeniería Electrónica": "IEL",
  "Ingeniería Eléctrica": "IE",
  "Ingeniería Mecánica": "IM",
  "Ingeniería Industrial": "II",
  "Ingeniería Mecatrónica": "IME",
  "Ingeniería Electromecánica": "IEM",
  "Ingeniería en Gestión Empresarial": "IGE",
  "Ingeniería Civil": "IC",
  "Ingeniería Química": "IQ",
  "Ingeniería Bioquímica": "IB",
  "Ingeniería Ambiental": "IA",
  "Ingeniería en Materiales": "IMAT",
  "Ingeniería en Nanotecnología": "INANO",
  "Ingeniería en Logística": "ILOG",
  "Ingeniería Aeronáutica": "IAER",
  "Ingeniería en Energías Renovables": "IER",
  "Ingeniería Petrolera": "IPE",
  "Ingeniería en Geociencias": "IGEO",
  "Ingeniería Biomédica": "IBIO",
  "Ingeniería Física": "IF",
  "Ingeniería Fotónica": "IFOT",
  "Ingeniería en Animación Digital y Efectos Visuales": "IADEV",
  "Ingeniería en Desarrollo Comunitario": "IDC",
  "Ingeniería en Sistemas Automotrices": "ISA",
  "Ingeniería en Tecnologías de Manufactura": "ITM",
  "Ingeniería Informática": "IINF",
  "Ingeniería en Administración": "IADM",
  
  // Licenciaturas
  "Licenciatura en Administración": "LA",
  "Licenciatura en Contaduría": "LC",
  "Licenciatura en Turismo": "LT",
  "Licenciatura en Gastronomía": "LG",
  "Licenciatura en Arquitectura": "ARQ",
  "Licenciatura en Biología": "LBIO",
  "Licenciatura en Informática": "LINF",
  
  // Contador Público
  "Contador Público": "CP",
  
  // Agregar más según las carreras que se manejen en el sistema
};

/**
 * Obtiene la abreviación de una carrera
 * @param {string} careerFullName - Nombre completo de la carrera
 * @returns {string} Abreviación de la carrera o las primeras 3 letras si no existe
 */
const getCareerAbbreviation = (careerFullName) => {
  if (!careerFullName) return '';
  
  // Buscar en el mapeo
  const abbreviation = careerAbbreviations[careerFullName];
  
  if (abbreviation) {
    return abbreviation;
  }
  
  // Si no está en el mapeo, devolver las primeras 3-4 letras en mayúsculas
  // o intentar crear una abreviación inteligente
  const words = careerFullName.split(' ').filter(word => 
    word.length > 2 && 
    !['en', 'de', 'la', 'las', 'los', 'del', 'y'].includes(word.toLowerCase())
  );
  
  if (words.length >= 2) {
    // Tomar las primeras letras de cada palabra importante
    return words.slice(0, 3).map(w => w[0]).join('').toUpperCase();
  }
  
  // Fallback: primeras 3 letras
  return careerFullName.substring(0, 3).toUpperCase();
};

/**
 * Obtiene el nombre completo de una carrera desde su abreviación
 * @param {string} abbreviation - Abreviación de la carrera
 * @returns {string|null} Nombre completo o null si no existe
 */
const getCareerFullName = (abbreviation) => {
  if (!abbreviation) return null;
  
  return Object.keys(careerAbbreviations).find(
    key => careerAbbreviations[key] === abbreviation.toUpperCase()
  ) || null;
};

module.exports = {
  careerAbbreviations,
  getCareerAbbreviation,
  getCareerFullName
};
