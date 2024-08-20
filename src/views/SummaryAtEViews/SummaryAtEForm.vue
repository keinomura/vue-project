<template>
    <v-container ref="form" class="no-horizontal-scroll">
      <v-row class="ma-2">
        <v-col cols="12">
          <v-radio-group v-model="selectedDisease" label="疾患を選択してください" inline>
            <v-radio v-for="disease in diseases" :key="disease" :label="disease" :value="disease"></v-radio>
          </v-radio-group>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <v-text-field v-model="chiefComplain" label="主訴" outlined></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <v-textarea v-model="presentHistory" label="現病歴" outlined></v-textarea>
        </v-col>
      </v-row>
        <!-- 疾患によって切り換えるcomponent -->
      <v-col cols="12">
        <component :is="selectedDiseaseComponent()" ref="child" :disNameSelected="chooseDisName"></component>
      </v-col>
      <v-row>
        <v-col cols="12" md="8">
          <v-select v-model="admissionRoute"
                      :items="routeOptions"
                      return-object
                      label="入院経路" outlined>
          </v-select>
        </v-col>
      </v-row>
      <v-row>
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
      </v-row>
      <v-row>
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
      </v-row>
      <v-row>
        <v-col v-if="otherHP=='あり'" cols="12">
          <v-text-field v-model="referralHospital" label="紹介元" outlined></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-divider>既往歴</v-divider>
        <v-col cols="12">
          <v-row id="pastHistoryArea" label="既往歴">
            <v-checkbox
              v-for="pastHistory in pastHistories"
              v-model="riskFactors"
              :label="pastHistory"
              :value="pastHistory"
              multiple
              persistent-hint
            ></v-checkbox>
          </v-row>
          <v-row>
            <v-textarea v-model="pastHistory" label="その他特記すべきことなし" outlined></v-textarea>
          </v-row>
        </v-col>
        <v-divider>入院時評価</v-divider>
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
    </v-container>
</template>

  <script setup>
    import { ref, shallowRef, watch } from 'vue';
    import SelectionSummaryType from './SelectionSummaryTypeAtEForm.vue';

    const child = shallowRef(null);
    const chooseDisName = ref(null);

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
       } else {
        return SelectionSummaryType;
       }
    };

    function chooseDisNameF() {
      const diseaseMapping = {
        'デフォルト': null,
        '三叉神経痛': 'TN',
        '顔面痙攣': 'HFS',
        '脳梗塞': 'CI',
        '脳出血': 'ICH',
        'ICS': 'ICS',
        '動脈瘤': 'Aneurysm',
        '慢性硬膜下血腫': 'CSDH',
        '経過観察': 'observation',
      };
      chooseDisName.value = diseaseMapping[selectedDisease.value] || null;
      return chooseDisName.value;
    };

    function createSummary() {
      console.log(chooseDisName.value);
      const detailedDiseaseSummary = (chooseDisName.value === null) ? '':child.value.getSummaryTextFromGrandChild();

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
      return summary.value;
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

    watch(selectedDisease, () => {
      chooseDisNameF();
    });
      // "defineExpose"を使用して、外部から参照できるプロパティを定義する
    defineExpose({
      createSummary,
    });
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
