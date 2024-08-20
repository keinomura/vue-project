<template>
  <v-container style="background-color: yellowgreen">
    <!-- CSDH -->{{ diseaseName }}
    <v-container v-if="diseaseName === 'CSDH'">
      <v-radio-group v-model="operation" label="手術" inline>
        <v-radio label="あり" value="あり"></v-radio>
        <v-radio label="なし" value="なし"></v-radio>
      </v-radio-group>
      <v-container v-if="operation === 'あり'">
        <v-radio-group v-model="operationDate" label="手術日選択" inline>
          <v-radio label="入院同日" value="入院同日"></v-radio>
          <v-radio label="入院翌日" value="入院翌日"></v-radio>
          <v-radio label="その他" value="その他"></v-radio>
        </v-radio-group>
        <v-text-field v-if="operationDate === 'その他'" v-model="operationDateText" label="入院後手術までの日数"></v-text-field>
        <v-radio-group v-model="operationMethod" label="手術方法" inline>
          <v-radio label="穿頭洗浄術" value="穿頭洗浄術"></v-radio>
          <v-radio label="穿頭ドレナージ" value="穿頭ドレナージ"></v-radio>
          <v-radio label="その他" value="その他"></v-radio>
        </v-radio-group>
        <v-text-field v-if="operationMethod === 'その他'" v-model="operationMethodText" label="手術方法"></v-text-field>
      </v-container>
      <v-container v-if="operation === 'なし'">
        <v-text-field v-model="observationPeriod" label="経過観察日数"></v-text-field>
      </v-container>
    </v-container>

    <!-- 経過観察 -->
    <v-container v-if="diseaseName === 'observation'">
      <v-radio-group v-model="followUp" label="退院後フォロー" inline>
        <v-radio label="当院フォロー" value="当院フォロー"></v-radio>
        <v-radio label="他院フォロー" value="他院フォロー"></v-radio>
        <v-radio label="フォロー不要" value="フォロー不要"></v-radio>
        <v-radio label="その他" value="その他"></v-radio>
      </v-radio-group>
      <v-text-field v-if="followUp === 'その他'" v-model="followUpText" label="退院後フォロー"></v-text-field>
    </v-container>

    <!-- サマリ -->
    <v-textarea v-model="othersSummary" label="サマリ"></v-textarea>
    
  </v-container>


  </template>
  
  <script setup>
  import { ref, watch } from 'vue';
  
  // Props
  const props = defineProps({
    diseaseName: String,
  });
  

  // Data
  const operation = ref('あり');
  const operationDate = ref('入院同日');
  const operationDateText = ref('');
  const operationMethod = ref('穿頭洗浄術');
  const operationMethodText = ref('');
  const observationPeriod = ref('');
  const followUp = ref('当院フォロー');
  const followUpText = ref('');
  const othersSummary = ref('');


  // Methods
  // CSDHのサマリを作成
  const createCSDHSummary = () => {
    // 手術日のText
    const operationDateString = (operationDate.value === 'その他') ? '入院後' + operationDateText.value + '日' : operationDate.value;
    const operationMethodString = (operationMethod.value === 'その他') ? operationMethodText.value : operationMethod.value;

    othersSummary.value = (operation.value === 'なし') ? 
    // 手術無し
                          '症状悪化なく経過観察期間: ' + observationPeriod.value + '日にて退院。':
    // 手術有り
                          '手術日: ' + operationDateString + '、手術方法: ' + operationMethodString + 'にて手術を施行。経過観良好にて退院。';
  };

  const createObservationSummary = () => {
    const followUpString = (followUp.value === 'その他') ? followUpText.value : followUp.value;

    othersSummary.value = '経過観察し、症状悪化無く退院した。退院後フォロー: ' + followUpString + '。';
  };


  watch([operation, operationDate, operationDateText, operationMethod, operationMethodText, observationPeriod, props, followUp, followUpText],() => {
    (props.diseaseName === 'CSDH') ? createCSDHSummary():(props.diseaseName === 'observation') ? createObservationSummary():'';
  }, {immediate: true});
  

  const getSummaryAtDischargeOfOthers = () => {
    return othersSummary.value;
  };

  // "defineExpose"を使用して、外部から参照できるプロパティを定義する
  defineExpose({
    getSummaryAtDischargeOfOthers,
  });

  // Watchers
  


  </script>

  <style scoped>
  /* Add your styles here */
  </style>