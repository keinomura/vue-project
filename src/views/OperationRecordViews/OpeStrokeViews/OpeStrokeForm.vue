<template>
  <div style="background-color: #ffeaf5">
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
      <v-col cols="8" v-if="riskFactors.includes('その他')">
        <v-text-field v-model="additionalNotes" label="その他リスクファクター"></v-text-field>
      </v-col>
    </v-row>

    <v-row>
      <v-col style="margin-left: 2%;margin-right: 2%;">
        <v-text-field v-model="NIHSS" label="NIHSS点数" type="number"></v-text-field>
      </v-col>
    </v-row>
    <v-col cols="12">
      <v-textarea v-model="mriFindings" label="画像所見"></v-textarea>
    </v-col>
    <v-col cols="12">
      <v-text-field v-if="diseaseName === 'CI'" v-model="aspectScore" label="ASPECTまたはMRI-ASPECT 点数" type="number"></v-text-field>
    </v-col>
    <v-row>
      <v-col col="5" style="margin-left: 15px;">
        <v-label>※病変が複数箇所ある場合は複数チェック</v-label>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="6">
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

    <v-row>
      <v-col col="5" style="margin-left: 15px;">
        <v-label>大きさ</v-label>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="3" label="病変の大きさ" v-for="eachLesionSize in lesionSizeSelection">
        <v-checkbox
          :label="eachLesionSize"
          :value="eachLesionSize"
          v-model="lesionLocation"
        >
        </v-checkbox>
      </v-col>
    </v-row>


    <!-- 病変部位をチェックボックスで入力 -->
    <v-row>
      <v-col col="5" style="margin-left: 15px;">
        <v-label>部位</v-label>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="2" label="病変部位" v-for="eachLesionLocation in lesionLocationSelection">
        <v-checkbox
          :label="eachLesionLocation"
          :value="eachLesionLocation"
          v-model="lesionLocation"
        >
        </v-checkbox>
      </v-col>
    </v-row>

    <!-- 脳出血の場合に外科治療の有無を選択 -->
    <v-radio-group v-if="diseaseName === 'ICH'" v-model="surgicalTreatment" label="外科治療の有無" inline>
      <v-radio label="あり" value="あり"></v-radio>
      <v-radio label="なし" value="なし"></v-radio>
    </v-radio-group>

    <!-- 脳梗塞の場合にtPA治療の有無を選択 -->
    <v-radio-group v-if="diseaseName === 'CI'" v-model="tPATreatment" label="tPA治療の有無" inline>
      <v-radio label="あり" value="あり"></v-radio>
      <v-radio label="なし" value="なし"></v-radio>
    </v-radio-group>

    <!-- 脳梗塞の場合に血管内治療の有無を選択 -->
    <v-radio-group v-if="diseaseName === 'CI'" v-model="endovascularTreatment" label="血管内治療の有無" inline>
      <v-radio label="あり" value="あり"></v-radio>
      <v-radio label="なし" value="なし"></v-radio>
    </v-radio-group>
  </div>
</template>

<script setup>
  // import { l } from 'vite/dist/node/types.d-aGj9QkWt';
  import { defineProps } from 'vue';
  import { ref, watch } from 'vue';

  // Props: 読み込み時に配列で定義する
  const props = defineProps({
    diseaseName: String,
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

  const strokeTypeSelection = ref(['アテローム血栓性', '心原性塞栓', 'ラクナ', 'その他']);
  const lesionSizeSelection = ref(['15mm未満（小）', '15mm以上1/2葉未満（中）', '1/2葉以上（大）', '不明']);
  
  watch(() => props.diseaseName, (newVal) => {
    if (props.diseaseName === 'CI') {
      strokeTypeSelection.value = ['アテローム血栓性', '心原性塞栓', 'ラクナ', 'その他'];
      lesionSizeSelection.value = ['15mm未満（小）', '15mm以上1/2葉未満（中）', '1/2葉以上（大）', '不明'];
    } else if (props.diseaseName === 'ICH') {
      strokeTypeSelection.value = ['皮質下', '視床', '被殻', '脳幹', '小脳', 'その他'];
      lesionSizeSelection.value = ['2cm未満（小）', '2-6cm（中）', '6cm以上（大）', '不明'];
    } else {
      strokeTypeSelection.value = [];
      lesionSizeSelection.value = [];
    }
  }, { immediate: true });




  // Methods
  const getSummaryOfStroke = () => {
    // 作成したサマリーを返す
    // 入力されていない項目は削除する
    // 日付はyyyy/mm/ddで表示する関数
    const formatDate = (date) => {
      if (date !== undefined && date !== null && date !== '' && date.length !== 0) {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = ('0' + (d.getMonth() + 1)).slice(-2);
        const day = ('0' + d.getDate()).slice(-2);
        return `${year}/${month}/${day}`;
      } else {
        return '';
      }
    };

    const strokeSummary = {
      '病型': strokeType.value,
      '病型詳細': strokeTypeElse.value,
      '病側': lesionSide.value,
      '発症時刻': strokeOnsetTime.value,
      '入院時刻': admissionTime.value,
      '抗血小板薬': antiplateletType.value,
      '抗凝固薬': anticoagulantType.value,
      '危険因子': riskFactors.value,
      '画像所見': mriFindings.value,
      'aspectScore': aspectScore.value,
      '今回は': firstOrRecurrent.value,
      '備考': additionalNotes.value,
      'NIHSS': NIHSS.value,
      '前回発症': previousStrokeYear.value,
      '病変大きさ': lesionSize.value,
      '病変部位': lesionLocation.value,
      '手術': surgicalTreatment.value,
      'tPA': tPATreatment.value,
      '血管内治療': endovascularTreatment.value,
    };

    const filteredStrokeSummary = Object.fromEntries(
      Object.entries(strokeSummary).filter(([key, value]) => value != null && value !== '' && value !== undefined && value.length !== 0)
    );

    const summaryText = Object.entries(filteredStrokeSummary)
    .map(([key, value]) => `${key}: ${value}`)
    .join(',');

    return summaryText
  }

  // defineExpose
  defineExpose({
    getSummaryOfStroke,
  });

  // Watchers

  watch(() => strokeType.value, (value) => {
    if (!value.includes('その他')) {
      strokeTypeElse.value = '';
    }
  });

  watch(() => antiplatelet.value, (value) => {
    if (value === 'なし') {
      antiplateletType.value = [];
    }
  });

  watch(() => anticoagulant.value, (value) => {
    if (value === 'なし') {
      anticoagulantType.value = [];
    }
  });

  watch(() => riskFactors.value, (value) => {
    if (!value.includes('その他')) {
      additionalNotes.value = '';
    }
  });

  watch(() => firstOrRecurrent.value, (value) => {
    if (value !== '再発') {
      previousStrokeYear.value = '';
    }
  });

  watch(() => lesionSize.value, (value) => {
    if (!value.includes('その他')) {
      lesionLocation.value = [];
    }
  });


</script>
