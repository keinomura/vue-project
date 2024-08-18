<template>
    <StrokeAtDForm 
    ref="strokeAtDChild"
    :strokeTypeCIOrICH="strokeTypeCIOrICH" 
    />
</template>
  
  <script setup>
  import { ref, defineExpose,defineProps } from 'vue';
    // Props: 読み込み時に配列で定義する
  const props = defineProps({
    disName: String,
  });

  import StrokeAtDForm from './StrokeAtDForm.vue';
  const strokeTypeCIOrICH = 'ICH';

  console.log(disName) 
  // 親コンポーネントから子コンポーネントのメソッドを呼び出す
  const strokeAtDChild = ref(null);

  const getSummaryAtDischargeTextFromGrandChild = () => {
    return strokeAtDChild.value.getSummaryAtDischargeOfStroke();
  }

  defineExpose({
    getSummaryAtDischargeTextFromGrandChild,
  });
  </script>

  <style scoped>
  /* Add your styles here */
  </style>
