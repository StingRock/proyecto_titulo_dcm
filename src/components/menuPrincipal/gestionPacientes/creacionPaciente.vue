<template>
  <div class="main-content">
    <h1>Creación de Pacientes</h1>

    <form @submit.prevent="crearPaciente" class="formulario-crear-pacientes">
      <div>
        <label for="rut_paciente">RUT:</label>
        <input
          id="rut_paciente"
          v-model="paciente.rut_paciente"
          maxlength="8"
          placeholder="Ingrese el RUT sin dígito"
          pattern="\d*"
          required
        />
      </div>
      <div>
        <label for="dv_paciente">Dígito Verificador:</label>
        <input id="dv_paciente" v-model="paciente.dv_paciente" placeholder="Dígito verificador" readonly />
      </div>
      <div>
        <label for="nombre">Nombres:</label>
        <input 
          id="nombre" 
          v-model="paciente.nombre" 
          maxlength="50" 
          placeholder="Ej: Kevin Angel" 
          required 
        />
        <small v-if="camposLetrasInvalido" style="color: red;">El campo solo permite letras, favor de corregir.</small>
      </div>
      <div>
        <label for="apellido_paterno">Apellido Paterno:</label>
        <input 
          id="apellido_paterno" 
          v-model="paciente.apellido_paterno" 
          maxlength="30" 
          placeholder="Ej: Navarrete" 
          required 
        />
        <small v-if="camposLetrasInvalido" style="color: red;">El campo solo permite letras, favor de corregir.</small>
      </div>
      <div>
        <label for="apellido_materno">Apellido Materno:</label>
        <input 
          id="apellido_materno" 
          v-model="paciente.apellido_materno" 
          maxlength="30" 
          placeholder="Ej: Baeza" 
          required
        />
        <small v-if="camposLetrasInvalido" style="color: red;">El campo solo permite letras, favor de corregir.</small>
      </div>
      <div>
        <label for="contacto">Contacto:</label>
        <input
          id="contacto"
          v-model="paciente.contacto"
          type="tel"
          pattern="^\d{0,9}$"
          maxlength="9"
          placeholder="Ingrese hasta 9 dígitos"
          required
        />
        <small v-if="contactoInvalido" style="color: red;">El contacto debe contener solo números (máx. 9 dígitos).</small>
      </div>
      <div>
        <label for="correo">Correo:</label>
        <input
          id="correo"
          v-model="paciente.correo"
          type="email"
          maxlength="80"
          placeholder="Ingrese un correo válido"
          pattern="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
          required
        />
        <small v-if="correoInvalido" style="color: red;">Por favor, ingrese un correo válido.</small>
      </div>
      <div>
        <label for="prevision">Previsión:</label>
        <input 
        id="prevision" 
        v-model="paciente.prevision" 
        maxlength="50" 
        placeholder="Ej: Consalud" 
        />
        <small v-if="camposLetrasInvalido" style="color: red;">El campo solo permite letras, favor de corregir.</small>
      </div>
      <button type="submit">Guardar</button>
    </form>
    <exportedForm />
  </div>
</template>

<script setup>
import { reactive, watch, ref } from "vue";
import exportedForm from "@/components/exportedForm.vue";

function calcularDigitoVerificador(rut) {
  rut = rut.replace(/\./g, "").replace("-", "").trim();
  if (!/^\d+$/.test(rut) || rut.length < 7 || rut.length > 8) return "";

  let suma = 0;
  let multiplicador = 2;

  for (let i = rut.length - 1; i >= 0; i--) {
    suma += parseInt(rut[i]) * multiplicador;
    multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
  }

  const dvEsperado = 11 - (suma % 11);
  return dvEsperado === 11 ? "0" : dvEsperado === 10 ? "K" : dvEsperado.toString();
}

// Estado reactivo
const paciente = reactive({
  rut_paciente: "",
  dv_paciente: "",
  nombre: "",
  apellido_paterno: "",
  apellido_materno: "",
  contacto: "",
  correo: "",
  prevision: "",
});

const correoInvalido = ref(false);
const contactoInvalido = ref(false);
const camposLetrasInvalido = ref(false);

// Función para validar solo letras
function validarSoloLetras(campo) {
  const soloLetrasRegex = /^[a-zA-Z\s]+$/;
  return !soloLetrasRegex.test(campo);
}

// Validación del Rut
watch(
  () => paciente.rut_paciente,
  (nuevoRut) => {
    // Solo permitimos números
    if (/[^0-9]/.test(nuevoRut)) {
      paciente.rut_paciente = nuevoRut.replace(/[^0-9]/g, ''); // Remover cualquier cosa que no sea un número
    }
    paciente.dv_paciente = calcularDigitoVerificador(nuevoRut);
  }
);

// Validación del correo
watch(
  () => paciente.correo,
  (nuevoCorreo) => {
    const correoRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    correoInvalido.value = !correoRegex.test(nuevoCorreo);
  }
);

// Validación del contacto
watch(
  () => paciente.contacto,
  (nuevoContacto) => {
    const contactoRegex = /^\d{0,9}$/;
    contactoInvalido.value = !contactoRegex.test(nuevoContacto);
    if (nuevoContacto.length > 9) {
      paciente.contacto = nuevoContacto.slice(0, 9); // Limita los caracteres a 9
    }
  }
);

// Validación de solo letras para los campos relevantes
watch(
  () => paciente.nombre,
  (nuevoNombre) => {
    camposLetrasInvalido.value = validarSoloLetras(nuevoNombre);
  }
);

watch(
  () => paciente.apellido_paterno,
  (nuevoApellidoPaterno) => {
    camposLetrasInvalido.value = validarSoloLetras(nuevoApellidoPaterno);
  }
);

watch(
  () => paciente.apellido_materno,
  (nuevoApellidoMaterno) => {
    camposLetrasInvalido.value = validarSoloLetras(nuevoApellidoMaterno);
  }
);

watch(
  () => paciente.prevision,
  (nuevaPrevision) => {
    camposLetrasInvalido.value = validarSoloLetras(nuevaPrevision);
  }
);

async function crearPaciente() {
  if (correoInvalido.value || contactoInvalido.value || camposLetrasInvalido) {
    alert("Por favor, corrija los errores antes de guardar.");
    return;
  }

  try {
    const response = await fetch("http://localhost:3000/api/pacientes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(paciente),
    });

    if (!response.ok) throw new Error("Error en la API");

    alert("Paciente creado exitosamente.");
    limpiarFormulario();
  } catch (error) {
    console.error("Error al crear el paciente:", error);
    alert("Hubo un error al crear el paciente.");
  }
}

function limpiarFormulario() {
  Object.keys(paciente).forEach((key) => (paciente[key] = ""));
}
</script>


<style scoped>
.formulario-crear-pacientes {
  background-color: #f8f9fa;
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 20px;
  max-width: 600px;
  margin: 20px ;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.formulario-crear-pacientes h1 {
  text-align: center;
  font-size: 24px;
  margin-bottom: 20px;
  color: #333;
}

.formulario-crear-pacientes label {
  font-weight: bold;
  display: block;
  margin-bottom: 5px;
  color: #555;
}

.formulario-crear-pacientes input {
  width: 100%;
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
  box-sizing: border-box;
}

.formulario-crear-pacientes input:focus {
  border-color: #007bff;
  box-shadow: 0 0 4px rgba(0, 123, 255, 0.5);
  outline: none;
}

.formulario-crear-pacientes button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  font-size: 16px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
  width: 100%;
}

.formulario-crear-pacientes button:hover {
  background-color: #0056b3;
}
</style>
