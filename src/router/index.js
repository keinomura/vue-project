import { createRouter, createWebHistory } from 'vue-router';
import SummaryFrame from '../views/SummaryFrame.vue';

const routes = [
  { path: '/summaryFrame/hospitalization', component: SummaryFrame, props: {title: '入院サマリ'}},
  { path: '/summaryFrame/discharge', component: SummaryFrame, props: {title: '退院サマリ'}},
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
