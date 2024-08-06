<template>
  <MVDForm ref="mvdChild" :medications="medications" :showPainArea="true" :showDentalHistory="true" />
</template>

<script setup>
  import { ref, defineExpose } from 'vue';
  import MVDForm from './MVDForm.vue';
  const medications = ['テグレトール（カルバマゼピン）', 'ビムパット（ラコサミド）', 'パキシル', 'ロキソニン', 'ガバペン', 'アレビアチン'];

  const mvdChild = ref(null);

  const showText = () => {
    console.log('Hello, World!');
    mvdChild.value.getSummaryOfMVD()
  }

  defineExpose({
    showText
  });
</script>

<style scoped>
/* Add your styles here */
</style>
