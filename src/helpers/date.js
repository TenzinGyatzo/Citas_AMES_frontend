import { parse, formatISO, parseISO, format, addD } from "date-fns";
import es from "date-fns/locale/es";

export function convertToISO(strDate) {
  // Separar el string en día, mes y año
  const [day, month, year] = strDate.split('/').map(Number);

  // Crear una cadena con el formato requerido, incluyendo la hora fija y el desfase UTC
  const isoString = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}T00:00:00-07:00`;

  return isoString;
}

/* export function convertToISO(strDate) {
  const newDate = parse(strDate, 'dd/MM/yyyy', new Date())
    return formatISO(newDate) // Input: 25/01/2025, Output: 2025-01-25T00:00:00-07:00   
} */

export function displayDate(date) {
  return format(parseISO(date), 'PPPP', { locale: es }) // Input: 2025-01-11T00:00:00-07:00, Output: sábado, 11 de enero de 2025 | Input: 2025-01-25T07:00:00.000Z, Output: sábado, 25 de enero de 2025
}

export function convertToDDMMYYYY(isoDate) {
  const date = new Date(isoDate);
    return format(date, 'dd/MM/yyyy');
}

export function convertToDisplayDate(strDate) {
  const parsedDate = parse(strDate, 'dd/MM/yyyy', new Date());
    return format(parsedDate, 'EEEE, d \'de\' MMMM', { locale: es });
}
