<template>
  <div>
    <h1>Método Gran M</h1>

    <!-- Configuración inicial -->
    <div class="configuracion">
      <label for="num-variables">Número de Variables:</label>
      <input type="number" id="num-variables" v-model.number="numVariables" min="1" />

      <label for="num-restricciones">Número de Restricciones:</label>
      <input type="number" id="num-restricciones" v-model.number="numRestricciones" min="1" />

      <button @click="generarInputs">Aceptar</button>
    </div>

    <!-- Formulario dinámico -->
    <div v-if="mostrarFormulario" class="formulario">
      <h2>Ingresar Datos</h2>

      <!-- Función Objetivo -->
      <div class="seccion">
        <h3>Función Objetivo</h3>
        <div class="ecuacion">
          Maximizar Z =
          <span v-for="(coef, index) in funcionObjetivo" :key="'fo-' + index">
            <input type="number" v-model.number="funcionObjetivo[index]" />
            X{{ index + 1 }}
            <span v-if="index < funcionObjetivo.length - 1">+</span>
          </span>
        </div>
      </div>

      <!-- Restricciones -->
      <div class="seccion">
        <h3>Restricciones</h3>
        <div v-for="(restriccion, rIndex) in restricciones" :key="'r-' + rIndex" class="ecuacion">
          <span v-for="(coef, vIndex) in restriccion.coeficientes" :key="'r-' + rIndex + '-v-' + vIndex">
            <input type="number" v-model.number="restricciones[rIndex].coeficientes[vIndex]" />
            X{{ vIndex + 1 }}
            <span v-if="vIndex < restriccion.coeficientes.length - 1">+</span>
          </span>
          &nbsp;<=&nbsp;
          <input type="number" v-model.number="restricciones[rIndex].valor" />
        </div>
      </div>

      <!-- Botón Resolver -->
      <button @click="resolverSimplex">Resolver</button>
    </div>

    <!-- Resultado -->
    <div v-if="resultado" class="resultado">
      <h2>Resultado</h2>
      <p><strong>Solución Óptima:</strong> {{ resultado.solucion }}</p>
      <p><strong>Valor Óptimo:</strong> {{ resultado.valor_optimo }}</p>
      <p><strong>Iteraciones:</strong> {{ resultado.iteraciones }}</p>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      numVariables: 2,
      numRestricciones: 2,
      funcionObjetivo: [],
      restricciones: [],
      mostrarFormulario: false,
      resultado: null,
    };
  },
  methods: {
    generarInputs() {
      this.funcionObjetivo = Array(this.numVariables).fill(0);
      this.restricciones = Array(this.numRestricciones).fill(null).map(() => ({
        coeficientes: Array(this.numVariables).fill(0),
        valor: 0,
      }));
      this.mostrarFormulario = true;
    },
    async resolverGranM() {
      const data = {
        funcion_objetivo: [...this.funcionObjetivo],
        restricciones_coeficientes: this.restricciones.map(r => [...r.coeficientes]),
        restricciones_valores: this.restricciones.map(r => r.valor),
      };

      try {
        const response = await axios.post("http://localhost:5000/gran_m", data);
        this.resultado = response.data;
      } catch (error) {
        console.error("Error:", error);
      }
    },
  },
};
</script>


<style scoped>
/* Estilos generales */
.configuracion,
.formulario,
.resultado {
  margin-bottom: 20px;
}

.seccion {
  margin-bottom: 15px;
}

.ecuacion {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.ecuacion input {
  margin-right: 5px;
  padding: 5px;
  width: 60px;
}

button {
  padding: 10px 15px;
  background-color: #007bff;
  color: white;
  border: none;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}
</style>