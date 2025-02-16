<template>
  <div>
    <h1>Flujo Máximo en una Red</h1>

    <!-- Contenedor para la red -->
    <div ref="network" style="width: 800px; height: 400px; border: 1px solid #ccc;"></div>

    <!-- Botón para calcular el flujo máximo -->
    <button @click="calcularFlujoMaximo">Calcular Flujo Máximo</button>

    <!-- Resultado -->
    <div v-if="resultado">
      <h2>Resultado</h2>
      <p><strong>Flujo Máximo:</strong> {{ resultado.flujo_maximo }}</p>
      <p><strong>Aristas Utilizadas:</strong></p>
      <ul>
        <li v-for="(arista, index) in resultado.aristas_utilizadas" :key="index">
          {{ arista.from }} → {{ arista.to }} (Capacidad: {{ arista.capacidad }}, Flujo: {{ arista.flujo }})
        </li>
      </ul>
    </div>

    <!-- Mensaje de Error -->
    <div v-if="error" class="error">
      <p><strong>Error:</strong> {{ error }}</p>
    </div>
  </div>
</template>

<script>
import { Network, DataSet } from "vis-network/standalone"; // Importar vis-network
import axios from "axios";

export default {
  data() {
    return {
      nodes: new Set(), // Conjunto de nodos
      edges: [], // Lista de aristas
      network: null, // Instancia de vis-network
      resultado: null, // Resultado del backend
      error: null, // Mensaje de error
    };
  },
  mounted() {
    this.inicializarRed();
  },
  methods: {
    inicializarRed() {
      // Crear nodos y aristas iniciales
      const container = this.$refs.network;
      const data = {
        nodes: new DataSet([]), // Usar DataSet de vis-network
        edges: new DataSet([]), // Usar DataSet de vis-network
      };

      const options = {
        manipulation: {
          enabled: true,
          addNode: (data, callback) => {
            // Permitir al usuario agregar nodos
            const nombre = prompt("Ingrese el nombre del nodo:");
            if (nombre) {
              data.id = nombre; // Usar el nombre como ID del nodo
              data.label = nombre; // Mostrar el nombre como etiqueta
              this.nodes.add(nombre); // Agregar el nombre a la lista de nodos
              callback(data);
            }
          },
          addEdge: (data, callback) => {
            // Permitir al usuario agregar aristas con capacidades
            const capacidad = prompt("Ingrese la capacidad de la arista:");
            if (capacidad && !isNaN(capacidad)) {
              data.id = `${data.from}-${data.to}`; // Asignar un ID único basado en los nodos conectados
              data.label = capacidad;
              data.value = parseFloat(capacidad);
              this.edges.push({
                id: data.id, // Guardar el ID único
                from: data.from, // Usar el nombre del nodo de origen
                to: data.to, // Usar el nombre del nodo de destino
                capacidad: parseFloat(capacidad),
              });
              callback(data);
            }
          },
        },
      };

      this.network = new Network(container, data, options); // Inicializar la red
    },
    async calcularFlujoMaximo() {
      this.error = null;
      this.resultado = null;

      // Validar que haya nodos y aristas
      if (this.nodes.size === 0 || this.edges.length === 0) {
        this.error = "Debe dibujar una red con nodos y aristas.";
        return;
      }

      // Obtener el nodo fuente y sumidero
      const fuente = prompt("Ingrese el nodo fuente:");
      const sumidero = prompt("Ingrese el nodo sumidero:");

      if (!this.nodes.has(fuente) || !this.nodes.has(sumidero)) {
        this.error = "Los nodos fuente y sumidero deben existir en la red.";
        return;
      }

      try {
        // Convertir Proxy a arrays normales
        const nodosArray = Array.from(this.nodes);
        const aristasArray = Array.from(this.edges);

        // Imprimir los datos antes de enviarlos
        console.log("Datos enviados al backend:", {
          nodos: nodosArray,
          aristas: aristasArray,
          fuente: fuente,
          sumidero: sumidero,
        });

        // Enviar la red al backend
        const response = await axios.post(`${this.$backendUrl}/flujo-maximo`, {
          nodos: nodosArray,
          aristas: aristasArray,
          fuente: fuente,
          sumidero: sumidero,
        });

        // Mostrar el resultado
        this.resultado = response.data;

        // Resaltar las aristas utilizadas en el flujo máximo
        this.resaltarAristas(this.resultado.aristas_utilizadas);
      } catch (error) {
        console.error("Error:", error);
        this.error = error.response?.data?.error || "Ocurrió un error al calcular el flujo máximo.";
      }
    },
    resaltarAristas(aristasUtilizadas) {
      // Limpiar estilos previos
      this.network.body.data.edges.forEach((edgeId) => {
        const edge = this.network.body.data.edges.get(edgeId);
        if (edge) {
          this.network.body.data.edges.update({
            id: edge.id,
            color: { color: "#000" }, // Restaurar color predeterminado
          });
        }
      });

      // Resaltar las aristas utilizadas en el flujo máximo
      aristasUtilizadas.forEach((arista) => {
        const edge = this.network.body.data.edges.get({
          filter: (e) => (e.from === arista.from && e.to === arista.to),
        })[0];

        if (edge) {
          // Actualizar el color de la arista
          this.network.body.data.edges.update({
            id: edge.id,
            color: { color: "blue" }, // Resaltar con color azul
          });
        }
      });
    },
  },
};
</script>

<style scoped>
.error {
  color: red;
  font-weight: bold;
}
</style>