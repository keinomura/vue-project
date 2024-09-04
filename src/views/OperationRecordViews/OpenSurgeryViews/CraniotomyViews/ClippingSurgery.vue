<template>
  <v-card class="my-2" elevation="3" >
    <h2 style="padding-left: 15pt;background-color: aquamarine;">{{ operationType }}</h2>
  
    <v-radio-group v-model="ruptureOrNot" label="破裂有無" inline>
      <v-radio label="破裂脳動脈瘤" value="破裂脳動脈瘤"></v-radio>
      <v-radio label="未破裂脳動脈瘤" value="未破裂脳動脈瘤"></v-radio>
    </v-radio-group>

    <v-radio-group v-model="operationSide" label="手術側" inline>
      <v-radio label="右" value="右"></v-radio>
      <v-radio label="左" value="左"></v-radio>
    </v-radio-group>
    <v-row class="mx-2 my-2">
          <h4 class="mx-2 my-2" style="color: grey;">クリップ部位</h4>
        </v-row>
    <v-row class="mx-2">
      <v-checkbox 
        v-model="clippingSite"
        v-for="site in ['MCA:M1-2', 'M1', 'IC-Pcom', 'IC-Ant.Chor.a', 'Acom', 'IC-bif', 'M2', 'M3', 'BA-SCA', 'distal ACA', 'その他']"
        :label="site"
        :value="site"
        multiple
        ></v-checkbox>
    </v-row>
    <v-row class="mx-2">
      <v-text-field v-if="clippingSite.includes('その他')" v-model="clippingSiteText" label="その他" outlined></v-text-field>
    </v-row>
  </v-card>

  <v-card class="my-2" elevation="3">
    <v-row class="mx-2 my-2">
      <h3 class="mx-2 my-2" style="color: grey;">開頭</h3>
    </v-row>
    <v-radio-group v-model="CraniotomyType" label="開頭" inline>
      <v-radio label="pterional approach" value="pterional approach"></v-radio>
      <v-radio label="unilateral frontal approach" value="unilateral frontal approach"></v-radio>
      <v-radio label="bifrontal approach" value="bifrontal approach"></v-radio>
      <v-radio label="その他" value="その他"></v-radio>
    </v-radio-group>
    <v-text-field v-if="CraniotomyType === 'その他'" class="mx-2" v-model="CraniotomyTypeText" label="その他" outlined></v-text-field>
    <v-row class="mx-2">
      <v-radio-group v-model="approachType" label="アプローチ" inline>
        <v-radio label="transsylvian" value="transsylvian"></v-radio>
        <v-radio label="subfrontal + transsylvian" value="subfrontal + transsylvian"></v-radio>
        <v-radio label="interhemispheric" value="interhemispheric"></v-radio>
        <v-radio label="subtemporal" value="subtemporal"></v-radio>
        <v-radio label="その他" value="その他"></v-radio>
      </v-radio-group>
      <v-text-field v-if="approachType === 'その他'" class="mx-2" v-model="approachTypeText" label="その他" outlined></v-text-field>
    </v-row>
  </v-card>
  <!-- {{ clippingDetails }}
  {{ unCheckedClippingSite }} -->
    <!-- <v-component v-for="(eachSite, index) in clippingDetails" :key="index">
      <v-row class="mx-2">
        <v-col cols="1">
          <h3>{{ index + 1 }}</h3>
        </v-col>
        <v-col cols="11">
          <v-card>
            <v-row class="mx-2">
              <v-radio-group v-model="eachSite.site" label="部位選択">
                <v-radio v-for="choice in unCheckedClippingSite" :key="choice" :label="choice" :value="choice"></v-radio>
              </v-radio-group>
              <v-text-field v-model="eachSite.method" label="方法" outlined></v-text-field>
              <v-text-field v-model="eachSite.clip" label="クリップ" outlined></v-text-field>
            </v-row>
          </v-card>
          </v-col>
      </v-row>
    </v-component> -->
