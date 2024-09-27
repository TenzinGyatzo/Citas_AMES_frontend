<script setup>
    import AdminAppointment from '../../components/AdminAppointment.vue'
    import { useUserStore } from '../../stores/user'

    const user = useUserStore()
</script>

<template>
    <p class="text-white text-md mt-3">Aquí puedes administrar las próximas citas</p>

    <p v-if="user.loading" class="text-white text-xl text-center mt-3">Cargando...</p>

    <div v-else class="mt-3">
        <p v-if="user.noAppointments" class="text-white text-xl text-center mt-3">
            No hay citas próximas
        </p>
        
        <div v-else class="grid grid-cols-1 xl:grid-cols-2 gap-3 mt-4 pb-10">
            <AdminAppointment 
                v-for="appointment in user.userAppointments"
                :key="appointment._id"
                :appointment="appointment"
            />
        </div>
    </div>
</template>