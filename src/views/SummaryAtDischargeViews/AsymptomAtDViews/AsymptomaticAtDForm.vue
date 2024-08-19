<template>
  <v-container style="background-color: lightblue">
    <v-row>
      <v-radio-group v-model="admissionPurpose" label="今回入院目的" inline>
        <v-radio label="精査" value="精査"></v-radio>
        <v-radio label="治療" value="治療"></v-radio>
        <v-radio label="その他" value="その他"></v-radio>
      </v-radio-group>
    </v-row>

<!-- 精査 -->
  <v-container v-if="admissionPurpose === '精査'">
    <v-textarea v-model="examinationFindings" label="検査所見"></v-textarea>

    <v-radio-group v-model="treatmentPlan" label="今後の治療方針" inline>
      <v-radio label="手術適応あり" value="手術適応あり"></v-radio>

      <v-radio label="経過観察 定期フォローアップ" value="経過観察 定期フォローアップ"></v-radio>
      <v-radio label="他院フォローアップ" value="他院フォローアップ"></v-radio>
      <v-radio label="要コンサルト" value="要コンサルト"></v-radio>
      <v-radio label="その他" value="その他"></v-radio>
    </v-radio-group>
    <v-row v-if="treatmentPlan === '手術適応あり'">
      <v-checkbox v-model="surgicalIndications" label="手術適応" value="手術適応"></v-checkbox>
      <v-checkbox v-model="surgicalIndications" label="血管内治療適応" value="血管内治療適応"></v-checkbox>
    </v-row>
    <v-text-field v-if="treatmentPlan === 'その他'" v-model="treatmentPlanText" label="その他"></v-text-field>
  </v-container>

