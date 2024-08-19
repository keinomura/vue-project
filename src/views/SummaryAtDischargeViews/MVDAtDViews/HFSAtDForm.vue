<template>
    <MVDAtDForm
      ref="formChild"
      :disName="disName" 
    />
  </template>
  
  <script setup>
    import { ref, defineExpose } from 'vue';
    import MVDAtDForm from './MVDAtDForm.vue';

    // 親コンポーネントから子コンポーネントのメソッドを呼び出す
    const formChild = ref(null);
    const disName = 'HFS';

    const getSummaryAtDischargeTextFromGrandChild = () => {
      return formChild.value.getSummaryAtDischargeOfMVD();
    }

    defineExpose({
      getSummaryAtDischargeTextFromGrandChild,
    });
  </script>
  
  <style scoped>
  /* Add your styles here */
  </style>
  