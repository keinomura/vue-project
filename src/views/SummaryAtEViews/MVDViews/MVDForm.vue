<template>
    <div style="background-color: greenyellow">
      <v-radio-group v-model="lesionSide" label="病側" inline>
        <v-radio v-for="side in ['左', '右']" :key="side" :label="side" :value="side"></v-radio>
      </v-radio-group>
  
      <v-select
        v-if="diseaseName === 'TN'"
        v-model="painArea"
        :items="painAreasOption"
        label="痛みの領域"
        multiple
        inline
      ></v-select>
  
      <v-row>
        <v-col cols="4">
          <v-select v-model="onsetYear" :items="years" label="発症年"></v-select>
        </v-col>
        <v-col cols="4">
          <v-select v-model="onsetMonth" :items="[''].concat(months)" label="発症時期 月"></v-select>
        </v-col>
      </v-row>
  
      <v-row>
        <v-radio-group v-model="operation" label="今回手術" inline>
          <v-radio v-for="ans in ['あり', 'なし']" :key="ans" :label="ans" :value="ans"></v-radio>
        </v-radio-group>
      </v-row>
  
      <v-row v-if="operation === 'あり'">
        <v-col cols="6">
          <span class="ma-2">今回手術予定日</span>
          <v-date-picker v-model="scheduledSurgeryDate" style="background-color: greenyellow;"></v-date-picker>
        </v-col>
        <v-col cols="4">
          <span>発症から</span>{{ periodFromOnsetToSurgery }}
        </v-col>
      </v-row>
  
      <v-row cols="12" v-if="operation === 'あり'">
        <v-radio-group v-model="recurrence" label="今回手術は" inline>
          <v-radio v-for="ans in ['初発', '再発']" :key="ans" :label="ans" :value="ans"></v-radio>
        </v-radio-group>
      </v-row>
  
      <v-row v-if="recurrence === '再発'"> 
        <v-col cols="12">
          <span>発症前回手術から</span>{{ periodFromLastSurgery }}
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
  
      <v-radio-group v-if="diseaseName === 'TN'" v-model="dentalTreatmentHistory" label="痛みについての歯科治療歴" inline>
        <v-radio label="あり" value="あり"></v-radio>
        <v-radio label="なし" value="なし"></v-radio>
      </v-radio-group>
  
      <v-radio-group v-if="diseaseName === 'HFS'" v-model="botoxTreatment" label="ボトックス治療の有無" inline>
        <v-radio label="あり" value="あり"></v-radio>
        <v-radio label="なし" value="なし"></v-radio>
      </v-radio-group>
  
      <v-row v-if="botoxTreatment === 'あり'"> 
        <v-col cols="4">
          <v-select v-model="botoxYear" :items="years" label="ボトックス治療開始年"></v-select>
        </v-col>
        <v-col cols="4">
          <v-select v-model="botoxMonth" :items="[''].concat(months)" label="ボトックス治療開始月"></v-select>
        </v-col>
      </v-row>
  
      <div v-if="operation === 'あり'">
        <span>手術直前内服量</span>
        <div v-for="(medication, index) in preSurgeryMedications" :key="index">
          <v-row>
            <v-col cols="6">
              <v-select v-model="medication.name" :items="medications" label="薬剤名"></v-select>
            </v-col>
            <v-col cols="3">
              <v-text-field v-model="medication.dosage" label="1日量"></v-text-field>
            </v-col>
            <v-col cols="2">
              <v-btn @click="removeMedication(index)">削除</v-btn>
            </v-col>
          </v-row>
        </div>
        <v-btn @click="addMedication" class="ma-2">薬剤を追加</v-btn>
        <v-textarea v-model="additionalNotes" label="追加のメモ"></v-textarea>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, watch } from 'vue';
  
//new
  const diseaseName = defineModel('diseaseName');
  
  const lesionSide = ref('左');
  const painArea = ref([]);
  const painAreasOption = ref(['V1', 'V2', 'V3']);
  const operation = ref('あり');
  const periodFromOnsetToSurgery = ref('');
  const recurrence = ref('初発');
  const onsetYear = ref(null);
  const onsetMonth = ref(null);
  const previousSurgeries = ref(recurrence.value === '再発' ? [{ year: '', month: '' }] : []);
  const scheduledSurgeryDate = ref([]);
  const periodFromLastSurgery = ref('');
  const dentalTreatmentHistory = ref('あり');
  const preSurgeryMedications = ref([]);
  const additionalNotes = ref('');
  const botoxTreatment = ref('');
  const botoxYear = ref(null);
  const botoxMonth = ref(null);

  const medications = ref([])

  watch(() => diseaseName.value, (newVal) => {
    if(diseaseName.value === 'TN'){
      medications.value = ['テグレトール（カルバマゼピン）', 'ビムパット（ラコサミド）', 'パキシル', 'ロキソニン', 'ガバペン', 'アレビアチン'];
    } 
    else if (diseaseName.value === 'HFS'){
      medications.value = ['リボトリール', 'ビムパット', 'テグレトール', 'セルシン'];
    }
  }, { immediate: true });



  const years = ref(Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i));
  const months = ref(Array.from({ length: 12 }, (_, i) => i + 1));
  
  // 前回手術の追加・削除
  const addSurgery = () => {
    previousSurgeries.value.push({ year: '', month: '' });
  };
  const removeSurgery = (index) => {
    previousSurgeries.value.splice(index, 1);
  };

  //術前薬剤の追加・削除
  const addMedication = () => {
    preSurgeryMedications.value.push({ name: '', dosage: '' });
  };
  const removeMedication = (index) => {
    preSurgeryMedications.value.splice(index, 1);
  };
  
  // 日付計算
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

  watch([() => onsetYear.value, () => onsetMonth.value], calculatePeriodFromOnsetToSurgery);

  watch(scheduledSurgeryDate, () => {
    calculatePeriodFromOnsetToSurgery();
    if (previousSurgeries.value.length !== 0){
      calculatePeriodFromLastSurgery();
    }
  }, {immediate: true, deep: true});
  
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