<template>
  <v-card class="my-2" elevation="3" >
    <h2 style="padding-left: 15pt;background-color: aquamarine;">{{ operationType }}</h2>
    <v-component v-if="operationType === 'V-P shunt'">
      <v-row class="mx-2 my-2">
        <h3 class="mx-2 my-2" style="color: grey;">頭部</h3>
      </v-row>
      <v-row class="mx-2">
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
      </v-row>
      <v-row class="mx-2">
        <v-col cols="4">
          <v-radio-group v-model="measurementPoint" label="穿刺長基準" inline>
            <v-radio label="脳表" value="脳表"></v-radio>
            <v-radio label="外板" value="外板"></v-radio>
          </v-radio-group>
        </v-col>
        <v-col cols="8">{{ punctureLength }}
          <v-text-field v-model="punctureLength" label="穿刺長 cm" outlined></v-text-field>
        </v-col>
      </v-row>
      <v-row class="mx-2">
        <v-radio-group v-model="punctureTiming" label="穿刺タイミング" inline>
          <v-radio label="先に" value="先に"></v-radio>
          <v-radio label="接続直前" value="接続直前"></v-radio>
        </v-radio-group>
      </v-row>
    </v-component>

    <v-component v-if="operationType === 'L-P shunt'">
      <v-row class="mx-2 my-2">
      <h3 class="mx-2 my-2" style="color: grey;">腰椎</h3>
    </v-row>
      <v-radio-group v-model="punctureLevel" label="手術部位" inline>
        <v-radio  v-for="level in ['L2/3', 'L3/4', 'L4/5', 'L5/S1']" :label="level" :value="level"></v-radio>
      </v-radio-group>
      <v-radio-group v-model="punctureSite" label="穿刺" inline>
        <v-radio label="Sagittal" value="Sagittal"></v-radio>
        <v-radio label="Parasagittal" value="Parasagittal"></v-radio>
      </v-radio-group>
      <v-radio-group v-model="skinIncision" label="皮膚切開" inline>
        <v-radio label="linear" value="linear"></v-radio>
        <v-radio label="curved" value="curved"></v-radio>
        <v-radio label="U-shape" value="U-shape"></v-radio>
      </v-radio-group>

      <v-text-field v-model="punctureLength" label="近位チューブ挿入長 cm" outlined></v-text-field>
    </v-component>
  </v-card>

  <v-card class="my-2" elevation="3">
    <v-row class="mx-2 my-2">
      <h3 class="mx-2 my-2" style="color: grey;">腹部</h3>
    </v-row>
    <v-row class="mx-2">
      <v-radio-group v-model="abdominalSide" label="手術側" inline>
        <v-radio label="右" value="右"></v-radio>
        <v-radio label="左" value="左"></v-radio>
      </v-radio-group>
    </v-row>
  </v-card>
  <v-card class="my-2" elevation="3">
    <v-row class="mx-2 my-2">
      <h3 class="mx-2 my-2" style="color: grey;">デバイス</h3>
    </v-row>
    <v-row class="mx-2">
      <v-text-field v-model="devices" label="デバイス(複数個の場合は,（半角カンマ）で区切って)" outlined></v-text-field>
      <v-text-field v-model="settingPressure" label="設定圧" outlined></v-text-field>
    </v-row>
  </v-card>

