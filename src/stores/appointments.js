import { ref, computed, onMounted, inject, watch } from 'vue'
import { defineStore } from 'pinia'
import { useRouter } from 'vue-router'
import AppointmentAPI from '../api/AppointmentAPI'
import { convertToISO, convertToDDMMYYYY } from '../helpers/date'
import { useUserStore } from './user'
import { format, parse } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';

export const useAppointmentsStore = defineStore('appointments', () => {

    const appointmentId = ref('')
    const worker = ref({})
    const services = ref([])
    const date = ref('')
    const time = ref('')
    const appointmentsByDate = ref([])
    const hours = ref([])
    const loading = ref(false)
    const isLoadingHours = ref(true)

    // Reglas de horas configurables
    const hourRules = ref({
        "8:00": 2, "8:30": 2, "9:00": 2, "9:30": 2,
        "10:00": 2, "10:30": 2, "11:00": 2, "11:30": 2,
        "12:00": 2, "12:30": 2, "14:00": 1, "14:30": 1,
        "15:00": 2, "15:30": 2, "16:00": 2, "16:30": 2,
        "17:00": 1, "17:30": 1
    });

    const toast = inject('toast')
    const router = useRouter()
    const user = useUserStore()

    onMounted(() => {
        const startHour = 8;
        const endHour = 17;
        
        for (let hour = startHour; hour <= endHour + 0.5; hour += 0.5) {
            let formattedTime = Math.floor(hour) + ':' + (hour % 1 === 0 ? '00' : '30');
            hours.value.push(formattedTime)
        }

    })

    watch(date, async () => {
        time.value = '';
        if (date.value === '') return;
      
        const { data } = await AppointmentAPI.getByDate(date.value);
        // console.log(`Citas del ${date.value}:`, data);
      
        if (appointmentId.value) { // Si hay appointmentId, estamos editando
          // console.log('appointmentId.value:', appointmentId.value);
          const filteredAppointments = data.filter(appointment => appointment._id !== appointmentId.value);
          appointmentsByDate.value = filteredAppointments.map(appointment => appointment.time);
          // console.log('appointmentsByDate.value:', appointmentsByDate.value);
          const currentAppointment = data.find(appointment => appointment._id === appointmentId.value);
          // console.log('currentAppointment:', currentAppointment);
          if (currentAppointment) {
            time.value = currentAppointment.time;
          }
        } else {
          // Si no hay appointmentId, estamos creando
          appointmentsByDate.value = data.map(appointment => appointment.time);
        }
      
        // Llama a fetchUnavailableTimes para obtener horarios ocupados de Google Calendar
        await fetchUnavailableTimes(date.value);
    });

    // Método para obtener las horas ocupadas de Google Calendar
    async function fetchUnavailableTimes(date) {
        try {
            isLoadingHours.value = true;
            // Limpiar el array al inicio para evitar acumulación
            appointmentsByDate.value = [];

            // console.log('Input date:', date);
            const isoDate = convertToISO(date);
            // console.log('Output date:', isoDate);
            const formattedDate = format(new Date(isoDate), 'yyyy-MM-dd');
            // const apiUrl = import.meta.env.VITE_API_URL_DOMAIN || 'http://localhost:4000/api'; // Para producción
            const apiUrl = 'http://localhost:4000/api'; // Para desarrollo
            const response = await fetch(`${apiUrl}/calendar/events-by-date/${formattedDate}`);
            const events = await response.json();

            console.log('Eventos recibidos de Google Calendar:', events);

            const occupiedTimes = [];
            const businessTimeZone = 'America/Hermosillo'; // UTC-07:00

            events.forEach((event, index) => {            
                const start = toZonedTime(new Date(event.start), businessTimeZone);
                const end = toZonedTime(new Date(event.end), businessTimeZone);

                const selectedDay = toZonedTime(new Date(isoDate), businessTimeZone);
    
                // Asegurarse de que el evento afecte específicamente al día seleccionado
                const eventStartsOnSelectedDay = start.toDateString() === selectedDay.toDateString();
                const eventEndsOnSelectedDay = end.toDateString() === selectedDay.toDateString();
                const eventCrossesSelectedDay = start < selectedDay && end > selectedDay;
        
                // Filtrar solo eventos que impacten el día específico seleccionado
                if (eventStartsOnSelectedDay || eventEndsOnSelectedDay || eventCrossesSelectedDay) {
                    let currentTime = start;
    
                    // Ajustar para no añadir horas del día anterior si el evento no cruza medianoche
                    while (currentTime < end && currentTime.toDateString() === selectedDay.toDateString()) {
                        const timeSlot = format(currentTime, 'H:mm', { timeZone: businessTimeZone });
                        occupiedTimes.push(timeSlot);
                        currentTime = new Date(currentTime.getTime() + 30 * 60 * 1000);
                    }
                }
            });

            // SOLO usar los eventos de Google Calendar, no combinar con citas existentes
            // Las citas existentes ya están incluidas en los eventos de Google Calendar
            appointmentsByDate.value = occupiedTimes;
            

                    
            // Remover el valor que esté en time.value de appointmentsByDate.value
            if (time.value) {
                appointmentsByDate.value = appointmentsByDate.value.filter(timeSlot => timeSlot !== time.value);
            }
        } catch (error) {
            console.error('Error al obtener horarios ocupados:', error);
        } finally {
            isLoadingHours.value = false;
        }
    }

    function setSelectedAppointment(appointment) {
        worker.value = appointment.worker;
        services.value = appointment.services;
        date.value = convertToDDMMYYYY(appointment.date);
        time.value = appointment.time;
        appointmentId.value = appointment._id;
    }

    function setWorkerData(workerData) {
        worker.value = workerData
    }

    function onServiceSelected(service) {
        if(services.value.some(s => s._id === service._id)) {
            services.value = services.value.filter(s => s._id !== service._id)
        } else {
            services.value.push(service)         
        }
    }

    async function saveAppointment() {
        loading.value = true; // Iniciar la carga
    
        const appointment = {
            worker: worker.value,
            services: services.value.map(service => service._id),
            date: convertToISO(date.value),
            time: time.value,
            totalAmount: totalAmount.value
        };
    
        if (appointmentId.value) { // Editando una cita
            try {
                const { data } = await AppointmentAPI.update(appointmentId.value, appointment);
                toast.open({
                    message: data.msg,
                    type: 'success'
                });
            } catch (error) {
                console.log(error);
            } finally {
                loading.value = false;
            }
        } else { // Creando una nueva cita
            try {
                const { data } = await AppointmentAPI.create(appointment);
                toast.open({
                    message: data.msg,
                    type: 'success'
                });
            } catch (error) {
                console.log(error);
            } finally {
                loading.value = false;
            }
        }

        clearAppointmentData()
        user.getUserAppointments()
        router.push({ name: 'my-appointments' })
    }

    function clearAppointmentData() {
        appointmentId.value = '' 
        worker.value = {}
        services.value = []
        date.value = ''
        time.value = ''
    }

    async function cancelAppointment(id) {
        if(confirm('¿Deseas cancelar esta cita?')) {
            try {
                const { data } = await AppointmentAPI.delete(id)
                toast.open({
                    message: data.msg,
                    type: 'success'    
                })

                user.userAppointments = user.userAppointments.filter(appointment => appointment._id !== id)
            } catch (error) {
                toast.open({
                    message: error.response.data.msg,
                    type: 'error'    
                })
            }   
        }
    }


    const hasWorkerData = computed(() => {
        return (
            worker.value.workerName && 
            worker.value.workerName.length > 3
        )
    } )

    const isServiceSelected = computed(() => {
        return (id) => services.value.some( service => service._id === id)   
    })

    const noServicesSelected = computed(() => services.value.length === 0)

    const totalAmount = computed(() => {
        return services.value.reduce((total, service) => total + service.price, 0)
    })

    const isValidReservation = computed(() => {
        return (
          worker.value.workerName && 
          worker.value.workerName.length > 3 &&
          services.value.length && 
          date.value.length && 
          time.value.length
        );
      });
      

    const isDateSelected = computed(() => {
        return date.value ? true : false
    })

    const disableTime = computed(() => {
        return (hour, date) => {
            // format convierte Date => String
            // parse convierte String => Date

            // Asegura que la hora se formatee siempre a dos dígitos
            const formattedHour = hour.padStart(5, '0'); // Convierte "8:00" a "08:00" si es necesario

            const now = new Date();
            const currentHour = format(now, 'HH:mm');
            const currentDate = format(now, 'dd/MM/yyyy'); 
            
            const currentTime = parse(currentHour, 'HH:mm', new Date());
            const slotTime = parse(hour, 'HH:mm', new Date());
    
            const parsedDate = parse(date, 'dd/MM/yyyy', new Date());
            // Obtenemos el día de la semana (6 = Sábado)
            const selectedDay = parsedDate.getDay(); 

            if (["13:00", "13:30"].includes(hour)) {
                return true;
            }
    
            // Si es sábado, deshabilitar las horas de la tarde
            if (selectedDay === 6) {
                if (["14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30"].includes(hour)) {
                    return true;
                }
            }
        
            // Si la fecha es hoy, deshabilitar las horas menores a la hora actual
            if (date === currentDate && slotTime < currentTime) {
                return true;
            }

            // Obtener la regla para esta hora específica
            const maxEventsForHour = hourRules.value[hour] || 1; // Por defecto 1 si no está configurado

            // Contar cuántos eventos hay en esta hora específica
            const eventsInThisHour = appointmentsByDate.value.filter(timeSlot => timeSlot === hour).length;
            

            
            // Deshabilitar si se alcanza el límite de eventos para esta hora
            return eventsInThisHour >= maxEventsForHour;
        };
    });

    // Funciones para gestionar las reglas de horas
    function getHourRules() {
        return { ...hourRules.value };
    }

    function updateHourRules(newRules) {
        hourRules.value = { ...newRules };
    }

    return {
        worker,
        services,
        date,
        hours,
        time,
        loading,
        isLoadingHours,
        setSelectedAppointment,
        setWorkerData,
        onServiceSelected,
        saveAppointment,
        clearAppointmentData,
        cancelAppointment,
        hasWorkerData,
        isServiceSelected,
        noServicesSelected,
        totalAmount,
        isValidReservation,
        isDateSelected,
        disableTime,
        getHourRules,
        updateHourRules
    }
})