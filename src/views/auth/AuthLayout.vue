<script setup>
    import { useRoute } from 'vue-router'

    const route = useRoute()

    const authRoutes = [
        { name: 'register', text: 'Crear una cuenta'},
        { name: 'login', text: 'Iniciar Sesión'},
        { name: 'forgot-password', text: 'Olvidé mi contraseña'},
    ]
</script>

<template>
  <div class="mx-auto lg:w-4/5 xl:w-3/5 2xl:w-2/5 mt-10">
    <RouterView />

    <nav class="mt-10 flex flex-col items-center space-y-2.5 lg:flex-row lg:justify-between lg:space-y-0">
        <RouterLink 
            v-for="authRoute in authRoutes"

            class="text-center p-2 text-gray-200 hover:text-white uppercase text-xs lg:text-lg font-black rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105 hover:bg-slate-700 shadow-md hover:shadow-lg"
            :to="{name: authRoute.name}"
            :class="{ 'hidden' : route.name === authRoute.name }"
        >{{ authRoute.text }}</RouterLink>
    </nav>
  </div>
</template>