<script setup>
import { ref } from 'vue'
import ServiceItem from '../../components/ServiceItem.vue'
import { useServicesStore } from '../../stores/services'

const store = useServicesStore()

const isComunesVisible = ref(true)
const isGabineteVisible = ref(false)
const isLaboratorioVisible = ref(false)
const isRayosXVisible = ref(false)

const toggleSection = (section) => {
  if (section === 'comunes') isComunesVisible.value = !isComunesVisible.value
  else if (section === 'gabinete') isGabineteVisible.value = !isGabineteVisible.value
  else if (section === 'laboratorio') isLaboratorioVisible.value = !isLaboratorioVisible.value
  else if (section === 'rayosX') isRayosXVisible.value = !isRayosXVisible.value
}
</script>

<template>
  <h2 class="text-3xl font-extrabold text-white mt-10">Servicios</h2>
  <p class="text-white text-lg">Selecciona al menos un servicio</p>
  <hr>

  <div v-if="store.isLoading">
    <p class="text-white text-center">Cargando...</p>
  </div>

  <div v-else>
    <div @click="toggleSection('comunes')" class="flex items-center cursor-pointer mt-3 mb-2">
      <span 
        :class="{
          'rotate-00': !isComunesVisible,
          'rotate-90': isComunesVisible
        }" 
        class="transition-transform duration-300 text-white mr-2 flex-shrink-0"
      >
        ▶ 
      </span>
      <p class="text-white text-lg flex-1">Más comunes</p>
    </div>
    <transition name="slide-fade">
      <div v-if="isComunesVisible" class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3">
        <ServiceItem 
          v-for="(service, index) in store.commonServices"
          :key="service._id"
          :service="service"
        />
      </div>
    </transition>

    <div @click="toggleSection('gabinete')" class="flex items-center cursor-pointer mt-5 mb-2">
      <span 
        :class="{
          'rotate-00': !isGabineteVisible,
          'rotate-90': isGabineteVisible
        }" 
          class="transition-transform duration-300 text-white mr-2"
      >
        ▶
      </span>
      <p class="text-white text-lg flex-1">Estudios de Gabinete</p>
    </div>
    <transition name="slide-fade">
      <div v-if="isGabineteVisible" class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3">
        <ServiceItem 
          v-for="service in store.testServices"
          :key="service._id"
          :service="service"
        />
      </div>
    </transition>

    <div @click="toggleSection('laboratorio')" class="flex items-center cursor-pointer mt-5 mb-2">
      <span 
        :class="{
          'rotate-00': !isLaboratorioVisible,
          'rotate-90': isLaboratorioVisible
        }" 
        class="transition-transform duration-300 text-white mr-2 flex-shrink-0"
      >
        ▶ 
      </span>
      <p class="text-white text-lg flex-1">Estudios de Laboratorio</p>
    </div>
    <transition name="slide-fade">
      <div v-if="isLaboratorioVisible" class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3">
        <ServiceItem 
          v-for="service in store.labServices"
          :key="service._id"
          :service="service"
        />
      </div>
    </transition>

    <div @click="toggleSection('rayosX')" class="flex items-center cursor-pointer mt-5 mb-2">
      <span 
        :class="{
          'rotate-00': !isRayosXVisible,
          'rotate-90': isRayosXVisible
        }" 
        class="transition-transform duration-300 text-white mr-2 flex-shrink-0"
      >
        ▶ 
      </span>
      <p class="text-white text-lg flex-1">Rayos X</p>
    </div>
    <transition name="slide-fade">
      <div v-if="isRayosXVisible" class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3">
        <ServiceItem 
          v-for="service in store.imageServices"
          :key="service._id"
          :service="service"
        />
      </div>
    </transition>
  </div>
</template>

<style scoped>
.rotate-0 {
  transform: rotate(0deg);
}
.rotate-90 {
  transform: rotate(90deg);
}
.slide-fade-enter-active, .slide-fade-leave-active {
  transition: all 0.3s ease-in-out;
}
.slide-fade-enter-from, .slide-fade-leave-to {
  max-height: 0;
  opacity: 0;
  overflow: hidden;
  transform: translateY(-10px);
}
.slide-fade-enter-to, .slide-fade-leave-from {
  max-height: 500px; /* Ajusta este valor según el contenido */
  opacity: 1;
  transform: translateY(0);
}
</style>
