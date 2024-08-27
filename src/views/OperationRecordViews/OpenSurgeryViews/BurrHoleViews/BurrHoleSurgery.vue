<template>
  <v-card style="margin-top: 10pt;" elevation="3" >
    <h2 style="background-color: aquamarine;">{{ operationType }}</h2>
    <v-component v-if="operationType === 'CSDH'">
      <v-radio-group v-model="hematomaSide" label="病変側" inline>
        <v-radio label="右" value="右"></v-radio>
        <v-radio label="左" value="左"></v-radio>
        <v-radio label="両側" value="両側"></v-radio>
      </v-radio-group>
      <v-radio-group v-model="operationSide" label="手術部位" inline>
        <v-radio label="右" value="右"></v-radio>
        <v-radio label="左" value="左"></v-radio>
        <v-radio label="両側" value="両側"></v-radio>
      </v-radio-group>
      <v-radio-group v-if="operationSide === '両側'" v-model="firstOpeSide" label="最初の手術側" inline>
        <v-radio label="右" value="右"></v-radio>
        <v-radio label="左" value="左"></v-radio>
      </v-radio-group>
      <v-radio-group v-model="operationTimes" label="手術回数" inline>
        <v-radio label="初回" value="初回"></v-radio>
        <v-radio label="再手術" value="再手術"></v-radio>
        <v-radio label="再々手術" value="再々手術"></v-radio>
      </v-radio-group>
      <v-radio-group v-model="operationMethod" label="術式" inline>
        <v-radio label="穿頭洗浄術" value="穿頭洗浄術"></v-radio>
        <v-radio label="穿頭ドレナージ術" value="穿頭ドレナージ術"></v-radio>
      </v-radio-group>
    </v-component>

    <v-component v-if="operationType === '脳室ドレナージ'">
      <v-radio-group v-model="operationSide" label="手術側" inline>
        <v-radio label="右" value="右"></v-radio>
        <v-radio label="左" value="左"></v-radio>
      </v-radio-group>
      <v-radio-group v-model="punctureSite" label="穿刺" inline>
        <v-radio label="前角" value="前角"></v-radio>
        <v-radio label="後角" value="後角"></v-radio>
      </v-radio-group>
      <v-radio-group v-model="skinIncision" label="皮膚切開" inline>
        <v-radio label="linear" value="linear"></v-radio>
        <v-radio label="curved" value="curved"></v-radio>
        <v-radio label="U-shape" value="U-shape"></v-radio>
      </v-radio-group>
      <v-radio-group v-model="measurementPoint" label="測定基準" inline>
        <v-radio label="脳表" value="脳表"></v-radio>
        <v-radio label="外板" value="外板"></v-radio>
      </v-radio-group>
      <v-text-field v-model="punctureLength" label="穿刺長 cm" outlined></v-text-field>
    </v-component>
  </v-card>
</template>

