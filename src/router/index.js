import { createRouter, createWebHistory } from 'vue-router';
import SummaryForm from '../views/SummaryViews/SummaryForm.vue';
import SurgeryForm from '../views/SurgeryForm.vue';

const routes = [
  { path: '/summary', component: SummaryForm },
  { path: '/surgery', component: SurgeryForm },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
