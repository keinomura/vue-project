<template>
  <AsymptomsForm ref="asymptomaticChild" :disName="ICS"/>
</template>

<script setup>
  import { ref, defineExpose } from 'vue';
import AsymptomsForm from './AsymptomsForm.vue';

  // 親コンポーネントから子コンポーネントのメソッドを呼び出す
  const asymptomaticChild = ref(null);

  const getSummaryTextFromGrandChild = () => {
    return asymptomaticChild.value.getSummaryOfAsymptoms();
  }

  defineExpose({
    getSummaryTextFromGrandChild,
  });
</script>

<style scoped>
/* Add your styles here */
</style>
