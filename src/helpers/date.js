import { parse, formatISO, parseISO, format } from 'date-fns'
import es from 'date-fns/locale/es'

export function convertToISO(strDate) {
    const newDate = parse(strDate, 'dd/MM/yyyy', new Date())
    return formatISO(newDate)
}

export function displayDate(date) {
    return format(parseISO(date), 'PPPP', { locale: es })
}

export function convertToDDMMYYYY(isoDate) {
    // Extrae el año, mes y día del formato ISO
    const [year, month, day] = isoDate.split('T')[0].split('-');
    const utcDate = new Date(Date.UTC(year, month - 1, day)); // Usamos Date.UTC para evitar el ajuste de zona horaria
    return format(utcDate, 'dd/MM/yyyy');
}

export function convertToDisplayDate(strDate) {
    const parsedDate = parse(strDate, 'dd/MM/yyyy', new Date());
    return format(parsedDate, 'EEEE, d \'de\' MMMM', { locale: es });
}
