<script setup>
  import { inject } from 'vue'
  import { useRouter } from 'vue-router'
  import AuthAPI from '@/api/AuthAPI.js'

  const toast = inject('toast')
  const router = useRouter()
  
  const handleSubmit = async (formData) => {
    try {
      const { data } = await AuthAPI.login(formData)
      localStorage.setItem('AUTH_TOKEN', data.token)
      router.push({ name: 'my-appointments' })
    } catch (error) {
      toast.open({
        message: error.response.data.msg,
        type: 'error'
      })
    }
  }
</script>

<template>
  <h1 class="text-3xl md:text-4xl xl:text-5xl font-extrabold text-white text-center mt-6">Iniciar Sesión</h1>
  <p class="text-lg md:text-2xl lg:text-2xl text-white text-center my-2 mb-5">Si tienes una cuenta, inicia sesión</p>

  <FormKit
    id="loginForm"
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
    
    <FormKit
      type="password"
      label="Contraseña"
      name="password"
      placeholder="Contraseña" 
      validation="required"
      :validation-messages="{
        required: 'La contraseña es obligatoria'
      }"
    />

    <FormKit type="submit">Iniciar Sesión</FormKit>

  </FormKit>
</template>