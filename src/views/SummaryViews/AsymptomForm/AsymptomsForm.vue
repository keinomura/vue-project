<template>
    <div style="background-color: lightblue">
      //病側 左右両方 Checkbox
      <v-checkbox v-model="lesionSide" label="左" value="左"></v-checkbox>
      <v-checkbox v-model="lesionSide" label="右" value="右"></v-checkbox>
      <v-checkbox v-model="lesionSide" label="両側" value="両側"></v-checkbox>

      <div v-if="disName === 'ICS'">
        <div v-if="lesionSide.includes('右')||lesionSide.includes('両側')">
          <!--右側病変-->
          <v-col>
            <span>右側病変</span>
          </v-col>
          <!--症候性、無症候性 radiobutton-->
          <v-radio-group v-model="symptomaticRight" label="症候性" inline>
            <v-radio label="症候性" value="症候性"></v-radio>
            <v-radio label="無症候性" value="無症候性"></v-radio>
          </v-radio-group>
          <!--CAS:プラーク性状 テキスト入力-->
          <v-text-field v-model="plaqueCharacterRight" label="プラーク性状"></v-text-field>
          <!--CAS:NASCET %数値入力-->
          <v-text-field v-model="nascetRight" label="NASCET %"></v-text-field>
          <!--CAS:Echo エコー所見テキスト入力-->
          <v-text-field v-model="echoFindingsRight" label="Echo エコー所見"></v-text-field>
          <!--CAS:Vmax-->
          <v-text-field v-model="vmaxRight" label="Vmax"></v-text-field>
          <!--CAS:潰瘍性病変 有無-->
          <v-radio-group v-model="ulcerativeLesionRight" label="潰瘍性病変" inline>
            <v-radio label="あり" value="あり"></v-radio>
            <v-radio label="なし" value="なし"></v-radio>
          </v-radio-group>
        </div>

        <div v-if="lesionSide.includes('左')||lesionSide.includes('両側')">
          <!--左側病変-->
          <v-col>
            <span>左側病変</span>
          </v-col>
          <!--症候性、無症候性 radiobutton-->
          <v-radio-group v-model="symptomaticLeft" label="症候性" inline>
            <v-radio label="症候性" value="症候性"></v-radio>
            <v-radio label="無症候性" value="無症候性"></v-radio>
          </v-radio-group>
          <!--CAS:プラーク性状 テキスト入力-->
          <v-text-field v-model="plaqueCharacterLeft" label="プラーク性状"></v-text-field>
          <!--CAS:NASCET %数値入力-->
          <v-text-field v-model="nascetLeft" label="NASCET %"></v-text-field>
          <!--CAS:Echo エコー所見テキスト入力-->
          <v-text-field v-model="echoFindingsLeft" label="Echo エコー所見"></v-text-field>
          <!--CAS:Vmax-->
          <v-text-field v-model="vmaxLeft" label="Vmax"></v-text-field>
          <!--CAS:潰瘍性病変 有無-->
          <v-radio-group v-model="ulcerativeLesionLeft" label="潰瘍性病変" inline>
            <v-radio label="あり" value="あり"></v-radio>
            <v-radio label="なし" value="なし"></v-radio>
          </v-radio-group>
        </div>
      </div>

      //Coil
      <div v-if="disName === 'Aneurysm'">
        //Coil:右病変
        <div v-if="lesionSide === '右'||lesionSide === '両側'">
          //Aneurysm部位を v-selectで選択 変数aneurysmLocationOptionsから選択肢を取得 aneurysmLocation:[]に格納。labelは"部位"
          <v-select v-model="aneurysmLocationRight" :items="aneurysmLocationOptions" label="部位"></v-select>
          //選択肢にその他が含まれている場合はフリー入力
          <v-text-field v-if="aneurysmLocationRight === 'その他'" v-model="aneurysmLocationRightText" label="複数個ある場合は','で区切って"></v-text-field>
        </div>
        //Coil:左病変
        <div v-if="lesionSide === '左'||lesionSide === '両側'">
          //Aneurysm部位を v-selectで選択 変数aneurysmLocationOptionsから選択肢を取得 aneurysmLocation:[]に格納。labelは"部位"
          <v-select v-model="aneurysmLocationLeft" :items="aneurysmLocationOptions" label="部位"></v-select>
          //選択肢にその他が含まれている場合はフリー入力
          <v-text-field v-if="aneurysmLocationLeft === 'その他'" v-model="aneurysmLocationLeftText" label="複数個ある場合は','で区切って"></v-text-field>
        </div>
        //Coil:今回治療病変 変数aneurysmLocationRight,aneurysmLocationLeftに含まれている選択肢の部位を一覧にする。かつCheckboxで選択できるようにする
          <v-select v-model="treatedAneurysmLocation" :items="treatedAneurysmLocationOptions" label="今回治療病変" multiple></v-select>
        //Coil:病変大きさ テキスト入力--
          <v-text-field v-model="aneurysmSize" label="病変大きさ"></v-text-field>
      </div>
      //備考 テキストボックス
      <v-textarea v-model="additionalNotes" label="備考"></v-textarea>
      //手術有無
      //手術日
      <v-row>
        <v-radio-group v-model="operation" label="今回手術" inline>
          <v-radio label="あり" value="あり"></v-radio>
          <v-radio label="なし" value="なし"></v-radio>
        </v-radio-group>
      </v-row>
  
      <v-row v-if="operation === 'あり'">
        <v-col cols="6">
          <span class="ma-2">今回手術予定日</span>
          <v-date-picker v-model="scheduledSurgeryDate" style="background-color: greenyellow;"></v-date-picker>
        </v-col>
      </v-row>
  
      <v-row cols="12" v-if="operation === 'あり'">
        <v-radio-group v-model="recurrence" label="今回手術は" inline>
          <v-radio label="初発" value="初発"></v-radio>
          <v-radio label="再発" value="再発"></v-radio>
        </v-radio-group>
      </v-row>
  
      <v-row v-if="recurrence === '再発'"> 
        <v-col cols="12">
          <span>発症前回手術から</span>{{ periodFromLastSurgery }} // TODO: 表示されないエラー
        </v-col>
        <v-col cols="8">
          <v-row v-for="(surgery, index) in previousSurgeries" :key="index">
            <v-col cols="4">
              <v-select v-model="surgery.year" :items="years" label="前回手術年" @update:modelValue="calculatePeriodFromLastSurgery"></v-select>
            </v-col>
            <v-col cols="4">
              <v-select v-model="surgery.month" :items="[''].concat(months)" label="前回手術月" @update:modelValue="calculatePeriodFromLastSurgery"></v-select>
            </v-col>
            <v-col cols="1">
              <v-btn @click="removeSurgery(index)">削除</v-btn>
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="8">
          <v-btn @click="addSurgery" class="ma-2">手術を追加</v-btn>
        </v-col>
      </v-row>
    </div>
  </template>
  
  <script setup>
  import { ref, watch } from 'vue';
  
  // Props
  const props = defineProps({
    disName: String,
  });
  

  // Data
  const lesionSide = ref([]);
  const symptomaticRight = ref('');
  const symptomaticLeft = ref('');
  const plaqueCharacterRight = ref('');
  const plaqueCharacterLeft = ref('');
  const nascetRight = ref('');
  const nascetLeft = ref('');
  const echoFindingsRight = ref('');
  const echoFindingsLeft = ref('');
  const vmaxRight = ref('');
  const vmaxLeft = ref('');
  const ulcerativeLesionRight = ref('');
  const ulcerativeLesionLeft = ref('');
  const aneurysmLocationRight = ref('');
  const aneurysmLocationLeft = ref('');
  const treatedAneurysmLocationOptions = ref([]);
  const treatedAneurysmLocation = ref([]);
  const aneurysmSize = ref('');
  const additionalNotes = ref('');
  const scheduledSurgeryDate = ref([]);
  const recurrence = ref('初発');
  const previousSurgeries = ref(recurrence.value === '再発' ? [{ year: '', month: '' }] : []);
  const periodFromLastSurgery = ref('');

  const painArea = ref([]);
  const painAreasOption = ref(['V1', 'V2', 'V3']);
  const operation = ref('あり');
  const periodFromOnsetToSurgery = ref('');
  const onsetYear = ref(null);
  const onsetMonth = ref(null);
  const dentalTreatmentHistory = ref('');
  const preSurgeryMedications = ref([]);
  const botoxTreatment = ref('');
  const botoxYear = ref(null);
  const botoxMonth = ref(null);
  
  //options
  const aneurysmLocationOptions = ref(['IC-Pcom', 'IC-Ant.chor.A','IC-bif','MCA:M1', 'MCA:M1-2','ACom', 'A1-2', 'BA-Tip', 'BA-SCA', 'VA-PICA', 'VA', 'その他']);


  const years = ref(Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i));
  const months = ref(Array.from({ length: 12 }, (_, i) => i + 1));
  
  const addSurgery = () => {
    previousSurgeries.value.push({ year: '', month: '' });
  };
  
  const removeSurgery = (index) => {
    previousSurgeries.value.splice(index, 1);
  };


  const addMedication = () => {
    preSurgeryMedications.value.push({ name: '', dosage: '' });
  };
  
  const removeMedication = (index) => {
    preSurgeryMedications.value.splice(index, 1);
  };
  
  const calculatePeriodBetweenDates = (date1, date2) => {
    const diffTime = Math.abs(date2 - date1);
    const diffYears = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 365));
    const diffMonths = Math.floor((diffTime % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24 * 30));
    return { diffYears, diffMonths };
  };
  
  const calculatePeriodFromOnsetToSurgery = () => {
    if (scheduledSurgeryDate.value.length !== 0 && onsetYear.value) {
      const onsetDate = new Date(onsetYear.value, onsetMonth.value ? onsetMonth.value - 1 : 0);
      const surgeryDate = new Date(scheduledSurgeryDate.value);
      const { diffYears, diffMonths } = calculatePeriodBetweenDates(onsetDate, surgeryDate);
      periodFromOnsetToSurgery.value = `${diffYears}年${onsetMonth.value ? diffMonths + 'ヶ月' : ''}`;
    } else {
      periodFromOnsetToSurgery.value = '';
    }
  };
  
  const calculatePeriodFromLastSurgery = () => {
    //previousSurgeries.valueの最後の手術日と今回の手術日の差を計算
    // previousSurgeries.valueの中は手術日が必ずしも降順になっていない。並び替えて最も新しい手術日を取得する
    // previousSurgeries.valueを直接並び替えると、Vueがリアクティブに反応して入力中に順番が入れ替わってしまうので入力ミスが起きる。新しい配列を作成して代入する
    const sortedPreviousSurgeries = [...previousSurgeries.value].sort((a, b) => {
      if (a.year > b.year) {
        return -1;
      } else if (a.year < b.year) {
        return 1;
      } else {
        return a.month > b.month ? -1 : 1;
      }
    });

    if (scheduledSurgeryDate.value.length !== 0 && sortedPreviousSurgeries[0].year > 1980) {
      const lastSurgeryDate = new Date(sortedPreviousSurgeries[0].year, sortedPreviousSurgeries[0].month ? sortedPreviousSurgeries[0].month - 1 : 0);
      const surgeryDate = new Date(scheduledSurgeryDate.value);
      const { diffYears, diffMonths } = calculatePeriodBetweenDates(lastSurgeryDate, surgeryDate);
      periodFromLastSurgery.value = `${diffYears}年${diffMonths}ヶ月`;
    } else {
      periodFromLastSurgery.value = '';
    }

  };
  
  const getSummaryOfMVD = () => {
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

    const getPreviousSurgeriesText = () => {
      if (previousSurgeries.value.length === 0) {
      return '';
      } else {
      return previousSurgeries.value.map((surgery) => {
        return `${surgery.year}/${surgery.month}`;
      }).join(',');
      }
    };

    const getPreSurgeryMedicationsText = () => {
      if (preSurgeryMedications.value.length === 0) {
      return '';
      } else {
      return preSurgeryMedications.value.map((medication) => {
        return `${medication.name} ${medication.dosage}`;
      }).join(',');
      }
    };

    const mvdSummary = {
      '病側': lesionSide.value,
      '部位': painArea.value,
      '手術日': scheduledSurgeryDate.value ? formatDate(scheduledSurgeryDate.value) : null,
      '今回手術は': recurrence.value,
      '発症から手術まで': periodFromOnsetToSurgery.value,
      '発症年月': onsetYear.value  ? `${onsetYear.value}/${onsetMonth.value ? onsetMonth.value : ''}` : null,
      '手術既往': getPreviousSurgeriesText(),
      '前回手術から今回手術まで': periodFromLastSurgery.value,
      '歯科治療': dentalTreatmentHistory.value,
      '術前治療薬': getPreSurgeryMedicationsText(),
      '備考': additionalNotes.value,
      'ボトックス治療': botoxTreatment.value,
      'ボトックス開始年月': botoxYear.value  ? `${botoxYear.value}/${botoxMonth.value ? botoxMonth.value : ''}` : null,

    };

    const filteredMvdSummary = Object.fromEntries(
      Object.entries(mvdSummary).filter(([key, value]) => value != null && value !== '' && value !== undefined && value.length !== 0)
    );

    const summaryText = Object.entries(filteredMvdSummary)
    .map(([key, value]) => `${key}: ${value}`)
    .join(',');

  return summaryText; 
    };

  // "defineExpose"を使用して、外部から参照できるプロパティを定義する
  defineExpose({
    getSummaryOfMVD,
  });

  watch (operation, (newVal) => {
    if (newVal === 'なし') {
      scheduledSurgeryDate.value = [];
      recurrence.value = '';
      previousSurgeries.value = [];
      preSurgeryMedications.value = [];
    }
  });

  watch(onsetYear, calculatePeriodFromOnsetToSurgery);
  watch(onsetMonth, calculatePeriodFromOnsetToSurgery);
  watch(scheduledSurgeryDate, () => {
    calculatePeriodFromOnsetToSurgery();
    if (previousSurgeries.value.length !== 0){
      calculatePeriodFromLastSurgery();
    }
  });
  
  watch(recurrence, (newVal) => {
    if (newVal === '初発') {
      previousSurgeries.value = [];
    } else if (newVal === '再発') {
      previousSurgeries.value = [{ year: '', month: '' }];
    }
  });

  watch(botoxTreatment, (newVal) => {
    if (newVal === 'なし') {
      botoxYear.value = null;
      botoxMonth.value = null;
    }
  });

  </script>

  <style scoped>
  /* Add your styles here */
  </style>