<template>
    <v-container fluid>
      <v-row >
        <v-col cols="12" md="6">
          <h2 class="mb-4">入院サマリ</h2>

            <v-form ref="form" class="no-horizontal-scroll">
              <v-row class="ma-2">
                <v-col cols="12" md="6">
                  <v-select
                    v-model="selectedDisease"
                    :items="diseases"
                    label="疾患を選択してください"
                  ></v-select>
                </v-col>

                <v-col cols="12">
                  <v-text-field v-model="chiefcomplain" label="主訴" outlined></v-text-field>
                </v-col>

                <v-col cols="12">
                  <v-textarea v-model="presenthistory" label="現病歴" outlined></v-textarea>
                </v-col>

                <!-- 疾患によって切り換えるcomponent -->
                <v-col cols="12">
                  <component :is="selectedDiseaseComponent()"></component>
                </v-col>

                <v-col cols="12" md="8">
                  <v-select v-model="admissionRoute"
                              :items="routeOptions"
                              return-object
                              label="入院経路" outlined>
                  </v-select>
                </v-col>

                <v-col cols="6">
                  <v-radio-group v-model="inHospitalOnset" label="院内発症" inline>
                    <v-radio label="あり" value="あり"></v-radio>
                    <v-radio label="なし" value="なし"></v-radio>
                  </v-radio-group>
                </v-col>
                <v-col cols="6">
                  <v-radio-group v-model="QQ" label="QQ" inline>
                    <v-radio label="あり" value="あり"></v-radio>
                    <v-radio label="なし" value="なし"></v-radio>
                  </v-radio-group>
                </v-col>
                <v-col cols="6">
                  <v-radio-group v-model="admissionType" label="予定入院/緊急入院" inline>
                    <v-radio label="予定入院" value="予定入院"></v-radio>
                    <v-radio label="緊急入院" value="緊急入院"></v-radio>
                  </v-radio-group>
                </v-col>
                <v-col cols="6">
                  <v-radio-group v-model="otherHP" label="他院から紹介" inline>
                    <v-radio label="あり" value="あり"></v-radio>
                    <v-radio label="なし" value="なし"></v-radio>
                  </v-radio-group>
                </v-col>

                <v-col v-if="otherHP=='あり'" cols="12">
                  <v-text-field v-model="referralHospital" label="紹介元" outlined></v-text-field>
                </v-col>
                <v-col cols="12">
                  <label for="pastHistoryArea">既往歴</label>
                  <v-row id="pastHistoryArea" label="既往歴">
                    <v-select
                      v-model="riskfactors"
                      :items="pastHistories"
                      hint="Pick past histories"
                      label="Select"
                      multiple
                      persistent-hint
                    ></v-select>
                  </v-row>
                  <v-row>
                    <v-textarea v-model="pasthistory" label="その他特記すべきことなし" outlined></v-textarea>
                  </v-row>
                </v-col>

                <v-col cols="12">
                  <v-radio-group v-model="E"  inline>
                    E
                    <v-radio label="4" value="4"></v-radio>
                    <v-radio label="3" value="3"></v-radio>
                    <v-radio label="2" value="2"></v-radio>
                    <v-radio label="1" value="1"></v-radio>
                  </v-radio-group>
                  <v-radio-group v-model="V"  inline>
                    V
                    <v-radio label="5" value="5"></v-radio>
                    <v-radio label="4" value="4"></v-radio>
                    <v-radio label="3" value="3"></v-radio>
                    <v-radio label="2" value="2"></v-radio>
                    <v-radio label="1" value="1"></v-radio>
                  </v-radio-group>
                  <v-radio-group v-model="M"  inline>
                    M
                    <v-radio label="6" value="6"></v-radio>
                    <v-radio label="5" value="5"></v-radio>
                    <v-radio label="4" value="4"></v-radio>
                    <v-radio label="3" value="3"></v-radio>
                    <v-radio label="2" value="2"></v-radio>
                    <v-radio label="1" value="1"></v-radio>
                  </v-radio-group>
                  <v-textarea v-model="exam" label="身体所見" outlined></v-textarea>
                </v-col>
                <v-col cols="12" md="8">
                  <v-select v-model="premRS"
                              :items="mRSOptions"
                              item-title="text"
                              item-value="value"
                              return-object
                              label="発症前 mRS" outlined>
                  </v-select>
                </v-col>

              </v-row>
            </v-form>
            <div class="d-flex justify-center pa-2">
              <v-btn color="primary" @click="createSummary">作成</v-btn>
            </div>
          </v-col>
        <v-col cols="12" md="6"  >
          <v-card>
            <v-card-title>入院時サマリー</v-card-title>
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
    import HFSForm from './HFSForm.vue';
    import TNForm from './TNForm.vue';
    import StrokeForm from './StrokeForm.vue';

    const selectedDisease = ref('デフォルト');
    const diseases = ref(['デフォルト', '脳梗塞', '脳出血', '三叉神経痛', '顔面痙攣']);
    const chiefcomplain = ref('');
    const presenthistory = ref('現病歴');
    const admissionRoute = ref(null);
    const routeOptions = ref([
      '1 院内の他科からの転科',
      '2 直接入院、家庭からの入院',
      '3 他の病院、診療所の病棟からの転院',
      '4 介護施設、福祉施設に入所中',
      '5 院内で出生',
      '6 その他',
    ]);
    const inHospitalOnset = ref('なし');
    const QQ = ref('あり');
    const admissionType = ref('予定入院');
    const otherHP = ref('なし');
    const referralHospital = ref('');
    const riskfactors = ref([]);
    const pasthistory = ref('その他特記すべきことなし');
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
      '不整脈',
      '喫煙',
      '飲酒',
      '家族歴'
    ]);

    function selectedDiseaseComponent() {
      if (selectedDisease.value === '三叉神経痛') {
        return TNForm;
      } else if (selectedDisease.value === 'デフォルト'){
        return null;
      } else if (selectedDisease.value === '顔面痙攣') {
        return HFSForm;
      } else if (selectedDisease.value === '脳梗塞') {
        return StrokeForm;
      }
    }

    function createSummary() {
      const vriskfactors = riskfactors.join(',');
      const rkftt = " " + vriskfactors;
      const chif = textReplaced("【主訴】", chiefcomplain);
      const preshist = this.textReplaced("【現病歴】", this.presenthistory);
      const pasthist = this.textReplaced("【既往歴,家族歴】" + rkftt + "\r", this.pasthistory);
      const exm = this.textReplaced("【入院時現症】", this.exam);

      const QQt = "\rQQ" + this.QQ;
      const otHP = "紹介:" + this.otherHP + " " + this.referralHospital;

      const GCSgt = "\rGCS:" + this.GCS("GCS");
      const GCSjt = this.GCS("JCS");
      const premRS = " 発症前mRS:" + this.premRS.value;

      this.summary = chif + preshist + pasthist + GCSgt + exm + "\r---------入院データ----------"  + QQt + this.admissionType + otHP + "\r" +GCSjt + premRS;
    }

    function textReplaced(title, text) {
      return title + text.replace(/\r?\n|\t/g, "\s");
    }

    function GCS(type) {
      const resultE = this.E;
      const resultV = this.V;
      const resultM = this.M;
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
