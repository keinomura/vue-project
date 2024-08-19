<template>
  <component
    :is="currentFormComponent"
    ref="formChild"
    :diseaseName="disNameSelected"
  />
</template>

<script setup>
  import { ref, defineExpose, defineProps, watch } from 'vue';
  import MVDAtDForm from './MVDAtDForm.vue'

  // Props: 読み込み時に配列で定義する
  const props = defineProps({
    disNameSelected: String,
  });

  // const currentDisName = props.disNameSelected;
  let diseaseName = ref(props.disNameSelected);  //
  // props.disNameSelected;

  // 親コンポーネントから子コンポーネントのメソッドを呼び出す
  const formChild = ref(null);

  const getSummaryAtDischargeTextFromGrandChild = () => {
    return (props.disNameSelected === ('TN' || 'HFS')) ? formChild.value.getSummaryAtDischargeOfMVD():
            (props.disNameSelected === ('CI'|| 'ICH')) ? formChild.value.getSummaryAtDischargeOfStroke():
            '';
  }

  watch(props.disNameSelected, (disName) => {
    diseaseName = disName;
  }, { immediate: true });

  defineExpose({
    getSummaryAtDischargeTextFromGrandChild,
  });

  // diseaseNameSelected の値に基づいてコンポーネントを切り替える
  const currentFormComponent = ref((props.disNameSelected === ('TN'||'HFS')) ? MVDAtDForm : '');

</script>

<style scoped>
  /* Add your styles here */
</style>
