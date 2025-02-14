<template>
  <div class="container">
    <!-- Sidebar -->
    <aside class="sidebar">
      <h2>Menú</h2>
      <ul>
        <li><RouterLink to="/">Inicio</RouterLink></li>
        <li>
          Programación Lineal
          <ul>
            <li><RouterLink to="/simplex">Método Simplex</RouterLink></li>
            <li><RouterLink to="/gran-m">Método Gran M</RouterLink></li>
            <li><RouterLink to="/dos-fases">Método de Dos Fases</RouterLink></li>
            <li><RouterLink to="/dual">Método Dual</RouterLink></li>
          </ul>
        </li>
        <li>
          Transporte
          <ul>
            <li><RouterLink to="/esquina-noroeste">Esquina Noroeste</RouterLink></li>
            <li><RouterLink to="/costo-minimo">Costo Mínimo</RouterLink></li>
            <li><RouterLink to="/vogel">Método de Vogel</RouterLink></li>
          </ul>
        </li>
        <li>
          Redes
          <ul>
            <li><RouterLink to="/camino-corto">Camino más Corto</RouterLink></li>
            <li><RouterLink to="/flujo-maximo">Flujo Máximo</RouterLink></li>
            <li><RouterLink to="/arbol-expansion">Árbol de Expansión Mínima</RouterLink></li>
          </ul>
        </li>
      </ul>
    </aside>

    <!-- Main Content -->
    <main class="main-content">
      <router-view></router-view>
    </main>
  </div>
</template>

<style>
/* Estilos generales */
.container {
  display: grid;
  grid-template-columns: 250px 1fr; /* Sidebar + Main Content */
  height: 100vh;
  font-family: Arial, sans-serif;
}

/* Sidebar */
.sidebar {
  background-color: #f4f4f9;
  padding: 20px;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
}

.sidebar h2 {
  margin-bottom: 20px;
  font-size: 1.5rem;
  color: #333;
}

.sidebar ul {
  list-style: none;
  padding: 0;
}

.sidebar ul li {
  margin: 10px 0;
}

.sidebar ul li a {
  text-decoration: none;
  color: #333;
  font-size: 1rem;
}

.sidebar ul li a:hover {
  color: #007bff;
  text-decoration: underline;
}

.sidebar ul ul {
  margin-left: 20px;
}

/* Main Content */
.main-content {
  padding: 20px;
  background-color: #fff;
  overflow-y: auto;
}

.main-content h1 {
  margin-bottom: 20px;
  font-size: 2rem;
  color: #333;
}
</style>