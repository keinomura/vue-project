<template>
  <v-card style="margin-top: 10pt;" elevation="3" >
    <h2 style="background-color: aquamarine;">{{ operationType }}</h2>
    <v-component v-if="operationType === 'CSDH'">
      <v-radio-group v-model="hematomaSide" label="病変側" inline>
        <v-radio label="右" value="右"></v-radio>
        <v-radio label="左" value="左"></v-radio>
        <v-radio label="両方" value="両方"></v-radio>
      </v-radio-group>
      <v-radio-group v-model="operationSide" label="手術部位" inline>
        <v-radio label="右" value="右"></v-radio>
        <v-radio label="左" value="左"></v-radio>
        <v-radio label="両方" value="両方"></v-radio>
      </v-radio-group>
      <v-radio-group v-if="operationSide === '両方'" v-model="firstOpeSide" label="最初の手術側" inline>
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
      <v-radio-group v-model="hematomaSide" label="手術側" inline>
        <v-radio label="右" value="右"></v-radio>
        <v-radio label="左" value="左"></v-radio>
      </v-radio-group>
      <v-radio-group v-model="operationSide" label="穿刺" inline>
        <v-radio label="前角" value="前角"></v-radio>
        <v-radio label="後角" value="後角"></v-radio>
      </v-radio-group>
    </v-component>
  </v-card>
</template>

<script setup>
  import { ref, defineModel, defineExpose, watch } from 'vue';
  const operationType = defineModel('operationType');
  const OpeRecordByType = defineModel('OpeRecordByType');

  const hematomaSide = ref('');
  const operationSide = ref('');
  watch(() => hematomaSide.value, (newVal) => {
    operationSide.value = (newVal !== '両方') ? newVal : '';
  }, { immediate: true });
  const firstOpeSide = ref('');
  const operationTimes = ref('');
  const operationMethod = ref('');
  const Kcode = ref('');

  function createRecordForEachOperation() {
    let opeInfoItems = {
      '病側': hematomaSide.value,
      '手術側': operationSide.value,
      '最初に手術したのは': firstOpeSide.value,
      '今回手術は': operationTimes.value,
      '術式': operationMethod.value,
      'Kcode': 'K145 穿頭脳室ドレナージ術'
    };
    const burrHoleText = 
      (hematomaSide.value === '両側') ? 
        'まず'
        + firstOpeSide 
        +'から手術を行った。両側にBurr holeを開けるべく、前額部眼窩直上のhair line内側にlinearな皮膚切開をおき穿頭した。'
      :'linearな皮膚切開をおき、型どおりに外耳孔を基準に患側OM lineに垂直に8cm頭側に穿頭した。'
    const punctureText = '骨を止血後、硬膜をバイポーラで止血凝固。尖刃で硬膜を十字切開し血腫外膜を確認。血腫外膜をバイポーラで凝固し尖刃で切開。'
    const drainOrWashText = (operationMethod.value === '穿頭ドレナージ術') ? 
    'カニューレを適宜血腫全方向に挿入し可及的に血腫を吸引した。その後生食水で十分に血腫腔内を洗浄した。':
    'ドレナージチューブを皮下に挿入し、血腫腔内に挿入した。'
    const closeText = '止血を確認し、Burr holeはサージセルを充填しBurr hole buttonをおいた。型どおりに皮下、皮膚を縫合し終了した。'
    const counterSideText = (hematomaSide.value === '両側') ? '反対側も同様に処置を行い、術野を確認し終了した。': ''

    const finalRecord = burrHoleText + punctureText + drainOrWashText + closeText + counterSideText
    // key, valueの配列をカンマ区切りでテキストにする
    //空白のものは除外

    // 空のvalueを持つキーと値のペアをフィルタリング
    opeInfoItems = Object.fromEntries(
      Object.entries(opeInfoItems).filter(([key, value]) => value !== '')
    );
    const text = Object.entries(opeInfoItems).map(([key, value]) => `${key}: ${value}`).join(', ');
    return finalRecord + '\n{' + text + '}';
  };

  defineExpose({
    createRecordForEachOperation,
  });
</script>