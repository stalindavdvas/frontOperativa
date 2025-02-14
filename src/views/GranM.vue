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
          <select v-model="restricciones[rIndex].signo">
            <option value="<=">≤</option>
            <option value=">=">≥</option>
            <option value="=">=</option>
          </select>
          <input type="number" v-model.number="restricciones[rIndex].valor" />
        </div>
      </div>
      <!-- Botón Resolver -->
      <button @click="resolverGranM">Resolver</button>
    </div>
    <!-- Resultado -->
    <div v-if="resultado" class="resultado">
      <h2>Resultado Final</h2>
      <p><strong>Solución Óptima:</strong> {{ resultado.solucion }}</p>
      <p><strong>Valor Óptimo:</strong> {{ resultado.valor_optimo }}</p>

      <!-- Mostrar iteraciones -->
      <div v-if="iteraciones.length">
        <h2>Iteraciones del Método Gran M</h2>
        <div v-for="(iteracion, index) in iteraciones" :key="'iter-' + index" class="iteracion">
          <h3>Iteración {{ index + 1 }}</h3>
          <table>
            <thead>
              <tr>
                <th>Variable Básica</th>
                <th v-for="(varName, idx) in iteracion.variables" :key="'var-' + idx">{{ varName }}</th>
                <th>Solución</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(fila, fIndex) in iteracion.tabla" :key="'fila-' + fIndex">
                <td>{{ iteracion.bases[fIndex] }}</td>
                <td v-for="(valor, vIndex) in fila" :key="'val-' + vIndex">{{ valor.toFixed(2) }}</td>
              </tr>
            </tbody>
          </table>
          <p><strong>Valor de Z:</strong> {{ iteracion.valor_z.toFixed(2) }}</p>
        </div>
      </div>
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
      iteraciones: [],
    };
  },
  methods: {
    generarInputs() {
      this.funcionObjetivo = Array(this.numVariables).fill(0);
      this.restricciones = Array(this.numRestricciones)
        .fill(null)
        .map(() => ({
          coeficientes: Array(this.numVariables).fill(0),
          signo: "<=",
          valor: 0,
        }));
      this.mostrarFormulario = true;
    },
    async resolverGranM() {
      const data = {
        funcion_objetivo: Array.from(this.funcionObjetivo),
        restricciones: this.restricciones.map((r) => ({
          coeficientes: Array.from(r.coeficientes),
          signo: r.signo,
          valor: r.valor,
        })),
      };
      try {
        const response = await axios.post("http://localhost:5000/gran_m", data);
        this.resultado = response.data;
        this.iteraciones = response.data.iteraciones;
      } catch (error) {
        console.error("Error al resolver el Método de la Gran M:", error);
        alert("Ocurrió un error al resolver el problema.");
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
.ecuacion input,
.ecuacion select {
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
table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
}
table th,
table td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: center;
}
table th {
  background-color: #f4f4f4;
}
.iteracion {
  margin-bottom: 20px;
}
</style>