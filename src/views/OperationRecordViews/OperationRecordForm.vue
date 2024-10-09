<template>
  <v-container ref="form" class="no-horizontal-scroll">
    <v-divider>術前情報</v-divider>
    <v-textarea v-model="preoperativeInformation" label="術前情報" outlined></v-textarea>
    <v-row>
      <v-radio-group v-model="operationType" label="手術種類" inline>
        <v-radio v-for="operationType in ['open surgery', 'endovascular surgery']" :key="operationType" :label="operationType" :value="operationType"></v-radio>
      </v-radio-group>
    </v-row>


    <OperationSelectCard
      v-model:detailOperationOptions="detailOperationOptions"
      v-model:typeOfOperation="typeOfOperation1"
      v-model:typeOfOperationText="typeOfOperation1Text"
    />
    <v-card class="my-2" v-if="typeOfOperation1 === 'その他'">
      <v-textarea v-model="detailOperationForElse" label="手術詳細" rows="10" outlined></v-textarea>
    </v-card>

    <!-- <OperationSelectCard v-if="operationType === 'combined surgery'"
      v-model:detailOperationOptions="detailEndovascularOperationOptions"
      v-model:typeOfOperation="typeOfOperation2"
      v-model:typeOfOperationText="typeOfOperation2Text"
    /> -->

    <component :is="componentByOperationType" 
      v-model:operationType="typeOfOperationForSummary"
      v-model:AnesthesiaHeadPosition="AnesthesiaHeadPositionFromChild"
      ref="childOfOperationRecord"
      />
      <v-card class="my-2">
    <v-row align="end">
      <v-col cols="(anesthesia === 'その他') ? 8:12">
        <v-radio-group v-model="anesthesia" label="麻酔" inline>
          <v-radio v-for="anesthesiaType in ['局所麻酔', '局所麻酔＋鎮静', '全身麻酔', 'その他']" :label="anesthesiaType" :value="anesthesiaType"/>
        </v-radio-group>
      </v-col>
      <v-col cols="4" v-if="anesthesia === 'その他'">
        <v-text-field v-model="anesthesiaText" label="その他麻酔" outlined></v-text-field>
      </v-col>
    </v-row>
  </v-card>

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
  </v-container>
