<script setup>
    import { displayDate } from '../helpers/date'
    import { formatCurrency } from '../helpers';

    defineProps({
        appointment: {
            type: Object
        }
    })
</script>

<template>
    <div class="bg-white px-6 py-4 space-y-3 rounded-lg">
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-1">
          <p class="text-gray-600 font-bold text-sm lg:text-lg">
              Fecha: <span class="font-light">{{ displayDate(appointment.date) }}</span>
          </p>    
          <p class="text-gray-600 font-bold text-sm lg:text-lg">
              Hora: <span class="font-light">{{ appointment.time }} Horas</span>
          </p>
          <p class="text-gray-600 font-bold text-sm lg:text-lg">
              Cliente: <span class="font-light"> {{ appointment.user.company }} </span>
          </p>    
          <p class="text-gray-600 font-bold text-sm lg:text-lg">
              Responsable: <span class="font-light"> {{ appointment.user.name }} {{ appointment.user.lastName }} </span>
          </p>
          <p class="text-gray-600 font-bold text-sm lg:text-lg">
              Correo: <span class="font-light"> {{ appointment.user.email }} </span>
          </p>    
          <p class="text-gray-600 font-bold text-sm lg:text-lg">
              Teléfono: <span class="font-light"> {{ appointment.user.phone }} </span>
          </p>
      </div>
  
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-1">
          <div>
              <p class="text-lg font-bold">Trabajador:</p>
              <div class="text-sm lg:text-lg">
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
  
    </div>
  </template>