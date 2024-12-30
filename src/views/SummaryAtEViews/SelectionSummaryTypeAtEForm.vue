<template>
  <component
    :is="currentFormComponent"
    ref="formChild"
    v-model:diseaseName="disNameSelected"
  />
</template>

<script setup>
  import { ref, shallowRef, defineExpose, defineProps, watch, markRaw } from 'vue';
  import MVDAtEForm from './MVDViews/MVDForm.vue'
  import StrokeAtEForm from './StrokeViews/StrokeForm.vue'
  import AsymptomAtEForm from './AsymptomForm/AsymptomaticForm.vue'

  // new props
  const disNameSelected = defineModel('disNameSelected')

  // 親コンポーネントから子コンポーネントのメソッドを呼び出す
  const formChild = shallowRef(null);

  const getSummaryTextFromGrandChild = () => {
    if (disNameSelected.value === 'デフォルト') {
      return '';
    } else if (disNameSelected.value === 'TN' || disNameSelected.value === 'HFS') {
      return formChild.value.getSummaryOfMVD();
    } else if (disNameSelected.value === 'CI' || disNameSelected.value === 'ICH') {
      return formChild.value.getSummaryOfStroke();
    } else if (disNameSelected.value === 'ICS' || disNameSelected.value === 'Aneurysm') {
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

  watch(() => disNameSelected, (newVal) => {
    if (newVal.value === 'TN' || newVal.value === 'HFS') {
      currentFormComponent.value = markRaw(MVDAtEForm);
    } else if (newVal.value === 'CI' || newVal.value === 'ICH') {
      currentFormComponent.value = markRaw(StrokeAtEForm);
    } else if (newVal.value === 'ICS' || newVal.value === 'Aneurysm') {
      currentFormComponent.value = markRaw(AsymptomAtEForm);
    } else {
      currentFormComponent.value = null;
    }
  }, { immediate: true, deep: true });

</script>

<style scoped>
  /* Add your styles here */
</style>
