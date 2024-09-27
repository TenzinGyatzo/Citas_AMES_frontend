import { generateClasses } from '@formkit/themes'

const config = {
    config: {
        classes: generateClasses({
            global: {
                wrapper: 'space-y-2 mb-3',
                message: 'bg-red-500 text-white text-center text-sm font-bold uppercase p-1 my-2.5 rounded-lg',
                label: 'block mb-1 font-bold text-md lg:text-lg text-white',
                input: 'w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500 transition-all duration-200 ease-in-out text-xs md:text-sm lg:text-md',
            },
            submit: {
                input: '$reset bg-sky-600 hover:bg-sky-700 rounded-lg text-white font-semibold w-full py-1.5 mt-4 hover:scale-105 transform transition-all duration-200 ease-in-out shadow-md md:text-lg xl:text-xl'
            }
        })
    }
}     

export default config