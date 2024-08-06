<template>
    <MVDForm
      ref="mvdChild"
      :medications="medications" 
      :showPainArea="false" 
      :showDentalHistory="false" 
      :showBotoxTreatment="true" 
    />
  </template>
  
  <script setup>
    import { ref, defineExpose } from 'vue';
    import MVDForm from './MVDForm.vue';
    const medications = ['リボトリール', 'ビムパット', 'テグレトール', 'セルシン'];

    // 親コンポーネントから子コンポーネントのメソッドを呼び出す
    const mvdChild = ref(null);

    const getSummaryTextFromGrandChild = () => {
      return mvdChild.value.getSummaryOfMVD();
    }

    defineExpose({
      getSummaryTextFromGrandChild,
    });
  </script>
  
  <style scoped>
  /* Add your styles here */
  </style>
  