//under this
    <draggable 
      :list="clippingDetails"
      item-key="site"
      >
      <template #item="{element, index}">
        <v-card>
          <v-row class="mx-2 my-2">
            <v-col cols="1">
              <h3>{{ index + 1 }}</h3>
            </v-col>
            <v-col cols="4" v-if="element.site !== 'その他'">
              <h3>{{ element.site }}</h3>
            </v-col>
            <v-col cols="4" v-if="element.site === 'その他'">
              <v-text-field v-model="element.siteText" label="部位" outlined></v-text-field>
            </v-col>
            <v-col cols="7">
              <v-radio-group v-model="element.method" label="方法" inline @change="modifyClipArray(element)">
                <v-radio label="clip" value="clip"></v-radio>
                <v-radio label="wrapping" value="wrapping"></v-radio>
              </v-radio-group>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="3">
              <v-text-field v-if="element.method === 'clip'" v-model="element.clip" label="クリップ" outlined></v-text-field>
            </v-col>
          </v-row>
        </v-card>
      </template>
    </draggable>
    //upper this

  </template>
    <script setup>
      import { ref, defineModel, defineExpose, watch } from 'vue';
      import draggable from 'vuedraggable';

      const operationType = defineModel('operationType');
      const OpeRecordByType = defineModel('OpeRecordByType');
      const AnesthesiaHeadPosition = defineModel('AnesthesiaHeadPosition');
  
      const ruptureOrNot = ref('');
      const operationSide = ref('');
      const clippingSite = ref([]);
      const clippingSiteText = ref('');
      const CraniotomyType = ref('');
      const CraniotomyTypeText = ref('');
      const approachType = ref('');
      const approachTypeText = ref('');
      const clippingDetail = ref([]);
      // watch (clippingSite , (newVal) => {
      //   clippingDetail.value = Object.fromEntries(
      //     newVal.map((site) => [site, ''])
      //   );
      // }, {immediate: true});
      const clippingDetails = ref([]);
      // clippingDetailで動脈瘤の場所が新たに追加された時clippingDetailsを変化させる。
      watch(clippingSite, (newVal) => {
        //1. newValとclippingDetailsのsiteを比較して、2. clippingDetailsにないものを追加する　か 3. clippingDetailsに余分にあるものを削除する
        // newValとclippingDetailsのsiteをその要素数で比較する。
        if (newVal.length > clippingDetails.value.length) {
          // clippingDetailsにないものを追加する
          newVal.forEach((site) => {
            if (!clippingDetails.value.map((eachSite) => eachSite.site).includes(site)) {
              clippingDetails.value.push({
                site: site,
                method: '',
                clip: ''
              });
            }
          });
        } else {
          // clippingDetailsに余分にあるものを削除する
          clippingDetails.value = clippingDetails.value.filter((eachSite) => {
            return newVal.includes(eachSite.site);
          });
        }
      }, {immediate: true});




      // clippingDetailsのsiteで選ばれていない選択肢
      const unCheckedClippingSite = ref([]);
      watch(clippingDetails, (newVal) => {
        // unCheckedClippingSiteからclippingDetailsのsiteを取り除いたものをunCheckedClippingSiteに代入
        unCheckedClippingSite.value = 
        // clippingDetailsのsiteを取り出して配列にする。これをunCheckedClippingSiteと比較して、clippingDetailsのsiteにないものをunCheckedClippingSiteに代入する
        clippingSite.value.filter((site) => {
          return !newVal.map((eachSite) => eachSite.site).includes(site);
        });
      }, {immediate: true});

      const drag = ref(false);


      // methods
      function modifyClipArray(element) {
        if (element.method === 'clip') {
          element.clip = [''];
        } else {
          element.clip = '';
        }
        const index = clippingDetails.value.findIndex((eachSite) => eachSite.site === element.site);
        clippingDetails.value[index] = element;
      }
  
    //   // anesthesia
    //   const AnesthesiaHeadPositionForVPshunt = ref({
    //     'anesthesia': '全身麻酔',
    //     'bodyPosition': (punctureSite.value === '前角') ? '仰臥位': '側臥位',
    //     'headPosition': '馬蹄型',
    //     'headFlexion': '自然位',
    //     'headFlexionDegree': '0',
    //     'headLateralFlexion': 'なし',
    //     'headLateralFlexionDegree': '0',
    //     'headRotation': (punctureSite.value === '前角') ? '健側': 'なし',
    //     'headRotationDegree': (punctureSite.value === '前角') ? '30': '0',
    //   });
    //   watch(punctureSite, (newVal) => {
    //     if (newVal === '前角') {
    //       AnesthesiaHeadPosition.value.bodyPosition = '仰臥位';
    //       AnesthesiaHeadPosition.value.headRotation = '健側';
    //       AnesthesiaHeadPosition.value.headRotationDegree = '30';
    //     } else {
    //       AnesthesiaHeadPosition.value.bodyPosition = '側臥位';
    //       AnesthesiaHeadPosition.value.headRotation = 'なし';
    //       AnesthesiaHeadPosition.value.headRotationDegree = '0';
    //     }
    //   }, {immediate: true});
  
    //   const AnesthesiaHeadPositionForLPshunt = ref({
    //     'anesthesia': '全身麻酔',
    //     'bodyPosition': '側臥位',
    //     'headPosition': '馬蹄型',
    //     'headFlexion': '自然位',
    //     'headFlexionDegree': '0',
    //     'headLateralFlexion': 'なし',
    //     'headLateralFlexionDegree': '0',
    //     'headRotation': 'なし',
    //     'headRotationDegree': '0',
    //   });
    //   AnesthesiaHeadPosition.value = (operationType.value === 'V-P shunt') ? AnesthesiaHeadPositionForVPshunt.value : AnesthesiaHeadPositionForLPshunt.value;
  
    //   watch(operationType, (newVal) => {
    //     AnesthesiaHeadPosition.value = (newVal === 'V-P shunt') ? AnesthesiaHeadPositionForVPshunt.value : AnesthesiaHeadPositionForLPshunt.value;
    // }, {immediate: true});
    
  
    //   //operation texts
    //   const operationInfo = '頭部' + (operationType.value === 'V-P shunt') ? operationSide.value + 'VPシャント術':'LPシャント術';
  
    //   // realtimeに変わらなくてもいい。最終的な記録を作成するときに使う　-> functionにする
    //   const TextOfBurrHoleAndPocketForBulb = () => {
    //     return (punctureSite.value === '前角') ? '正中から'+ operationSide.value + 'に3cm、Coronal sutureの前方1cmにBurr holeを開けるべく、皮膚切開を行った。'
    //       :'Inionの上方6cm、正中から'+ operationSide.value + '3cmの位置にBurr holeを開けるべく、皮膚切開を行った。'
    //       + '皮膚切開は' + skinIncision.value + 'に行った。' + '筋層を切開剥離し、骨を露出した。Perforatorを用いてburr holeを開けた。'
    //       + '骨を止血後、硬膜をバイポーラで止血凝固。尖刃で硬膜を十字切開し脳表を確認。脳表をバイポーラで凝固し尖刃で切開した。'
    //       + 'あらかじめドレナージチューブを表皮から皮下に挿入しておいた。'
    //   }
    //     const TextOfLumbarPunctureAndPocketForBulb = () => {
    //       return '穿刺レベル' + punctureLevel.value + 'の傍正中にlinearに皮膚切開を行った。'
    //         + '穿刺針を' + punctureLevel.value + 'に向けて'+ punctureSite.value + 'から挿入した。'
    //         + '穿刺針よりCSFの流出を確認した。穿刺針より脊髄腔内に近位ドレナージチューブを'+ punctureLength.value +'cm挿入した。'
    //         + '皮下にシャント圧調整バルブを挿入するスペースを作った。'
    //       }
    //     const TextOfVentPuncture = () => {
    //       const insertionPoint = (punctureSite.value === '前角') ? 'nasion, 外耳孔':'nasion';
    //       return '穿刺針を' + insertionPoint + 'に向けて挿入した。'
    //       +'穿刺針よりCSFの流出を確認した。穿刺針を抜き、同じTractに近位ドレナージチューブを挿入した。'
    //       + measurementPoint.value + 'を基準に近位ドレナージチューブを'+ punctureLength.value +'cm挿入して固定した。'
    //     }
  
    //     const TextOfAbdominalSide = () => {
    //       return '臍'+ abdominalSide.value +'外側に5cmの横切開を行った。皮下組織を切開した後。鈍的に脂肪組織を剥離し、腹直筋外膜を露出した。'
    //       + '腹直筋外膜を縦切開した後、腹直筋を線維方向に分離、剥離し、腹直筋内膜を露出した。内膜を鑷子で交互につまみ上げ、腹膜下組織、臓器を落とす。内膜、腹膜を切開し、腹腔を確認した。'
    //       + '切開部にたばこ縫合をかけた。\r\n'
    //       + '切開部より皮下にpasserを用いてシャントチューブを、近位チューブとの接合部まで通した。'
    //     }
    //     const TextOfConnectionAndClosure = () => {
    //       return '遠位チューブ、圧調整バルブ、近位チューブを接合した。CSFの流出を確認した後、遠位チューブはダグラス窩に向かって30cm挿入した。'
    //     + '腹直筋内膜、腹膜のたばこ縫合を結紮しチューブを適度な締め付けで固定した。\r\n'
    //     + '近位部、遠位部共に皮下を3-0バイクリルで縫合し、表皮をステープラーで縫合した。'
    //     } 
  
    //     //V-P shunt text
    //     // [burrhole + pocket for bulb, puncture, abdominal side, connection, closure]
    //     // [burrhole + pocket for bulb, abdominal side, puncture, connection, closure]
    //     // L-P shunt text
    //     // [lumbar puncture + pocket for bulb, abdominal side, puncture, connection, closure]
    //     // const operationProcedureArray = (operationType.value === 'L-P shunt') ? [TextOfLumbarPunctureAndPocketForBulb, TextOfAbdominalSide, TextOfConnectionAndClosure]:
    //     //   (punctureTiming.value === '先に') ? [TextOfBurrHoleAndPocketForBulb, TextOfVentPuncture, TextOfAbdominalSide, TextOfConnectionAndClosure]:
    //     //   [TextOfBurrHoleAndPocketForBulb, TextOfAbdominalSide, TextOfVentPuncture, TextOfConnectionAndClosure];
  
    //   const tubeInsert= ()  => {
    //     return (operationType.value === 'V-P shunt') ? 
    //                       measurementPoint.value + 'から' + punctureLength.value + 'cm挿入':
    //                       '表面から' + punctureLength.value + 'cm挿入'
    //   };
    //   const fetchOpeInfoItems = () => {
    //     return {
    //       '手術側': operationSide.value,
    //       '穿刺位置': punctureSite.value,
    //       '皮膚切開': skinIncision.value,
    //       '穿刺タイミング': punctureTiming.value,
    //       '近位チューブ挿入': tubeInsert(),
    //       '穿刺レベル': punctureLevel.value,
    //       '腹部術側': abdominalSide.value,
    //       'デバイス': devices.value,
    //       '設定圧': settingPressure.value,
    //       'Kcode': 'K174-2 水頭症手術 シャント手術'
    //     };
    //   };
  
    //   // methods
    //   function createOpeInfoItemsText(Items) {
    //     // delete empty items
    //     Items = Object.fromEntries(
    //       Object.entries(Items).filter(([key, value]) => value !== '')
    //     );
    //     // items to text
    //     const text = Object.entries(Items).map(([key, value]) => `${key}: ${value}`).join(', ');
    //     return text;
    //   }
  
    //   function createRecordForEachOperation() {
    //     const operationProcedureArray = (operationType.value === 'L-P shunt') ? [TextOfLumbarPunctureAndPocketForBulb(), TextOfAbdominalSide(), TextOfConnectionAndClosure()]:
    //       (punctureTiming.value === '先に') ? [TextOfBurrHoleAndPocketForBulb(), TextOfVentPuncture(), TextOfAbdominalSide(), TextOfConnectionAndClosure()]:
    //       [TextOfBurrHoleAndPocketForBulb(), TextOfAbdominalSide(), TextOfVentPuncture(), TextOfConnectionAndClosure()];
  
    //     const operationRecordText = operationProcedureArray.join('\n');
  
    //     const opeInfoItems = fetchOpeInfoItems();
    //     const opeInfoText = createOpeInfoItemsText(opeInfoItems);
    //     return operationInfo + '\n\n' + operationRecordText + '\n\n{' + opeInfoText + '}';
    //   }
  
    //   defineExpose({
    //     createRecordForEachOperation,
    //   });
    </script>