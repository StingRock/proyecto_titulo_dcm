<template>
  <div class="flex min-h-screen">
    <h1>Creación de Detalle de Cuenta Médica</h1>
    <div class="crear-dcm flex-1">
      <form @submit.prevent="crearDcm">
        <div class="grid gap-4 mb-6">
          <div class="flex items-center gap-2">
            <label for="rut_paciente" class="text-sm font-medium text-gray-700">RUT:</label>
            <input 
              id="rut_paciente" 
              v-model="rutInput"
              @input="manejarCambioRut"
              placeholder="Ingresar Rut sin punto ni guión" 
              class="flex-1 px-3 py-2 border rounded-md"
              required 
            />
            <label for="dv_paciente" class="text-sm font-medium text-gray-700">-</label>
            <input 
              id="dv_paciente" 
              v-model="dvInput" 
              maxlength="1"
              class="dv-input px-3 py-2 border rounded-md bg-gray-100"
              readonly 
            />
          </div>

          <div class="flex items-center gap-2">
            <label for="nombre_completo" class="text-sm font-medium text-gray-700 w-32">Nombre Completo:</label>
            <input 
              id="nombre_completo" 
              :value="`${paciente.nombre_pcte} ${paciente.appaterno_pcte} ${paciente.apmaterno_pcte}`"
              class="flex-1 px-3 py-2 bg-gray-100 rounded-md"
              readonly 
              required 
            />
          </div>

          <div class="flex items-center gap-2">
            <label for="contacto" class="text-sm font-medium text-gray-700 w-32">Contacto:</label>
            <input 
              id="contacto" 
              v-model="paciente.contacto" 
              class="flex-1 px-3 py-2 bg-gray-100 rounded-md"
              readonly 
            />
          </div>

          <div class="flex items-center gap-2">
            <label for="correo" class="text-sm font-medium text-gray-700 w-32">Correo:</label>
            <input 
              id="correo" 
              v-model="paciente.correo" 
              class="flex-1 px-3 py-2 bg-gray-100 rounded-md"
              readonly 
            />
          </div>

          <div class="flex items-center gap-2">
            <label for="prevision" class="text-sm font-medium text-gray-700 w-32">Previsión:</label>
            <input 
              id="prevision" 
              v-model="paciente.prevision" 
              class="flex-1 px-3 py-2 bg-gray-100 rounded-md"
              readonly 
            />
          </div>
        </div>

        <div class="mb-6">
          <h2 class="text-lg font-semibold mb-2">Prestaciones para el registro</h2>
          <div class="flex gap-2 mb-4">
            <div class="relative flex-1">
              <input
                type="text"
                placeholder="Buscar por código..."
                class="w-full px-3 py-2 border rounded-md pr-10"
                v-model="searchTerm"
                @input="buscarPrestaciones"
              />
              <i class="fas fa-search absolute right-3 top-2.5 text-gray-400"></i>
            </div>
          </div>

          <div class="overflow-x-auto rounded-lg border">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="w-12 px-3 py-2 text-left text-sm font-medium text-gray-500">N°</th>
                  <th class="px-3 py-2 text-left text-sm font-medium text-gray-500">Código</th>
                  <th class="px-3 py-2 text-left text-sm font-medium text-gray-500">Glosa</th>
                  <th class="px-3 py-2 text-left text-sm font-medium text-gray-500">Valor</th>
                  <th class="w-24 px-3 py-2"></th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="(result, index) in searchResults" :key="index" class="hover:bg-gray-50">
                  <td class="px-3 py-2 text-sm">{{ index + 1 }}</td>
                  <td class="px-3 py-2 text-sm">{{ result.codigo_prestacion }}</td>
                  <td class="px-3 py-2 text-sm">{{ result.descrip_prestacion }}</td>
                  <td class="px-3 py-2 text-sm text-right">${{ result.valor_prestacion }}</td>
                  <td class="px-3 py-2">
                    <button
                      type="button"
                      @click="agregarPrestacion(result)"
                      class="crear-dcm button agregar w-full"
                    >
                      <i class="fas fa-plus mr-1"></i>
                    Agregar
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="mb-6">
          <h2 class="text-lg font-semibold mb-2">Prestaciones registradas</h2>
          <div class="overflow-x-auto rounded-lg border">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="w-12 px-3 py-2 text-left text-sm font-medium text-gray-500">N°</th>
                  <th class="px-3 py-2 text-left text-sm font-medium text-gray-500">Código</th>
                  <th class="px-3 py-2 text-left text-sm font-medium text-gray-500">Glosa</th>
                  <th class="px-3 py-2 text-left text-sm font-medium text-gray-500">Valor</th>
                  <th class="w-24 px-3 py-2"></th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="(service, index) in selectedServices" :key="index" class="hover:bg-gray-50">
                  <td class="px-3 py-2 text-sm">{{ index + 1 }}</td>
                  <td class="px-3 py-2 text-sm">{{ service.codigo_prestacion }}</td>
                  <td class="px-3 py-2 text-sm">{{ service.descrip_prestacion }}</td>
                  <td class="px-3 py-2 text-sm text-right">${{ service.valor_prestacion }}</td>
                  <td class="px-3 py-2">
                    <button
                      type="button"
                      @click="eliminarPrestacion(index)"
                      class="crear-dcm button eliminar w-full"
                      >
                      <i class="fas fa-trash mr-1"></i>
                      Eliminar
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="flex justify-end">
          <button 
            type="submit"
            class="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            <i class="fas fa-save"></i>
            Crear D.C.M
          </button>
        </div>
      </form>
    </div>
    <exportedForm class="w-64 shrink-0" />  
  </div>
