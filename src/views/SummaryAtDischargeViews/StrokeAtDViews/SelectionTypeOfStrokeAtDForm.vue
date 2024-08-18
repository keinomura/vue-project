<template>
    <StrokeAtDForm
    ref="strokeAtDChild"
    :strokeTypeCIOrICH="disNameSelected"
    />
</template>

<script setup>
  import { ref, defineExpose, defineProps, watch } from 'vue';
  import StrokeAtDForm from './StrokeAtDForm.vue';

  // Props: 読み込み時に配列で定義する
  const props = defineProps({
    disNameSelected: String,
  });
  
  const currentDisName = props.disNameSelected;
  // const strokeTypeCIOrICH = 'CI';
  const strokeTypeCIOrICH = props.disNameSelected;

  // 親コンポーネントから子コンポーネントのメソッドを呼び出す
  const strokeAtDChild = ref(null);

  const getSummaryAtDischargeTextFromGrandChild = () => {
    return strokeAtDChild.value.getSummaryAtDischargeOfStroke();
  }

  watch(currentDisName, (currentDisName) => {
    strokeTypeCIOrICH.value = currentDisName;
  });

  defineExpose({
    getSummaryAtDischargeTextFromGrandChild,
  });
</script>

<style scoped>
  /* Add your styles here */
</style>
