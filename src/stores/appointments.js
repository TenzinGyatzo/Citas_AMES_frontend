import { ref, computed, onMounted, inject, watch } from 'vue'
import { defineStore } from 'pinia'
import { useRouter } from 'vue-router'
import AppointmentAPI from '../api/AppointmentAPI'
import { convertToISO, convertToDDMMYYYY } from '../helpers/date'
import { useUserStore } from './user'
import { format, parse } from 'date-fns';

export const useAppointmentsStore = defineStore('appointments', () => {

    const appointmentId = ref('')
    const worker = ref({})
    const services = ref([])
    const date = ref('')
    const time = ref('')
    const appointmentsByDate = ref([])
    const hours = ref([])
    const loading = ref(false)

    const toast = inject('toast')
    const router = useRouter()
    const user = useUserStore()

    onMounted(() => {
        const startHour = 8;
        const endHour = 16;
        
        for (let hour = startHour; hour <= endHour + 0.5; hour += 0.5) {
            let formattedTime = Math.floor(hour) + ':' + (hour % 1 === 0 ? '00' : '30');
            hours.value.push(formattedTime)
        }
    })

    watch(date, async () => {
        time.value = '';
        if (date.value === '') return;
      
        // Obtenemos las citas locales desde AppointmentAPI
        const { data } = await AppointmentAPI.getByDate(date.value);
      
        if (appointmentId.value) {
          // Si hay appointmentId, estamos editando
          appointmentsByDate.value = data.filter(appointment => appointment._id !== appointmentId.value);
          const currentAppointment = data.find(appointment => appointment._id === appointmentId.value);
          if (currentAppointment) {
            time.value = currentAppointment.time;
          }
        } else {
          // Si no hay appointmentId, estamos creando
          appointmentsByDate.value = data;
        }
      
        // Llama a fetchUnavailableTimes para obtener horarios ocupados de Google Calendar
        await fetchUnavailableTimes(date.value);
    });



    // Método para obtener las horas ocupadas de Google Calendar
    async function fetchUnavailableTimes(date) {
        try {
            appointmentsByDate.value = [];

            const isoDate = convertToISO(date);
            const formattedDate = format(new Date(isoDate), 'yyyy-MM-dd');
            const apiUrl = import.meta.env.VITE_API_URL_DOMAIN || 'http://localhost:4000/api';
            const response = await fetch(`${apiUrl}/calendar/events-by-date/${formattedDate}`);
            const events = await response.json();

            // console.log('Eventos recibidos de Google Calendar:', events);

            const occupiedTimes = [];

            events.forEach(event => {
                const start = new Date(event.start);
                const end = new Date(event.end);
    
                // Asegurarse de que el evento afecte específicamente al día seleccionado
                const eventStartsOnSelectedDay = start.toDateString() === new Date(isoDate).toDateString();
                const eventEndsOnSelectedDay = end.toDateString() === new Date(isoDate).toDateString();
                const eventCrossesSelectedDay = start < new Date(isoDate) && end > new Date(isoDate);
    
                // Filtrar solo eventos que impacten el día específico seleccionado
                if (eventStartsOnSelectedDay || eventEndsOnSelectedDay || eventCrossesSelectedDay) {
                    let currentTime = start;
    
                    // Ajustar para no añadir horas del día anterior si el evento no cruza medianoche
                    while (currentTime < end && currentTime.toDateString() === new Date(isoDate).toDateString()) {
                        occupiedTimes.push(format(currentTime, 'H:mm'));
                        currentTime = new Date(currentTime.getTime() + 30 * 60 * 1000);
                    }
                }
            });

            // Actualiza appointmentsByDate.value con las horas ocupadas
            appointmentsByDate.value = [...new Set(occupiedTimes)];
            // console.log('Horas ocupadas procesadas:', occupiedTimes);
        } catch (error) {
            console.error('Error al obtener horarios ocupados:', error);
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
            now.setHours(0, 0, 0, 0); // Normaliza a medianoche
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
                if (["14:00", "14:30", "15:00", "15:30", "16:00", "16:30"].includes(hour)) {
                    return true;
                }
            }
        
            // Si la fecha es hoy, deshabilitar las horas menores a la hora actual
            if (date === currentDate && slotTime < currentTime) {
                return true;
            }
    
            // Deshabilitar si la hora ya está ocupada en las citas
            return appointmentsByDate.value.includes(hour || formattedHour);
        };
    });

    return {
        worker,
        services,
        date,
        hours,
        time,
        loading,
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
        disableTime
    }
})