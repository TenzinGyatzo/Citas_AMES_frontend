<script setup>
    import { onMounted } from 'vue'
    import { useRoute } from 'vue-router'
    import { useAppointmentsStore } from '../../stores/appointments'
    import StepperComponent from '../../components/StepperComponent.vue'

    const route = useRoute()
    const appointments = useAppointmentsStore()

    onMounted(() => {
        appointments.clearAppointmentData()
    })
</script>

<template>
    <StepperComponent />
</template>