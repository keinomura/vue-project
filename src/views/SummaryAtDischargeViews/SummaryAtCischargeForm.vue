<template>
    <v-container fluid>
      <v-row >
        <!-- 左側入力スペース -->
        <v-col cols="12" md="6"> 
          <h2 class="mb-4">退院サマリ</h2>
            <v-form ref="form" class="no-horizontal-scroll">
                <v-col cols="12">
                  <v-radio-group v-model="selectedDisease" label="疾患を選択してください" inline>
                    <v-radio v-for="disease in diseases" :key="disease" :label="disease" :value="disease"></v-radio>
                  </v-radio-group>
                </v-col>

                <!-- 疾患によって切り換えるcomponent -->
                <v-col cols="12">
                  <component :is="selectedDiseaseComponent()" ref="child"></component>
                </v-col>

                <v-col cols="12">
                  <v-radio-group v-model="complication" label="合併症" inline>
                    <v-radio label="あり" value="あり"></v-radio>
                    <v-radio label="なし" value="なし"></v-radio>
                  </v-radio-group>
                </v-col>
                <v-col cols="12">
                  <v-textarea v-if="complication === 'あり'" v-model="complicationText" label="合併症" outlined></v-textarea>
                </v-col>
                <v-col cols="12">
                  <v-textarea v-model="additionalComment" label="備考" outlined></v-textarea>
                </v-col>
                <v-col cols="12" md="8">
                  <v-select v-model="postRS"
                              :items="mRSOptions"
                              item-title="text"
                              item-value="value"
                              return-object
                              label="退院時 mRS" outlined>
                  </v-select>
                </v-col>
                <v-col cols="12" md="8">
                  <v-select v-model="dischargeRoute"
                              :items="dischargeRouteOptions"
                              item-title="text"
                              item-value="value"
                              label="退院経路"
                              outlined
                              >
                  </v-select>
                </v-col>
                <v-col cols="12" md="8">
                  <v-text-field v-if="dischargeRoute === '1' || dischargeRoute === '3' || dischargeRoute === '4' || dischargeRoute === '5' || dischargeRoute === '7'" v-model="referralHospital" label="退院先" outlined></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-radio-group v-model="outcome" label="転帰" inline>
                    <v-radio v-for="outcome in outcomeOptions" :key="outcome" :label="outcome.text" :value="outcome.value"></v-radio>
                  </v-radio-group>
                </v-col>
            </v-form>
            <div class="d-flex justify-center pa-2">
              <v-btn color="primary" @click="createSummary">作成</v-btn>
            </div>
        </v-col>
        <!-- 右側サマリ表示スペース -->
        <v-col cols="12" md="6"  >
          <v-card>
            <v-card-title>退院時サマリー</v-card-title>
            <v-card-text>
              <v-textarea v-model="summary" outlined rows="30"></v-textarea>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

  </template>

  <script setup>
    import { ref } from 'vue';

    // import HFSForm from './MVDViews/HFSForm.vue';
    // import TNForm from './MVDViews/TNForm.vue';
    // import ICHForm from './StrokeViews/ICHForm.vue';
    // import CIForm from './StrokeViews/CIForm.vue';
    // import ICSForm from './AsymptomForm/ICSForm.vue';
    // import AneurysmForm from './AsymptomForm/AneurysmForm.vue';

    const child = ref(null);

    const selectedDisease = ref('デフォルト');
    const diseases = ref(['デフォルト', 'ICS', '動脈瘤', '脳梗塞', '脳出血', '三叉神経痛', '顔面痙攣']);
    const complication = ref('なし');
    const complicationText = ref('');
    const additionalComment = ref('');

    const dischargeRoute = ref('2 家庭');
    const dischargeRouteOptions = ref([
      { text: '1 院内他科', value: '1' },
      { text: '2 家庭', value: '2' },
      { text: '3 転院', value: '3' },
      { text: '4 介護老人保健施設', value: '4' },
      { text: '5 病院以外の介護施設', value: '5' },
      { text: '6 死亡退院', value: '6' },
      { text: '7 その他', value: '7' },
    ]);

    const referralHospital = ref('');
    const postRS = ref('');
    const summary = ref('');
    const mRSOptions = ref([
      { text: 'mRS 0:正常', value: '0' },
      { text: 'mRS 1:症候+、障害なし', value: '1' },
      { text: 'mRS 2:身の回りのことはできる', value: '2' },
      { text: 'mRS 3:歩けるが、外出は介助', value: '3' },
      { text: 'mRS 4:歩行、トイレ介助必要', value: '4' },
      { text: 'mRS 5:寝たきり', value: '5' },
      { text: 'mRS 6:死亡', value: '6' }
    ]);

    const outcome = ref('');
    const outcomeOptions = ref([
      { text: '1 治癒', value: '1' }, //F
      { text: '2 軽快', value: '2' }, //R
      { text: '3 寛解', value: '3' }, //R
      { text: '4 不変', value: '4' }, //N
      { text: '5 増悪', value: '5' }, //W
      { text: '6 死亡', value: '6' }, //D
      { text: '7 入院病名以外の死亡', value: '7' }, //D
      { text: '9 その他', value: '9' } //U
    ]);

    const outocomeHL7Options = ref([
      { text: 'D 死亡', value: 'D' },
      { text: 'R 回復', value: 'R' },
      { text: 'N 回復せず／変わらない', value: 'N' },
      { text: 'W 悪化', value: 'W' },
      { text: 'S 後遺症', value: 'S' },
      { text: 'F 完全に回復した', value: 'F' },
      { text: 'U 未知', value: 'U' }
    ]);

    function selectedDiseaseComponent() {
      if (selectedDisease.value === 'デフォルト'){
        return null;
      // } else if (selectedDisease.value === '三叉神経痛') {
      //   return TNForm;
      // } else if (selectedDisease.value === '顔面痙攣') {
      //   return HFSForm;
      // } else if (selectedDisease.value === '脳梗塞') {
      //   return CIForm;
      // } else if (selectedDisease.value === '脳出血') {
      //   return ICHForm;
      // } else if (selectedDisease.value === 'ICS') {
      //   return ICSForm;
      // } else if (selectedDisease.value === '動脈瘤') {
      //   return AneurysmForm;
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