</template>
  
  <script setup>
    import { ref, defineModel, defineExpose, watch } from 'vue';
    const operationType = defineModel('operationType');
    const OpeRecordByType = defineModel('OpeRecordByType');
    const AnesthesiaHeadPosition = defineModel('AnesthesiaHeadPosition');

    // common
    const operationSide = ref('');
    const punctureSite = ref('前角');
    const skinIncision = ref('');
    const punctureLength = ref('');
    const abdominalSide = ref('');
    watch(operationSide, (newVal) => {
      abdominalSide.value = newVal;
    })
    
    // V-P shunt
    const measurementPoint = ref('');
    const punctureTiming = ref('');

    // L-P shunt
    const punctureLevel = ref('');

    // devices
    const devices = ref('');
    const settingPressure = ref('');

    // anesthesia
    const AnesthesiaHeadPositionForVPshunt = ref({
      'anesthesia': '全身麻酔',
      'bodyPosition': (punctureSite.value === '前角') ? '仰臥位': '側臥位',
      'headPosition': '馬蹄型',
      'headFlexion': '自然位',
      'headFlexionDegree': '0',
      'headLateralFlexion': 'なし',
      'headLateralFlexionDegree': '0',
      'headRotation': (punctureSite.value === '前角') ? '健側': 'なし',
      'headRotationDegree': (punctureSite.value === '前角') ? '30': '0',
    });
    watch(punctureSite, (newVal) => {
      if (newVal === '前角') {
        AnesthesiaHeadPosition.value.bodyPosition = '仰臥位';
        AnesthesiaHeadPosition.value.headRotation = '健側';
        AnesthesiaHeadPosition.value.headRotationDegree = '30';
      } else {
        AnesthesiaHeadPosition.value.bodyPosition = '側臥位';
        AnesthesiaHeadPosition.value.headRotation = 'なし';
        AnesthesiaHeadPosition.value.headRotationDegree = '0';
      }
    }, {immediate: true});

    const AnesthesiaHeadPositionForLPshunt = ref({
      'anesthesia': '全身麻酔',
      'bodyPosition': '側臥位',
      'headPosition': '馬蹄型',
      'headFlexion': '自然位',
      'headFlexionDegree': '0',
      'headLateralFlexion': 'なし',
      'headLateralFlexionDegree': '0',
      'headRotation': 'なし',
      'headRotationDegree': '0',
    });
    AnesthesiaHeadPosition.value = (operationType.value === 'V-P shunt') ? AnesthesiaHeadPositionForVPshunt.value : AnesthesiaHeadPositionForLPshunt.value;

    watch(operationType, (newVal) => {
      AnesthesiaHeadPosition.value = (newVal === 'V-P shunt') ? AnesthesiaHeadPositionForVPshunt.value : AnesthesiaHeadPositionForLPshunt.value;
  }, {immediate: true});
  

    //operation texts
    const operationInfo = '頭部' + (operationType.value === 'V-P shunt') ? operationSide.value + 'VPシャント術':'LPシャント術';

    // realtimeに変わらなくてもいい。最終的な記録を作成するときに使う　-> functionにする
    const TextOfBurrHoleAndPocketForBulb = () => {
      return (punctureSite.value === '前角') ? '正中から'+ operationSide.value + 'に3cm、Coronal sutureの前方1cmにBurr holeを開けるべく、皮膚切開を行った。'
        :'Inionの上方6cm、正中から'+ operationSide.value + '3cmの位置にBurr holeを開けるべく、皮膚切開を行った。'
        + '皮膚切開は' + skinIncision.value + 'に行った。' + '筋層を切開剥離し、骨を露出した。Perforatorを用いてburr holeを開けた。'
        + '骨を止血後、硬膜をバイポーラで止血凝固。尖刃で硬膜を十字切開し脳表を確認。脳表をバイポーラで凝固し尖刃で切開した。'
        + 'あらかじめドレナージチューブを表皮から皮下に挿入しておいた。'
    }
      const TextOfLumbarPunctureAndPocketForBulb = () => {
        return '穿刺レベル' + punctureLevel.value + 'の傍正中にlinearに皮膚切開を行った。'
          + '穿刺針を' + punctureLevel.value + 'に向けて'+ punctureSite.value + 'から挿入した。'
          + '穿刺針よりCSFの流出を確認した。穿刺針より脊髄腔内に近位ドレナージチューブを'+ punctureLength.value +'cm挿入した。'
          + '皮下にシャント圧調整バルブを挿入するスペースを作った。'
        }
      const TextOfVentPuncture = () => {
        const insertionPoint = (punctureSite.value === '前角') ? 'nasion, 外耳孔':'nasion';
        return '穿刺針を' + insertionPoint + 'に向けて挿入した。'
        +'穿刺針よりCSFの流出を確認した。穿刺針を抜き、同じTractに近位ドレナージチューブを挿入した。'
        + measurementPoint.value + 'を基準に近位ドレナージチューブを'+ punctureLength.value +'cm挿入して固定した。'
      }

      const TextOfAbdominalSide = () => {
        return '臍'+ abdominalSide.value +'外側に5cmの横切開を行った。皮下組織を切開した後。鈍的に脂肪組織を剥離し、腹直筋外膜を露出した。'
        + '腹直筋外膜を縦切開した後、腹直筋を線維方向に分離、剥離し、腹直筋内膜を露出した。内膜を鑷子で交互につまみ上げ、腹膜下組織、臓器を落とす。内膜、腹膜を切開し、腹腔を確認した。'
        + '切開部にたばこ縫合をかけた。\r\n'
        + '切開部より皮下にpasserを用いてシャントチューブを、近位チューブとの接合部まで通した。'
      }
      const TextOfConnectionAndClosure = () => {
        return '遠位チューブ、圧調整バルブ、近位チューブを接合した。CSFの流出を確認した後、遠位チューブはダグラス窩に向かって30cm挿入した。'
      + '腹直筋内膜、腹膜のたばこ縫合を結紮しチューブを適度な締め付けで固定した。\r\n'
      + '近位部、遠位部共に皮下を3-0バイクリルで縫合し、表皮をステープラーで縫合した。'
      } 

      //V-P shunt text
      // [burrhole + pocket for bulb, puncture, abdominal side, connection, closure]
      // [burrhole + pocket for bulb, abdominal side, puncture, connection, closure]
      // L-P shunt text
      // [lumbar puncture + pocket for bulb, abdominal side, puncture, connection, closure]
      // const operationProcedureArray = (operationType.value === 'L-P shunt') ? [TextOfLumbarPunctureAndPocketForBulb, TextOfAbdominalSide, TextOfConnectionAndClosure]:
      //   (punctureTiming.value === '先に') ? [TextOfBurrHoleAndPocketForBulb, TextOfVentPuncture, TextOfAbdominalSide, TextOfConnectionAndClosure]:
      //   [TextOfBurrHoleAndPocketForBulb, TextOfAbdominalSide, TextOfVentPuncture, TextOfConnectionAndClosure];

    const tubeInsert= ()  => {
      return (operationType.value === 'V-P shunt') ? 
                        measurementPoint.value + 'から' + punctureLength.value + 'cm挿入':
                        '表面から' + punctureLength.value + 'cm挿入'
    };
    const fetchOpeInfoItems = () => {
      return {
        '手術側': operationSide.value,
        '穿刺位置': punctureSite.value,
        '皮膚切開': skinIncision.value,
        '穿刺タイミング': punctureTiming.value,
        '近位チューブ挿入': tubeInsert(),
        '穿刺レベル': punctureLevel.value,
        '腹部術側': abdominalSide.value,
        'デバイス': devices.value,
        '設定圧': settingPressure.value,
        'Kcode': 'K174-2 水頭症手術 シャント手術'
      };
    };

    // methods
    function createOpeInfoItemsText(Items) {
      // delete empty items
      Items = Object.fromEntries(
        Object.entries(Items).filter(([key, value]) => value !== '')
      );
      // items to text
      const text = Object.entries(Items).map(([key, value]) => `${key}: ${value}`).join(', ');
      return text;
    }

    function createRecordForEachOperation() {
      const operationProcedureArray = (operationType.value === 'L-P shunt') ? [TextOfLumbarPunctureAndPocketForBulb(), TextOfAbdominalSide(), TextOfConnectionAndClosure()]:
        (punctureTiming.value === '先に') ? [TextOfBurrHoleAndPocketForBulb(), TextOfVentPuncture(), TextOfAbdominalSide(), TextOfConnectionAndClosure()]:
        [TextOfBurrHoleAndPocketForBulb(), TextOfAbdominalSide(), TextOfVentPuncture(), TextOfConnectionAndClosure()];

      const operationRecordText = operationProcedureArray.join('\n');

      const opeInfoItems = fetchOpeInfoItems();
      const opeInfoText = createOpeInfoItemsText(opeInfoItems);
      return operationInfo + '\n\n' + operationRecordText + '\n\n{' + opeInfoText + '}';
    }

    defineExpose({
      createRecordForEachOperation,
    });
  </script>