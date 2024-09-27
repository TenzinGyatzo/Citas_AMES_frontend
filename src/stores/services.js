import { ref, onMounted } from "vue";
import { defineStore } from "pinia";
import ServicesAPI from '../api/ServicesAPI'

export const useServicesStore = defineStore("services", () => {

    const commonServices = ref([])
    const testServices = ref([])
    const labServices = ref([])
    const imageServices = ref([])
    const isLoading = ref(true)

    const fetchServices = async () => {
        try {
            const { data } = await ServicesAPI.all();
            commonServices.value = data.filter(service => service.type === 'Comun');
            testServices.value = data.filter(service => service.type === 'Gabinete');
            labServices.value = data.filter(service => service.type === 'Laboratorio');
            imageServices.value = data.filter(service => service.type === 'Imagen');
        } catch (error) {
            console.log(error);
        } finally {
            isLoading.value = false;
        }
    };

    fetchServices();

    return {
        commonServices,
        testServices,
        labServices,
        imageServices,
        isLoading
    }
})