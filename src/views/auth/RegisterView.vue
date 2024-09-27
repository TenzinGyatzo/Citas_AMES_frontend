<script setup>
  import { inject } from 'vue'
  import { reset } from '@formkit/vue'
  import AuthAPI from '@/api/AuthAPI.js'

  const toast = inject('toast') 

  const handleSubmit = async ({password_confirm, ...formData}) => {
      try {
        const { data } = await AuthAPI.register(formData);
        toast.open({
          message: data.msg,
          type: 'success'
        })
        reset('registerForm')
      } catch (error) {
        toast.open({
          message: error.response.data.msg,
          type: 'error'
        })
      } 
  }


</script>

<template>
  <h1 class="text-3xl md:text-4xl xl:text-5xl font-extrabold text-white text-center mt-6">Crea una cuenta</h1>
  <p class="text-lg md:text-2xl lg:text-2xl text-white text-center my-2 mb-5">Crea una cuenta en AmesCitas</p>

  <FormKit
    id="registerForm"
    type="form"
    :actions="false"
    incomplete-message="No se pudo enviar, revisa los campos"
    @submit="handleSubmit"
  >
    <FormKit
      type="text"
      label="Empresa"
      name="company"
      placeholder="Nombre comercial de la empresa"
      validation="required"
      :validation-messages="{
        required: 'Este campo es obligatorio'
      }"
    />

    <FormKit
      type="text"
      label="Nombre(s)"
      name="name"
      placeholder="Tu nombre"
      validation="required|length:3"
      :validation-messages="{
        required: 'El nombre es obligatorio',
        length: 'El nombre es muy corto'
      }"
    />

    <FormKit
      type="text"
      label="Apellidos"
      name="lastName"
      placeholder="Tus apellidos"
      validation="required|length:3"
      :validation-messages="{
        required: 'Los apellidos son obligatorios',
        length: 'El apellido es muy corto'
      }"
    />

    <FormKit
      type="text"
      label="Teléfono"
      name="phone"
      placeholder="10 dígitos sin espacios"
      validation="required|matches:/^[0-9]{10}$/"
      :validation-messages="{ 
          required: 'El teléfono es obligatorio',
          matches: 'El formato no es válido' }"
    />

    <FormKit
      type="email"
      label="Email"
      name="email"
      placeholder="Email de Registro"
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
      placeholder="Contraseña - Mínimo 8 caracteres" 
      validation="required|length:8"
      :validation-messages="{
        required: 'La contraseña es obligatoria',
        length: 'La contraseña es muy corta'
      }"
    />

    <FormKit
      type="password"
      label="Repetir Contraseña"
      name="password_confirm"
      placeholder="Repite la contraseña" 
      validation="required|confirm"
      :validation-messages="{
        required: 'Repetir la contraseña es obligatorio',
        confirm: 'Las contraseñas no son iguales'
      }"
    />


    <FormKit type="submit">Crear Cuenta</FormKit>

  </FormKit>
</template>