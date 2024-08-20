<template>
    <v-container fluid>
      <v-row>
        <v-col cols="12" md="6">
          <h2 class="mb-4">{{ title }}</h2>

            
            <v-container class="d-flex justify-center pa-2">
              <v-btn color="primary" @click="createSummary">作成</v-btn>
            </v-container>
          </v-col>
        <v-col cols="12" md="6"  >
        <v-card>
          <v-card-title>{{ title }}</v-card-title>
          <v-card-text>
            <v-textarea v-model="summary" outlined rows="30"></v-textarea>
          </v-card-text>
        </v-card>
        </v-col>
      </v-row>
    </v-container>
  </template>

  <script setup>
    import { ref, defineProps } from 'vue';

  // Props
  const props = defineProps({
      title: String,
    });

    const child = ref(null);

    const selectedDisease = ref('デフォルト');
    const diseases = ref(['デフォルト', 'ICS', '動脈瘤', '脳梗塞', '脳出血', '三叉神経痛', '顔面痙攣']);
    const chiefComplain = ref('');
    const presentHistory = ref('');
    const admissionRoute = ref('2 直接入院、家庭からの入院');
    const routeOptions = ref([
      '1 院内の他科からの転科',
      '2 直接入院、家庭からの入院',
      '3 他の病院、診療所の病棟からの転院',
      '4 介護施設、福祉施設に入所中',
      '5 院内で出生',
      '6 その他',
    ]);
    const inHospitalOnset = ref('なし');
    const QQ = ref('なし');
    const admissionType = ref('予定入院');
    const otherHP = ref('なし');
    const referralHospital = ref('');
    const riskFactors = ref([]);
    const pastHistory = ref('その他特記すべきことなし');
    const E = ref('4');
    const V = ref('5');
    const M = ref('6');
    const exam = ref('');
    const premRS = ref({ text: 'mRS 0:正常', value: '0' });
    const summary = ref('');
    const mRSOptions = ref([
      { text: 'mRS 0:正常', value: '0' },
      { text: 'mRS 1:症候+、障害なし', value: '1' },
      { text: 'mRS 2:身の回りのことはできる', value: '2' },
      { text: 'mRS 3:歩けるが、外出は介助', value: '3' },
      { text: 'mRS 4:歩行、トイレ介助必要', value: '4' },
      { text: 'mRS 5:寝たきり', value: '5' }
    ]);
    const pastHistories = ref([
      '高血圧',
      '糖尿病',
      '狭心症',
      '心房細動',
      '虚血性心疾患',
      'その他不整脈',
      '脳卒中の既往',
      '未破裂脳動脈瘤',
      '喫煙',
      '飲酒',
      '家族歴',
    ]);

    function selectedDiseaseComponent() {
      if (selectedDisease.value === 'デフォルト'){
        return null;
      } else if (selectedDisease.value === '三叉神経痛') {
        return TNForm;
      } else if (selectedDisease.value === '顔面痙攣') {
        return HFSForm;
      } else if (selectedDisease.value === '脳梗塞') {
        return CIForm;
      } else if (selectedDisease.value === '脳出血') {
        return ICHForm;
      } else if (selectedDisease.value === 'ICS') {
        return ICSForm;
      } else if (selectedDisease.value === '動脈瘤') {
        return AneurysmForm;
      }
    }

    function createSummary() {
      const detailedDiseaseSummary = child.value.getSummaryTextFromGrandChild();

      const riskFactorsText = (riskFactors.value.length === 0)? '':riskFactors.value.join(',') + ' ';
      const chiefComplainText = textReplaced("【主訴】", chiefComplain.value);
      const presentHistoryText = textReplaced("【現病歴】", presentHistory.value);
      const pastHistoryText = textReplaced("【既往歴,家族歴】" + riskFactorsText + pastHistory.value);
      const exm = textReplaced("【入院時現症】", exam.value);
      const QQt = "\rQQ" + QQ.value;
      const otHP = "他院からの紹介:" + otherHP.value + " " + referralHospital.value;
      const GCSgt = "\rGCS:" + GCS("GCS");
      const GCSjt = GCS("JCS");
      const premRSText = " 発症前mRS:" + premRS.value.value;

      summary.value = chiefComplainText + presentHistoryText + pastHistoryText + exm + '\r'
      + '{' + detailedDiseaseSummary + '}' + '\r'
      + "\r---------入院データ----------"
      + [QQt,admissionRoute.value,admissionType.value,otHP,GCSgt,GCSjt,premRSText].join(',') ;


      console.log(summary.value)
    }

    function textReplaced(title, element) {
      const replacedElement = (element)? element.replace(/\r?\n|\t/g, " "):'';
      return title + replacedElement;
    }

    function GCS(type) {
      const resultE = E.value;
      const resultV = V.value;
      const resultM = M.value;
      if (type === "GCS") {
        return `E:${resultE}V:${resultV}M:${resultM}  ${parseInt(resultE) + parseInt(resultM) + parseInt(resultV)}`;
      } else if (type === "JCS") {
        let jCSvalue = "";
        if (resultE === "4") {
          const jCSIArray = ["I-3", "I-3", "I-2", "I-2", "I-0"];
          jCSvalue = jCSIArray[resultV - 1];
        } else if (resultE === "3") {
          jCSvalue = "II-10";
        } else if (resultE === "2") {
          jCSvalue = "II-30";
        } else if (resultE === "1") {
          const jCSIIIArray = ["III-300", "III-200", "III-200", "III-200", "III-100", "III-100"];
          jCSvalue = jCSIIIArray[resultM - 1];
        }
        return " JCS: " + jCSvalue;
      }
    }
  </script>

  <style scoped>
  /* .container {
    max-width: 900px;
    margin: auto;
  } */

  .no-horizontal-scroll {
    overflow-x: hidden;
    max-height: 800px;
  }
  </style>