<!-- 治療 -->
  <v-container v-if="admissionPurpose === '治療'">
    <v-textarea v-model="treatmentFindings" label="治療所見" ></v-textarea>
  </v-container>
  </v-container>


  </template>
  
  <script setup>
  import { ref, watch } from 'vue';
  
  // Props
  const props = defineProps({
    diseaseName: String,
  });
  

  // Data
  const admissionPurpose = ref('精査');
  const examinationFindings = ref('');
  const treatmentFindings =  ref('');

  watch(admissionPurpose.value, (newVal) => {
    if (newVal === '治療') {
      treatmentFindings.value = '予定通り、手術施行。経過良好にて退院となった。';
      examinationFindings.value = '';
    } else if (newVal === '精査') {
      treatmentFindings.value = '';
    }
  }, {immediate: true});

  const treatmentPlan = ref('手術適応あり');
  const surgicalIndications = ref([]);
  const treatmentPlanText = ref('');



  const lesionSide = ref(['右']);
  const symptomaticRight = ref('');
  const symptomaticLeft = ref('');
  const additionalNotes = ref('');
  const scheduledSurgeryDate = ref([]);
  const recurrence = ref('初発');
  const previousSurgeries = ref(recurrence.value === '再発' ? [{ year: '', month: '' }] : []);
  const periodFromLastSurgery = ref('');
  const operation = ref('あり');

  // CAS variables
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
  const treatedICSLocation = ref([]);

  //aneurysm variables
  const aneurysmLocationRight = ref([]);
  const aneurysmLocationLeft = ref([]);
  const treatedAneurysmLocation = ref([]);
  const aneurysmSize = ref('');
  const aneurysmLocationRightText = ref('');
  const aneurysmLocationLeftText = ref('');
  const aneurysmLocationLists = ref([]);
  const aneurysmLocationRightLists = ref([]);
  const aneurysmLocationLeftLists = ref([]);


  //options
  const aneurysmLocationOptions = ref(['IC-Pcom', 'IC-Ant.chor.A','IC-bif','MCA:M1', 'MCA:M1-2','ACom', 'A1-2', 'BA-Tip', 'BA-SCA', 'VA-PICA', 'VA', 'その他']);

  const years = ref(Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i));
  const months = ref(Array.from({ length: 12 }, (_, i) => i + 1));

  // Methods
  const addSurgery = () => {
    previousSurgeries.value.push({ year: '', month: '' });
  };
  
  const removeSurgery = (index) => {
    previousSurgeries.value.splice(index, 1);
  };
  
  const calculatePeriodBetweenDates = (date1, date2) => {
    const diffTime = Math.abs(date2 - date1);
    const diffYears = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 365));
    const diffMonths = Math.floor((diffTime % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24 * 30));
    return { diffYears, diffMonths };
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
  
  const getSummaryOfAsymptoms = () => {
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

    const AsymptomaticSummary = {
      '今回治療病変': treatedICSLocation.value.join(','),
      '今回治療病変': treatedAneurysmLocation.value.join(','),
      '病変大きさ': aneurysmSize.value,
      'その他備考': additionalNotes.value,
      '手術': operation.value,
      '手術予定日': formatDate(scheduledSurgeryDate.value),
      '': recurrence.value,
      '発症前回手術から': periodFromLastSurgery.value,
      '前回手術': getPreviousSurgeriesText(),
    };

    // Summary of ICS
    // 1. 右側と左側の所見をまとめる関数
      const getSideSummary = (side, symptomatic, plaqueCharacter, nascet, vmax, ulcerativeLesion, echoFindings, aneurysmLocation) => {
      return `ICS${side}病変: ${symptomatic}, プラーク性状: ${plaqueCharacter}, NASCET %: ${nascet}, Vmax: ${vmax}, 潰瘍性病変: ${ulcerativeLesion}, Echo所見: ${echoFindings}, 病変部位: ${aneurysmLocation}`;
    };

    // 2. サマリーテキストの計算
    const ICSSummaryText = () => {
      const rightSummary = getSideSummary('右側', symptomaticRight.value, plaqueCharacterRight.value, nascetRight.value, vmaxRight.value, ulcerativeLesionRight.value, echoFindingsRight.value, aneurysmLocationRight.value);
      const leftSummary = getSideSummary('左側', symptomaticLeft.value, plaqueCharacterLeft.value, nascetLeft.value, vmaxLeft.value, ulcerativeLesionLeft.value, echoFindingsLeft.value, aneurysmLocationLeft.value);
      let summary = '';
      if (lesionSide.value.includes('右')) {
        summary = rightSummary;
      }
      if (lesionSide.value.includes('左')) {
        summary += (summary ? '\n' : '') + leftSummary;
      }
      return summary;
    };


    // Summary of Aneurysm
    const aneurysmSummaryText = () => {
        return '動脈瘤病変部位' + aneurysmLocationLists.value.join(',')
    }


    // 項目が空のものを除外
    const filteredAsymptomaticSummary = Object.fromEntries(
      Object.entries(AsymptomaticSummary).filter(([key, value]) => value != null && value !== '' && value !== undefined && value.length !== 0)
    );

    const summaryText = Object.entries(filteredAsymptomaticSummary)
    .map(([key, value]) => `${key}: ${value}`)
    .join(',');

    return (props.diseaseName=== 'ICS')? ICSSummaryText() + summaryText: 
            (props.diseaseName === 'Aneurysm')? aneurysmSummaryText() + summaryText: summaryText; 
  };

  // "defineExpose"を使用して、外部から参照できるプロパティを定義する
  defineExpose({
    getSummaryOfAsymptoms,
  });

  // Watchers
  // Aneurysm
   // その他の入力値が変更されたら、リストにする。
  watch(aneurysmLocationRightText, (newVal) => {
    aneurysmLocationRightLists.value = newVal.split(',');
  });
  watch(aneurysmLocationLeftText, (newVal) => {
    aneurysmLocationLeftLists.value = newVal.split(',');
  });

  watch ([aneurysmLocationRight, aneurysmLocationLeft, aneurysmLocationRightLists, aneurysmLocationLeftLists], () => {
    console.log('change!!')
    // aneurysmLocationRight, aneurysmLocationRightListsをconcatする。
    const rightLocationList = aneurysmLocationRight.value.filter(location => location !== 'その他').concat(aneurysmLocationRightLists.value);
    // concatしたリストについて、各項目にRt.をつける。
    const rightLocationLists = rightLocationList.map((location) => {
      return 'Rt. ' + location;
    });
    // aneurysmLocationLeft, aneurysmLocationLeftListsをconcatする。
    const leftLocationList = aneurysmLocationLeft.value.filter(location => location !== 'その他').concat(aneurysmLocationLeftLists.value);
    // concatしたリストについて、各項目にLt.をつける。
    const leftLocationLists = leftLocationList.map((location) => {
      return 'Lt. ' + location;
    });
    // 右側と左側のリストをconcatする。
    aneurysmLocationLists.value = rightLocationLists.concat(leftLocationLists);
  });

  watch (operation, (newVal) => {
    if (newVal === 'なし') {
      scheduledSurgeryDate.value = [];
      recurrence.value = '';
      previousSurgeries.value = [];
    }
  });
  
  watch(recurrence, (newVal) => {
    if (newVal === '初発') {
      previousSurgeries.value = [];
    } else if (newVal === '再発') {
      previousSurgeries.value = [{ year: '', month: '' }];
    }
  });


  </script>

  <style scoped>
  /* Add your styles here */
  </style>