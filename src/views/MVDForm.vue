<template>
    <div>
      <v-radio-group v-model="lesionSide" label="病側" inline>
        <v-radio label="左" value="左"></v-radio>
        <v-radio label="右" value="右"></v-radio>
      </v-radio-group>
  
      <v-select
        v-if="showPainArea"
        v-model="painArea"
        :items="painAreasOption"
        label="痛みの領域"
        multiple
        inline
      ></v-select>
  
      <v-row>
        <v-col cols="4">
          <v-select v-model="onsetYear" :items="years" label="痛みの発症年"></v-select>
        </v-col>
        <v-col cols="4">
          <v-select v-model="onsetMonth" :items="[''].concat(months)" label="痛みの発症時期 月"></v-select>
        </v-col>
      </v-row>
  
      <v-row>
        <v-radio-group v-model="operation" label="今回手術" inline>
          <v-radio label="あり" value="あり"></v-radio>
          <v-radio label="なし" value="なし"></v-radio>
        </v-radio-group>
      </v-row>
  
      <v-row v-if="operation === 'あり'">
        <v-col cols="6">
          <span class="ma-2">今回手術予定日</span>
          <v-date-picker v-model="scheduledSurgeryDate"></v-date-picker>
        </v-col>
        <v-col cols="4">
          <span>発症から</span>{{ periodFromOnsetToSurgery }}
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
          <span>発症前回手術から</span>{{ periodFromLastSurgery }}
        </v-col>
        <v-col cols="8">
          <v-row v-for="(surgery, index) in previousSurgeries" :key="index">
            <v-col cols="4">
              <v-select v-model="surgery.year" :items="years" label="前回手術年"></v-select>
            </v-col>
            <v-col cols="4">
              <v-select v-model="surgery.month" :items="[''].concat(months)" label="前回手術月"></v-select>
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
  
      <v-radio-group v-if="showDentalHistory" v-model="dentalTreatmentHistory" label="痛みについての歯科治療歴" inline>
        <v-radio label="有り" value="有り"></v-radio>
        <v-radio label="無し" value="無し"></v-radio>
      </v-radio-group>
  
      <v-radio-group v-if="showBotoxTreatment" v-model="botoxTreatment" label="ボトックス治療の有無" inline>
        <v-radio label="有り" value="有り"></v-radio>
        <v-radio label="無し" value="無し"></v-radio>
      </v-radio-group>
  
      <v-row v-if="botoxTreatment === '有り'">
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
  
  // Props
  const props = defineProps({
    medications: Array,
    showPainArea: Boolean,
    showDentalHistory: Boolean,
    showBotoxTreatment: Boolean,
  });
  
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
  const dentalTreatmentHistory = ref('');
  const preSurgeryMedications = ref([]);
  const additionalNotes = ref('');
  const botoxTreatment = ref('');
  const botoxYear = ref(null);
  const botoxMonth = ref(null);
  
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
    if (scheduledSurgeryDate.value.length !== 0 && previousSurgeries.value[0].year > 1980) {
      const lastSurgeryDate = new Date(previousSurgeries.value[0].year, previousSurgeries.value[0].month ? previousSurgeries.value[0].month - 1 : 0);
      const surgeryDate = new Date(scheduledSurgeryDate.value);
      const { diffYears, diffMonths } = calculatePeriodBetweenDates(lastSurgeryDate, surgeryDate);
      periodFromLastSurgery.value = `${diffYears}年${diffMonths}ヶ月`;
    } else {
      periodFromLastSurgery.value = '';
    }
  };
  
  watch(operation, (newVal) => {
    if (newVal === 'なし') {
      recurrence.value = '初発';
      previousSurgeries.value = [];
      scheduledSurgeryDate.value = [];
    }
  });
  
  watch(recurrence, (newVal) => {
    if (newVal === '再発' && previousSurgeries.value.length === 0) {
      addSurgery();
    } else if (newVal === '初発') {
      previousSurgeries.value = [];
    }
  });
  
  watch([scheduledSurgeryDate, onsetYear, onsetMonth], calculatePeriodFromOnsetToSurgery);
  
  watch(previousSurgeries, (newSurgeries) => {
    newSurgeries.sort((b, a) => a.year - b.year || a.month - b.month);
    if (scheduledSurgeryDate.value.length !== 0) {
      calculatePeriodFromLastSurgery();
    }
  }, { deep: true });
  </script>
  
  <style scoped>
  /* Add your styles here */
  </style>