import { createRouter, createWebHistory } from 'vue-router';
import SummaryForm from '../views/SummaryViews/SummaryForm.vue';
import SummaryAtDischargeForm from '../views/SummaryAtDischargeViews/SummaryAtDischargeForm.vue';
import SurgeryForm from '../views/SurgeryForm.vue';

const routes = [
  { path: '/summary', component: SummaryForm },
  { path: '/summaryAtDischarge', component: SummaryAtDischargeForm },
  { path: '/surgery', component: SurgeryForm },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
