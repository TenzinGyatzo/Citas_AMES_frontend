<script setup>
  import { inject } from 'vue'
  import { reset } from '@formkit/core'
  import AuthAPI from '@/api/AuthAPI.js'

  const toast = inject('toast')

  const handleSubmit = async ({email}) => {
    try {
      const { data } = await AuthAPI.forgotPassword({email})
      toast.open({
        message: data.msg,
        type: 'success'
      })
      reset('forgotPassword')
    } catch (error) {
      toast.open({
        message: error.response.data.msg,
        type: 'error'
      })
    }
  }
</script>

<template>
  <h1 class="text-3xl md:text-4xl xl:text-5xl font-extrabold text-white text-center mt-6">Olvidé mi contraseña</h1>
  <p class="text-lg md:text-2xl lg:text-2xl text-white text-center my-2 mb-5">Recupera el acceso a tu cuenta</p>

  <FormKit
    id="forgotPassword"
    type="form"
    :actions="false"
    incomplete-message="No se pudo enviar, revisa los campos"
    @submit="handleSubmit"
  >
    <FormKit
        type="email"
        label="Email"
        name="email"
        placeholder="Email de Usuario"
        validation="required|email"
        :validation-messages="{
            required: 'El email es obligatorio',
            email: 'Email no válido'
        }"
    />

    <FormKit type="submit">Enviar Instrucciones</FormKit>

  </FormKit>
</template>