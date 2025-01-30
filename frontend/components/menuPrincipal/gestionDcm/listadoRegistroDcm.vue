<template>
    <div class="flex min-h-screen">
  
      <!-- Contenido Principal -->
      <div class="listado-dcm flex-1">
        <h1>Gestión Detalle de Cuenta Médica</h1>
  
        <div v-if="loading" class="text-center py-4">
          <p>Cargando datos...</p>
        </div>
  
        <div v-else class="table-container">
          <table>
            <thead>
              <tr>
                <th>N°</th>
                <th>Rut Paciente</th>
                <th>Contacto</th>
                <th>Correo</th>
                <th>Previsión</th>
                <th>Gestionar Prestaciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(dcm, index) in dcms" :key="dcm.paciente_rut">
                <td>{{ index + 1 }}</td>
                <td>{{ dcm.paciente_rut }}</td>
                <td>{{ dcm.contacto_paciente }}</td>
                <td>{{ dcm.correo_paciente }}</td>
                <td>{{ dcm.prevision_paciente }}</td>
                <td class="text-center">
                  <button 
                    @click="verPrestaciones(dcm.rut)"
                    class="ver-btn"
                  >
                    Ver
                  </button>
                </td>
              </tr>
              <tr v-if="dcms.length === 0">
                <td colspan="6" class="text-center">
                  No se encontraron registros
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <exportedForm class="mt-6" />
    </div>
  </template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import exportedForm from '@/components/exportedForm.vue';

const dcms = ref([]);
const loading = ref(true);

const obtenerDcms = async () => {
  try {
    loading.value = true;
    const response = await axios.get('/api/dcm');
    console.log('DCMs obtenidos:', response.data);
    
    // Agrupar DCMs por paciente
    const dcmsAgrupados = response.data.reduce((acc, dcm) => {
      if (!acc[dcm.paciente_rut]) {
        acc[dcm.paciente_rut] = {
          paciente_rut: `${dcm.paciente_rut}-${dcm.paciente_dv}`,
          nombre_completo_paciente: dcm.nombre_completo_paciente,
          contacto_paciente: dcm.contacto_paciente || 'No especificado',
          correo_paciente: dcm.correo_paciente || 'No especificado',
          prevision_paciente: dcm.prevision_paciente || 'No especificado',
          prestaciones: []
        };
      }
      acc[dcm.paciente_rut].prestaciones.push({
        codigo: dcm.prestacion_codigo,
        descripcion: dcm.prestacion_descripcion,
        valor: dcm.prestacion_valor
      });
      return acc;
    }, {});

    dcms.value = Object.values(dcmsAgrupados);
  } catch (error) {
    console.error('Error al obtener DCMs:', error);
  } finally {
    loading.value = false;
  }
};

const verPrestaciones = (rut) => {
  console.log('Ver prestaciones del paciente:', rut);
  // Aquí implementarás la lógica para ver prestaciones
};

onMounted(() => {
  obtenerDcms();
});
</script>

<style scoped>
.listado-dcm {
  background-color: #f8f9fa;
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 20px;
  margin: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: block;
  margin-left: 260px;
  width: fit-content;
}

.main-container {
  display: flex;
  min-height: 100vh;
  background-color: #f0f2f5;
}

h1 {
  font-size: 24px;
  text-align: center;
  margin-bottom: 20px;
  color: #333;
}

.table-container {
  width: 100%;
  overflow-x: auto;
  background-color: white;
  border-radius: 8px;
  padding: 1px;
}

table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
}

th, td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

th {
  background-color: #f8f9fa;
  font-weight: bold;
  color: #555;
  font-size: 14px;
}

td {
  font-size: 14px;
  color: #333;
}

tr:hover {
  background-color: #f5f5f5;
}

.ver-btn {
  background-color: #00ff48;
  color: white;
  font-size: 14px;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.ver-btn:hover {
  background-color: #0056b3;
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
td:nth-child(3),
th:nth-child(4), 
td:nth-child(4) {
  width: 200px;
}

th:nth-child(5), 
td:nth-child(5) {
  width: 120px;
}

th:nth-child(6), 
td:nth-child(6) {
  width: 100px;
}

td {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.text-center {
  text-align: center;
  padding: 1rem;
  color: #666;
}
</style>