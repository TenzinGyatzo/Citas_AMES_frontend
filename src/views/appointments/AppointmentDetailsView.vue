<script setup>
  import { ref } from 'vue'
  import VueTailwindDatepicker from 'vue-tailwind-datepicker'
  import SelectedService from '../../components/SelectedService.vue'
  import { formatCurrency } from '../../helpers'
  import { useAppointmentsStore } from '../../stores/appointments'
  import { convertToDisplayDate } from '../../helpers/date'

  const appointments = useAppointmentsStore()

  const formatter = ref({
    date: 'DD/MM/YYYY',
    month: 'MMM',
  })

</script>

<template>
  <h2 class="text-3xl font-extrabold text-white mt-10">Resumen de Cita</h2>
  <p class="text-white text-lg">Verifica la información y confirma la cita</p>
  <hr>

  <div class="lg:flex gap-10">
    <div class="lg:w-1/2 mt-5">
      <h3 class="text-2xl font-extrabold text-white">Trabajador</h3>
      <p v-if="!appointments.hasWorkerData" class="text-white text-xl text-center my-3">No se ha validado el trabajador</p>

      <div v-else class="grid grid-cols-1 sm:grid-cols-[1fr_5fr] md:grid-cols-[1fr_3fr] lg:grid-cols-1 xl:grid-cols-[1fr_2fr] border border-gray-600 rounded-lg px-5 py-3 items-center mt-2">
        <p class="text-base font-bold text-white">Nombre:</p>
        <span class="font-light text-gray-200">{{ appointments.worker.workerName }}</span>

        <p class="text-base font-bold text-white">Puesto:</p>
        <span class="font-light text-gray-200">
          {{ appointments.worker.workerPosition ? appointments.worker.workerPosition : 'No disponible' }}
        </span>

        <p class="text-base font-bold text-white">Teléfono:</p>
        <span class="font-light text-gray-200">
          {{ appointments.worker.workerPhone ? appointments.worker.workerPhone : 'No disponible' }}
        </span>

        <p class="text-base font-bold text-white">Notas:</p>
        <span class="font-light text-gray-200">
          {{ appointments.worker.workerNotes ? appointments.worker.workerNotes : 'Sin notas adicionales' }}
        </span>
      </div>
    </div>

    <div class="lg:w-1/2 mt-5" >
      <h3 class="text-2xl font-extrabold text-white">Servicios</h3>
      <p v-if="appointments.noServicesSelected" class="text-white text-xl text-center my-3">No hay servicios seleccionados</p>

      <div v-else class="grid gap-2 mt-2">
        <SelectedService 
          v-for="service in appointments.services"
          :key="service._id"
          :service="service"
        />

        <p class="text-right text-white text-lg">Total a pagar: 
          <span class="font-black">{{ formatCurrency(appointments.totalAmount) }}</span>
        </p>
        <p class="text-right text-xs text-white">No incluye IVA</p>
      </div>
    </div>
  </div>

  <div class="lg:flex gap-10">
    <div class="lg:w-1/2 mt-5">
      <h3 class="text-2xl font-extrabold text-white">Fecha y Hora</h3>
      <p v-if="!appointments.isDateSelected" class="text-white text-xl text-center my-3">No se ha seleccionado fecha y hora</p>

      <div v-else class="grid grid-cols-1 sm:grid-cols-[1fr_5fr] md:grid-cols-[1fr_3fr] lg:grid-cols-1 xl:grid-cols-[1fr_3fr] border border-gray-600 rounded-lg px-5 py-3 items-center mt-2">
          <p class="text-base font-bold text-white">Fecha:</p>
          <span class="font-light text-gray-200">{{ convertToDisplayDate(appointments.date) }}</span>

          <p class="text-base font-bold text-white">Hora:</p>
          <span class="font-light text-gray-200">
            {{ appointments.time ? appointments.time + ' Horas' : 'No seleccionada' }}
          </span>
        </div>
    </div>
    <div class="lg:w-1/2"></div>
  </div>
</template>

