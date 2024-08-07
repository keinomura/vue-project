<template>
    <StrokeForm
    ref="strokeChild"
    :strokeTypeSelection="strokeTypeSelection"
    :aspectShow="true"
    :lesionSizeSelection="lesionSizeSelection"
    :showOperativeTreatment="false"
    :showtPATreatment="true"
    :showEndovascularTreatment="true"
    />
</template>

<script setup>
  import { ref, defineExpose } from 'vue';
  import StrokeForm from './StrokeForm.vue';
  const strokeTypeSelection = ['アテローム血栓性', '心原性塞栓', 'ラクナ', 'その他'];
  const lesionSizeSelection = ['15mm未満（小）', '15mm以上1/2葉未満（中）', '1/2葉以上（大）', '不明'];

  // 親コンポーネントから子コンポーネントのメソッドを呼び出す
  const strokeChild = ref(null);

  const getSummaryTextFromGrandChild = () => {
    return strokeChild.value.getSummaryOfStroke();
  }

  defineExpose({
    getSummaryTextFromGrandChild,
  });
</script>

<style scoped>
  /* Add your styles here */
</style>
