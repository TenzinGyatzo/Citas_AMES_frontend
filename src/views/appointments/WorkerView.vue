<script setup>
import { ref } from 'vue'
import { useAppointmentsStore } from '../../stores/appointments'

const appointments = useAppointmentsStore()
const submitSuccess = ref(false)

const handleSubmit = (formData) => {
  appointments.setWorkerData(formData)
  submitSuccess.value = true // Muestra feedback visual
  setTimeout(() => { submitSuccess.value = false }, 5000) // Desaparece después de 3 segundos
}
</script>

<template>
  <h2 class="text-3xl font-extrabold text-white mt-10">Trabajador</h2>
  <p class="text-white text-lg">Introduce los datos del trabajador</p>
  <hr>

  <div class="mt-3">
    <FormKit
      id="workerForm"
      type="form"
      :actions="false"
      incomplete-message="No se pudo enviar, revisa los campos"
      @submit="handleSubmit"
    >

      <FormKit
        type="text"
        label="Nombre"
        name="workerName"
        placeholder="Nombre del trabajador"
        v-model="appointments.worker.workerName"
        validation="required|length:3"
        :validation-messages="{
            required: 'El nombre es obligatorio',
            length: 'El nombre es muy corto'
        }"
      />
        
      <FormKit
        type="text"
        label="Puesto"
        name="workerPosition"
        placeholder="Puesto del trabajador"
        v-model="appointments.worker.workerPosition"
      />

      <FormKit
        type="text"
        label="Teléfono"
        name="workerPhone"
        placeholder="10 dígitos"
        v-model="appointments.worker.workerPhone"
        validation="matches:/^[0-9]{10}$/"
        :validation-messages="{ matches: 'El formato no es válido' }"
      />

      <FormKit
        type="textarea"
        label="Notas (Opcional)"
        name="workerNotes"
        placeholder="Indicar aquí cualquier información adicional."
        v-model="appointments.worker.workerNotes"
      />

      <FormKit type="submit">Validar</FormKit>

      <!-- Feedback visual -->
      <div v-if="submitSuccess" class="mt-3 p-1 text-center text-green-600 bg-green-100 rounded">
        ¡Datos válidos!
      </div>
      
    </FormKit>
  </div>
</template>
