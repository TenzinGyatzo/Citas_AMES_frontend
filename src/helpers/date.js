import { parse, formatISO, parseISO, format, addD } from "date-fns";
import es from "date-fns/locale/es";

export function convertToISO(strDate) {
  /* const newDate = parse(strDate, 'dd/MM/yyyy', new Date())
    return formatISO(newDate) */                                                                           // Input: 11/01/2025, Output: 2025-01-11T00:00:00-07:00
    const newDate = parse(strDate, 'dd/MM/yyyy', new Date());
    return new Date(Date.UTC(newDate.getFullYear(), newDate.getMonth(), newDate.getDate())).toISOString(); // Input: 11/01/2025, Output: 2025-01-11T00:00:00-00:00Z    
}

export function displayDate(date) {
  // return format(parseISO(date), 'PPPP', { locale: es }) // Input: 2025-01-11T00:00:00-07:00, Output: sábado, 11 de enero de 2025
  return format(new Date(date), "PPPP", { locale: es }); // Input: 2025-01-11T00:00:00-07:00, Output: sábado, 11 de enero de 2025
}

export function convertToDDMMYYYY(isoDate) {
  const date = new Date(isoDate);
    return format(date, 'dd/MM/yyyy');
  /* const date = new Date(Date.parse(isoDate));
  return format(date, "dd/MM/yyyy"); */
}

export function convertToDisplayDate(strDate) {
  const parsedDate = parse(strDate, 'dd/MM/yyyy', new Date());
    return format(parsedDate, 'EEEE, d \'de\' MMMM', { locale: es });
}
