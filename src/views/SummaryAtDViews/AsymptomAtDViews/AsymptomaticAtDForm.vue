<template>
  <v-container style="background-color: lightblue">
    <v-row>
      <v-radio-group v-model="admissionPurpose" label="今回入院目的" inline>
        <v-radio label="精査" value="精査"></v-radio>
        <v-radio label="治療" value="治療"></v-radio>
        <v-radio label="その他" value="その他"></v-radio>
      </v-radio-group>
    </v-row>

<!-- 精査 -->{{ admissionPurpose }}
  <v-container v-if="admissionPurpose === '精査'">
    <v-textarea v-model="examinationFindings" label="検査所見"></v-textarea>

    <v-radio-group v-model="treatmentPlan" label="今後の治療方針" inline>
      <v-radio label="手術適応あり" value="手術適応あり"></v-radio>

      <v-radio label="経過観察 定期フォローアップ" value="経過観察 定期フォローアップ"></v-radio>
      <v-radio label="他院フォローアップ" value="他院フォローアップ"></v-radio>
      <v-radio label="要コンサルト" value="要コンサルト"></v-radio>
      <v-radio label="その他" value="その他"></v-radio>
    </v-radio-group>
    <v-row v-if="treatmentPlan === '手術適応あり'">
      <v-checkbox v-model="surgicalIndications" label="手術適応" value="手術適応"></v-checkbox>
      <v-checkbox v-model="surgicalIndications" label="血管内治療適応" value="血管内治療適応"></v-checkbox>
    </v-row>
    <v-text-field v-if="treatmentPlan === 'その他'" v-model="treatmentPlanText" label="その他"></v-text-field>
  </v-container>

<!-- 治療 -->
  <v-container v-if="admissionPurpose === '治療'">
    <v-textarea v-model="treatmentFindings" label="治療所見" ></v-textarea>
  </v-container>
  </v-container>


  </template>
  
  <script setup>
  import { ref, watch } from 'vue';
  
  // Props
  const props = defineProps({
    diseaseName: String,
  });
  

  // Data
  const admissionPurpose = ref('精査');
  const examinationFindings = ref('');
  const treatmentFindings =  ref('');

  watch(admissionPurpose, (newVal) => {
    if (newVal === '治療') {
      treatmentFindings.value = '予定通り、手術施行。経過良好にて退院となった。';
      examinationFindings.value = '';
    } else if (newVal === '精査') {
      treatmentFindings.value = '';
    }
  }, {immediate: true});

  const treatmentPlan = ref('手術適応あり');
  const surgicalIndications = ref([]);
  const treatmentPlanText = ref('');



  
  const additionalNotes = ref('');
  

  // Methods
  
  
  const getSummaryAtDischargeOfAsymptom = () => {
    

    const AsymptomaticSummary = {
      '今回入院目的': admissionPurpose.value,
      'その他': treatmentPlanText.value,

      '検査所見': examinationFindings.value,
      '治療所見': treatmentFindings.value,
      '今後の治療方針': treatmentPlan.value,
      '手術適応': surgicalIndications.value,
      'その他備考': additionalNotes.value,
      
    };

    

    // 項目が空のものを除外
    const filteredAsymptomaticSummary = Object.fromEntries(
      Object.entries(AsymptomaticSummary).filter(([key, value]) => value != null && value !== '' && value !== undefined && value.length !== 0)
    );

    const summaryText = Object.entries(filteredAsymptomaticSummary)
    .map(([key, value]) => `${key}: ${value}`)
    .join(',');

    return summaryText; 
  };

  // "defineExpose"を使用して、外部から参照できるプロパティを定義する
  defineExpose({
    getSummaryAtDischargeOfAsymptom,
  });

  // Watchers
  


  </script>

  <style scoped>
  /* Add your styles here */
  </style>