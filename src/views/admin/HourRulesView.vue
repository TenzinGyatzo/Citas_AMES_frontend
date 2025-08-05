<script setup>
import { ref, onMounted } from 'vue'
import { useAppointmentsStore } from '../../stores/appointments'
import { useUserStore } from '../../stores/user'

const appointments = useAppointmentsStore()
const user = useUserStore()

const hourRules = ref({})
const loading = ref(false)
const message = ref('')
const messageType = ref('')

// Horas disponibles para configurar
const availableHours = [
  '8:00', '8:30', '9:00', '9:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
  '17:00', '17:30'
]

onMounted(() => {
  // Cargar las reglas actuales
  loadCurrentRules()
})

function loadCurrentRules() {
  // Obtener las reglas actuales del store
  hourRules.value = { ...appointments.getHourRules() }
}

async function saveRules() {
  loading.value = true
  message.value = ''
  messageType.value = ''

  try {
    // Validar que todos los valores sean números positivos
    const invalidRules = Object.entries(hourRules.value).filter(([hour, limit]) => {
      const numLimit = parseInt(limit)
      return isNaN(numLimit) || numLimit < 0
    })

    if (invalidRules.length > 0) {
      message.value = 'Todos los límites deben ser números positivos'
      messageType.value = 'error'
      return
    }

    // Actualizar las reglas en el store
    appointments.updateHourRules(hourRules.value)
    
    message.value = 'Reglas actualizadas correctamente'
    messageType.value = 'success'
    
    // Limpiar mensaje después de 3 segundos
    setTimeout(() => {
      message.value = ''
      messageType.value = ''
    }, 3000)

  } catch (error) {
    message.value = 'Error al guardar las reglas'
    messageType.value = 'error'
  } finally {
    loading.value = false
  }
}

function deactivateAppointments() {
  const noDoctorRules = {
    "8:00": 0, "8:30": 0, "9:00": 0, "9:30": 0,
    "10:00": 0, "10:30": 0, "11:00": 0, "11:30": 0,
    "12:00": 0, "12:30": 0, "14:00": 0, "14:30": 0,
    "15:00": 0, "15:30": 0, "16:00": 0, "16:30": 0,
    "17:00": 0, "17:30": 0
  }
  hourRules.value = { ...noDoctorRules }
}

function setOneDoctor() {
  const oneDoctorRules = {
    "8:00": 1, "8:30": 1, "9:00": 1, "9:30": 1,
    "10:00": 1, "10:30": 1, "11:00": 1, "11:30": 1,
    "12:00": 1, "12:30": 1, "14:00": 1, "14:30": 1,
    "15:00": 1, "15:30": 1, "16:00": 1, "16:30": 1,
    "17:00": 0, "17:30": 0
  }
  hourRules.value = { ...oneDoctorRules }
}

function setTwoDoctors() {
  const twoDoctorsRules = {
    "8:00": 2, "8:30": 2, "9:00": 2, "9:30": 2,
    "10:00": 2, "10:30": 2, "11:00": 2, "11:30": 2,
    "12:00": 2, "12:30": 2, "14:00": 1, "14:30": 1,
    "15:00": 2, "15:30": 2, "16:00": 2, "16:30": 2,
    "17:00": 1, "17:30": 1
  }
  hourRules.value = { ...twoDoctorsRules }
}
</script>

