<template>
    <div style="background-color: #ffeaf5">

      <!--病型の選択肢を、脳出血、脳梗塞で変える。その他でフリー入力を可能にする。-->
      <v-row>
        <v-col col="5" style="margin-left: 15px;">
          <v-label>病型</v-label>
        </v-col>
      </v-row>
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




      <v-row>
        <v-col cols="6">
          <v-text-field v-model="strokeOnsetTime" label="発症日時または最終健常時刻" type="datetime-local"></v-text-field>
        </v-col>

        <v-col cols="6">
          <v-text-field v-model="admissionTime" label="入院時刻" type="datetime-local"></v-text-field>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="3">
          <v-radio-group v-model="antiplatelet" label="抗血小板薬内服" inline>
            <v-radio label="あり" value="あり"></v-radio>
            <v-radio label="なし" value="なし"></v-radio>
          </v-radio-group>
        </v-col>

        <v-col cols v-if="antiplatelet === 'あり'" v-for="eachAntiplatelet in antiplateletTypeSelection" :key="eachAntiplatelet">
          <v-checkbox
        :label="eachAntiplatelet"
        :value="eachAntiplatelet"
        v-model="antiplateletType"
          ></v-checkbox>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="3">
          <v-radio-group v-model="anticoagulant" label="抗凝固薬内服" inline>
            <v-radio label="あり" value="あり"></v-radio>
            <v-radio label="なし" value="なし"></v-radio>
          </v-radio-group>
        </v-col>

        <v-col cols v-if="anticoagulant === 'あり'" v-for="eachAnticoagulant in anticoagulantTypeSelection" :key="eachAnticoagulant">
          <v-checkbox
        :label="eachAnticoagulant"
        :value="eachAnticoagulant"
        v-model="anticoagulantType"
          ></v-checkbox>
        </v-col>
      </v-row>

      <v-row>
        <v-col col="5" style="margin-left: 15px;">
          <v-label>リスクファクター</v-label>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="2" v-for="(eachRiskFactor, index) in riskFactorsSelection" :key="index">
          <v-checkbox
        :label="eachRiskFactor"
        :value="eachRiskFactor"
        v-model="riskFactors"
          ></v-checkbox>
        </v-col>
        <!--　その他を選択した際に入力欄を表示する -->
        <v-col cols="8" v-if="riskFactors.includes('その他')">
          <v-text-field v-model="additionalNotes" label="その他リスクファクター"></v-text-field>
        </v-col>
      </v-row>


      <v-col>
        <v-text-field v-model="NIHSS" label="NIHSS点数" type="number"></v-text-field>
      </v-col>
      <v-col cols="12">
        <v-textarea v-model="mriFindings" label="画像所見"></v-textarea>
      </v-col>
      <v-col cols="12">
        <v-text-field v-if="aspectShow" v-model="aspectScore" label="ASPECTまたはMRI-ASPECT 点数" type="number"></v-text-field>
      </v-col>
      <v-row>
        <v-col cols="4">
          <v-radio-group v-model="firstOrRecurrent" inline>
            <v-radio label="初発" value="初発"></v-radio>
            <v-radio label="再発" value="再発"></v-radio>
            <v-radio label="不明" value="不明"></v-radio>
          </v-radio-group>
        </v-col>
        <v-col cols="6">
          <v-text-field v-if="firstOrRecurrent === '再発'"
          v-model="previousStrokeYear" label="前回発症年月" type="month"></v-text-field>
        </v-col>
      </v-row>

      <v-radio-group v-model="lesionSide" label="病側" inline>
        <v-radio label="右" value="右"></v-radio>
        <v-radio label="左" value="左"></v-radio>
        <v-radio label="両側" value="両側"></v-radio>
      </v-radio-group>

      <v-col cols="6" label="病変の大きさ" v-for="eachLesionSize in lesionSizeSelection">
        <v-checkbox
          :label="eachLesionSize"
          :value="eachLesionSize"
          v-model="lesionLocation"
        >
        </v-checkbox>
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
  // import { l } from 'vite/dist/node/types.d-aGj9QkWt';
  import { ref, watch } from 'vue';

  // Props: 読み込み時に配列で定義する
  const props = defineProps({
    strokeTypeSelection: Array,
    aspectShow: Boolean,
    lesionSizeSelection: Array,
  });

  // Data
  const strokeType = ref([]);

  const strokeTypeElse = ref('');
  const lesionSide = ref('');
  const strokeOnsetTime = ref('');
  const admissionTime = ref('');
  const antiplatelet = ref('');
  const anticoagulant = ref('');
  const antiplateletType = ref([]);
  const anticoagulantType = ref([]);
  const riskFactors = ref([]);
  const mriFindings = ref('');
  const aspectScore = ref('');
  const firstOrRecurrent = ref('');
  const additionalNotes = ref('');
  const NIHSS = ref('');
  const previousStrokeYear = ref('');
  const lesionSize = ref([]);
  const lesionLocation = ref([]);
  const surgicalTreatment = ref('');
  const tPATreatment = ref('');
  const endovascularTreatment = ref('');

  // Selections
  const anticoagulantTypeSelection = ref(['ワルファリン', 'リバーロキサバン', 'エドキサバン', 'アピキサバン', 'ダビガトラン', 'その他']);
  const antiplateletTypeSelection = ref(['アスピリン', 'クロピドグレル', 'シロスタゾール', 'プラスグレル', 'その他']);
  const riskFactorsSelection = ref(['高血圧', '高脂血症', '糖尿病', '心房細動', '脳血管障害の既往', '未破裂動脈瘤', '虚血性心疾患', 'その他']);
  const lesionLocationSelection = ref(['テント上穿通枝', 'テント上皮質枝', 'テント下', 'テント上下', '責任病変不明']);

  // watch(() => ischemicStroke.value.antiplatelet, (value) => {
  //   if (value === 'なし') {
  //     ischemicStroke.value.antiplateletType = '';
  //   }
  // });

  // watch(() => ischemicStroke.value.anticoagulant, (value) => {
  //   if (value === 'なし') {
  //     ischemicStroke.value.anticoagulantType = '';
  //   }
  // });


  </script>
