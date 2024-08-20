import { createRouter, createWebHistory } from 'vue-router';
import SummaryForm from '../views/SummaryViews/SummaryForm.vue';
import SummaryAtDischargeForm from '../views/SummaryAtDischargeViews/SummaryAtDischargeForm.vue';
// import SurgeryForm from '../views/SurgeryForm.vue';
import SummaryFrame from '../views/SummaryFrame.vue';

const routes = [
  { path: '/summary', component: SummaryForm },
  { path: '/summaryAtDischarge', component: SummaryAtDischargeForm },
  // { path: '/surgery', component: SurgeryForm },
  { path: '/summaryFrame', component: SummaryFrame, props: {title: '入院サマリですよ'}},
  // { path: '/summaryFrame', component: SummaryFrame},

];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
