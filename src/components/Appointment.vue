<script setup>
    import { displayDate } from '../helpers/date'
    import { formatCurrency } from '../helpers/index'
    import { useAppointmentsStore } from '../stores/appointments'

    const appointments = useAppointmentsStore()

    defineProps({
        appointment: {
            type: Object
        }
    })
</script>

<template>
  <div class="bg-white px-6 py-4 space-y-3 rounded-lg shadow-lg">
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-1">
        <p class="text-gray-600 font-bold text-sm lg:text-lg">
            Fecha: <span class="font-light">{{ displayDate(appointment.date) }}</span>
        </p>    
        <p class="text-gray-600 font-bold text-sm lg:text-lg">
            Hora: <span class="font-light">{{ appointment.time }} Horas</span>
        </p>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-1">
        <div>
            <p class="text-lg font-bold text-gray-900">Trabajador:</p>
            <div class="text-sm text-gray-700 space-y-1 lg:text-lg">
                <p>{{ appointment.worker.workerName }}</p>
                <p>{{ appointment.worker.workerPosition }}</p>
                <p>{{ appointment.worker.workerPhone }}</p>
                <p>{{ appointment.worker.workerNotes }}</p>
            </div> 
        </div>

        <div>
            <p class="text-lg font-bold">Evaluaciones:</p>
            <div v-for="service in appointment.services" class="text-sm lg:text-lg">
                <p>{{ service.name }}</p>
                <p class="text-sky-600 font-bold">
                    {{ formatCurrency(service.price) }}
                </p>
            </div> 
        </div>
    </div>

    <p class="text-md lg:text-lg font-black text-right">Total a pagar: <span class="text-sky-600">{{ formatCurrency(appointment.totalAmount) }}</span></p>

    <div class="flex gap-3 items-center">
        <RouterLink
            :to="{ name: 'edit-appointment', params: { id: appointment._id } }"
            class="flex-1 md:flex-none bg-slate-600 rounded-lg p-2 text-white text-xs uppercase font-bold  hover:bg-slate-700 transition-all duration-300 ease-in-out transform hover:scale-105 shadow-sm hover:shadow-lg text-center"
        >
            Editar Cita
        </RouterLink>

        <button
            class="flex-1 md:flex-none bg-red-600 hover:bg-red-700 text-white uppercase text-xs font-extrabold rounded-lg px-4 py-2 transition-all duration-300 ease-in-out transform hover:scale-105 shadow-md hover:shadow-lg hover:text-gray-200"
            @click="appointments.cancelAppointment(appointment._id)"
        >
            Cancelar Cita
        </button>
    </div>
  </div>
</template>