<template>
  <component
    :is="currentFormComponent"
    ref="formChild"
    :diseaseName="disNameSelected"
  />
</template>

<script setup>
  import { ref, shallowRef, defineExpose, defineProps, watch, markRaw } from 'vue';
  import MVDAtEForm from './OpeMVDViews/OpeMVDForm.vue'
  import StrokeAtEForm from './OpeStrokeViews/OpeStrokeForm.vue'
  import AsymptomAtEForm from './OpeAsymptomForm/OpeAsymptomaticForm.vue'

  // Props: 読み込み時に配列で定義する
  const props = defineProps({
    disNameSelected: String,
  });

  // 親コンポーネントから子コンポーネントのメソッドを呼び出す
  const formChild = shallowRef(null);

  //　親コンポーネントからみて孫コンポーネントのメソッドを呼び出す
  const getSummaryTextFromGrandChild = () => {
    if (props.disNameSelected === 'デフォルト') {
      return '';
    } else if (props.disNameSelected === 'TN' || props.disNameSelected === 'HFS') {
      return formChild.value.getSummaryOfMVD();
    } else if (props.disNameSelected === 'CI' || props.disNameSelected === 'ICH') {
      return formChild.value.getSummaryOfStroke();
    } else if (props.disNameSelected === 'ICS' || props.disNameSelected === 'Aneurysm') {
      return formChild.value.getSummaryOfAsymptoms();
    } else {
      return formChild.value.getSummaryOfOthers();
    }
  };

  defineExpose({
    getSummaryTextFromGrandChild,
  });

  // diseaseNameSelected の値に基づいてコンポーネントを切り替える
  const currentFormComponent = shallowRef(null);

  watch(() => props.disNameSelected, (newVal) => {
    if (newVal === 'TN' || newVal === 'HFS') {
      currentFormComponent.value = markRaw(MVDAtEForm);
    } else if (newVal === 'CI' || newVal === 'ICH') {
      currentFormComponent.value = markRaw(StrokeAtEForm);
    } else if (newVal === 'ICS' || newVal === 'Aneurysm') {
      currentFormComponent.value = markRaw(AsymptomAtEForm);
    } else {
      currentFormComponent.value = null;
    }
  }, { immediate: true });


</script>

<style scoped>
  /* Add your styles here */
</style>
