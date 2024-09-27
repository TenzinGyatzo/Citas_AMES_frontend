<script setup>
    import { useAppointmentsStore } from '../stores/appointments'
    import { formatCurrency } from '../helpers'

    const appointments = useAppointmentsStore()

    defineProps({
        service: {
            type: Object
        }
    })
</script>

<template>
  <div class="border border-gray-600 rounded-lg px-5 py-3 flex justify-between items-center">
    <div>
        <p class="text-base font-extrabold text-white">{{ service.name }}</p>
        <p class="text-xl font-black text-sky-500">
            {{ formatCurrency(service.price) }}
        </p>
    </div>
    <button
        type="button"
        class="inline-flex items-center rounded-md bg-red-600 text-white text-xs px-3 py-2 font-semibold shadow-sm ring-1 ring-inset ring-red-300 hover:bg-red-700 hover:scale-105 transition"
        @click="appointments.onServiceSelected(service)"
    >
        Eliminar
    </button>
  </div>
</template>