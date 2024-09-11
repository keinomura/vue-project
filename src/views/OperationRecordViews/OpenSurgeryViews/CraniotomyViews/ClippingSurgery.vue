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
        <v-radio label="transsylvian" value="transsylvian approach"></v-radio>
        <v-radio label="subfrontal + transsylvian" value="subfrontal + transsylvian approach"></v-radio>
        <v-radio label="interhemispheric" value="interhemispheric approach"></v-radio>
        <v-radio label="subtemporal" value="subtemporal approach"></v-radio>
        <v-radio label="その他" value="その他"></v-radio>
      </v-radio-group>
      <v-text-field v-if="approachType === 'その他'" class="mx-2" v-model="approachTypeText" label="その他" outlined></v-text-field>
    </v-row>
  </v-card>

  <v-card class="my-2" elevation="3">
    <v-radio-group v-model="difficultyOfVeinDissection" label="静脈処理の難易度" inline>
      <v-radio label="容易" value="容易"></v-radio>
      <v-radio label="普通" value="普通"></v-radio>
      <v-radio label="難しい" value="難しい"></v-radio>
    </v-radio-group>
  </v-card>
  
  <h3 class="mx-2 my-2" style="color: grey;">クリップ詳細 順番はDragして変更</h3>
  <draggable 
    :list="detailInformationOfAneurysmTreatment"
    item-key="site"
    class="my-2 mx-2"
    >
    <template #item="{element, index}">
      <v-card class="my-2" :style="getCardStyle(index)">
        <v-row class="mx-2" style="height: auto;" align="center">
          <v-col cols="1">
            <h2>{{ index + 1 }}</h2>
          </v-col>
          <v-col cols="3" >
            <h3 v-if="element.site !== 'その他'">{{ element.site }}</h3>
            <v-text-field v-else v-model="element.siteText" label="部位" outlined></v-text-field>
          </v-col>
          <v-col cols="7" align-center>
            <v-radio-group v-model="element.method" inline >
              <v-radio label="clip" value="clip"></v-radio>
              <v-radio label="wrapping" value="wrapping"></v-radio>
            </v-radio-group>
          </v-col>
        </v-row>

        <v-row v-if="detailInformationOfAneurysmTreatment[index].method === 'clip'" v-for="(clip, cIndex) in detailInformationOfAneurysmTreatment[index].clip" class="my-2">
          <v-col cols="1">
            <h3 class="mx-5" style="color: gray;">{{ cIndex + 1 }}</h3>
          </v-col>
          <v-col cols="7">
            <v-btn @click="dialog = true; indexArrayForDialog = [index, cIndex]" style="width: auto;">
              <h3 v-if="clip !== ''">{{ clip }}</h3>
              <h3 v-else>クリップを選択</h3>
            </v-btn>
          </v-col>
          <v-col cols="2">
            <v-btn @click="detailInformationOfAneurysmTreatment[index].clip.push('')" style="width: auto;">追加</v-btn>
          </v-col>
          <v-col cols="2">
            <v-btn @click="detailInformationOfAneurysmTreatment[index].clip.splice(cIndex, 1)" style="width: auto;">削除</v-btn>
          </v-col>
        </v-row>

  <!-- ダイアログの定義 -->
        <v-dialog v-model="dialog" max-width="700px">
          <v-card>
            <v-card-title class="headline">ダイアログのタイトル</v-card-title>
            <v-card-text>
              <selectClip v-model:selectedClip="detailInformationOfAneurysmTreatment[indexArrayForDialog[0]].clip[indexArrayForDialog[1]]"></selectClip>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="dialog = false; selectedElement = ''">閉じる</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

      </v-card>
      
    </template>
  </draggable>
  <v-card class="my-2" elevation="3">
    <v-row class="mx-2 my-2">
      <h3 class="mx-2 my-2" style="color: grey;">クリップ詳細</h3>
      <v-textarea v-model="clippingProcedureDetailText" outlined></v-textarea>
    </v-row>
  </v-card>
  <v-card class="my-2" elevation="3">
    <v-row align="end"> 
      <v-col cols="5" >
          <v-radio-group v-model="useOfTemporaryClip" label="テンポラリークリップの使用" inline>
            <v-radio label="あり" value="あり"></v-radio>
            <v-radio label="なし" value="なし"></v-radio>
          </v-radio-group>
        </v-col>
        <v-col cols="5">
          <v-text-field v-if="useOfTemporaryClip === 'あり'" v-model="temporaryClippingTime" label="クリップ遮断時間" outlined></v-text-field>
        </v-col>
      </v-row>
  </v-card>
  <v-card class="my-2" elevation="3">
    <v-row class="my-2">
      <v-radio-group v-model="duraRepairMaterial" label="硬膜修復材料" inline>
        <v-radio label="DuraGen" value="DuraGen"></v-radio>
        <v-radio label="デュラウェーブ" value="デュラウェーブ"></v-radio>
        <v-radio label="なし" value="なし"></v-radio>
        <v-radio label="その他" value="その他"></v-radio>
      </v-radio-group>
      <v-text-field v-if="duraRepairMaterial === 'その他'" v-model="duraRepairMaterialText" label="その他" outlined></v-text-field>
    </v-row>
    <v-row>
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

      // models 親コンポーネントの変数と同期させる
      const operationType = defineModel('operationType');
      const AnesthesiaHeadPosition = defineModel('AnesthesiaHeadPosition');
  
      // variables: operation information
      const ruptureOrNot = ref('');
      const operationSide = ref('');
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