<script setup>
  import { ref, defineModel, defineExpose, watch } from 'vue';
  const operationType = defineModel('operationType');
  const OpeRecordByType = defineModel('OpeRecordByType');
  const AnesthesiaHeadPosition = defineModel('AnesthesiaHeadPosition');

  const hematomaSide = ref('');
  const operationSide = ref('');
  watch(() => hematomaSide.value, (newVal) => {
    operationSide.value = (newVal !== '両側') ? newVal : '';
  }, { immediate: true });
  const firstOpeSide = ref('');
  const operationTimes = ref('');
  const operationMethod = ref('');
  
  const AnesthesiaHeadPositionForCSDH = ref({
    'anesthesia': '局所麻酔',
    'bodyPosition': '仰臥位',
    'headPosition': '馬蹄型',
    'headFlexion': '自然位',
    'headFlexionDegree': '0',
    'headLateralFlexion': 'なし',
    'headLateralFlexionDegree': '0',
    'headRotation': (operationSide.value === '両側') ? 'なし':'健側',
    'headRotationDegree': (operationSide.value === '両側') ? '0':'30',
  });
  watch (() => operationSide.value, (newVal) => {
    if (operationType.value === 'CSDH'){
      AnesthesiaHeadPositionForCSDH.value.headRotation = (newVal === '両側') ? 'なし':'健側';
      AnesthesiaHeadPositionForCSDH.value.headRotationDegree = (newVal === '両側') ? '0':'30';
    }
  }, { immediate: true });

  function createRecordForCSDH() {
    let opeInfoItems = {
      '病側': hematomaSide.value,
      '手術側': operationSide.value,
      '最初に手術したのは': firstOpeSide.value,
      '今回手術は': operationTimes.value,
      '術式': operationMethod.value,
      'Kcode': 'K145 穿頭脳室ドレナージ術'
    };

    const info = hematomaSide.value + '慢性硬膜下血腫。' + '今回手術側は' + operationSide.value + '。'
    const burrHoleText = 
      (operationSide.value === '両側') ? 
        'まず'
        + firstOpeSide.value 
        +'から手術を行った。両側にBurr holeを開けるべく、前額部眼窩直上のhair line内側にlinearな皮膚切開をおき穿頭した。'
      :'linearな皮膚切開をおき、型どおりに外耳孔を基準に患側OM lineに垂直に8cm頭側に穿頭した。'
    const punctureText = '骨を止血後、硬膜をバイポーラで止血凝固。尖刃で硬膜を十字切開し血腫外膜を確認。血腫外膜をバイポーラで凝固し尖刃で切開。'
    const drainOrWashText = (operationMethod.value === '穿頭ドレナージ術') ? 
    'カニューレを適宜血腫全方向に挿入し可及的に血腫を吸引した。その後生食水で十分に血腫腔内を洗浄した。':
    'ドレナージチューブを皮下に挿入し、血腫腔内に挿入した。'
    const closeText = '止血を確認し、Burr holeはサージセルを充填しBurr hole buttonをおいた。型どおりに皮下、皮膚を縫合し終了した。'
    const counterSideText = (operationSide.value === '両側') ? '反対側も同様に処置を行い、術野を確認し終了した。': ''

    const finalRecord = info + '\n' + burrHoleText + punctureText + drainOrWashText + closeText + counterSideText

    opeInfoItems = Object.fromEntries(
      Object.entries(opeInfoItems).filter(([key, value]) => value !== '')
    );
    const text = Object.entries(opeInfoItems).map(([key, value]) => `${key}: ${value}`).join(', ');
    return finalRecord + '\n{' + text + '}';
  };

  // vent. drainage
  const skinIncision = ref('');
  const punctureSite = ref('');
  const measurementPoint = ref('');
  const punctureLength = ref('');
  const AnesthesiaHeadPositionForVentDrainage = ref({
    'anesthesia': '局所麻酔',
    'bodyPosition': (punctureSite === '後角') ? '側臥位':'仰臥位',
    'headPosition': '馬蹄型',
    'headFlexion': '自然位',
    'headFlexionDegree': '0',
    'headLateralFlexion': 'なし',
    'headLateralFlexionDegree': '0',
    'headRotation': 'なし',
    'headRotationDegree': '0',
  });
  watch (() => punctureSite.value, (newVal) => {
    AnesthesiaHeadPositionForVentDrainage.value.bodyPosition = (newVal === '後角') ? '側臥位':'仰臥位';
  }, { immediate: true });

  watch (() => operationType.value, (newVal) => {
    AnesthesiaHeadPosition.value = (newVal === 'CSDH') ? AnesthesiaHeadPositionForCSDH.value : AnesthesiaHeadPositionForVentDrainage.value;
  }, { immediate: true });
  // AnesthesiaHeadPosition.value = (operationType.value === 'CSDH') ? AnesthesiaHeadPositionForCSDH.value : AnesthesiaHeadPositionForVentDrainage.value;  


  function createRecordForVentDrainage() {
    let opeInfoItems = {
      '手術側': operationSide.value,
      '穿刺位置': punctureSite.value,
      '皮膚切開': skinIncision.value,
      '測定基準': measurementPoint.value,
      '穿刺長cm': punctureLength.value,
      'Kcode': 'K145 穿頭脳室ドレナージ術'

  };
    const info = operationSide.value + punctureSite.value + '穿刺で行った。'
    const punctureText = 
       (punctureSite.value === '前角') ? 
        '正中から'+ operationSide.value + 'に3cm、Coronal sutureの前方1cmにBurr holeを開けるべく、皮膚切開を行った。'
      :'Inionの上方6cm、正中から'+ operationSide.value + '3cmの位置にBurr holeを開けるべく、皮膚切開を行った。'
    const skinIncisionText = '皮膚切開は' + skinIncision.value + 'に行った。'
    const punctureSiteText = 'Burr holeを開け、骨、硬膜を止血。尖刃で硬膜を切開し、脳表を確認。脳表をバイポーラで凝固した。'
    + 'あらかじめドレナージチューブを表皮から皮下に挿入しておく。'
    + (punctureSite === '前角') ? '穿刺針をnasion, 外耳孔に向けて挿入した。':'穿刺針をnasionに向けて挿入した。'
    const drainagePlacement = '穿刺針よりCSFの流出を確認した。穿刺針を抜き、同じTractにドレナージチューブを挿入した。'
    + measurementPoint.value + 'を基準にドレナージチューブを'+ punctureLength.value +'cm挿入して固定した。'
    const closeText = '型どおりに閉創し、手術を終了した。'

    const finalRecord = info + '\n' + punctureText + skinIncisionText + punctureSiteText + drainagePlacement + closeText

    opeInfoItems = Object.fromEntries(
      Object.entries(opeInfoItems).filter(([key, value]) => value !== '')
    );
    const text = Object.entries(opeInfoItems).map(([key, value]) => `${key}: ${value}`).join(', ');
    return finalRecord + '\n{' + text + '}';
  };


  function createRecordForEachOperation() {
    return (operationType.value === 'CSDH') ? createRecordForCSDH() : createRecordForVentDrainage();
  };

  defineExpose({
    createRecordForEachOperation,
  });
</script>