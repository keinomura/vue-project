<template>
  <AsymptomaticForm ref="asymptomaticChild" :disName="disName"/>
</template>

<script setup>
  import { ref, defineExpose } from 'vue';
import AsymptomaticForm from './AsymptomaticForm.vue';

  // 親コンポーネントから子コンポーネントのメソッドを呼び出す
  const disName = 'ICS';
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
