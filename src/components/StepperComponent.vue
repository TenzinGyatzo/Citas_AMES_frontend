<script setup>
    import { ref, computed, watch, onMounted } from 'vue'
    import { useRoute, useRouter } from 'vue-router'
    import { useAppointmentsStore } from '@/stores/appointments'

    const step = ref(1)
    const route = useRoute()
    const router = useRouter()
    const appointments = useAppointmentsStore()

    const stepperProgress = computed(() => {
        return ( 100 / 3 ) * ( step.value - 1 ) + '%'
    })

    // Función para sincronizar `step` con la ruta actual
    const syncStepWithRoute = (routeName) => {
        switch (routeName) {
            case 'new-appointment':
                step.value = 1
                break
            case 'appointment-services':
                step.value = 2
                break
            case 'appointment-date':
                step.value = 3
                break
            case 'appointment-details':
                step.value = 4
                break
        }
    }

    // Inicializa `step` al montar el componente
    onMounted(() => {
        syncStepWithRoute(route.name)
    })

    const navigateToStep = async (stepNumber) => {
        step.value = stepNumber
        switch (stepNumber) {
            case 1:
                router.push({ name: 'new-appointment' })
                break
            case 2:
                router.push({ name: 'appointment-services' })
                break
            case 3:
                router.push({ name: 'appointment-date' })
                break
            case 4:
                router.push({ name: 'appointment-details' })
                break
        }
    }

    watch(route, () => {
        switch (route.name) {
            case 'new-appointment':
                step.value = 1
                break
            case 'appointment-services':
                step.value = 2
                break
            case 'appointment-date':
                step.value = 3
                break
            case 'appointment-details':
                step.value = 4
                break
        }
    })

</script>

<template>
    <div class="bg-gray-800 p-6 md:p-10 rounded-lg shadow-lg mt-10 w-full max-w-full md:max-w-3xl mx-auto">
      <div class="relative flex items-center justify-between w-full max-w-full md:max-w-2xl mx-auto mb-6">
        <!-- Progreso de la barra -->
        <div class="absolute bg-gray-400 h-0.5 w-full"></div>
        <div
            class="absolute bg-emerald-500 h-0.5 transition-width duration-1000"
            :style="{ width: stepperProgress }"
        ></div>

        <!-- Cada paso de la barra -->
        <div
          class="relative flex flex-col items-center text-gray-300 transition-all"
          :class="{ '!text-sky-500 ': item === step, '!text-emerald-500': step > item }"
          v-for="item in 4"
          :key="item"
          @click="navigateToStep(item)"
        >
          <div
            class="flex items-center justify-center w-12 h-12 rounded-full border-2 border-gray-300 bg-white cursor-pointer"
            :class="{ 'border-sky-500 !bg-sky-500 text-white': item === step, 'border-emerald-500': step > item }"
          >
            <img
              v-if="step > item"
              class="absolute w-6 h-6"
              src="../../public/img/tick.svg"
              alt=""
            />
            <span v-else>{{ item }}</span>
          </div>
          <span class="absolute text-sm bottom-[-1.5rem]">Paso {{ item }}</span>
        </div>
      </div>
  
      <div class="stepper-content">
        <RouterView />
      </div>
  
      <div class="flex gap-4 mt-6">
        <button
          class="px-4 py-2 bg-gray-200 border border-gray-300 rounded text-gray-800 hover:bg-gray-300 disabled:opacity-50 text-center uppercase text-xs lg:text-lg font-black transition-all duration-300 ease-in-out transform shadow-md hover:shadow-lg"
          @click="navigateToStep(step - 1)"
          :disabled="step === 1"
          :class="{'transform hover:scale-105': step !== 1}"
        >
          Anterior
        </button>

        <button
        v-if="(step === 1 && appointments.hasWorkerData) || 
              (step === 2 && !appointments.noServicesSelected) || 
              (step === 3 && appointments.time)"
        class="px-4 py-2 bg-emerald-500 border-emerald-500 hover:bg-emerald-600 text-white rounded ml-auto disabled:opacity-50 text-center uppercase text-xs lg:text-lg font-black transition-all duration-300 ease-in-out transform hover:scale-105 shadow-md hover:shadow-lg"
        @click="navigateToStep(step + 1)"
        :disabled="step === 4"
      >
        Siguiente
      </button>


        <button
          v-if="appointments.isValidReservation && step === 4"
          type="button"
          :disabled="appointments.loading"
          class="w-full md:w-auto bg-emerald-500 px-3 py-2 ml-auto rounded-lg uppercase font-black text-white transition-all duration-300 ease-in-out shadow-md focus:outline-none focus:ring-4 focus:ring-emerald-300 focus:ring-opacity-50 pulse-animation"
          :class="{
            'opacity-50 cursor-not-allowed': appointments.loading,
            'transform hover:scale-105 hover:bg-emerald-400 hover:shadow-lg': !appointments.loading
          }"
          @click="appointments.saveAppointment()"
        >
          {{ appointments.loading ? 'Guardando...' : 'Confirmar Cita' }}
        </button>

      </div>
    </div>
</template>
  

<style lang="scss">
    @import "../scss/components/stepper_component.scss";
</style>

<style scoped>
.pulse-animation {
  animation: pulse 4s infinite;
}

@keyframes pulse {
  0%, 100% {
    /* box-shadow: 0 0 0 0 rgba(56, 189, 248, 0.7); */ /* Sombra inicial y final */
    box-shadow: 0 0 0 0 rgba(56, 248, 158, 0.7); /* Sombra inicial y final */
  }
  50% {
    box-shadow: 0 0 20px 10px rgba(56, 189, 248, 0); /* Efecto de pulso intermedio */
  }
}
</style>