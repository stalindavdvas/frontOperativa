import { createRouter, createWebHistory } from 'vue-router';
import Home from './views/Home.vue';
import Simplex from './views/Simplex.vue';
import GranM from './views/GranM.vue';
import DosFases from './views/DosFases.vue';
import Dual from './views/Dual.vue';
import EsquinaNoroeste from './views/EsquinaNoroeste.vue';
import CostoMinimo from './views/CostoMinimo.vue';
import Vogel from './views/Vogel.vue';
import CaminoCorto from './views/CaminoCorto.vue';
import FlujoMaximo from './views/FlujoMaximo.vue';
import ArbolExpansion from './views/ArbolExpansion.vue';

const routes = [
  { path: '/', component: Home },
  { path: '/simplex', component: Simplex },
  { path: '/gran-m', component: GranM },
  { path: '/dos-fases', component: DosFases },
  { path: '/dual', component: Dual },
  { path: '/esquina-noroeste', component: EsquinaNoroeste },
  { path: '/costo-minimo', component: CostoMinimo },
  { path: '/vogel', component: Vogel },
  { path: '/camino-corto', component: CaminoCorto },
  { path: '/flujo-maximo', component: FlujoMaximo },
  { path: '/arbol-expansion', component: ArbolExpansion }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
