<script setup>
import { ref, watch } from 'vue';
import VueTailwindDatepicker from 'vue-tailwind-datepicker';
import SelectedService from '../../components/SelectedService.vue';
import { formatCurrency } from '../../helpers';
import { useAppointmentsStore } from '../../stores/appointments';

const appointments = useAppointmentsStore();

const formatter = ref({
  date: 'DD/MM/YYYY',
  month: 'MMM',
});

const holidays = [
  { day: 1, month: 0 },   // 1 de enero - Año Nuevo
  { day: 5, month: 1 },   // 5 de febrero - Día de la Constitución (día original)
  { day: 1, month: 4 },   // 1 de mayo - Día del Trabajo
  { day: 16, month: 8 },  // 16 de septiembre - Día de la Independencia
  // { day: 20, month: 10 }, // 20 de noviembre - Día de la Revolución Mexicana (día original)
  { day: 25, month: 11 }, // 25 de diciembre - Navidad
  { day: 1, month: 11 },  // 1 de diciembre (cada seis años) - Transmisión del Poder Ejecutivo Federal (solo si hay cambio de presidente) **Quitar después que entre la Sheinbaum** 

  // Feriados movibles (según la ley) **No pondré lógica para deshabilitar estas fechas**
  { day: null, month: 1, weekDay: 1, weekOffset: 1 },   // Primer lunes de febrero en conmemoración del 5 de febrero - Día de la Constitución
  { day: null, month: 2, weekDay: 1, weekOffset: 3 },   // Tercer lunes de marzo en conmemoración del 21 de marzo - Natalicio de Benito Juárez
  { day: null, month: 10, weekDay: 1, weekOffset: 3 },  // Tercer lunes de noviembre en conmemoración del 20 de noviembre - Día de la Revolución
];

const disableDate = (date) => {
  const today = new Date();

  // Normalizar la fecha y eliminar la hora para que la comparación sea solo de día, mes, año
  const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const startOfDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

  // Normalizar al inicio del día para evitar desfases
  startOfDate.setHours(0, 0, 0, 0);

  // Deshabilitar si la fecha es anterior a hoy
  if (startOfDate < startOfToday) {
    return true;
  }

  // Deshabilitar si el mes es más de un mes adelante del mes actual
  if (date.getMonth() > today.getMonth() + 3) {
    return true;
  }

  // Deshabilitar los domingos (0 = domingo)
  if (date.getDay() === 0) {
    return true;
  }

  // Deshabilitar si la fecha coincide con algún día festivo (ignorando el año)
  const isHoliday = holidays.some(holiday =>
    holiday.day === date.getDate() &&
    holiday.month === date.getMonth()
  );

  return isHoliday;
};

</script>

<template>
  <h2 class="text-3xl font-extrabold text-white mt-10">Fecha y Hora</h2>
  <p class="text-white text-lg">Selecciona fecha y hora</p>
  <hr>

  <div class="xl:flex gap-5 items-start mt-3">
    <div class="w-full xl:w-96 bg-white flex justify-center rounded-lg shadow-md">
      <VueTailwindDatepicker :disable-date="disableDate" disable-in-range i18n="es-mx" as-single no-input
        :formatter="formatter" v-model="appointments.date" />
    </div>
    <div v-if="appointments.isDateSelected" class="flex-1 grid grid-cols-3 gap-3 mt-5 xl:mt-0">
      <button v-for="hour in appointments.hours"
        class="block rounded-lg text-base font-bold px-3 py-2 transition-all duration-300 ease-in-out shadow-sm hover:shadow-lg transform"
        :class="[
          appointments.time === hour ? 'bg-sky-500 text-white font-black' : 'bg-white text-gray-900',
          !appointments.disableTime(hour, appointments.date) && !appointments.isLoadingHours ? 'hover:scale-105' : 'disabled:opacity-10'
        ]" @click="appointments.time = hour"
        :disabled="appointments.disableTime(hour, appointments.date) || appointments.isLoadingHours">
        {{ hour }}
      </button>
    </div>
  </div>
</template>