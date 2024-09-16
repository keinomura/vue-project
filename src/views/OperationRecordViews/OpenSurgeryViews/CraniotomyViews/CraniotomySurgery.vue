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
    <v-row class="mx-2 my-2"/>
      <v-radio-group v-model="decompressionWithHematomaEvacuation" label="減圧開頭術の併用" inline>
        <v-radio v-for="decompression in ['あり', 'なし']" :label="decompression" :value="decompression"></v-radio>
      </v-radio-group>
    <v-row class="mx-2">
      <v-radio-group v-model="ventDrainageWithHematomaEvacuation" label="脳室ドレナージの併用" inline>
        <v-radio v-for="drainage in ['あり', 'なし']" :label="drainage" :value="drainage"/>
      </v-radio-group>
      <v-radio-group v-if="ventDrainageWithHematomaEvacuation === 'あり'" v-model="ventDrainageSide" label="脳室ドレナージ左右" inline>
        <v-radio v-for="drainage in ['左', '右']" :label="drainage" :value="drainage"/>
      </v-radio-group>
            <v-radio-group v-if="ventDrainageWithHematomaEvacuation === 'あり'" v-model="ventDrainageSite" label="脳室ドレナージ左右" inline>
        <v-radio v-for="drainage in ['前角', '後角']" :label="drainage" :value="drainage"/>
      </v-radio-group>
    </v-row>
  </v-card>
  <drainage 
    v-if="ventDrainageWithHematomaEvacuation === 'あり'"
    v-model:operationType="ventDrainageName"
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
  
        // models 親コンポーネントの変数と同期させる
        const operationType = defineModel('operationType');
        const AnesthesiaHeadPosition = defineModel('AnesthesiaHeadPosition');
    
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
        const ventDrainageSide = ref('');
        const ventDrainageSite = ref('');
        const ventDrainageName = ref('脳室ドレナージ');

        // variables: clipping
        const clippingSite = ref([]);
        const clippingSiteText = ref('');


  
        // variables, extradural procedure
        const CraniotomyType = ref('pterional approach');
        const CraniotomyTypeText = ref('');
        const approachType = ref('');
        const approachTypeText = ref('');
  
        //variables: intradural procedure
        const difficultyOfVeinDissection = ref('');
        const clippingProcedureDetailText = ref('');
        const useOfTemporaryClip = ref('');
        const temporaryClippingTime = ref('');
  
        const detailInformationOfAneurysmTreatment = ref([]);
        // clippingDetailで動脈瘤の場所が新たに追加された時detailInformationOfAneurysmTreatmentを変化させる。
        watch(clippingSite, (newVal) => {
          //1. newValとdetailInformationOfAneurysmTreatmentのsiteを比較して、2. detailInformationOfAneurysmTreatmentにないものを追加する　か 3. detailInformationOfAneurysmTreatmentに余分にあるものを削除する
          // newValとdetailInformationOfAneurysmTreatmentのsiteをその要素数で比較する。
          if (newVal.length > detailInformationOfAneurysmTreatment.value.length) {
            // detailInformationOfAneurysmTreatmentにないものを追加する
            newVal.forEach((site) => {
              if (!detailInformationOfAneurysmTreatment.value.map((eachSite) => eachSite.site).includes(site)) {
                detailInformationOfAneurysmTreatment.value.push({
                  site: site,
                  method: '',
                  clip: [''],
                });
              }
            });
          } else {
            // detailInformationOfAneurysmTreatmentに余分にあるものを削除する
            detailInformationOfAneurysmTreatment.value = detailInformationOfAneurysmTreatment.value.filter((eachSite) => {
              return newVal.includes(eachSite.site);
            });
          }
        }, {immediate: true});
  
        //variables: dialog for selecting clip
        const dialog = ref(false);
        const selectedElement = ref('');
        const indexArrayForDialog = ref([]);
  
        //variables: closure
        const duraRepairMaterial = ref('');
        const duraRepairMaterialText = ref('');
        const artificialBone = ref('');
        const artificialBoneText = ref('');
  
        // methods
        // グラデーションの色を生成する関数
        const getCardStyle = (index) => {
          const color = `hsl(${index * 20}, 100%, 70%)`; // インデックスに基づいて色を生成
          return {
            borderLeft: `5px solid ${color}`,
            borderBottom: `5px solid ${color}`,
          };
        };
  
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
        watch(CraniotomyType, (newVal) => {
          if (newVal === 'pterional approach') {
            AnesthesiaHeadPosition.value.headRotation = '患側';
            AnesthesiaHeadPosition.value.headRotationDegree = '20';
          } else {
            AnesthesiaHeadPosition.value.headRotation = 'なし';
            AnesthesiaHeadPosition.value.headRotationDegree = '0';
          }
        }, {immediate: true});
  
        // clippingDetailText
        //operation texts
        const operationInfo = () => {
          return 'Clipping ' + operationSide.value + ' ' + ruptureOrNot.value
          // return 'Clipping ' + operationSide.value + ' ' + ruptureOrNot.value + ' ' + clippingSite.value.join(', ');
        }
  
        // extradural operation
        const extraduralOperationText = () => {
          const skinIncisionDesignText = 
          (CraniotomyType === 'pterional approach')? '皮膚切開は患側hair line内にCurved Shapeで正中付近から外耳道付近までのデザインで行った。'
          :'皮膚切開はhair line内にbicoronal Incisionのデザインで行った。';
          const skinIncisionText = '型どおり皮膚切開し、筋層も同様に切開した。筋層を骨弁から剥がしフックで翻転した。';
          const craniotomyText = '開頭は' + CraniotomyType.value + 'とし、Burr holeを3カ所開け、硬膜と骨を十分に剥離した後に骨切りした。骨弁を外し、硬膜、骨の止血を十分に行った。硬膜と周囲骨の間にサージセルを詰めた後、硬膜をTentingし、硬膜外からの出血をコントロールした。';
          const sphenoidRidgeText = (CraniotomyType === 'pterional approach')? 'sphenoid ridgeの硬膜を十分に剥がし、sphenoid ridgeをリューエルを用い十分に削った。':'';
          const duraOpeningText = (CraniotomyType === 'pterional approach')? '硬膜をBaseを基部とする半円状に切開し翻転した。4-0ニューロロンで硬膜をつり上げた。':
          'Sinusを基部とする半円状に切開し翻転した。4-0ニューロロンで硬膜をつり上げた。';
  
          return skinIncisionDesignText + skinIncisionText + craniotomyText + sphenoidRidgeText + duraOpeningText;
        }
  
        // intradural operation
        const intraduralOperationText = () => {
          const approachText = 'アプローチは' + approachType.value + 'とし、Sylvian fissureを十分に開けた。';
          const veinText = '静脈処理は' + difficultyOfVeinDissection.value + 'であった。';
  
          return approachText + veinText;
        }
  
  
        // clipping
        const clippingText = () => {
          const temporaryClipText = (useOfTemporaryClip.value === 'あり') ? 'テンポラリークリップを使用し、クリップ遮断時間は' + temporaryClippingTime.value + 'であった。': 'テンポラリークリップは使用しなかった。';
          const clippingDetailText = detailInformationOfAneurysmTreatment.value.map((detail, index) => {
            return (detail.method === 'clip') ? detail.site + 'に' + detail.clip.join(', ') + 'をクリップした。': detail.site + 'にwrappingを行った。';
          }).join('\r\n');
  
          return temporaryClipText + '\r\n' + clippingDetailText;
        }
  
        //closure
        const closureText = '硬膜を4-0ニューロロンで縫合した。元に戻し、硬膜をBaseを基部とする半円状に縫合した。筋層を縫合し、皮膚を縫合した。';
  
        const opeInformationItems = () =>{
          return {
          '破裂有無': ruptureOrNot.value,
          '手術側': operationSide.value,
          'クリップ部位': clippingSite.value.join(', '),
          'クリップ部位(その他)': clippingSiteText.value,
          '開頭': CraniotomyType.value,
          '開頭(その他)': CraniotomyTypeText.value,
          'アプローチ': approachType.value,
          'アプローチ(その他)': approachTypeText.value,
          '静脈処理の難易度': difficultyOfVeinDissection.value,
          'テンポラリークリップの使用': useOfTemporaryClip.value,
          'クリップ遮断時間': temporaryClippingTime.value,
          '硬膜修復材料': duraRepairMaterial.value,
          '硬膜修復材料(その他)': duraRepairMaterialText.value,
          '骨セメントの使用': artificialBone.value,
          '骨セメントの使用(その他)': artificialBoneText.value,
          'Kcode': 'K174-1 脳動脈瘤クリッピング術'
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
          const operationProcedureArray = 
          [extraduralOperationText(), intraduralOperationText(), '\n' + clippingProcedureDetailText.value + '\n', clippingText(), closureText];
          
          const operationRecordText = operationProcedureArray.join('\n');
    
          const opeInfoText = createOpeInfoItemsText(opeInformationItems());
          return operationInfo() + '\n\n' + operationRecordText + '\n\n{' + opeInfoText + '}';
        }
    
        defineExpose({
          createRecordForEachOperation,
        });
      </script>