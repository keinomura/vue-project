<template>
  <component
    :is="currentFormComponent"
    ref="formChild"
    :diseaseName="disNameSelected"
  />
</template>

<script setup>
  import { ref, defineExpose, defineProps, watch, markRaw } from 'vue';
  import MVDAtDForm from './MVDAtDViews/MVDAtDForm.vue'
  import StrokeAtDForm from './StrokeAtDViews/StrokeAtDForm.vue'
  import AsymptomaticForm from './AsymptomAtDViews/AsymptomaticAtDForm.vue'
  import OthersForm from './OthersAtDViews/OthersAtDForm.vue'

  // Props: 読み込み時に配列で定義する
  const props = defineProps({
    disNameSelected: String,
  });

  // 親コンポーネントから子コンポーネントのメソッドを呼び出す
  const formChild = ref(null);

  //　親コンポーネントからみて孫コンポーネントのメソッドを呼び出す
  const getSummaryAtDischargeTextFromGrandChild = () => {
    if (props.disNameSelected === 'デフォルト') {
      return '';
    } else if (props.disNameSelected === 'TN' || props.disNameSelected === 'HFS') {
      return formChild.value.getSummaryAtDischargeOfMVD();
    } else if (props.disNameSelected === 'CI' || props.disNameSelected === 'ICH') {
      return formChild.value.getSummaryAtDischargeOfStroke();
    } else if (props.disNameSelected === 'ICS' || props.disNameSelected === 'Aneurysm') {
      return formChild.value.getSummaryAtDischargeOfAsymptom();
    } else {
      return formChild.value.getSummaryAtDischargeOfOthers();
    }
  };

  defineExpose({
    getSummaryAtDischargeTextFromGrandChild,
  });

  // diseaseNameSelected の値に基づいてコンポーネントを切り替える
  const currentFormComponent = ref(null);

  watch(() => props.disNameSelected, (newVal) => {
    if (newVal === 'TN' || newVal === 'HFS') {
      currentFormComponent.value = markRaw(MVDAtDForm);
    } else if (newVal === 'CI' || newVal === 'ICH') {
      currentFormComponent.value = markRaw(StrokeAtDForm);
    } else if (newVal === 'ICS' || newVal === 'Aneurysm') {
      currentFormComponent.value = markRaw(AsymptomaticForm);
    } else if (newVal === 'CSDH' || newVal === 'observation') {
      currentFormComponent.value = markRaw(OthersForm);
    } else {
      currentFormComponent.value = null;
    }
  }, { immediate: true });


</script>

<style scoped>
  /* Add your styles here */
</style>
