<template>
    <v-container fluid>
      <v-row>
        <!-- 左側入力スペース -->
        <v-col cols="12" md="6">
          <h2 class="mb-4">退院サマリ</h2>
          <v-container ref="form" class="no-horizontal-scroll">
              <v-col cols="12">
                <v-radio-group v-model="selectedDisease" label="疾患を選択してください" inline>
                  <v-radio v-for="disease in diseases" :key="disease" :label="disease" :value="disease"></v-radio>
                </v-radio-group>
              </v-col>

              <!-- 疾患によって切り換えるcomponent -->
              <v-col cols="12">
                <component :is="selectedDiseaseComponent()" ref="child" :disNameSelected="chooseDisName"></component>
              </v-col>

              <v-col cols="12">
                <v-textarea v-model="additionalComment" label="入院経過補足" outlined></v-textarea>
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

              <v-col cols="12" md="8">
                <v-select v-model="postmRS"
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
          </v-container>
          <v-container class="d-flex justify-center pa-2">
            <v-btn color="primary" @click="createSummary">作成</v-btn>
          </v-container>
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
    import { ref, defineExpose, watch } from 'vue';
    // import TNAtDForm from './MVDAtDViews/TNAtDForm.vue';
    // import HFSAtDForm from './MVDAtDViews/HFSAtDForm.vue';
    // import SelectionTypeOfStrokeAtDForm from './StrokeAtDViews/SelectionTypeOfStrokeAtDForm.vue';
    // import SelectionTypeOfMVDAtDForm from './MVDAtDViews/SelectionTypeOfMVDAtDForm.vue';
    import SelectionSummaryType from './SelectionSummaryTypeAtDForm.vue';

    // import HFSForm from './MVDViews/HFSForm.vue';
    // import TNForm from './MVDViews/TNForm.vue';
    // import ICSForm from './AsymptomForm/ICSForm.vue';
    // import AneurysmForm from './AsymptomForm/AneurysmForm.vue';

    // variables
    const child = ref(null);
    const disName = ref('');
    const chooseDisName = ref('');

    const selectedDisease = ref('デフォルト');
    const diseases = ref(['デフォルト', 'ICS', '動脈瘤', '脳梗塞', '脳出血', '三叉神経痛', '顔面痙攣', '慢性硬膜下血腫']);
    const complication = ref('なし');
    const complicationText = ref('');
    const additionalComment = ref('');

    const dischargeRoute = ref({ text: '2 家庭', value: '2' });
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
    const postmRS = ref({ text: 'mRS 0:正常', value: '0' });
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

    const outcome = ref('2');
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

    // methods
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
      };
      chooseDisName.value = diseaseMapping[selectedDisease.value] || null;
      return chooseDisName.value;
    };


    function createSummary() {
      
      const detailedDiseaseSummary = (selectedDisease.value === 'デフォルト')? '':child.value.getSummaryAtDischargeTextFromGrandChild();




      // outcomeの値に対応するtextを取得するcomputedプロパティ
      const outcomeText = (outcomeValue) => {
        const option = outcomeOptions.value.find(opt => opt.value === outcomeValue);
        return option ? option.text : '';
      };

      const SummaryElements = {
        // '経過': additionalComment.value +'\r\n',
        '合併症': complicationText.value,
        '退院時mRS': postmRS.value.text,
        '退院経路': dischargeRoute.value.text,
        '退院先': referralHospital.value.text,
        '転帰': outcomeText(outcome.value),
      };


      //SummaryElementsで空白な要素をを削除する。
      const summaryText = Object.entries(SummaryElements)
        .filter(([key, value]) => value && value.length !== 0 && value !== '\r\n')
        .map(([key, value]) => `${key}: ${value}`)
        .join(', ');

      console.log(summaryText)
      const commentText = (additionalComment.value)? additionalComment.value + '\r\n': '';
      return summary.value = '【入院経過】\r\n' + commentText + detailedDiseaseSummary  + '\r' + summaryText;
    }

    function textReplaced(title, element) {
      const replacedElement = (element)? element.replace(/\r?\n|\t/g, " "):'';
      return title + replacedElement;
    }

    defineExpose({
      chooseDisName,
    });


    watch(selectedDisease, () => {
      chooseDisNameF();
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
