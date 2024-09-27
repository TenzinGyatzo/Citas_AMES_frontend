<script setup>
  import { onMounted, inject, ref } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import AuthAPI from '@/api/AuthAPI.js'
  import { reset } from '@formkit/core'

  const toast = inject('toast')
  const route = useRoute()
  const router = useRouter()
  const { token } = route.params

  const validToken = ref(false)
  
  onMounted (async () => {
    try {
      const { data } = await AuthAPI.verifyPasswordResetToken(token)
      validToken.value = true
      
    } catch (error) {
      toast.open({
        message: error.response.data.msg,
        type: 'error'
      })
    }
  })

  const handleSubmit = async ({ password }) => {
    try {
      const { data } = await AuthAPI.updatePassword(token, { password })
      toast.open({
        message: data.msg,
        type: 'success'
      })
      reset('newPasswordForm')
      setTimeout(() => {
        router.push({ name: 'login' })
      }, 5000);
    } catch (error) {
      toast.open({
        message: error.response.data.msg,
        type: 'error'
      })
    }
  }
</script>

<template>
  <div v-if="validToken">
    <h1 class="text-3xl md:text-4xl xl:text-5xl font-extrabold text-white text-center mt-6">Nueva Contraseña</h1>
    <p class="text-lg md:text-2xl lg:text-2xl text-white text-center my-2 mb-5">Coloca tu nueva contraseña</p>

    <FormKit
      id="newPasswordForm"
      type="form"
      :actions="false"
      incomplete-message="No se pudo enviar, revisa los campos"
      @submit="handleSubmit"
    >

      <FormKit
        type="password"
        label="Contraseña"
        name="password"
        placeholder="Contraseña de usuario - Mínimo 8 caracteres" 
        validation="required|length:8"
        :validation-messages="{
          required: 'La contraseña es obligatoria',
          length: 'La contraseña es muy corta'
        }"
      />

      <FormKit type="submit">Guardar Password</FormKit>

    </FormKit>
  </div>

  <p v-else class="text-center text-white text-xl font-black">Token no válido</p>
</template>