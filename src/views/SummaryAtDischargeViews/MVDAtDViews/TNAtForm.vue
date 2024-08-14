<template>
  <MVDAtDForm ref="mvdChild" :disName="disName"/>
</template>

<script setup>
  import { ref, defineExpose } from 'vue';
  import MVDAtDForm from './MVDAtDForm.vue';

  // 親コンポーネントから子コンポーネントのメソッドを呼び出す
  const mvdChild = ref(null);
  const disName = 'TN';

  const getSummaryAtDischargeTextFromGrandChild = () => {
    return mvdChild.value.getSummaryAtDischargeOfMVD();
  }

  defineExpose({
    getSummaryAtDischargeTextFromGrandChild,
  });
</script>

<style scoped>
/* Add your styles here */
</style>
