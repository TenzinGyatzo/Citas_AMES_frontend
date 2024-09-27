<script setup>
  import Appointment from '@/components/Appointment.vue'
  import { useUserStore } from '@/stores/user'

  const user = useUserStore()
</script>

<template>
  <h2 class="text-3xl font-extrabold text-white mt-10">Mis Citas</h2>
  <p class="text-white text-base mt-2">Aquí puedes administrar tus próximas citas</p>


  <p v-if="user.loading" class="text-white text-xl text-center mt-2" >Cargando...</p>

  <div v-else>
    <p v-if="user.noAppointments" class="text-white text-xl text-center mt-7" >No tienes próximas citas</p>

    <div v-else class="grid grid-cols-1 xl:grid-cols-2 gap-4 mt-4 pb-10">
      <Appointment 
        v-for="appointment in user.userAppointments"
        :key="appointment._id"
        :appointment="appointment"
      />
    </div>
  </div>
</template>