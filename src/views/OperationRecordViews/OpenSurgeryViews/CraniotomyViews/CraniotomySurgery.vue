<template class="my-2" elevation="3" >
  <h2 style="padding-left: 15pt;background-color: aquamarine;">{{ operationType }}</h2>
  <v-card class="" elevation="3">

    <v-row class="mx-2 my-2">
      <v-col :cols="operationSide !== 'その他'? 12:6">
        <v-radio-group v-model="operationSide" label="手術側" inline>
          <v-radio v-for="side in ['右', '左', '正中', '両側', 'その他']" :label="side" :value="side"></v-radio>
        </v-radio-group>
      </v-col>
      <v-col v-if="operationSide === 'その他'" cols="6">
        <v-text-field v-model="operationSideText" label="その他" outlined></v-text-field>
      </v-col>
    </v-row>

    <v-row class="mx-2">
      <v-col :cols="operationSideBasedOnTent !== 'その他'? 12:6">
        <v-radio-group v-model="operationSideBasedOnTent" label="テント上下" inline>
          <v-radio v-for="side in ['テント上', 'テント下', 'その他']" :label="side" :value="side"></v-radio>
        </v-radio-group>
      </v-col>
      <v-col cols="6">
        <v-text-field v-if="operationSideBasedOnTent === 'その他'" v-model="operationSideBasedOnTentText" label="その他" outlined></v-text-field>
      </v-col>
    </v-row>

    <v-row v-if="operationSideBasedOnTent === 'テント上'|| operationSideBasedOnTent === 'テント下'" class="mx-2">
      <v-col>
        <v-radio-group v-model="approach" label="approach" inline>
          <v-radio v-if="operationSideBasedOnTent === 'テント上'" v-for="approach in ['pterional approach', 'subfrontal approach', 'その他']" :label="approach" :value="approach"></v-radio>
          <v-radio v-if="operationSideBasedOnTent === 'テント下'" v-for="approach in ['midline approach', 'retrosigmoid approach', 'その他']" :label="approach" :value="approach"></v-radio>
        </v-radio-group>
      </v-col>
    </v-row>
  </v-card>

  <!-- 手術詳細 -->
  <v-card class="my-2" elevation="3">
    <v-textarea class="mx-2 my-2" v-model="procedureDetailText" label="手術詳細" outlined rows="8"></v-textarea>
  </v-card>

  <!-- 各疾患 -->
  <!-- 腫瘍摘出術 -->
  <v-card v-if="operationType == 'Tumor'" class="my-2" elevation="3">
    <v-row class="mx-2 my-2">
      <v-radio-group v-model="pathology" label="病理提出" inline>
        <v-radio v-for="patho in ['あり', 'なし']" :label="patho" :value="patho"/>
      </v-radio-group>
      <v-radio-group v-model="rapidPathology" label="迅速病理" inline>
        <v-radio v-for="patho in ['あり', 'なし']" :label="patho" :value="patho"/>
      </v-radio-group>
    </v-row>
  </v-card>

  <!-- 開頭血腫除去術 -->
  <v-card v-if="operationType === '開頭血腫除去術'" class="my-2" elevation="3">
    <v-row class="mx-2 my-2">
      <v-radio-group v-model="decompressionWithHematomaEvacuation" label="減圧開頭術の併用" inline>
        <v-radio v-for="decompression in ['あり', 'なし']" :label="decompression" :value="decompression"></v-radio>
      </v-radio-group>
      <v-radio-group v-model="ventDrainageWithHematomaEvacuation" label="脳室ドレナージの併用" inline>
        <v-radio v-for="drainage in ['あり', 'なし']" :label="drainage" :value="drainage"/>
      </v-radio-group>
    </v-row>
  </v-card>
  <drainage 
    v-if="ventDrainageWithHematomaEvacuation === 'あり'"
    v-model:operationType="ventDrainageName"
    ref="drainageOption"
  ></drainage>


  <!-- 閉創 -->
  <v-card class="my-2" elevation="3">
    <v-row class="mx-2 my-2">
      <v-radio-group v-model="duraRepairMaterial" label="硬膜修復材料" inline>
        <v-radio label="DuraGen" value="DuraGen"></v-radio>
        <v-radio label="デュラウェーブ" value="デュラウェーブ"></v-radio>
        <v-radio label="なし" value="なし"></v-radio>
        <v-radio label="その他" value="その他"></v-radio>
      </v-radio-group>
      <v-text-field v-if="duraRepairMaterial === 'その他'" v-model="duraRepairMaterialText" label="その他" outlined></v-text-field>
    </v-row>
    <v-row class="mx-2">
      <v-radio-group v-model="artificialBone" label="骨セメントの使用" inline>
        <v-radio label="ストライカー" value="ダイレクトインジェクト（ストライカー）"></v-radio>
        <v-radio label="なし" value="なし"></v-radio>
        <v-radio label="その他" value="その他"></v-radio>
      </v-radio-group>
      <v-text-field v-if="artificialBone === 'その他'" v-model="artificialBoneText" label="その他" outlined></v-text-field>
    </v-row>
  </v-card>
