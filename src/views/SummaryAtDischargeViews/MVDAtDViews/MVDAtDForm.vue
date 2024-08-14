<template>
    <v-container style="background-color: greenyellow">
      <v-radio-group v-model="lesionSide" label="病側" inline>
        <v-radio label="左" value="左"></v-radio>
        <v-radio label="右" value="右"></v-radio>
      </v-radio-group>
  
      <v-checkbox
        v-if="disName === 'TN'"
        v-for="option in painAreasOption"
        :key="option.value"
        v-model="painArea"
        :label="option.text"
        :value="option.value"
        multiple
        class="d-inline-block"
        ></v-checkbox>
      <v-row>

      </v-row>
        <v-row>
          <v-col cols="12">
            <v-divider>手術手技</v-divider>
          </v-col>
        </v-row>
        <v-col cols="12">
          <v-checkbox
            v-for="option in operationTypeOptions"
            :key="option.value"
            v-model="operationType"
            :label="option.text"
            :value="option.value"
            multiple
            class="d-inline-block"
          ></v-checkbox>
        </v-col>
      <v-row>
        <v-radio-group v-model="mastoidAirCellOpening" label="mastoid air cellの開放" inline>
          <v-radio label="あり" value="あり"></v-radio>
          <v-radio label="なし" value="なし"></v-radio>
        </v-radio-group>
        <v-radio-group v-model="preservationOfPetrosalVein" label="錐体静脈の温存" inline>
          <v-radio label="全部保存" value="全部保存"></v-radio>
          <v-radio label="一部切断" value="一部切断"></v-radio>
        </v-radio-group>
        <v-radio-group v-model="transpositionOfVA" label="VAの移動" inline>
          <v-radio label="あり" value="あり"></v-radio>
          <v-radio label="なし" value="なし"></v-radio>
        </v-radio-group>
      </v-row>
      <v-row>
        <v-col cols="12">
          <v-divider>責任血管</v-divider>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <v-checkbox
            v-for="option in offendingVesselOptions"
            :key="option.value"
            v-model="selectedOffendingVessels"
            :label="option.text"
            :value="option.value"
            multiple
            class="d-inline-block"
            ></v-checkbox>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12">
          <v-text-field v-if="selectedOffendingVessels.includes('その他')" v-model="offendingVesselText" label="その他の血管。複数の場合は','で区切る" outlined>
          </v-text-field>
        </v-col>
      </v-row>

      <v-row v-if="treatedVessels.length > 1 || selectedOffendingVessels.length > 1">
        <v-col cols="12">
          <v-divider>最も責任のある血管</v-divider>
        </v-col>
        <v-col cols="12">
          <v-checkbox
            v-for="option in treatedVessels"
            :key="option"
            v-model="mostResponsibleVessel"
            :label="option"
            :value="option"
            multiple
            class="d-inline-block"
          ></v-checkbox>
        </v-col>
      </v-row>
      <v-divider>術後経過</v-divider>
      <v-row>
        <v-col cols="12">
          <v-radio-group v-model="postOperationCourse" label="術後経過" inline>
            <v-radio v-for="option in ['直後から消失', '消失後軽減して再燃', '消失せず軽減', '術前と変化無し']" :key="option" :label="option" :value="option"></v-radio>
          </v-radio-group>
        </v-col>
      </v-row>

        <v-divider>退院時</v-divider>
        <v-row>
        <v-col cols="12">
          <v-radio-group v-model="postOperationPain" label="退院時痛み VAS" inline>
            <v-radio v-for="option in postOperationPainOptions" :key="option" :label="option" :value="option"></v-radio>
          </v-radio-group>
        </v-col>
      </v-row>
  
      <v-radio-group v-model="medicationAtDischarge" label="退院時内服治療" inline>
        <v-radio label="あり" value="あり"></v-radio>
        <v-radio label="なし" value="なし"></v-radio>
      </v-radio-group>

      <v-container v-if="medicationAtDischarge === 'あり'">
        <span>退院時内服量</span>
        <v-container v-for="(medication, index) in postSurgeryMedications" :key="index">
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
          <v-radio-group v-model="medicationChange" label="術前と比較して" inline>
            <v-radio label="増加" value="増加"></v-radio>
            <v-radio label="不変" value="不変"></v-radio>
            <v-radio label="減少" value="減少"></v-radio>
          </v-radio-group>
        </v-container>
        <v-btn @click="addMedication" class="ma-2">薬剤を追加</v-btn>
        <v-textarea v-model="additionalNotes" label="追加のメモ"></v-textarea>
      </v-container>
      <v-radio-group v-model="followUp" label="退院後フォローアップ" inline>
        <v-radio label="自院フォロー" value="自院フォロー"></v-radio>
        <v-radio label="紹介元病院フォロー" value="紹介元病院フォロー"></v-radio>
        <v-radio label="その他" value="その他"></v-radio>
      </v-radio-group>

    </v-container>
  </template>
  
  <script setup>
  import { ref, watch } from 'vue';
  
  // Props
  const props = defineProps({
    disName: String,
  });
  
  const lesionSide = ref('左');
  const painArea = ref([]);
  const painAreasOption = ref([
      { text: 'V1', value: 'V1' },
      { text: 'V2', value: 'V2' },
      { text: 'V3', value: 'V3' },
    ],
  );

  const operationType = ref([]);
  const operationTypeOptions = ref([
    { text: 'transposition', value: 'transposition' },
    { text: 'internal neurolysis', value: 'internal neurolysis' },
    { text: 'adhesion Dissection', value: 'adhesion Dissection' },
    { text: 'interposition', value: 'interposition' },
  ]);

  const postOperationCourse = ref('直後から消失');
  const postOperationPain = ref('0');

  const postOperationPainOptions = ref(['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10']);
  const medicationAtDischarge = ref('なし');

  const medicationsForHFS = ref(['リボトリール', 'ビムパット', 'テグレトール', 'セルシン']);
  const medicationsForTN = ref(['テグレトール（カルバマゼピン）', 'ビムパット（ラコサミド）', 'パキシル', 'ロキソニン', 'ガバペン', 'アレビアチン']);
  const medications = (props.disName ==='TN')? medicationsForTN : medicationsForHFS;
  const medicationChange = ref('');

  const mastoidAirCellOpening = ref('なし');
  const preservationOfPetrosalVein = ref('全部保存');
  const transpositionOfVA = ref('なし');
  const selectedOffendingVessels = ref([]);
  const offendingVesselOptions = ref([
    { text: 'SCA', value: 'SCA' },
    { text: 'AICA', value: 'AICA' },
    { text: 'PICA', value: 'PICA' },
    { text: 'VA', value: 'VA' },
    { text: 'BA', value: 'BA' },
    { text: 'petrosal vein', value: 'petrosal vein' },
    { text: '癒着', value: '癒着' },
    { text: 'TCA', value: 'TCA' },
    { text: 'PTA', value: 'PTA' },
    { text: 'branch of AICA', value: 'branch of AICA' },
    { text: 'branch of PICA', value: 'branch of PICA' },
    { text: 'AICA/PICA trunk', value: 'AICA/PICA trunk' },
    { text: 'その他', value: 'その他' },
  ]);
  const offendingVesselText = ref('');
  const offendingVesselTextList = ref([]);
  const treatedVessels = ref([]);
  const mostResponsibleVessel = ref([]);

  const followUp = ref('自院フォロー');

  const postSurgeryMedications = ref([]);
  const additionalNotes = ref('');



  // Methods
  const addMedication = () => {
    postSurgeryMedications.value.push({ name: '', dosage: '' });
  };
  
  const removeMedication = (index) => {
    postSurgeryMedications.value.splice(index, 1);
  };
  
  const getSummaryAtDischargeOfMVD = () => {
    const getPostSurgeryMedicationsText = () => {
      if (postSurgeryMedications.value.length === 0) {
      return 'なし';
      } else {
      return postSurgeryMedications.value.map((medication) => {
        return `${medication.name} ${medication.dosage}`;
      }).join(',');
      }
    };

    const mvdSummaryAtDischarge = {
      ope: {
        '病側': lesionSide.value,
        '痛みの領域': painArea.value,
        '手術手技': operationType.value,
        'mastoid air cellの開放': mastoidAirCellOpening.value,
        '錐体静脈': preservationOfPetrosalVein.value,
        'VA移動': transpositionOfVA.value,
        '関与血管': treatedVessels.value,
        '責任血管': mostResponsibleVessel.value,
      },
      post: {
        '術後経過': postOperationCourse.value,
        '追加のメモ': additionalNotes.value,
      },
      discharge: {
        '退院時VAS': postOperationPain.value,
        '退院時内服': getPostSurgeryMedicationsText(),
        '術前と比較して': medicationChange.value,
        '退院後': followUp.value,
      },
    };

    const createSummaryText = (obj) => {
      const filteredObj = Object.fromEntries(
        Object.entries(obj).filter(([key, value]) => value != null && value !== '' && value !== undefined && value.length !== 0)
      );

      const summaryText = Object.entries(filteredObj)
        .map(([key, value]) => `${key}: ${value}`)
        .join(',');
        return summaryText;
      };

      const summaryText = '{' + createSummaryText(mvdSummaryAtDischarge.ope)
                        + '\r' + createSummaryText(mvdSummaryAtDischarge.post) + '}'
                        + '\r' + '【退院時情報】\r' + '{' + createSummaryText(mvdSummaryAtDischarge.discharge) + '}' + '\r';
      return summaryText; 
    };

  // "defineExpose"を使用して、外部から参照できるプロパティを定義する
  defineExpose({
    getSummaryAtDischargeOfMVD,
  });

  watch(offendingVesselText, (newVal) => {
    offendingVesselTextList.value = (newVal === '')? [] : newVal.split(',');
  });

  watch([offendingVesselTextList, selectedOffendingVessels], () => {
      treatedVessels.value = selectedOffendingVessels.value.concat(offendingVesselTextList.value);
    
      // treatedVesselsから'その他'を削除する
      if (treatedVessels.value.includes('その他')) {
        treatedVessels.value = treatedVessels.value.filter((vessel) => vessel !== 'その他');
      }
    
  });

  watch(selectedOffendingVessels, () => {
    if (!selectedOffendingVessels.value.includes('その他')) {
      offendingVesselText.value = '';
    }
  });

  watch(medicationAtDischarge, () => {
    if (medicationAtDischarge.value === 'なし') {
      postSurgeryMedications.value = [];
      medicationChange.value = '';
      additionalNotes.value = '';
    }
  });


  </script>

  <style scoped>
  /* Add your styles here */
  </style>