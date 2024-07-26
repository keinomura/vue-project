<template>
    <MVDForm
      :medications="medications" 
      :showPainArea="false" 
      :showDentalHistory="false" 
      :showBotoxTreatment="true" 
    />
  </template>
  
  <script setup>
  import MVDForm from './MVDForm.vue';
  const medications = ['リボトリール', 'ビムパット', 'テグレトール', 'セルシン'];
  </script>
  
  <style scoped>
  /* Add your styles here */
  </style>
  