</template>
 
<script>
import { ref, reactive } from 'vue'
import axios from 'axios'
import exportedForm from '@/components/exportedForm.vue'

export default {
  name: 'DetalleCuentaMedica',
  components: {
    exportedForm
  },
  setup() {
    const rutInput = ref('')
    const dvInput = ref('')
    const searchTerm = ref('')
    const searchResults = ref([])
    const selectedServices = ref([])
    const paciente = reactive({
      nombre_pcte: '',
      appaterno_pcte: '',
      apmaterno_pcte: '',
      contacto_pcte: '',
      correo_pcte: '',
      prevision: ''
    })

    // Función para calcular dígito verificador
    const calcularDv = (rut) => {
      let suma = 0
      let multiplo = 2

      // Para cada dígito del Rut
      for (let i = String(rut).length - 1; i >= 0; i--) {
        suma += Number(String(rut)[i]) * multiplo
        multiplo = multiplo === 7 ? 2 : multiplo + 1
      }

      const resultado = 11 - (suma % 11)
      let dv = ''

      if (resultado === 11) {
        dv = '0'
      } else if (resultado === 10) {
        dv = 'K'
      } else {
        dv = String(resultado)
      }

      return dv
    }

    // Función para manejar cambio de RUT
const manejarCambioRut = async () => {
  // Limpiar caracteres no numéricos excepto K
  rutInput.value = rutInput.value.replace(/[^0-9kK]/g, '')
  
  // Limpiar datos del paciente
  const limpiarDatosPaciente = () => {
    dvInput.value = ''
    Object.keys(paciente).forEach(key => paciente[key] = '')
  }
  
  if (rutInput.value.length >= 7) {
    // Calcular DV
    const dv = calcularDv(rutInput.value)
    dvInput.value = dv

    try {
      console.log('Buscando paciente con RUT:', rutInput.value)
      const response = await axios.get(`/api/pacientes/${rutInput.value}`)
      console.log('Respuesta de búsqueda:', response.data)
      
      const data = response.data
      if (data) {
        paciente.nombre_pcte = data.nombre_pcte || ''
        paciente.appaterno_pcte = data.appaterno_pcte || ''
        paciente.apmaterno_pcte = data.apmaterno_pcte || ''
        paciente.contacto = data.contacto_pcte || ''
        paciente.correo = data.correo_pcte || ''
        paciente.prevision = data.prevision || ''
      }
      } catch (error) {
        console.error('Error al buscar paciente:', error)
        if (error.response?.status === 404) {
          alert('Paciente no encontrado')
        } else {
          alert('Error al buscar paciente')
        }
        limpiarDatosPaciente()
      }
    } else {
      limpiarDatosPaciente()
    }
  }

    // Función para validar RUT completo
    const validarRut = () => {
      if (!rutInput.value || !dvInput.value) return false
      const dv = calcularDv(rutInput.value)
      return dv.toLowerCase() === dvInput.value.toLowerCase()
    }

    // Función para buscar prestaciones
    const buscarPrestaciones = async () => {
      if (searchTerm.value.length < 3) {
        searchResults.value = [];
        return;
      }
      try {
        console.log('Buscando:', searchTerm.value);
        const response = await axios.get(`http://localhost:9000/api/prestaciones/buscar`, {
          params: {
            q: searchTerm.value
          }
        });
        console.log('Respuesta:', response.data);
        searchResults.value = response.data;
      } catch (error) {
        console.error('Error al buscar prestaciones:', error.response || error);
        searchResults.value = [];
      }
    }

    // Función para agregar prestación
    const agregarPrestacion = (prestacion) => {
      selectedServices.value.push(prestacion)
    }

    // Función para eliminar prestación
    const eliminarPrestacion = (index) => {
      selectedServices.value.splice(index, 1)
    }

    // En creacionDcm.vue, dentro del setup()
    const crearDcm = async () => {
      if (!validarRut()) {
        alert('RUT inválido')
        return
      }

      if (selectedServices.value.length === 0) {
        alert('Debe seleccionar al menos una prestación')
        return
      }

      try {
        // Crear un DCM por cada prestación seleccionada
        const dcmPromises = selectedServices.value.map(prestacion => {
          const dcmData = {
            paciente_rut: rutInput.value,
            paciente_dv: dvInput.value,
            nombre_completo_paciente: `${paciente.nombre_pcte} ${paciente.appaterno_pcte} ${paciente.apmaterno_pcte}`.trim(),
            contacto_paciente: paciente.contacto_pcte || '',
            correo_paciente: paciente.correo_pcte || '',
            prestacion_codigo: prestacion.codigo_prestacion,
            prestacion_descripcion: prestacion.descrip_prestacion,
            prestacion_valor: prestacion.valor_prestacion,
            prevision_paciente: paciente.prevision || '',
            descripcion_dcm: '',
            usuario_responsable: ''
          }

          console.log('Enviando DCM:', dcmData)
          return axios.post('/api/dcm/crear', dcmData)
        })

        const responses = await Promise.all(dcmPromises)
        const allSuccess = responses.every(response => response.data.success)

        if (allSuccess) {
          alert(`Se crearon ${selectedServices.value.length} DCMs exitosamente`)
          // Limpiar formulario
          selectedServices.value = []
          rutInput.value = ''
          dvInput.value = ''
          Object.keys(paciente).forEach(key => paciente[key] = '')
          searchTerm.value = ''
          searchResults.value = []
        }
      } catch (error) {
        console.error('Error al crear DCMs:', error)
        const errorMessage = error.response?.data?.message || 'Error al crear los DCMs'
        alert(errorMessage)
      }
    }

    return {
      rutInput,
      dvInput,
      searchTerm,
      searchResults,
      selectedServices,
      paciente,
      manejarCambioRut,
      buscarPrestaciones,
      agregarPrestacion,
      eliminarPrestacion,
      crearDcm,
      validarRut
    }
  }
}
</script>
 
 <style>
