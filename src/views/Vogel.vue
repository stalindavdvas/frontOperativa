<template>
  <div>
    <h1>Método de Vogel</h1>

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
      <button @click="resolverVogel">Resolver</button>
    </div>

    <!-- Iteraciones -->
    <div v-if="resultado && resultado.iteraciones" class="resultado">
      <h2>Iteraciones</h2>
      <div v-for="(iteracion, index) in resultado.iteraciones" :key="'iteracion-' + index">
        <h3>Iteración {{ index + 1 }}</h3>
        <table border="1" cellpadding="5">
          <thead>
            <tr>
              <th></th>
              <th v-for="(destino, j) in destinos" :key="'destino-header-' + j">{{ destino || `D${j + 1}` }}</th>
              <th>Oferta</th>
              <th>Penalización Fila</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(fila, i) in iteracion.matriz_costos" :key="'fila-' + i">
              <td>{{ origenes[i] || `O${i + 1}` }}</td>
              <td v-for="(costo, j) in fila" :key="'costo-' + i + '-' + j">{{ costo === Infinity ? "∞" : costo }}</td>
              <td>{{ iteracion.ofertas[i] }}</td>
              <td>{{ iteracion.penalizaciones_fila[i] === Infinity ? "∞" : iteracion.penalizaciones_fila[i] }}</td>
            </tr>
            <tr>
              <td>Demanda</td>
              <td v-for="(demanda, j) in iteracion.demandas" :key="'demanda-' + j">{{ demanda }}</td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td>Penalización Columna</td>
              <td v-for="(penalizacion, j) in iteracion.penalizaciones_columna" :key="'penalizacion-col-' + j">
                {{ penalizacion === Infinity ? "∞" : penalizacion }}
              </td>
              <td></td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>Resultado Final</h2>
      <p><strong>Solución:</strong></p>
      <ul>
        <li v-for="(asignacion, index) in resultado.asignaciones" :key="'asignacion-' + index">
          {{ asignacion.origen }} -> {{ asignacion.destino }}: {{ asignacion.cantidad }}
        </li>
      </ul>
      <p v-if="resultado.costo_total !== undefined">
        <strong>Costo Total:</strong> {{ resultado.costo_total.toFixed(2) }}
      </p>
      <p v-else>
        <strong>Costo Total:</strong> No disponible
      </p>
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
    async resolverVogel() {
      this.error = null; // Limpiar errores previos

      // Convertir Proxy a arrays normales
      const ofertasArray = Array.from(this.ofertas);
      const demandasArray = Array.from(this.demandas);

      const data = {
        origenes: this.origenes.map((nombre, i) => nombre || `O${i + 1}`),
        destinos: this.destinos.map((nombre, i) => nombre || `D${i + 1}`),
        matriz_costos: this.matriz.map(fila => fila.slice(0, -1)), // Excluir la columna de oferta
        ofertas: ofertasArray, // Convertir Proxy a array normal
        demandas: demandasArray, // Convertir Proxy a array normal
      };

      console.log("Datos enviados al backend:", data); // Imprimir los datos enviados

      try {
        const response = await axios.post("http://localhost:5000/vogel", data);
        console.log("Respuesta del backend:", response.data); // Imprimir la respuesta completa

        // Validar que la respuesta tenga la estructura esperada
        if (!response.data || typeof response.data !== "object") {
          throw new Error("La respuesta del servidor no es un objeto válido.");
        }
        if (!Array.isArray(response.data.asignaciones)) {
          throw new Error("La respuesta del servidor no contiene asignaciones válidas.");
        }
        if (typeof response.data.costo_total === "undefined") {
          throw new Error("La respuesta del servidor no contiene un costo total válido.");
        }
        if (!Array.isArray(response.data.iteraciones)) {
          throw new Error("La respuesta del servidor no contiene iteraciones válidas.");
        }

        this.resultado = response.data;
      } catch (error) {
        console.error("Error en el frontend:", error); // Imprimir el error detallado
        this.error = error.message || "Ocurrió un error al resolver el problema.";
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