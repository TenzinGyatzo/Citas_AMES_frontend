<script setup>
    import { formatCurrency } from '../helpers'
    import { useAppointmentsStore } from '../stores/appointments'

    const appointments = useAppointmentsStore()

    defineProps({
        service: {
            type: Object
        }
    })
</script>

<template>
  <div
    class="px-5 py-3 rounded-lg cursor-pointer transition-all duration-300 ease-in-out shadow-md hover:shadow-lg transform hover:scale-105"
    :class="appointments.isServiceSelected(service._id) ? 'bg-sky-500 text-white' : 'bg-white'"
    @click="appointments.onServiceSelected(service)"
  >
    <!-- Nombre del servicio -->
    <p class="text-xl font-semibold"
      :class="appointments.isServiceSelected(service._id) ? 'text-white' : 'text-gray-800'"
    >{{ service.name }}</p>

    <!-- Precio del servicio -->
    <p 
      class="text-2xl font-black transition-colors"
      :class="appointments.isServiceSelected(service._id) ? 'text-white' : 'text-sky-600'"
    >{{ formatCurrency(service.price) }}</p>
  </div>
</template>
