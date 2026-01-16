/**
 * Validador de CURP (Clave Única de Registro de Población)
 * Formato: 18 caracteres alfanuméricos
 * Ejemplo: MELM850101HDFRRS09
 */

/**
 * Valida el formato de una CURP mexicana
 * @param {string} curp - CURP a validar
 * @returns {boolean} - true si es válida, false en caso contrario
 */
const validateCURP = (curp) => {
  if (!curp || typeof curp !== 'string') {
    return false;
  }

  // Eliminar espacios y convertir a mayúsculas
  const cleanCurp = curp.trim().toUpperCase();

  // Debe tener exactamente 18 caracteres
  if (cleanCurp.length !== 18) {
    return false;
  }

  // Regex para CURP:
  // - 4 letras (apellidos e iniciales del nombre)
  // - 6 dígitos (fecha: AAMMDD)
  // - 1 letra (sexo: H o M)
  // - 2 letras (estado de nacimiento)
  // - 3 letras (consonantes internas de nombres)
  // - 2 caracteres alfanuméricos (homoclave)
  const curpRegex = /^[A-Z]{4}[0-9]{6}[HM][A-Z]{5}[0-9A-Z]{2}$/;

  if (!curpRegex.test(cleanCurp)) {
    return false;
  }

  // Validar que la fecha sea coherente
  const year = parseInt(cleanCurp.substring(4, 6));
  const month = parseInt(cleanCurp.substring(6, 8));
  const day = parseInt(cleanCurp.substring(8, 10));

  if (month < 1 || month > 12) {
    return false;
  }

  if (day < 1 || day > 31) {
    return false;
  }

  // Validar código de estado (posiciones 11-12)
  const validStates = [
    'AS', 'BC', 'BS', 'CC', 'CL', 'CM', 'CS', 'CH', 'DF', 'DG',
    'GT', 'GR', 'HG', 'JC', 'MC', 'MN', 'MS', 'NT', 'NL', 'OC',
    'PL', 'QT', 'QR', 'SP', 'SL', 'SR', 'TC', 'TS', 'TL', 'VZ',
    'YN', 'ZS', 'NE' // NE = Nacido en el Extranjero
  ];

  const stateCode = cleanCurp.substring(11, 13);
  if (!validStates.includes(stateCode)) {
    return false;
  }

  return true;
};

/**
 * Limpia y normaliza una CURP
 * @param {string} curp - CURP a normalizar
 * @returns {string} - CURP normalizada (mayúsculas, sin espacios)
 */
const normalizeCURP = (curp) => {
  if (!curp || typeof curp !== 'string') {
    return '';
  }
  return curp.trim().toUpperCase();
};

module.exports = {
  validateCURP,
  normalizeCURP
};
