<script setup>
  import { useUserStore } from '@/stores/user'
  import { onMounted } from 'vue'

  const user = useUserStore()

  onMounted(() => {
    user.fetchUserData()
  })
</script>


<template>
    <div class="flex justify-between">
        <div>
            <h1 class="text-2xl lg:text-6xl font-black text-white">Citas AMES</h1>
            <h2 class="text-xl lg:text-2xl font-black text-white">Panel de Administración</h2>
        </div>

        <div class="flex flex-col space-y-5">
              <div class="flex gap-2 items-center">
                  <p class="text-white text-right">Hola: {{ user.getUserName }}</p>
                  <button
                      type="button"
                      class="bg-red-600 hover:bg-red-700 text-white uppercase text-xs font-extrabold rounded-lg px-3 py-2 transition-all duration-300 ease-in-out transform hover:scale-105 shadow-md hover:shadow-lg hover:text-gray-200"
                      @click="user.logout"
                  >
                      Cerrar Sesión
                  </button>
              </div>
          </div>
    </div>
    <main class="space-y-6">
       <RouterView />
    </main>
</template>