<script setup>
import { ref } from "vue";
import axios from "axios";

const oferta = ref("");
const demanda = ref("");
const costos = ref("");
const resultado = ref(null);

const resolver = async () => {
  try {
    const response = await axios.post("http://localhost:5000/esquina_noroeste", {
      oferta: oferta.value.split(",").map(Number),
      demanda: demanda.value.split(",").map(Number),
      costos: JSON.parse(costos.value),
    });

    resultado.value = response.data.solucion;
  } catch (error) {
    console.error("Error:", error);
  }
};
</script>

<template>
  <div>
    <h2>Método de la Esquina Noroeste</h2>
    <label>Oferta:</label>
    <input v-model="oferta" placeholder="Ej: 30,40" />
    
    <label>Demanda:</label>
    <input v-model="demanda" placeholder="Ej: 20,50" />

    <label>Matriz de Costos:</label>
    <input v-model="costos" placeholder='Ej: [[8,6],[4,3]]' />

    <button @click="resolver">Resolver</button>

    <div v-if="resultado">
      <h3>Resultado</h3>
      <pre>{{ resultado }}</pre>
    </div>
  </div>
</template>
