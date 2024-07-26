import { createRouter, createWebHistory } from 'vue-router';
import SummaryForm from '../views/SummaryForm.vue';
import StrokeForm from '../views/StrokeForm.vue';
import SurgeryForm from '../views/SurgeryForm.vue';

const routes = [
  { path: '/summary', component: SummaryForm },
  { path: '/stroke', component: StrokeForm },
  { path: '/surgery', component: SurgeryForm },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
