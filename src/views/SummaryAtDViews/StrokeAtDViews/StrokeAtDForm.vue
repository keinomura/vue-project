<template>
  <v-container style="background-color: #ffeaf5">
    <v-row>
      <v-col col="5" style="margin-left: 15px;">
        <v-divider>最終病型診断</v-divider>
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

    <v-divider>入院中治療</v-divider>
    <v-container v-if="diseaseName === 'CI'">
      <v-row>
        <v-col
          cols
          v-for="eachInjection in intravenousInjectionSelection" 
          label="点滴注射" 
          >
          <v-checkbox
            :label="eachInjection"
            :value="eachInjection"
            v-model="intravenousInjection"
            class="d-inline-block">
          </v-checkbox>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="3">
          <v-radio-group v-model="tPATreatment" label="tPA治療の有無" inline>
            <v-radio label="あり" value="あり"></v-radio>
            <v-radio label="なし" value="なし"></v-radio>
          </v-radio-group>
        </v-col>
        <v-col cols="3">
          <v-text-field v-if="tPATreatment === 'あり'" v-model="tPATreatmentTime" label="tPA治療 発症から" type="time"></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-radio-group v-model="endovascularTreatment" label="血管内治療の有無" inline>
          <v-radio label="あり" value="あり"></v-radio>
          <v-radio label="なし" value="なし"></v-radio>
        </v-radio-group>
      
        <v-col cols="3" v-if="endovascularTreatment === 'あり'" v-for="eachEndovascularTreatment in endovascularTreatmentSelection" :key="eachEndovascularTreatment">
          <v-checkbox
            :label="eachEndovascularTreatment"
            :value="eachEndovascularTreatment"
            v-model="endovascularTreatmentType"
          ></v-checkbox>
        </v-col>
      </v-row>
    </v-container>
    <v-container v-if="diseaseName === 'ICH'">
      <v-radio-group v-model="operativeTreatment" label="外科治療の有無" inline>
        <v-radio label="あり" value="あり"></v-radio>
        <v-radio label="なし" value="なし"></v-radio>
      </v-radio-group>
      <v-text-field v-if="operativeTreatment === 'あり'" label="手術内容" v-model="operationName"></v-text-field>
    </v-container>

    <v-row>
      <v-col cols="3" v-for="drug in ['抗浮腫薬', '降圧薬', '抗てんかん薬']" :key="drug">
        <v-checkbox
          :label="drug"
          :value="drug"
          v-model="otherMedications"
        ></v-checkbox>
      </v-col>
    </v-row>
    <v-row class="d-flex flex-row">
      <v-radio-group v-model="recurrentStroke" label="入院中脳卒中再発" inline>
        <v-radio label="あり" value="あり"></v-radio>
        <v-radio label="なし" value="なし"></v-radio>
      </v-radio-group>
      <v-radio-group v-model="clinicalPath" label="クリニカルパスの使用" inline>
        <v-radio label="あり" value="あり"></v-radio>
        <v-radio label="なし" value="なし"></v-radio>
      </v-radio-group>
      <v-radio-group v-model="elasticStocking" label="弾性ストッキング使用" inline>
        <v-radio label="あり" value="あり"></v-radio>
        <v-radio label="なし" value="なし"></v-radio>
      </v-radio-group>
    </v-row>
    <v-row>
    <v-radio-group v-model="rehabilitation" label="リハビリテーション" inline>
      <v-radio label="あり" value="あり"></v-radio>
      <v-radio label="なし" value="なし"></v-radio>
    </v-radio-group>
    <v-text-field v-if="rehabilitation === 'あり'" v-model="rehabilitationStartDate" label="リハビリテーション開始日" type="date"></v-text-field>
    <v-text-field v-if="rehabilitation === 'あり'" v-model="rehabilitationStartDay" label="入院何日目から開始か" type="number"></v-text-field>
  </v-row>
  <v-row >
      </v-row>
        <v-col col="5" style="margin-left: 15px;">
          <v-divider>入院中その他治療</v-divider>
        </v-col>
      <v-row>
      <v-col cols="2" v-for="additionalTherapy in otherAdditionalTherapiesSelection" :key="additionalTherapy">
            <v-checkbox

              :label="additionalTherapy.label"
              :value="additionalTherapy.value"
              v-model="otherAdditionalTherapies"
            >
            <v-tooltip activator="parent" location="bottom">{{ additionalTherapy.description }}</v-tooltip>
          </v-checkbox>
      </v-col>
    </v-row>
  <v-divider>退院時内服</v-divider>
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
      <v-radio-group v-model="antidepressant" label="抗うつ薬" inline>
        <v-radio label="あり" value="あり"></v-radio>
        <v-radio label="なし" value="なし"></v-radio>
      </v-radio-group>
      <v-col cols="2" v-if="antidepressant === 'あり'" v-for="eachAntidepressant in antidepressantSelection" :key="eachAntidepressant">
        <v-checkbox
          :label="eachAntidepressant"
          :value="eachAntidepressant"
          v-model="antidepressantType"
        ></v-checkbox>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="3">
        <v-radio-group v-model="sleepingPill" label="睡眠薬" inline>
          <v-radio label="あり" value="あり"></v-radio>
          <v-radio label="なし" value="なし"></v-radio>
        </v-radio-group>
      </v-col>
      <v-col cols="6">
        <v-text-field v-if="sleepingPill === 'あり'" v-model="sleepingPillType" label="睡眠薬種類"></v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="3" v-for="drug in ['降圧薬', 'スタチン', '糖尿病治療薬（インスリン含む）']" :key="drug">
        <v-checkbox
          :label="drug"
          :value="drug"
          v-model="otherMedicationsAtDischarge"
        ></v-checkbox>
      </v-col>
    </v-row>
    <v-divider>退院時情報</v-divider>

    <v-radio-group v-model="upperLimb" label="上肢" inline>
      <v-radio v-for=" n in [0, 1, 2, 3, 4]" :key="n" :label=n.toString() :value="n"></v-radio>
    </v-radio-group>
    <v-radio-group v-model="lowerLimb" label="下肢" inline>
      <v-radio v-for=" n in [0, 1, 2, 3, 4]" :key="n" :label=n.toString() :value="n"></v-radio>
    </v-radio-group>
    <v-radio-group v-model="articulation" label="構音" inline>
      <v-radio v-for=" n in [0, 1, 2]" :key="n" :label=n.toString() :value="n"></v-radio>
    </v-radio-group>
    <v-radio-group v-model="aphasia" label="失語" inline>
      <v-radio v-for=" n in [0, 1, 2, 3]" :key="n" :label=n.toString() :value="n"></v-radio>
    </v-radio-group>
    <v-radio-group v-model="hemianopsia" label="半盲" inline>
      <v-radio v-for=" n in [0, 1, 2, 3]" :key="n" :label=n.toString() :value="n"></v-radio>
    </v-radio-group>

    <v-radio-group v-model="eating" label="摂食" inline>
      <v-radio label="摂食可" value="摂食可"></v-radio>
      <v-radio label="調整食" value="調整食"></v-radio>
      <v-radio label="経管栄養" value="経管栄養"></v-radio>
      <v-radio label="胃瘻" value="胃瘻"></v-radio>
    </v-radio-group>

    <v-radio-group v-model="walking" label="歩行" inline>
      <v-radio label="自立" value="自立"></v-radio>
      <v-radio label="杖" value="杖"></v-radio>
      <v-radio label="シルバーカー" value="シルバーカー"></v-radio>
      <v-radio label="車椅子" value="車椅子"></v-radio>
      <v-radio label="ベッド上" value="ベッド上"></v-radio>
    </v-radio-group>
    <v-row>
      <v-col style="margin-left: 2%;margin-right: 2%;">
        <v-text-field v-model="NIHSS" label="NIHSS総点数 あれば入力" type="number"></v-text-field>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
  import { defineProps } from 'vue';
  import { ref, watch } from 'vue';

  // Props: 読み込み時に配列で定義する
  const props = defineProps({
    diseaseName: String,
  });
  // Data
  const isCI = ref(false);
  watch(() => props.diseaseName, (value) => {
    isCI.value = (value === 'CI');
  }, { immediate: true });
  // (props.diseaseName === 'ICH')? ref(true): ref(false);
  const strokeType = ref([]);
  // console.log(props.diseaseName)

  const strokeTypeElse = ref('');
  const intravenousInjection = ref([]);

  const antiplatelet = ref('');
  const anticoagulant = ref('');
  const antiplateletType = ref([]);
  const anticoagulantType = ref([]);
  const NIHSS = ref('');
  const tPATreatment = ref((isCI.value)? 'なし': '');
  const tPATreatmentTime = ref('');
  const endovascularTreatment = ref((isCI.value)? 'なし': '');
  const endovascularTreatmentType = ref([]);

  const operativeTreatment = ref('');
  const operationName = ref('');

  const otherMedications = ref([]);

  const recurrentStroke = ref('なし');
  const clinicalPath = ref('あり');
  const elasticStocking = ref('あり');
  const rehabilitation = ref('あり');
  const rehabilitationStartDate = ref('');
  const rehabilitationStartDay = ref('');

  const otherMedicationsAtDischarge = ref([]);
  const antidepressant = ref('なし');
  const antidepressantType = ref([]);
  const sleepingPill = ref('なし');
  const sleepingPillType = ref('');

  const upperLimb = ref('');
  const lowerLimb = ref('');
  const articulation = ref('');
  const aphasia = ref('');
  const hemianopsia = ref('');
  const eating = ref('');
  const walking = ref('');
  const otherAdditionalTherapies = ref([]);


  // Selections
  const strokeTypeSelectionOfCI = ref(['アテローム血栓性', '心原性', 'ラクナ', 'ESUS', 'その他']);
  const strokeTypeSelectionOfICH = ref(['皮質下', '視床', '被殻', '脳幹', '小脳', 'その他']);
  const strokeTypeSelection = ref((isCI.value) ? strokeTypeSelectionOfCI.value : strokeTypeSelectionOfICH.value);
  watch(isCI, (value) => {
    strokeTypeSelection.value = value ? strokeTypeSelectionOfCI.value : strokeTypeSelectionOfICH.value;
    tPATreatment.value = value ? 'なし' : '';
    endovascularTreatment.value = value ? 'なし' : '';
  }, { immediate: true });

  const intravenousInjectionSelection = ref(['アルガトロバン', 'オザグレルナトリウム', 'エダラボン', 'ヘパリン', 'その他']);
  const anticoagulantTypeSelection = ref(['ワルファリン', 'リバーロキサバン', 'エドキサバン', 'アピキサバン', 'ダビガトラン', 'その他']);
  const antiplateletTypeSelection = ref(['アスピリン', 'クロピドグレル', 'シロスタゾール', 'プラスグレル', 'その他']);
  const endovascularTreatmentSelection = ref(['機械的血栓回収術', '局所血栓溶解療法', 'その他']);
  const antidepressantSelection = ref(['SSRI', 'SNRI', 'TCA', 'その他']);
  const otherAdditionalTherapiesSelection = ref([
        { label: 'HT', value: 'HT', description: '' },
        { label: 'DM', value: 'DM', description: '' },
        { label: 'HL', value: 'HL', description: '' },
        { label: 'HU', value: 'HU', description: '高尿酸血症' },
        { label: '不整脈', value: '不整脈', description: '' },
        { label: '心疾患', value: '心疾患', description: '' }
      ]);

  // Methods
  const getSummaryAtDischargeOfStroke = () => {
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

    const strokeSummaryAtDischarge = {
      treatmentInHospital: {
        '病型': strokeType.value,
        '病型詳細': strokeTypeElse.value,
        '点滴注射': intravenousInjection.value,
        'tPA治療': tPATreatment.value,
        '治療時刻': tPATreatmentTime.value,
        '血管内治療': endovascularTreatment.value,
        '手技': endovascularTreatmentType.value,
        'その他内服薬': otherMedications.value,
        'その他治療': otherAdditionalTherapies.value,
        '入院中の再発': recurrentStroke.value,
        'クリニカルパス': clinicalPath.value,
        '弾性ストッキング': elasticStocking.value,
        'リハビリテーション': rehabilitation.value,
        'リハ開始日': formatDate(rehabilitationStartDate.value),
        '入院から開始まで': rehabilitationStartDay.value,
      },
      neurologicalInformationAtDischarge: {
        '上肢': upperLimb.value,
        '下肢': lowerLimb.value,
        '構音': articulation.value,
        '失語': aphasia.value,
        '半盲': hemianopsia.value,
        '摂食': eating.value,
        '歩行': walking.value,
        '総NIHSS': NIHSS.value,
      },
      otherInformationAtDischarge: {
        '抗血小板薬': antiplatelet.value,
        '種類': antiplateletType.value,
        '抗凝固薬': anticoagulant.value,
        '種類': anticoagulantType.value,
        'その他': otherMedicationsAtDischarge.value,
        '抗うつ薬': antidepressant.value,
        '種類': antidepressantType.value,
        '睡眠薬': sleepingPill.value,
        '種類': sleepingPillType.value,
      },
    };

    const createSummaryText = (summary) => {
      const filteredSummary = Object.fromEntries(
        Object.entries(summary).filter(([key, value]) => value != null && value !== '' && value !== undefined && value.length !== 0)
      );

      const summaryText = Object.entries(filteredSummary)
      .map(([key, value]) => `${key}: ${value}`)
      .join(',');

      return summaryText
    }

    const summaryText = '入院治療 {' + createSummaryText(strokeSummaryAtDischarge.treatmentInHospital) + '}\r' + 
    '退院時神経所見 {' + createSummaryText(strokeSummaryAtDischarge.neurologicalInformationAtDischarge) + '}\r' +
    '退院時内服 {' + createSummaryText(strokeSummaryAtDischarge.otherInformationAtDischarge) + '}';
    // return summaryText
    return summaryText;
  }

  // defineExpose
  defineExpose({
    getSummaryAtDischargeOfStroke,
  });

  // Watchers
  watch(() => strokeType.value, (value) => {
    if (!value.includes('その他')) {
      strokeTypeElse.value = '';
    }
  });

  watch(tPATreatment, (value) => {
    if (value === 'なし') {
      tPATreatmentTime.value = '';
    }
  });

  watch(endovascularTreatment, (value) => {
    if (value === 'なし') {
      endovascularTreatmentType.value = [];
    }
  });

  watch(rehabilitation, (value) => {
    if (value === 'なし') {
      rehabilitationStartDate.value = '';
      rehabilitationStartDay.value = '';
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

  watch(() => antidepressant.value, (value) => {
    if (value === 'なし') {
      antidepressantType.value = [];
    }
  });

  watch(() => sleepingPill.value, (value) => {
    if (value === 'なし') {
      sleepingPillType.value = '';
    }
  });


</script>