</template>
  
      <script setup>
        import { ref, defineModel, defineExpose, watch } from 'vue';
        import draggable from 'vuedraggable';
        import selectClip from './selectClip.vue';
        import drainage from '../BurrHoleViews/BurrHoleSurgery.vue';
import ShuntSurgery from '../ShuntViews/ShuntSurgery.vue';
  
        // models 親コンポーネントの変数と同期させる
        const operationType = defineModel('operationType');
        const AnesthesiaHeadPosition = defineModel('AnesthesiaHeadPosition');

        // 子コンポーネント
        const drainageOption = ref(null);
    
        // variables: operation information
        const operationSide = ref('');
        const operationSideText = ref('');
        const operationSideBasedOnTent = ref('');
        const operationSideBasedOnTentText = ref('');
        const approach = ref('');

        const procedureDetailText = ref('');

        //variables: tumor
        const pathology = ref('');
        const rapidPathology = ref('');

        //variables: hematoma
        const decompressionWithHematomaEvacuation = ref('');
        const ventDrainageWithHematomaEvacuation = ref('');
        watch(operationType, (newVal) => {
          if (newVal !== '減圧開頭術') {
            ventDrainageWithHematomaEvacuation.value = '';
          }
        });
        const ventDrainageName = ref('脳室ドレナージ');
  
        //variables: closure
        const duraRepairMaterial = ref('');
        const duraRepairMaterialText = ref('');
        const artificialBone = ref('');
        const artificialBoneText = ref('');

        // methods;
  
        // anesthesia
        AnesthesiaHeadPosition.value = {
          'anesthesia': '全身麻酔',
          'bodyPosition': '仰臥位',
          'headPosition': 'Mayfield 3-pin',
          'headFlexion': '自然位',
          'headFlexionDegree': '0',
          'headLateralFlexion': 'なし',
          'headLateralFlexionDegree': '0',
          'headRotation': '患側',
          'headRotationDegree': '20',
        };
        watch(approach, (newVal) => {
          let anesthesiaFactor = {}
          if (newVal === 'pterional approach'|| newVal === 'subfrontal approach') {
            anesthesiaFactor = {
              'bodyPosition': '仰臥位',
              'headPosition': 'Mayfield 3-pin',
              'headFlexion': '自然位',
              'headFlexionDegree': '0',
              'headLateralFlexion': 'なし',
              'headLateralFlexionDegree': '0',
              'headRotation': '患側',
              'headRotationDegree': '20',
            }
          } else if (newVal === 'midline approach') {
            anesthesiaFactor =
            {'bodyPosition': '腹臥位',
              'headFlexion': '屈曲位',
              'headFlexionDegree': '20',
              'headLateralFlexion': 'なし',
              'headLateralFlexionDegree': '0',
              'headRotation': 'なし',
              'headRotationDegree': '0'
            }
          } else if (newVal === 'retrosigmoid approach') {
            anesthesiaFactor =
            {'bodyPosition': '側臥位',
              'headFlexion': '屈曲位',
              'headFlexionDegree': '20',
              'headLateralFlexion': '健側',
              'headLateralFlexionDegree': '20',
              'headRotation': '健側',
              'headRotationDegree': '30',
            }
          }
          Object.keys(AnesthesiaHeadPosition.value).forEach((key) => {
              if (anesthesiaFactor[key]) {
                AnesthesiaHeadPosition.value[key] = anesthesiaFactor[key];
              }
            });

        }, {immediate: true});
  
        // craniotomy Detail Text
        //operation texts
        const operationName = {
          'Tumor': '腫瘍摘出術',
          '開頭血腫除去術': '開頭血腫除去術',
          '減圧開頭': '減圧開頭',
        }
        const operationInfo = () => {
          return operationName[operationType.value];
        }
  
        // extradural operation
        const extraduralOperationText = () => {
          const pterionalapproachText = '皮膚切開は患側hair line内にCurved Shapeで正中付近から外耳道付近までのデザインで行った。型どおり皮膚切開し、筋層も同様に切開した。筋層を骨弁から剥がしフックで翻転した。'
          + '開頭はpterional を中心とし、Burr holeを3カ所開け、硬膜と骨を十分に剥離した後に骨切りした。骨弁を外し、硬膜、骨の止血を十分に行った。硬膜と周囲骨の間にサージセルを詰めた後、硬膜をTentingし、硬膜外からの出血をコントロールした。'
          + 'sphenoid ridgeの硬膜を十分に剥がし、sphenoid ridgeをリューエルを用い十分に削った。'
          + '硬膜をBaseを基部とする半円状に切開し翻転した。4-0ニューロロンで硬膜をつり上げた。';
          const midlineApproachText = '皮膚切開は正中切開。頭側はinionより頭側に、尾側はC2までのデザインで行った。型どおり皮膚切開し、筋層も同様に切開した。筋層を骨から剥がしフックで翻転した。'
          + '開頭範囲を確認し、Burrholeを開け、硬膜と骨を十分に剥離した後に骨切りした。骨弁を外し、硬膜、骨の止血を十分に行った。硬膜と周囲骨の間にサージセルを詰めた後、硬膜をTentingし、硬膜外からの出血をコントロールした。'
          + '硬膜をX状に切開し翻転。4-0ニューロロンでつり上げた。'
          const retrosigmoidApproachText = '皮膚切開は患側hair line内にCurved Shapeのデザインで行った。型どおり皮膚切開し、筋層も同様に切開した。筋層を骨弁から剥がしフックで翻転した。' 
          + 'perforatorにて開頭予定部位でsinusから最も離れた場所にburr holeを開けた。硬膜を十分に骨から剥離し、ケリーソンパンチで開頭を広げた。'
          + 'sinusを十分に確認できる位置まで開頭を広げた。'
          + '開頭中のmastoid air cellの開放は骨片を開放部に充填し、デュラウェーブでSealした。'
          + '周囲骨を止血し、硬膜外にサージセルを詰め止血した。硬膜を弧状に切開し、4-0ニューロロンでつり上げた。'

  
          return (approach.value === 'pterional approach'||approach.value === 'subfrontal approach') ? pterionalapproachText:
          (approach.value === 'midline approach') ? midlineApproachText:
          (approach.value === 'retrosigmoid approach') ? retrosigmoidApproachText: '';
        }
  
        //closure
        const duraClosureText = () =>{
          const duraRepairMaterialText = 
          (duraRepairMaterial.value !== 'なし')? 
          (duraRepairMaterial.value === 'その他') ? duraRepairMaterialText.value: duraRepairMaterial.value
          : '';
            const duraClosure = '硬膜を4-0ニューロロンで縫合した。筋層を縫合し、皮膚を縫合した。';

          return (operationType.value === '減圧開頭')? '硬膜修復には' + duraRepairMaterialText + 'を使用し、硬膜は縫合せず。'
          :'硬膜修復には' + duraRepairMaterialText + 'を使用した。' + duraClosure;
        }
  
        const opeInformationItems = () => {
          return {
            '手術側': operationSide.value,
            'テント上下': operationSideBasedOnTent.value,
            'テント上下詳細': operationSideBasedOnTentText.value,
            'アプローチ': approach.value,
            '病理提出': pathology.value,
            '迅速病理': rapidPathology.value,
            '減圧開頭術の併用': decompressionWithHematomaEvacuation.value,
            '脳室ドレナージの併用': ventDrainageWithHematomaEvacuation.value,
            '硬膜修復材料': duraRepairMaterial.value,
            '硬膜修復材料詳細': duraRepairMaterialText.value,
            '骨セメントの使用': artificialBone.value,
            '骨セメントの使用詳細': artificialBoneText.value,
          }
        };
  
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
          const drainageText = (ventDrainageWithHematomaEvacuation.value === 'あり') ? '\n\n脳室ドレナージは' + drainageOption.value.createRecordForEachOperation() + '\n': '';

          const operationProcedureArray = 
          [extraduralOperationText(), '\n' + procedureDetailText.value + '\n', duraClosureText()];
          
          const operationRecordText = operationProcedureArray.join('\n');
    
          const opeInfoText = createOpeInfoItemsText(opeInformationItems());
          return operationInfo() + '\n\n' + operationRecordText + drainageText + '\n\n{' + opeInfoText + '}';
        }
    
        defineExpose({
          createRecordForEachOperation,
        });
      </script>