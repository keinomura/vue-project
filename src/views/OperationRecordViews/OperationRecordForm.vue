<template>
  <v-container ref="form" class="no-horizontal-scroll">
    <v-row>
      <v-radio-group v-model="operationType" label="手術種類" inline>
        <v-radio v-for="operationType in typeOfOperationOptions" :key="operationType" :label="operationType" :value="operationType"></v-radio>
      </v-radio-group>
    </v-row>

    <!-- 手術種類1 -->
     <v-container>
      <v-row>
        <v-radio-group v-model="typeOfOperation1" label="手術種類" inline>
          <v-radio v-for="typeOfOperation1 in typeOfOperationOptions1" :key="typeOfOperation1" :label="typeOfOperation1" :value="typeOfOperation1"></v-radio>
        </v-radio-group>
      </v-row>
      <v-row>
        <v-text-field v-if="typeOfOperation1 === 'その他'"
        v-model="typeOfOperation1Text" label="その他手術種類" outlined></v-text-field>
      </v-row>
    </v-container>
    <!-- 手術種類2 combined operationの時だけ-->
    <v-container v-if="operationType === 'combined surgery'">
      <v-row>
        <v-radio-group v-model="typeOfOperation2" label="手術種類" inline>
          <v-radio v-for="typeOfOperation2 in typeOfEndovascularSurgeryOptions" :key="typeOfOperation2" :label="typeOfOperation2" :value="typeOfOperation2"></v-radio>
        </v-radio-group>
      </v-row>
      <v-row>
        <v-text-field v-if="typeOfOperation2 === 'その他'"
        v-model="typeOfOperation2Text" label="その他手術種類" outlined></v-text-field>
      </v-row>
    </v-container>

    <v-divider>術前情報</v-divider>
    <v-textarea v-model="preoperativeInformation" label="術前情報" outlined></v-textarea>
    
    <v-divider>手術詳細</v-divider>


    <!-- 疾患によって切り換えるcomponent -->
    <!-- <v-col cols="12">
      <component :is="selectedDiseaseComponent" ref="child" :disNameSelected="chooseDisName"></component>
    </v-col> -->

       <!-- 手術開始時間入力 -->
    <!-- 1. 手術開始時間 入力(時間入力) 2桁入力で制限、入力されたら次の入力欄にフォーカス -->
     <v-row>
      <v-col>
        <h3>手術開始時間</h3>
        <v-time-picker
          format="24hr"
          v-model="operationStartTime"
          label="手術開始時間"
        ></v-time-picker>
      </v-col>
      <v-col>
        <h3>手術終了時間</h3>
        <v-time-picker
          format="24hr"
          v-model="operationEndTime"
          label="手術終了時間"
        ></v-time-picker>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <h3>総手術時間{{ operationTime }}</h3>
      </v-col>
    </v-row>





        </v-container>

  </template>

  <script setup>
    import { ref, defineExpose, watch, shallowRef, markRaw } from 'vue';
    import { VTimePicker } from 'vuetify/labs/VTimePicker'

    // import SelectionSummaryType from './SelectOperationTypeForm.vue';

    // variables
    const operationType = ref('open surgery');
  
    const typeOfOperationOptions = ref(['open surgery', 'endovascular surgery', 'combined surgery']);
    const typeOfOpenSurgeryOptions = ref(['TN', 'HFS', 'CSDH', 'Clipping', '開頭血腫除去', '減圧開頭術', '腫瘍摘出術', 'その他']);
    const typeOfEndovascularSurgeryOptions = ref(['Coiling', 'Stent', 'その他']);


    const typeOfOperationOptions1 = ref(['open surgery', 'endovascular surgery', 'combined surgery']);
    const typeOfOperation1 = ref('');
    watch(() => operationType.value, (newVal) => {
      typeOfOperationOptions1.value = 
        (newVal === 'open surgery' || newVal === 'combined surgery')? typeOfOpenSurgeryOptions.value:  
        (newVal === 'endovascular surgery')? typeOfEndovascularSurgeryOptions.value: '';
    }, { immediate: true });


    const typeOfOperation1Text = ref('');
    const typeOfOperation2 = ref('');
    const typeOfOperation2Text = ref('');
    const preoperativeInformation = ref('');
    const operationStartDate = ref('');

    const operationStartTime = ref('13:00');
    const operationEndTime = ref('16:00');
    const operationTime = ref('');

    const calculateOperationTime = () => {
      const startTime = operationStartTime.value.split(':');
      const endTime = operationEndTime.value.split(':');
      const startHour = parseInt(startTime[0], 10);
      const startMinute = parseInt(startTime[1], 10);
      const endHour = parseInt(endTime[0], 10);
      const endMinute = parseInt(endTime[1], 10);
      const start = startHour * 60 + startMinute;
      const end = endHour * 60 + endMinute;
      const time = end - start;
      let hour = Math.floor(time / 60);
      hour = (hour < 0) ? hour + 24 : hour;
      let minute = time % 60;
      //minuteは二桁表示
      let minuteStr = minute.toString();
      minute = (minuteStr.length === 1) ? '0' + minuteStr : minuteStr;
      operationTime.value = `${hour}:${minute}`;
    };
    watch(() => [operationStartTime.value, operationEndTime.value], () => {
      calculateOperationTime(); 
    }, { immediate: true });

    const time = ref('');
    const timeStep = ref('');



    const allowedHours = v => v % 2;
    const allowedMinutes= v => v >= 10 && v <= 50;
    const allowedStep= m => m % 10 === 0;

    // variables Options


    function validateAndFocus(refValue, nextInputRef) {
      const value = parseInt(refValue.value, 10);
      if (value >= 0 && value <= 24) {
        refValue.value = value;
        nextTick(() => {
          const nextInput = refs[nextInputRef];
          if (nextInput) {
            nextInput.focus();
          }
        });
      } else {
        refValue.value = '';
  }
}


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
    // function selectedDiseaseComponent() {
    //   if (selectedDisease.value === 'デフォルト'){
    //     return null;
    //    } else {
    //     return SelectionSummaryType;
    //    }
    // };




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
