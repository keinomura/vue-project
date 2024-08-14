<template>
    <MVDAtDForm
      ref="mvdChild"
      :disName="TN" 
    />
  </template>
  
  <script setup>
    import { ref, defineExpose } from 'vue';
    import MVDAtDForm from './MVDAtDForm.vue';

    // 親コンポーネントから子コンポーネントのメソッドを呼び出す
    const mvdChild = ref(null);

    const getSummaryAtDischargeTextFromGrandChild = () => {
      return mvdChild.value.getSummaryATDischargeOfMVD();
    }

    defineExpose({
      getSummaryAtDischargeTextFromGrandChild,
    });
  </script>
  
  <style scoped>
  /* Add your styles here */
  </style>
  