.crear-dcm {
  background-color: #f8f9fa;
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 20px;
  max-width: 900px;
  margin: 1rem auto; /* Reducido de 20px a 1rem */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
 
h1 {
  font-size: 24px;
  text-align: center;
  margin-bottom: 20px;
  color: #333;
}
 
.crear-dcm form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
 
.crear-dcm label {
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 4px;
  display: block;
  color: #555;
}
 
.crear-dcm input,
.crear-dcm select {
  width: 100%;
  padding: 8px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}
 
.crear-dcm input[readonly] {
  background-color: #e9ecef;
  cursor: not-allowed;
}
 
.crear-dcm button {
  background-color: #007bff;
  color: white;
  font-size: 14px;
  padding: 8px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}
 
.crear-dcm button:hover {
  background-color: #0056b3;
}
 
.crear-dcm ul {
  list-style: none;
  padding: 0;
  margin: 0;
}
 
.crear-dcm li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #ffffff;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-bottom: 8px;
}
 
.crear-dcm li button {
  background-color: #dc3545;
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 4px;
}
 
.crear-dcm li button:hover {
  background-color: #a71d2a;
}
 
.crear-dcm .error-message {
  color: #dc3545;
  font-size: 14px;
  margin-top: 10px;
  text-align: center;
}
 
.crear-dcm .success-message {
  color: #28a745;
  font-size: 14px;
  margin-top: 10px;
  text-align: center;
}

.crear-dcm button.agregar {
  background-color: #22c55e;
  color: white;
}

.crear-dcm button.agregar:hover {
  background-color: #16a34a;
}

.crear-dcm button.eliminar {
  background-color: #ef4444;
  color: white;
}

.crear-dcm button.eliminar:hover {
  background-color: #dc2626;
}

.table-container {
  width: 100%;
  overflow-x: auto;
}

table {
  width: 100%;
  table-layout: fixed;
}

th:nth-child(1), 
td:nth-child(1) {
  width: 50px;
}

th:nth-child(2), 
td:nth-child(2) {
  width: 120px;
}

th:nth-child(3), 
td:nth-child(3) {
  width: 400px;
}

th:nth-child(4), 
td:nth-child(4) {
  width: 100px;
}

th:nth-child(5), 
td:nth-child(5) {
  width: 70px;
}

td {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

</style>