<template>
  <div class="space-y-6">
    <div>
      <h2 class="text-3xl font-extrabold text-white">Configuración de Reglas de Horarios</h2>
      <p class="text-white text-lg mt-2">
        Configura cuántos eventos se permiten por hora antes de deshabilitar el botón
      </p>
    </div>

    <!-- Mensaje de estado -->
    <div v-if="message" 
         :class="[
           'p-4 rounded-lg font-bold',
           messageType === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
         ]">
      {{ message }}
    </div>

         <!-- Instrucciones -->
     <!-- <div class="bg-blue-900 p-4 rounded-lg">
       <h3 class="text-white font-bold text-lg mb-2">Instrucciones:</h3>
       <ul class="text-white text-sm space-y-1">
         <li>• <strong>Límite 1:</strong> Se deshabilita cuando hay 1 evento</li>
         <li>• <strong>Límite 2:</strong> Se deshabilita cuando hay 2 eventos</li>
         <li>• <strong>Límite 0:</strong> Siempre deshabilitado</li>
         <li>• <strong>Límite 999:</strong> Nunca se deshabilita</li>
       </ul>
     </div> -->

     <!-- Acciones Rápidas -->
     <div class="bg-gradient-to-r from-sky-50 to-blue-50 border-2 border-sky-200 p-6 rounded-xl shadow-lg">
       <div class="flex items-center mb-1 justify-center">
         <h3 class="text-sky-800 font-bold text-xl text-center">⚡ Acciones Rápidas</h3>
       </div>
       
       <p class="text-sky-700 text-sm mb-2 text-center">Configuración automática según la disponibilidad de médicos</p>
       
       <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
         <button
           @click="setOneDoctor"
           class="group bg-gradient-to-br from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white py-4 px-4 rounded-xl transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg hover:shadow-xl border-2 border-orange-400 hover:border-orange-500"
         >
           <div class="flex items-center justify-center mb-2">
             <span class="text-lg font-bold">👩‍⚕️ UN MÉDICO</span>
           </div>
           <div class="text-xs opacity-90">Todo en 1, 17:00-17:30 en 0</div>
         </button>
         
         <button
           @click="setTwoDoctors"
           class="group bg-gradient-to-br from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white py-4 px-4 rounded-xl transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg hover:shadow-xl border-2 border-purple-400 hover:border-purple-500"
         >
           <div class="flex items-center justify-center mb-2">
             <span class="text-lg font-bold">👨‍⚕️👩‍⚕️ DOS MÉDICOS</span>
           </div>
           <div class="text-xs opacity-90">14:00-14:30 y 17:00-17:30 en 1, resto en 2</div>
         </button>
         
         <button
           @click="deactivateAppointments"
           class="group bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-4 px-4 rounded-xl transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg hover:shadow-xl border-2 border-red-400 hover:border-red-500"
         >
           <div class="flex items-center justify-center mb-2">
             <span class="text-lg font-bold">DESACTIVAR CITAS</span>
           </div>
           <div class="text-xs opacity-90">Todas las citas se deshabilitarán</div>
         </button>
       </div>
     </div>

    <!-- Configuración de reglas -->
    <div class="bg-white rounded-lg p-6 shadow-lg">
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
        <div v-for="hour in availableHours" :key="hour" class="space-y-2">
          <label :for="hour" class="block text-sm font-bold text-gray-700">
            {{ hour }}
          </label>
          <input
            :id="hour"
            v-model.number="hourRules[hour]"
            type="number"
            min="0"
            max="999"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
            :class="{
              'border-red-500': hourRules[hour] < 0 || isNaN(hourRules[hour])
            }"
          />
          <p class="text-xs text-gray-500">
            {{ hourRules[hour] === 0 ? 'Siempre deshabilitado' : 
               hourRules[hour] === 999 ? 'Nunca se deshabilita' : 
               `Se deshabilita con ${hourRules[hour]} evento${hourRules[hour] > 1 ? 's' : ''}` }}
          </p>
        </div>
      </div>

             <!-- Botones de acción -->
       <div class="flex justify-center mt-6 pt-6 border-t border-gray-200">
         <button
           @click="saveRules"
           :disabled="loading"
           class="w-full max-w-md bg-sky-600 hover:bg-sky-700 disabled:bg-gray-400 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105 shadow-md hover:shadow-lg"
         >
           <span v-if="loading">Guardando...</span>
           <span v-else>Guardar Cambios</span>
         </button>
       </div>
    </div>

    <!-- Vista previa de las reglas -->
    <div class="bg-white rounded-lg p-6 shadow-lg">
      <h3 class="text-xl font-bold text-gray-800 mb-4">Vista Previa de las Reglas</h3>
      <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
                 <div v-for="hour in availableHours" :key="hour" 
              class="p-2 border rounded text-center text-sm"
              :class="{
                'bg-red-100 border-red-300': hourRules[hour] === 0,
                'bg-blue-100 border-blue-300': hourRules[hour] === 1,
                'bg-orange-100 border-orange-300': hourRules[hour] === 2,
                'bg-green-100 border-green-300': hourRules[hour] >= 3 && hourRules[hour] <= 999
              }">
          <div class="font-bold">{{ hour }}</div>
                     <div class="text-xs">
             {{ hourRules[hour] === 0 ? 'Siempre OFF' : 
                hourRules[hour] >= 5 && hourRules[hour] <= 999 ? 'Muy Alto' : 
                `Límite: ${hourRules[hour]}` }}
           </div>
        </div>
      </div>
    </div>
  </div>
</template> 