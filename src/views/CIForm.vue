<template>
    <StrokeForm :strokeTypeSelection="strokeTypeSelection" :aspectShow="true" :lesionSizeSelection="lesionSizeSelection" />
  </template>
  
  <script setup>
  import StrokeForm from './StrokeForm.vue';
  const strokeTypeSelection = ['アテローム血栓性', '心原性塞栓', 'ラクナ', 'その他'];
  const lesionSizeSelection = ['15mm未満（小）', '15mm以上1/2葉未満（中）', '1/2葉以上（大）', '不明'];
  </script>

  <style scoped>
  /* Add your styles here */
  </style>
