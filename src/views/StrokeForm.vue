<template>
    <div>
      <v-col cols="12"> // 病型 脳出血、脳梗塞で選択肢を変える。その他でフリー入力を可能にする。
        <v-text-field v-model="strokeType" label="病型"></v-text-field>
      </v-col>

      <v-radio-group v-model="lesionSide" label="病側" inline>
        <v-radio label="右" value="右"></v-radio>
        <v-radio label="左" value="左"></v-radio>
      </v-radio-group>

      <v-col cols="12">
        <v-text-field v-model="ischemicStroke.onsetTime" label="発症日時または最終健常時刻" type="datetime-local"></v-text-field>
      </v-col>

      <v-col cols="12">
        <v-text-field v-model="ischemicStroke.admissionTime" label="入院時刻" type="datetime-local"></v-text-field>
      </v-col>

      <v-col cols="12">
        <v-radio-group v-model="ischemicStroke.antiplatelet" row>
          <v-radio label="抗血小板薬内服あり" value="あり"></v-radio>
          <v-radio label="抗血小板薬内服なし" value="なし"></v-radio>
        </v-radio-group>
        <v-text-field v-if="ischemicStroke.antiplatelet === 'あり'" v-model="ischemicStroke.antiplateletType" label="抗血小板薬種類"></v-text-field>
      </v-col>
      <v-col cols="12">
        <v-radio-group v-model="ischemicStroke.anticoagulant" row>
          <v-radio label="抗凝固薬内服あり" value="あり"></v-radio>
          <v-radio label="抗凝固薬内服なし" value="なし"></v-radio>
        </v-radio-group>
        <v-text-field v-if="ischemicStroke.anticoagulant === 'あり'" v-model="ischemicStroke.anticoagulantType" label="抗凝固薬種類"></v-text-field>
      </v-col>
      <v-col cols="12">
        <v-checkbox-group v-model="ischemicStroke.riskFactors" label="脳梗塞リスク要因の有無" class="d-flex flex-wrap">
          <v-checkbox label="心房細動" value="心房細動"></v-checkbox>
          <v-checkbox label="凝固異常" value="凝固異常"></v-checkbox>
          <v-checkbox label="その他" value="その他"></v-checkbox>
        </v-checkbox-group>
      </v-col>

      <v-col cols="12">
        <v-checkbox-group v-model="riskFactors" label="リスク要因の有無" class="d-flex flex-wrap">
          <v-checkbox label="心房細動" value="心房細動"></v-checkbox>
          <v-checkbox label="凝固異常" value="凝固異常"></v-checkbox>
          <v-checkbox label="その他" value="その他"></v-checkbox>
        </v-checkbox-group>
      </v-col>

      <v-col cols="12">
        <v-textarea v-model="mriFindings" label="MRI所見"></v-textarea>
      </v-col>
      <v-col cols="12">
        <v-text-field v-model="aspectScore" label="ASPECTまたはMRI-ASPECT 点数" type="number"></v-text-field>
      </v-col>
      <v-col cols="12">
        <v-radio-group v-model="firstOrRecurrent" row>
          <v-radio label="初発" value="初発"></v-radio>
          <v-radio label="再発" value="再発"></v-radio>
        </v-radio-group>
      </v-col>


    </div>
  </template>
  
  <script setup>
  import { ref, watch } from 'vue';

  const lesionSide = ref('');
  const ischemicStroke = ref({
    onsetTime: '',
    antiplatelet: '',
    antiplateletType: '',
    anticoagulant: '',
    anticoagulantType: '',
    riskFactors: [],
  });
  const riskFactors = ref([]);
  const strokeType = ref('');
  const mriFindings = ref('');
  const aspectScore = ref('');
  const firstOrRecurrent = ref('');
  const additionalNotes = ref('');

  watch(() => ischemicStroke.value.antiplatelet, (value) => {
    if (value === 'なし') {
      ischemicStroke.value.antiplateletType = '';
    }
  });

  watch(() => ischemicStroke.value.anticoagulant, (value) => {
    if (value === 'なし') {
      ischemicStroke.value.anticoagulantType = '';
    }
  });


  </script>
  