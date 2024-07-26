<template>
    <MVDForm :medications="medications" :showPainArea="true" :showDentalHistory="true" />
  </template>
  
  <script setup>
  import MVDForm from './MVDForm.vue';
  const medications = ['テグレトール（カルバマゼピン）', 'ビムパット（ラコサミド）', 'パキシル', 'ロキソニン', 'ガバペン', 'アレビアチン'];
  </script>
  
  <style scoped>
  /* Add your styles here */
  </style>
