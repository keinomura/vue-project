<template>
  <v-container ref="form" class="no-horizontal-scroll">
    <v-divider>術前情報</v-divider>
    <v-textarea v-model="preoperativeInformation" label="術前情報" outlined></v-textarea>
    <v-row>
      <v-radio-group v-model="operationType" label="手術種類" inline>
        <v-radio v-for="operationType in typeOfOperationOptions" :key="operationType" :label="operationType" :value="operationType"></v-radio>
      </v-radio-group>
    </v-row>
    <OperationSelectCard
      v-model:detailOperationOptions="detailOperationOptions"
      v-model:typeOfOperation="typeOfOperation1"
      v-model:typeOfOperationText="typeOfOperation1Text"

    />

    <OperationSelectCard v-if="operationType === 'combined surgery'"
      v-model:detailOperationOptions="detailEndovascularOperationOptions"
      v-model:typeOfOperation="typeOfOperation2"
      v-model:typeOfOperationText="typeOfOperation2Text"
    />

    <v-divider>麻酔</v-divider>
    <v-row align="end">
      <v-col cols="(anesthesia === 'その他') ? 8:12">
        <v-radio-group v-model="anesthesia" label="麻酔" inline>
          <v-radio v-for="anesthesiaType in ['局所麻酔', '局所麻酔＋沈静', '全身麻酔', 'その他']" :label="anesthesiaType" :value="anesthesiaType"/>
        </v-radio-group>
      </v-col>
      <v-col cols="4" v-if="anesthesia === 'その他'">
        <v-text-field v-model="anesthesiaText" label="その他麻酔" outlined></v-text-field>
      </v-col>
    </v-row>

  <v-card v-if="operationType === 'open surgery'" elevation="3" >
    <v-tabs v-model="currentTab" fixed-tabs style="background-color: yellow;">
      <v-tab>{{ position }}</v-tab>
      <v-tab>{{ headPosition }}</v-tab>
      <v-tab>{{ headFlexion }} {{ headFlexionText }}</v-tab>
      <v-tab>側屈-{{ headLateralVending }} {{ headLateralVendingText }}</v-tab>
      <v-tab>回旋-{{ headRotation }} {{ headRotationText }}</v-tab>
    </v-tabs>

    <v-tabs-window v-model="currentTab">
      <v-tabs-window-item>
        <v-divider>体位</v-divider>
        <v-row align="end">
          <v-col cols="(position === 'その他') ? 7:12">
            <v-radio-group v-model="position" label="体位" inline>
              <v-radio v-for="positionType in ['仰臥位', '側臥位', '半側臥位', '腹臥位', '座位', 'その他']" :label="positionType" :value="positionType"/>
            </v-radio-group>
          </v-col>
          <v-col cols="5" v-if="position === 'その他'">
            <v-text-field v-model="positionText" label="その他体位" outlined></v-text-field>
          </v-col>
        </v-row>
      </v-tabs-window-item>

      <v-tabs-window-item>
        <v-divider>頭部位置</v-divider>
        <v-row align="end">
          <v-col cols="7">
            <v-radio-group v-model="headPosition" label="頭部位置" inline>
              <v-radio v-for="headPositionType in ['Mayfield 3-pin', '馬蹄型', 'その他']" :label="headPositionType" :value="headPositionType"/>
            </v-radio-group>
          </v-col>
          <v-col cols="5">
            <v-text-field v-if="headPosition === 'その他'" v-model="headPositionText" label="その他頭部固定" outlined></v-text-field>
          </v-col>
        </v-row>
      </v-tabs-window-item>

      <!-- TODO:子コンポーネントにする。 -->
      <v-tabs-window-item>  
        <v-divider>屈曲</v-divider>
        <v-row align="center">
          <v-col cols="5">
            <v-radio-group v-model="headFlexion" label="屈曲" inline>
              <v-radio v-for="headFlexionType in ['自然位', '屈曲位', '伸展位']" :label="headFlexionType" :value="headFlexionType"/>
            </v-radio-group>
          </v-col>
          <v-col cols="2">
            <h2>{{ Math.floor(Number(headFlexionText)) }}°</h2>
          </v-col>
          <v-col cols="5">
            <v-slider
              v-model="headFlexionText"
              v-bind="sliderVariables[0]"
            ></v-slider>
          </v-col>
        </v-row>
      </v-tabs-window-item>

      <v-tabs-window-item>
        <v-divider>側屈</v-divider>
        <v-row align="center">
          <v-col cols="5">
            <v-radio-group v-model="headLateralVending" label="側屈" inline>
              <v-radio v-for="headLateralVendingType in ['なし', '健側', '患側']" :label="headLateralVendingType" :value="headLateralVendingType"/>
            </v-radio-group>
          </v-col>
          <v-col cols="2">
            <h2>{{ Math.floor(Number(headLateralVendingText)) }}°</h2>
          </v-col>
          <v-col cols="5">
            <v-slider v-model="headLateralVendingText" v-bind="sliderVariables[1]"></v-slider>
          </v-col>
        </v-row>
      </v-tabs-window-item>

      <v-tabs-window-item>
        <v-divider>回旋</v-divider>
        <v-row align="center">
          <v-col cols="5">
            <v-radio-group v-model="headRotation" label="回旋" inline>
              <v-radio v-for="headRotationType in ['なし', '健側', '患側']" :label="headRotationType" :value="headRotationType"/>
            </v-radio-group>
          </v-col>
          <v-col cols="2">
            <h2>{{ Math.floor(Number(headRotationText)) }}°</h2>
          </v-col>
          <v-col cols="5">
            <v-slider
              v-model="headRotationText"
              v-bind="sliderVariables[2]"
            ></v-slider>
          </v-col>
        </v-row>
      </v-tabs-window-item>
    </v-tabs-window>
  </v-card>

    <!-- 手術開始時間入力 -->
    <TimeCalculation
      v-model:StartTime="operationStartTime"
      v-model:EndTime="operationEndTime"
      v-model:totalTime="operationTime"/>

    <component 
      is="componentByOperationType" 
      v-model:operationType="operationType"
      v-model:OpeRecordByType="OpeRecordByType"
      />
  </v-container>
