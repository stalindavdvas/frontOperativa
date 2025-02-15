<template>
  <div>
    <h1>Camino Más Corto en una Red</h1>

    <!-- Contenedor para la red -->
    <div ref="network" style="width: 800px; height: 400px; border: 1px solid #ccc;"></div>

    <!-- Botón para calcular el camino más corto -->
    <button @click="calcularCaminoMasCorto">Calcular Camino Más Corto</button>

    <!-- Resultado -->
    <div v-if="resultado">
      <h2>Resultado</h2>
      <p><strong>Camino:</strong> {{ resultado.camino.join(" → ") }}</p>
      <p><strong>Costo Total:</strong> {{ resultado.costo_total }}</p>
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
            // Permitir al usuario agregar aristas con pesos
            const peso = prompt("Ingrese el peso de la arista:");
            if (peso && !isNaN(peso)) {
              data.id = `${data.from}-${data.to}`; // Asignar un ID único basado en los nodos conectados
              data.label = peso;
              data.value = parseFloat(peso);
              this.edges.push({
                id: data.id, // Guardar el ID único
                from: data.from, // Usar el nombre del nodo de origen
                to: data.to, // Usar el nombre del nodo de destino
                peso: parseFloat(peso),
              });
              callback(data);
            }
          },
        },
      };

      this.network = new Network(container, data, options); // Inicializar la red
    },
    async calcularCaminoMasCorto() {
      this.error = null;
      this.resultado = null;

      // Validar que haya nodos y aristas
      if (this.nodes.size === 0 || this.edges.length === 0) {
        this.error = "Debe dibujar una red con nodos y aristas.";
        return;
      }

      // Obtener el nodo de inicio y fin
      const inicio = prompt("Ingrese el nodo de inicio:");
      const fin = prompt("Ingrese el nodo de destino:");

      if (!this.nodes.has(inicio) || !this.nodes.has(fin)) {
        this.error = "Los nodos de inicio y destino deben existir en la red.";
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
          inicio: inicio,
          fin: fin,
        });

        // Enviar la red al backend
        const response = await axios.post("http://localhost:5000/camino-mas-corto", {
          nodos: nodosArray,
          aristas: aristasArray,
          inicio: inicio,
          fin: fin,
        });

        // Mostrar el resultado
        this.resultado = response.data;

        // Resaltar el camino más corto en la red
        this.resaltarCamino(this.resultado.camino);
      } catch (error) {
        console.error("Error:", error);
        this.error = error.response?.data?.error || "Ocurrió un error al calcular el camino más corto.";
      }
    },
    resaltarCamino(camino) {
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

      // Resaltar el camino más corto
      for (let i = 0; i < camino.length - 1; i++) {
        const from = camino[i];
        const to = camino[i + 1];

        // Buscar la arista correspondiente
        const edge = this.network.body.data.edges.get({
          filter: (e) => (e.from === from && e.to === to) || (e.from === to && e.to === from),
        })[0];

        if (edge) {
          // Actualizar el color de la arista
          this.network.body.data.edges.update({
            id: edge.id,
            color: { color: "red" }, // Resaltar con color rojo
          });
        }
      }
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