<script setup>
  import { onMounted } from 'vue' 
  import { useRouter } from 'vue-router'
  import { useUserStore } from '@/stores/user'
  import { useAppointmentsStore } from '@/stores/appointments'

  const user = useUserStore()
  const appointments = useAppointmentsStore()
  const router = useRouter()

  onMounted(() => {
    user.fetchUserData()
  })
  
  function clearAndNavigate() {
    appointments.clearAppointmentData()
    router.push({ name: 'new-appointment' })
  }
</script>

<template>
  <div class="flex justify-between">
    <img src="/public/img/AmesBrand.png" alt="logo" class="w-25 h-20 place-self-center hidden sm:block">
    <h1 class="place-self-center text-3xl sm:text-3xl md:text-4xl lg:text-4xl xl:text-6xl font-black text-white">Citas AMES</h1>

    <div class="flex flex-col space-y-3">
        <div class="flex gap-2 items-center">
            <p class="text-white text-right text-xs lg:text-base">{{ user.getUserName }} de {{  user.getCompanyName }}</p>
            <button
                type="button"
                class="bg-red-600 hover:bg-red-700 text-white uppercase text-xs font-extrabold rounded-lg px-4 py-2 transition-all duration-300 ease-in-out transform hover:scale-105 shadow-md hover:shadow-lg hover:text-gray-200"
                @click="user.logout()"
            >
                Cerrar Sesión
            </button>
        </div>

        <nav class="flex gap-2 items-center justify-end">
            <a href="https://maps.app.goo.gl/dmXPjXVp9DPohFi29" target="_blank" rel="noopener noreferrer">
              <button
                class="text-center p-2 text-gray-200 hover:text-white uppercase text-xs lg:text-base 2xl:text-lg font-black rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105 hover:bg-slate-700 shadow-md hover:shadow-lg"
              >
                Ubicación
              </button>
            </a>
            <RouterLink
                :to="{name: 'my-appointments'}"
                class="text-center p-2 text-gray-200 hover:text-white uppercase text-xs lg:text-base 2xl:text-lg font-black rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105 hover:bg-slate-700 shadow-md hover:shadow-lg"
            >Mis Citas</RouterLink>
            <RouterLink
                :to="{name: 'new-appointment'}"
                class="text-center p-2 text-white uppercase text-xs lg:text-base 2xl:text-lg font-black rounded-lg bg-sky-600 hover:bg-sky-700 transition-all duration-300 ease-in-out transform hover:scale-105 shadow-md hover:shadow-lg"
                @click.prevent="clearAndNavigate"
            >
                Nueva Cita
            </RouterLink>
        </nav>

    </div>
  </div>

  <main>
    <RouterView />
  </main>
</template>
