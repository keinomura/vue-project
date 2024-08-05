<template>
    <StrokeForm 
    :strokeTypeSelection="strokeTypeSelection" 
    :aspectShow="false" 
    :lesionSizeSelection="lesionSizeSelection"
    :showOperativeTreatment="true"
    :showtPATreatment="false"
    :showEndovascularTreatment="false"
    />
  </template>
  
  <script setup>
  import StrokeForm from './StrokeForm.vue';
  const strokeTypeSelection = ['皮質下', '視床', '被殻', '脳幹', '小脳', 'その他'];
  const lesionSizeSelection = ['2cm未満（小）', '2-6cm（中）', '6cm以上（大）', '不明'];
  </script>

  <style scoped>
  /* Add your styles here */
  </style>
