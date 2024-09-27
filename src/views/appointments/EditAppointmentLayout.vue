<script setup>
    import { onMounted } from 'vue'
    import { useRoute, useRouter } from 'vue-router'
    import AppointmentAPI from '../../api/AppointmentAPI'
    import { useAppointmentsStore } from '../../stores/appointments'
    import StepperComponentEditor from '../../components/StepperComponentEditor.vue'

    const appointments = useAppointmentsStore()
    const route = useRoute()
    const router = useRouter()

    const { id } = route.params    

    onMounted(async () => {
        try {
            const { data } = await AppointmentAPI.getById(id)
            appointments.setSelectedAppointment(data)
        } catch (error) {
            router.push({ name: 'my-appointments' })
        }
    })
</script>

<template>
    <StepperComponentEditor />
</template>