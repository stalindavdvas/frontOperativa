<template>
  <div>
    <h1>Método de la Esquina Noroeste</h1>

    <!-- Configuración inicial -->
    <div class="configuracion">
      <label for="num-origenes">Número de Orígenes:</label>
      <input type="number" id="num-origenes" v-model.number="numOrigenes" min="1" />
      <label for="num-destinos">Número de Destinos:</label>
      <input type="number" id="num-destinos" v-model.number="numDestinos" min="1" />
      <button @click="generarMatriz">Aceptar</button>
    </div>

    <!-- Matriz Generalizada -->
    <div v-if="mostrarMatriz" class="formulario">
      <h2>Tabla de Transporte</h2>
      <table border="1" cellpadding="5">
        <thead>
          <tr>
            <th></th>
            <th v-for="(destino, index) in destinos" :key="'destino-header-' + index">
              <input type="text" v-model="destinos[index]" placeholder="Nombre D" />
            </th>
            <th>Oferta</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(fila, i) in matriz" :key="'fila-' + i">
            <td>
              <input type="text" v-model="origenes[i]" placeholder="Nombre O" />
            </td>
            <td v-for="(celda, j) in fila" :key="'celda-' + i + '-' + j">
              <input
                v-if="j < numDestinos"
                type="number"
                v-model.number="matriz[i][j]"
                placeholder="Costo"
                min="0"
              />
              <input
                v-else
                type="number"
                v-model.number="ofertas[i]"
                placeholder="Oferta"
                min="0"
              />
            </td>
          </tr>
          <tr>
            <td>Demanda</td>
            <td v-for="(demanda, j) in demandas" :key="'demanda-' + j">
              <input type="number" v-model.number="demandas[j]" placeholder="Demanda" min="0" />
            </td>
            <td></td>
          </tr>
        </tbody>
      </table>

      <!-- Botón Resolver -->
      <button @click="resolverEsquinaNoroeste">Resolver</button>
    </div>

    <!-- Resultado -->
    <div v-if="resultado" class="resultado">
      <h2>Resultado</h2>
      <p><strong>Solución:</strong></p>
      <ul>
        <li v-for="(asignacion, index) in resultado.asignaciones" :key="'asignacion-' + index">
          {{ asignacion.origen }} -> {{ asignacion.destino }}: {{ asignacion.cantidad }}
        </li>
      </ul>
      <p><strong>Costo Total:</strong> {{ resultado.costo_total.toFixed(2) }}</p>
    </div>

    <!-- Mensaje de Error -->
    <div v-if="error" class="error">
      <p><strong>Error:</strong> {{ error }}</p>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      numOrigenes: 2,
      numDestinos: 2,
      origenes: [],
      destinos: [],
      matriz: [],
      ofertas: [],
      demandas: [],
      mostrarMatriz: false,
      resultado: null,
      error: null,
    };
  },
  methods: {
    generarMatriz() {
      // Inicializar nombres de orígenes y destinos
      this.origenes = Array(this.numOrigenes).fill("");
      this.destinos = Array(this.numDestinos).fill("");

      // Inicializar la matriz de costos
      this.matriz = Array(this.numOrigenes)
        .fill(null)
        .map(() => Array(this.numDestinos + 1).fill(0));

      // Inicializar ofertas y demandas
      this.ofertas = Array(this.numOrigenes).fill(0);
      this.demandas = Array(this.numDestinos).fill(0);

      this.mostrarMatriz = true;
    },
    async resolverEsquinaNoroeste() {
      this.error = null; // Limpiar errores previos

      const data = {
        origenes: this.origenes.map((nombre, i) => nombre || `O${i + 1}`),
        destinos: this.destinos.map((nombre, i) => nombre || `D${i + 1}`),
        matriz_costos: this.matriz.map(fila => fila.slice(0, -1)), // Excluir la columna de oferta
        ofertas: this.ofertas,
        demandas: this.demandas,
      };

      try {
        const response = await axios.post(`${this.$backendUrl}/esquina-noroeste`, data);
        this.resultado = response.data;
      } catch (error) {
        this.error = error.response?.data?.error || "Ocurrió un error al resolver el problema.";
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
/* Estilos para tablas */
table {
  border-collapse: collapse;
  margin-bottom: 15px;
  width: 100%;
}
table th,
table td {
  padding: 8px;
  text-align: center;
  border: 1px solid #ddd;
}
table th {
  background-color: #f4f4f4;
}
/* Estilos para errores */
.error {
  color: red;
  font-weight: bold;
}
</style>