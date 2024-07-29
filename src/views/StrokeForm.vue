<template>
    <div style="background-color: #ffeaf5">

      <!--病型の選択肢を、脳出血、脳梗塞で変える。その他でフリー入力を可能にする。-->
      <v-row>
        <v-col cols v-for="eachStrokeType in strokeTypeSelection" :key="eachStrokeType">
          <v-checkbox
        :label="eachStrokeType"
        :value="eachStrokeType"
        v-model="strokeType"
          ></v-checkbox>
        </v-col>
      </v-row>

      <v-text-field v-if="strokeType.includes('その他')"
      v-model="strokeTypeElse" label="その他病型"></v-text-field>


      <v-radio-group v-model="lesionSide" label="病側" inline>
        <v-radio label="右" value="右"></v-radio>
        <v-radio label="左" value="左"></v-radio>
      </v-radio-group>

      <v-row>
        <v-col cols="6">
          <v-text-field v-model="ischemicStroke.onsetTime" label="発症日時または最終健常時刻" type="datetime-local"></v-text-field>
        </v-col>

        <v-col cols="6">
          <v-text-field v-model="ischemicStroke.admissionTime" label="入院時刻" type="datetime-local"></v-text-field>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="6">
          <v-radio-group v-model="ischemicStroke.antiplatelet" label="抗血小板薬内服" inline>
            <v-radio label="あり" value="あり"></v-radio>
            <v-radio label="なし" value="なし"></v-radio>
          </v-radio-group>
        </v-col>
        <v-col cols="6">
          <v-text-field v-if="ischemicStroke.antiplatelet === 'あり'" v-model="ischemicStroke.antiplateletType" label="抗血小板薬種類"></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="6">
          <v-radio-group v-model="ischemicStroke.anticoagulant" label="抗凝固薬内服" inline>
            <v-radio label="あり" value="あり"></v-radio>
            <v-radio label="なし" value="なし"></v-radio>
          </v-radio-group>
        </v-col>
        <v-col cols="6">
          <v-text-field v-if="ischemicStroke.anticoagulant === 'あり'" v-model="ischemicStroke.anticoagulantType" label="抗凝固薬種類"></v-text-field>
        </v-col>
      </v-row>
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

      <v-col>// NIHSS点数を入れるエリア
        <v-text-field v-model="NIHSS" label="NIHSS点数" type="number"></v-text-field>
      </v-col>
      <v-col cols="12">
        <v-textarea v-model="mriFindings" label="MRI所見"></v-textarea>
      </v-col>
      <v-col cols="12">
        <v-text-field v-model="aspectScore" label="ASPECTまたはMRI-ASPECT 点数" type="number"></v-text-field>
      </v-col>
      <v-col cols="12">// 初発、再発、不明の選択肢を表示
        <v-radio-group v-model="firstOrRecurrent" row>
          <v-radio label="初発" value="初発"></v-radio>
          <v-radio label="再発" value="再発"></v-radio>
          <v-radio label="不明" value="不明"></v-radio>
        </v-radio-group>
      </v-col>
      <v-col cols="12">// 前回発症年月を入れるエリア
        <v-text-field v-model="previousStrokeYear" label="前回発症年月" type="month"></v-text-field>
      </v-col>

      <!-- 病変の大きさを登録するチェックボックス。病型 脳出血、脳梗塞で選択肢を変える。-->
      <!-- lesionSizeの選択肢は読み込み時に配列で定義する -->
      <v-col cols="6">
        <v-select v-model="lesionSize.size" :items="lesionSizeSelection" label="病変大きさ"></v-select>
      </v-col>
      <v-col cols="6" label="病変部位">
        <v-checkbox-group v-model="lesionSize" label="病変部位" class="d-flex flex-wrap">
          <template v-for="location in lesionSizeSelection">
            <v-checkbox :label="location" :value="location"></v-checkbox>
          </template>
        </v-checkbox-group>
      </v-col>

      <!-- 病変部位をチェックボックスで入力 -->
      <v-col cols="12" label="病変部位">
        <v-checkbox-group v-model="lesionLocation" label="病変部位" class="d-flex flex-wrap">
          <template v-for="location in lesionLocationSelection">
            <v-checkbox :label="location" :value="location"></v-checkbox>
          </template>
        </v-checkbox-group>
      </v-col>


      <!-- 脳出血の場合に外科治療の有無を選択 -->
      <v-radio-group v-model="surgicalTreatment" label="外科治療の有無" inline>
        <v-radio label="あり" value="あり"></v-radio>
        <v-radio label="なし" value="なし"></v-radio>
      </v-radio-group>

      <!-- 脳梗塞の場合にtPA治療の有無を選択 -->
      <v-radio-group v-model="tPATreatment" label="tPA治療の有無" inline>
        <v-radio label="あり" value="あり"></v-radio>
        <v-radio label="なし" value="なし"></v-radio>
      </v-radio-group>

      <!-- 脳梗塞の場合に血管内治療の有無を選択 -->
      <v-radio-group v-model="endovascularTreatment" label="血管内治療の有無" inline>
        <v-radio label="あり" value="あり"></v-radio>
        <v-radio label="なし" value="なし"></v-radio>
      </v-radio-group>
    </div>
  </template>

  <script setup>
  import { ref, watch } from 'vue';

  // Props
  const props = defineProps({
    lesionSize: Array,
    lesionLocationSelection: Array,
  });
  const strokeType = ref([]);
  const strokeTypeSelection = ref(['アテローム血栓性', '心原性塞栓', 'ラクナ', 'ESUS','その他']);
  const lesionSizeSelection = ref(['小', '中', '大']);
  const strokeTypeElse = ref('');
  const ICHOrCI = ref('');
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
  const mriFindings = ref('');
  const aspectScore = ref('');
  const firstOrRecurrent = ref('');
  const additionalNotes = ref('');
  const NIHSS = ref('');
  const previousStrokeYear = ref('');
  const lesionSize = ref([]);
  const lesionLocation = ref([]);
  const lesionLocationSelection = ref(['テント上穿通枝', 'テント上皮質枝', 'テント下', 'テント上下', '責任病変不明']);
  const surgicalTreatment = ref('');
  const tPATreatment = ref('');
  const endovascularTreatment = ref('');


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
