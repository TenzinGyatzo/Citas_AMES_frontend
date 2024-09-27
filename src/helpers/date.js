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
    const newDate = new Date(isoDate)
    const formattedDate = format(newDate, 'dd/MM/yyyy')
    return formattedDate
}

export function convertToDisplayDate(strDate) {
    const parsedDate = parse(strDate, 'dd/MM/yyyy', new Date());
    return format(parsedDate, 'EEEE, d \'de\' MMMM', { locale: es });
}