</template>

  <script setup>
    import { ref, defineExpose, watch, shallowRef, markRaw } from 'vue';
    import dayjs from 'dayjs';
    // dayjs().format();

    import OperationSelectCard from './OperationSelectCard.vue';
    import TimeCalculation from './OpeTimeInput.vue';

    import BurrHoleSurgery from './OpenSurgeryViews/BurrHoleViews/BurrHoleSurgery.vue';
    import MVDSurgery from './OpenSurgeryViews/MVDViews/MVDSurgery.vue';
    import ShuntSurgery from './OpenSurgeryViews/ShuntViews/ShuntSurgery.vue';
    import ClippingSurgery from './OpenSurgeryViews/CraniotomyViews/ClippingSurgery.vue';
    import CraniotomySurgery from './OpenSurgeryViews/CraniotomyViews/CraniotomySurgery.vue';
    import EndovascularSurgery from './EndVascularSurgeryViews/EndvascularSurgeryViews.vue';

    //define props
    const childOfOperationRecord = ref(null);

    // variables
    const operationType = ref('open surgery');
    const detailOperationOptions = ref('');
    const detailOpenOperationOptions = ref({
      'burr hole': ['CSDH', '脳室ドレナージ'],
      'MVD': ['TN', 'HFS', '舌咽神経痛', 'NVC複数合併例'],
      'shunt': ['V-P shunt', 'L-P shunt'],
      'Craniotomy': ['Clipping', 'Tumor', '開頭血腫除去術', '減圧開頭', 'AVM'],
      'others': ['その他']
    })
    const detailEndovascularOperationOptions = ref({
      'ICS': ['CAS', 'PTA'],
      'Aneurysm': ['Coil', 'FD'],
      'AIS': ['MT'],
      'For Spasm': ['PTA エリル動注'],
      'others': ['その他 血管内手術']
    })
    const detailOperationForElse = ref('');
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

    const position = ref('');
    const positionText = ref('');
    const headPosition = ref('');
    const headPositionText = ref('');
    const headFlexion = ref('');
    const headFlexionText = ref('');
    const headLateralVending = ref('');
    const headLateralVendingText = ref('');
    const headRotation = ref('');
    const headRotationText = ref('');
    const sliderVariables = [
      { max: 90, color: 'blue', thumbColor: 'blue', trackColor: 'light-blue' },
      { max: 90, color: 'green', thumbColor: 'green', trackColor: 'light-green' },
      {  max: 90, color: 'orange', thumbColor: 'orange', trackColor: 'orange-lighten-1' },
    ];

    const AnesthesiaHeadPositionFromChild = ref({})
    watch (AnesthesiaHeadPositionFromChild, () =>{
      anesthesia.value = AnesthesiaHeadPositionFromChild.value.anesthesia;
      position.value = AnesthesiaHeadPositionFromChild.value.bodyPosition;
      headPosition.value = AnesthesiaHeadPositionFromChild.value.headPosition;
      headFlexion.value = AnesthesiaHeadPositionFromChild.value.headFlexion;
      headFlexionText.value = AnesthesiaHeadPositionFromChild.value.headFlexionDegree;
      headLateralVending.value = AnesthesiaHeadPositionFromChild.value.headLateralFlexion;
      headLateralVendingText.value = AnesthesiaHeadPositionFromChild.value.headLateralFlexionDegree;
      headRotation.value = AnesthesiaHeadPositionFromChild.value.headRotation;
      headRotationText.value = AnesthesiaHeadPositionFromChild.value.headRotationDegree
    }, { immediate: true, deep: true });

    const typeOfOperationForSummary = ref('');
    watch(() => typeOfOperation1.value, (newVal) => {
      typeOfOperationForSummary.value = (newVal === 'その他')? typeOfOperation1Text.value: newVal;
    });
    const componentByOperationType = ref('');
    const OpeRecordByType = ref('');
    watch(() => typeOfOperationForSummary.value, (newVal) => {
      if (newVal === 'CSDH' || newVal === '脳室ドレナージ') {
        componentByOperationType.value = markRaw(BurrHoleSurgery);
      } else if (newVal === 'TN' || newVal === 'HFS' || newVal === '舌咽神経痛' || newVal === 'NVC複数合併例') {
        componentByOperationType.value = markRaw(MVDSurgery);
      } else if (newVal === 'V-P shunt' || newVal === 'L-P shunt') {
        componentByOperationType.value = markRaw(ShuntSurgery);
      } else if (newVal === 'Clipping') {
        componentByOperationType.value = markRaw(ClippingSurgery);
      } else if (newVal === 'Tumor' || newVal === '開頭血腫除去術' || newVal === '減圧開頭' || newVal === 'AVM') {
        componentByOperationType.value = markRaw(CraniotomySurgery);
      } else if (['CAS', 'PTA', 'Coil', 'FD', 'MT', 'PTA エリル動注', 'その他 血管内手術'].includes(newVal)) {
        componentByOperationType.value = markRaw(EndovascularSurgery);
      } else {
        componentByOperationType.value = null;
      }
    }, { immediate: true });


    // const childOfOperationRecord = ref(null);

    function createSummary() {

      const preOpeInfo = (preoperativeInformation.value)? '【術前情報】' + preoperativeInformation.value + '\r\n\r\n': '';
      const operationPositionItems = {
        '体位': (position.value==='その他')? positionText.value: position.value,
        '頭部固定': (headPosition.value === 'その他')? headPositionText.value: headPosition.value,
        '頭部屈曲': (headFlexion.value !== '自然位')? headFlexion.value + headFlexionText.value +'°': '',
        '頭部側屈': (headLateralVending.value !== 'なし')? headLateralVending.value + headLateralVendingText.value +'°': '',
        '頭部回旋': (headRotation.value !== 'なし')? headRotation.value + headRotationText.value +'°': '',
      };


      const operationTimes = (typeOfOperation1.value === 'MT')? 
      {
        '手術開始時間': operationStartTime.value,
        '再灌流時間': getReperfusionTime(),
        '手術終了時間': operationEndTime.value,
        '手術時間': calculateOperationDuration(operationStartTime.value, operationEndTime.value),
        'puncture to reperfusion':calculateOperationDuration(operationStartTime.value, getReperfusionTime()),
      }:
      {
        '手術開始時間': operationStartTime.value,
        '手術終了時間': operationEndTime.value,
        '手術時間': calculateOperationDuration(operationStartTime.value, operationEndTime.value),
      }


      function calculateOperationDuration (startTime, endTime){
        const today = dayjs().format('YYYY-MM-DD');
        const start = dayjs(`${today}T${startTime}`);
        let end = dayjs(`${today}T${endTime}`);

        // 終了時間が開始時間より前の場合、終了時間の日付を1日増やす
        if (end.isBefore(start)) {
          end = end.add(1, 'day');
        }

        const duration = end.diff(start, 'minute'); // 分単位で差を計算
        //durationをhh:mm形式に変換
        const hour = Math.floor(duration / 60);
        //minuteはmm形式に変換01, 02, 03
        const minute = ('0' + duration % 60).slice(-2);
       
        return `${hour}:${minute}`;
      };


      const anesthesiaItems = (anesthesia.value === 'その他')? anesthesiaText.value: anesthesia.value
      

      const detailSummary = (typeOfOperation1.value === 'その他')? detailOperationForElse.value: childOfOperationRecord.value.createRecordForEachOperation();

      function summaryText (Items) {
        const text = Object.entries(Items)
        .filter(([key, value]) => value && value.length !== 0 && value !== '\r\n')
        .map(([key, value]) => `${key}: ${value}`)
        .join(', ');
        return '{' + text + '}' + '\r\n';
      }

      function additionalInformation (operationPositionItems, operationTimes) {

        return (operationType.value === 'open surgery') ? 
        summaryText(operationPositionItems) + summaryText(operationTimes) + '\r\n':
        summaryText(operationTimes) + '\r\n'
      }


      return  preOpeInfo 
      + '麻酔:' + anesthesiaItems
      + '\n'
      // + summaryText(operationPositionItems)
      // + summaryText(operationTimes) + '\r\n'
      + additionalInformation(operationPositionItems, operationTimes)
      + detailSummary;
    }

    //MTの場合。
    function getReperfusionTime() {
      console.log('operationrecordformからEndovascularsurgeryviewsのgetReperfusionTime()呼び出し');
      console.log(typeOfOperation1.value);
      return childOfOperationRecord.value.getReperfusionTime();
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
