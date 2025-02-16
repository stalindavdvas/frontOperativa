import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
// Define la URL base del backend
const backendUrl = 'http://localhost:5000';
const app = createApp(App);
app.use(router);
// Hacer la URL base accesible globalmente
app.config.globalProperties.$backendUrl = backendUrl;
app.mount('#app');
