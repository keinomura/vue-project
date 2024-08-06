<template>
  <MVDForm ref="mvdChild" :medications="medications" :showPainArea="true" :showDentalHistory="true" />
</template>

<script setup>
  import { ref, defineExpose } from 'vue';
  import MVDForm from './MVDForm.vue';
  const medications = ['テグレトール（カルバマゼピン）', 'ビムパット（ラコサミド）', 'パキシル', 'ロキソニン', 'ガバペン', 'アレビアチン'];

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