</template>

  <script setup>
    import { ref, defineExpose, watch, shallowRef, markRaw } from 'vue';
    import OperationSelectCard from './OperationSelectCard.vue';
    import TimeCalculation from './OpeTimeInput.vue';

    // import OpenSurgeryForm from './OpenSurgeryForm.vue';

    // variables
    const operationType = ref('open surgery');
    const typeOfOperationOptions = ref(['open surgery', 'endovascular surgery', 'combined surgery']);
    const detailOperationOptions = ref('');
    const detailOpenOperationOptions = ref({
      'burr hole': ['CSDH', '脳室ドレナージ'],
      'MVD': ['TN', 'HFS', '舌咽神経痛'],
      'shunt': ['V-P shunt', 'L-P shunt'],
      'Craniotomy': ['Clipping', 'Tumor', '開頭血腫除去術', '減圧開頭', 'AVM'],
      'others': ['STA-MCA bypass', 'その他']
    })
    const detailEndovascularOperationOptions = ref({
      'ICS': ['CAS', 'PTA'],
      'Aneurysm': ['Coil', 'FD'],
      'ACI': ['MT'],
      'For SAH': ['PTA', 'エリル動注'],
      'AVM': ['TAE', 'TVE', 'combined'],
      'others': ['Tumor embolization', 'MMA embolization', 'その他']
    })
    watch (operationType, (newVal) => {
      detailOperationOptions.value =
        (newVal === 'open surgery' || newVal === 'combined surgery')? detailOpenOperationOptions.value:
        (newVal === 'endovascular surgery')? detailEndovascularOperationOptions.value: '';
    }, { immediate: true });

    const preoperativeInformation = ref('');

    const typeOfOperation1 = ref('');
    const typeOfOperation1Text = ref('');
    const typeOfOperation2 = ref('');
    const typeOfOperation2Text = ref('');
    const currentTab = ref('0');

    const anesthesia = ref('局所麻酔');
    const anesthesiaText = ref('');

    const operationStartTime = ref('13:00');
    const operationEndTime = ref('16:00');
    const operationTime = ref('');

    const position = ref('仰臥位');
    const positionText = ref('');
    const headPosition = ref('Mayfield 3-pin');
    const headPositionText = ref('');
    const headFlexion = ref('自然位');
    const headFlexionText = ref('');
    const headLateralVending = ref('なし');
    const headLateralVendingText = ref('');
    const headRotation = ref('なし');
    const headRotationText = ref('');
    const sliderVariables = [
      { max: 90, color: 'blue', thumbColor: 'blue', trackColor: 'light-blue' },
      { max: 90, color: 'green', thumbColor: 'green', trackColor: 'light-green' },
      {  max: 90, color: 'orange', thumbColor: 'orange', trackColor: 'orange-lighten-1' },
    ];

    const componentByOperationType = ref(null);
    const OpeRecordByType = ref(null);
    // watch(() => operationType.value, (newVal) => {
    //   if (newVal === 'open surgery') {
    //     componentByOperationType.value = markRaw(OpenSurgeryForm);
    //   } else if (newVal === 'endovascular surgery') {
    //     componentByOperationType.value = markRaw(EndovascularSurgeryForm);
    //   } else if (newVal === 'combined surgery') {
    //     componentByOperationType.value = markRaw(CombinedSurgeryForm);
    //   } else {
    //     componentByOperationType.value = null;
    //   }
    // }, { immediate: true });




    function createSummary() {
      const detailedDiseaseSummary = (selectedDisease.value === 'デフォルト')? '':child.value.getSummaryAtDischargeTextFromGrandChild();




      // outcomeの値に対応するtextを取得するcomputedプロパティ
      const outcomeText = (outcomeValue) => {
        const option = outcomeOptions.value.find(opt => opt.value === outcomeValue);
        return option ? option.text : '';
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
      createSummary
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
