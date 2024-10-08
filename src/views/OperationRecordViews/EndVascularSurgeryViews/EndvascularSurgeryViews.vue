<template>
  <h3 class="mx-2 my-2" style="color: grey;">クリップ詳細 順番はDragして変更</h3>
  <v-card class="mx-2 my-2">
    <v-row class="mx-2 my-1">
      <v-col cols="3">
        <v-text-field v-model="heparinBolusIVDosage" label="ヘパリン使用量" outlined color="grey darken-1"></v-text-field>
      </v-col>
      <v-col cols="3">
        <v-text-field v-model="preACT" label="preACT" outlined color="grey darken-1"></v-text-field>
      </v-col>
      <v-col cols="3">
        <v-text-field v-model="postACT" label="postACT" outlined color="grey darken-1"></v-text-field>
      </v-col>
    </v-row>
    <v-row class="mx-2 my-1">
      <v-col cols="5">
        <h4>1時間毎に1000単位/1cc追加iv</h4>
      </v-col>
      <v-col cols="3">
        <v-text-field v-model="additionalHeparin" label="追加ヘパリン回数" outlined color="grey darken-1"></v-text-field>
      </v-col>
    </v-row>
  </v-card>


  <draggable 
    v-model="detailInformationOfTreatment"
    item-key="title"
    class="my-2 mx-2"
    @start="drag=true" 
    @end="drag=false" 
    >
    <template #item="{element, index}">
      <v-card class="my-2" color="lightgrey lighten-4">
        <v-row class="mx-2">
          <v-col cols="1">
            <h2>{{ index + 1 }}</h2>
          </v-col>
          <v-col cols="8">
            <v-row class="my-1">
              <v-combobox 
                :items="items"
                v-model="element.tempTitle"
                @blur="updateModel(element)"
                :value="element.tempTitle"
                validate-on-blur="true"
                disable-lookup
                color="grey darken-1"
              >
              </v-combobox>
            </v-row>
            <v-row >
              <endvascularSurgeryDialog 
                v-model:elementTitle="element.title"
                v-model:elementText="element.description"
                v-model:elementItem="element.Items"
                ></endvascularSurgeryDialog>
            </v-row>
            <v-row >
              <v-textarea v-model="element.description" label="部位" outlined color="grey darken-1"></v-textarea>
            </v-row>
          </v-col>
          <v-col cols="3" >
            <v-row class="mx-8 my-5">
              <v-btn color="teal-lighten-4" @click="detailInformationOfTreatment.splice(index + 1, 0, { title: '', description: '', tempTitle: '' })" style="margin-top: 10px;">追加</v-btn>
            </v-row>
            <v-row class="mx-8 my-5">
              <v-btn color="pink-lighten-4" @click="detailInformationOfTreatment.splice(index, 1)" style="width: auto;">削除</v-btn>
            </v-row>
          </v-col>
        </v-row>
      </v-card>
    </template>
  </draggable>

</template>

<script setup>
import { ref,watch } from 'vue';
import draggable from 'vuedraggable';
import endvascularSurgeryDialog from './EndvascularSurgeryDialog.vue';
import endvascularProcedures from './endovascularSurgeryProcedures.json'

// models 親コンポーネントの変数と同期させる
const operationType = defineModel('operationType');
const AnesthesiaHeadPosition = defineModel('AnesthesiaHeadPosition');
AnesthesiaHeadPosition.value.anesthesia = '局所麻酔';

// ヘパリン使用量
const heparinBolusIVDosage = ref('5000');
const preACT = ref('');
const postACT = ref('');
const additionalHeparin = ref('');




const drag = ref(false);
const selectedIndex = ref(null);

const detailInformationOfTreatmentList = endvascularProcedures;
// const detailInformationOfTreatmentList = {
//     'CAS':{
//       'details':
//         [
//           {'title':'シース挿入', 'description':'8Frシースを右大腿動脈に挿入。'},
//           {'title':'親カテ挿入', 'description':'Branchor XS 8Fr  + JB2 6Fr アングル 0.035inch 150cmにてCCAまで親カテを挿入。', 
//             'Items':{'firstItem':['Branchor XS', '8Fr', ''], 'secondItem':['JB2', '6Fr', ''], 'thirdItem':['アングル', '0.035inch', '150cm']}
//           },
//           {'title': '頭頚部DSA ', 'description':'CCA, ICA狭窄部を確認。頭部DSA異常なし。'},
//           {'title': '3D DSA 造影', 'description':'3D DSA造影。CCA､ICAの径を測定。'},
//           {'title': 'フィルター挿入', 'description':'lesion crossする際に親カテのバルーンを拡張し総頚動脈遮断。FilterWire EZ 3.5-5.5mm  をICに挿入し展開した。',
//             'Items':{'firstItem':['FilterWire EZ ', '3.5-5.5mm', ''], 'secondItem':['', '', '']}
//           },
//           {'title': 'CCA造影', 'description':'CCA, ICAに閉塞なし、血栓無し、spasmなし。'},
//           {'title': 'prestent ballooning', 'description':'Rx-Genetiy 3.0mm 40mmを狭窄部に挿入し、prestent ballooningを行った。8atm, 30sec',
//             'Items':{'firstItem':['Rx-Genetiy', '3.0mm', '40mm']}
//           },
//           {'title': 'stent留置', 'description':'PPRECISE PRO RX 8mm 30mmを狭窄部に留置した。',
//             'Items':{'firstItem':['PPRECISE PRO RX', '8mm', '30mm']}
//           },
//           {'title': 'poststent ballooning', 'description':'Rx-Genetiy 4.0mm 40mmをステント内、狭窄拡張部に挿入し、poststent ballooningを行った。8atm, 30sec',
//             'Items':{'firstItem':['Rx-Genetiy', '4.0mm', '40mm']}
//           },
//           {'title': 'stent後造影', 'description':'stentの位置は正常。狭窄部の拡張を確認した。頭部DSAでの異常なし。'},
//           {'title': '親カテ回収', 'description':'親カテを回収。'},
//           {'title': '止血', 'description':'exosheelを使用して止血。'},
//           {'title': '終了', 'description':'手術終了。'},
//         ]
//     },
//     'PTA':{
//       'details':
//         [
//           {'title':'シース挿入', 'description':'8Frシースを右大腿動脈に挿入。'},
//           {'title':'親カテ挿入', 'description':'Branchor XS 8Fr  + JB2 6Fr アングル 0.035inch 150cmにてCCAまで親カテを挿入。', 
//             'Items':{'firstItem':['Branchor XS', '8Fr', ''], 'secondItem':['JB2', '6Fr', ''], 'thirdItem':['アングル', '0.035inch', '150cm']}
//           },
//           {'title': '頭頚部DSA ', 'description':'CCA, ICA狭窄部を確認。頭部DSA異常なし。'},
//           {'title': '3D DSA 造影', 'description':'3D DSA造影。CCA､ICAの径を測定。'},
//           {'title': 'フィルター挿入', 'description':'lesion crossする際に親カテのバルーンを拡張し総頚動脈遮断。FilterWire EZ 3.5-5.5mm  をICに挿入し展開した。',
//             'Items':{'firstItem':['FilterWire EZ ', '3.5-5.5mm', ''], 'secondItem':['', '', '']}
//           },
//           {'title': 'CCA造影', 'description':'CCA, ICAに閉塞なし、血栓無し、spasmなし。'},
//           {'title': 'ballooning', 'description':'Rx-Genetiy 3.0mm 40mmを狭窄部に挿入し、ballooningを行った。8atm, 30sec',
//             'Items':{'firstItem':['Rx-Genetiy', '3.0mm', '40mm']}
//           },
//           {'title': 'ballooning後造影', 'description':'狭窄部の拡張を確認した。頭部DSAでの異常なし。'},
//           {'title': '親カテ回収', 'description':'親カテを回収。'},
//           {'title': '止血', 'description':'exosheelを使用して止血。'},
//           {'title': '終了', 'description':'手術終了。'},
//         ]
//     },
//     'Coil':{
//       'details':
//         [
//           {'title':'シース挿入', 'description':'8Frシースを右大腿動脈に挿入。'},
//           {'title':'親カテ挿入', 'description':'Branchor XS 8Fr  + JB2 6Fr アングル 0.035inch 150cmにてICAまで親カテを挿入。',
//             'Items':{'firstItem':['Branchor XS', '8Fr', ''], 'secondItem':['JB2', '6Fr', ''], 'thirdItem':['アングル', '0.035inch', '150cm']}
//           },
//           {'title': '頭頚部DSA ', 'description':'動脈瘤を確認。その他頭部DSA異常なし。'},
//           {'title': '3D DSA 造影', 'description':'3D DSA造影。動脈瘤の形状、径を測定した。working angleでroad map撮影した。'},
//           {'title': 'road map造影', 'description':'working angleでroad map撮影した。'},
//           {'title': 'DAC挿入', 'description':'Tactics, SL-10, ChikaiでDACをIC topに留置した。',
//             'Items':{'firstItem':['Tactics', '4Fr', '150cm'], 'secondItem':['SL-10', '0.014inch', ''], 'thirdItem':['Chikai', '0.014inch', '150cm']}
//           },
//           {'title': 'バルーン留置', 'description':'Scepter C 4.0mm 20mmをExcelsior SL-10 0.014inch  + Chikai 0.014inch 150cmにて動脈瘤Neckにかけられるように留置した。',
//             'Items':{'firstItem':['Scepter C', '4.0mm', '20mm'], 'secondItem':['Chikai', '0.014inch', '150cm']}
//           },
//           {'title': 'ステントスタンバイ', 'description': 'LVIS Jr. 2.5mm 13mmをExcelsior SL-10 0.014inch + CHIKAI X014 0.014inch 200cmにて動脈瘤Neckに展開できるようにスタンバイした。',
//             'Items':{'firstItem':['LVIS Jr.', '2.5mm', '13mm'], 'secondItem':['SL-10', '0.014inch', ''], 'thirdItem':['Chikai', '0.014inch', '150cm']}
//           },
//           {'title': 'マイクロカテーテルを瘤内に挿入', 'description':'動脈瘤内にマイクロカテーテルを挿入した。',
//             'Items':{'firstItem':['SL-10', '0.014inch', ''], 'secondItem':['Chikai', '0.014inch', '150cm']}
//           },
//           {'title': 'ステント展開', 'description':'ステント展開した。',},
//           {'title': 'バルーン拡張', 'description':'バルーン拡張した。'},
//           {'title': 'コイル挿入 フレーミング', 'description':'コイル挿入'},
//           {'title': 'コイル挿入 フィリング', 'description':'コイル挿入'},
//           {'title': 'コイル挿入 フィニッシング', 'description':'コイル挿入'},
//           {'title': 'コイル後造影', 'description':'動脈瘤の消失を確認。頭部DSAでの異常なし。'},
//           {'title': 'カテ回収', 'description':'マイクロカテーテル、DAC, 親カテを回収。'},
//           {'title': '止血', 'description':'exosheelを使用して止血。'},
//           {'title': '終了', 'description':'手術終了。'},
//         ]
//     },
//     'FD':{
//       'details':
//         [
//           {'title':'シース挿入', 'description':'8Frシースを右大腿動脈に挿入。'},
//           {'title':'親カテ挿入', 'description':'Branchor XS 8Fr  + JB2 6Fr アングル 0.035inch 150cmにてICAまで親カテを挿入。',
//             'Items':{'firstItem':['Branchor XS', '8Fr', ''], 'secondItem':['JB2', '6Fr', ''], 'thirdItem':['アングル', '0.035inch', '150cm']}
//           },
//           {'title': '頭頚部DSA ', 'description':'動脈瘤を確認。その他頭部DSA異常なし。'},
//           {'title': '3D DSA 造影', 'description':'3D DSA造影。動脈瘤の形状、径を測定した。working angleでroad map撮影した。'},
//           {'title': 'road map造影', 'description':'working angleでroad map撮影した。'},
//           {'title': 'DAC挿入', 'description':'SOFIA SELECT 6Fr 125cmをHeadway Plus0.027inch  + Synchro SELECT Standard 0.014inch 215cmにてIC、動脈瘤遠位部に留置した。',
//             'Items':{'firstItem':['SOFIA SELECT', '6Fr', '125cm'], 'secondItem':['Headway Plus', '0.027inch', ''], 'thirdItem':['Synchro SELECT Standard', '0.014inch', '215cm']}
//           },
//           {'title': 'マイクロカテーテルをFD留置部先端まで挿入', 'description':'動脈瘤内にマイクロカテーテルを挿入した。',
//             'Items':{'firstItem':['Headway Plus', '0.027inch', ''], 'secondItem':['Synchro SELECT Standard', '0.014inch', '215cm']}
//           },
//           {'title': 'FD留置', 'description':'ステント展開した。',
//             'Items':{'firstItem':['FRED', '4.5mm', '20mm']}
//           },
//           {'title': 'ステント留置後造影', 'description':'FDが動脈瘤を十分にカバーしていることを確認。頭部DSAでの異常なし。'},
//           {'title': 'カテ回収', 'description':'マイクロカテーテル、DAC, 親カテを回収。'},
//           {'title': '止血', 'description':'exosheelを使用して止血。'},
//           {'title': '終了', 'description':'手術終了。'},
//         ]
//     },
//     'MT':{
//       'details':
//         [
//           {'title':'診断用4Frシース挿入', 'description':'4Frシースを右大腿動脈に挿入。'},
//           {'title':'診断DSA', 'description':'JB2 4Fr アングル 0.035inch 150cmにて閉塞血管、閉塞部位を確認。', 
//             'Items':{'firstItem':['JB N-18', '4Fr', ''], 'secondItem':['アングル', '0.035inch', '150cm']}
//           },
//           {'title':'シース入れ替え', 'description':'8Frシースを右大腿動脈に入れ替え挿入。'},
//           {'title':'親カテ挿入', 'description':'Branchor XS 8Fr  + JB2 4Fr アングル 0.035inch 150cmにてICAまで親カテを挿入。',
//             'Items':{'firstItem':['Branchor XS', '8Fr', ''], 'secondItem':['JB2', '4Fr', ''], 'thirdItem':['アングル', '0.035inch', '150cm']}
//           },
//           {'title': '吸引カテーテル挿入', 'description':'SOFIA SELECT 6Fr 125cmをHeadway Plus0.027inch  + Synchro SELECT Standard 0.014inch 215cmにて閉塞部位近傍まで進めた。',
//             'Items':{'firstItem':['REACT', '6Fr', '125cm'], 'secondItem':['Phenom', '0.027inch', ''], 'thirdItem':['Synchro SELECT Standard', '0.014inch', '215cm']}
//           },
//           {'title': '血栓超えてマイクロ留置', 'description':'血栓を超えてステント展開位置までマイクロカテーテルを留置した。',
//             'Items':{'firstItem':['Phenom', '0.027inch', ''], 'secondItem':['Synchro SELECT Standard', '0.014inch', '215cm']}
//           },
//           {'title': 'マイクロカテーテル造影', 'description':'末梢が造影され、カテーテルが血栓位置を超えていることを確認した。'},
//           {'title': '吸引カテーテルを血栓まで', 'description':'吸引カテーテルを進め、血栓吸引ができる位置に留置した。'},
//           {'title': 'ステントリトリーバー留置', 'description':'Solitaire X 4mm 40mmを閉塞部位に展開した。',
//             'Items':{'firstItem':['Solitaire X', '4mm', '40mm']}
//           },
//           {'title': '親カテでIC遮断', 'description':'親カテのバルーンを充填させ、ICA遮断した。'},
//           {'title': '吸引開始', 'description':'吸引カテーテルでの吸引開始した。'},
//           {'title': '血栓回収', 'description':'血栓回収した。'},
//           {'title': 'IC遮断解除', 'description':'ICA遮断解除した。'},
//           {'title': 'DSA', 'description':'血栓回収を確認した。'},
//           {'title': 'カテ回収', 'description':'マイクロカテーテル、DAC, 親カテを回収。'},
//           {'title': '止血', 'description':'exosheelを使用して止血。'},
//           {'title': 'ショートシースに入れ替え', 'description':'抜去せず、8Frショートシースに入れ替えた。'},
//           {'title': '終了', 'description':'手術終了。'},
//         ]
//     },
//     'PTA エリル動注':{
//       'details':
//       [
//           {'title':'シース挿入', 'description':'8Frシースを右大腿動脈に挿入。'},
//           {'title':'親カテ挿入', 'description':'Branchor XS 8Fr  + JB2 6Fr アングル 0.035inch 150cmにてICAまで親カテを挿入。',
//             'Items':{'firstItem':['Branchor XS', '8Fr', ''], 'secondItem':['JB2', '6Fr', ''], 'thirdItem':['アングル', '0.035inch', '150cm']}
//           },
//           {'title': '頭頚部DSA ', 'description':'Spasmを確認。その他頭部DSA異常なし。'},
//           {'title': 'DAC挿入', 'description':'Tactics, SL-10, ChikaiでDACをICに留置した。',
//             'Items':{'firstItem':['Tactics', '4Fr', '150cm'], 'secondItem':['SL-10', '0.014inch', ''], 'thirdItem':['Chikai', '0.014inch', '150cm']}
//           },
//           {'title': 'バルーン留置(PTA)', 'description':'UNRYU XP 4.0mm 20mmをChikai 0.014inch 150cmにて狭窄部にかけられるように留置した。',
//             'Items':{'firstItem':['UNRYU XP', '4.0mm', '20mm'], 'secondItem':['Chikai', '0.014inch', '150cm']}
//           },
//           {'title': 'バルーン拡張', 'description':'バルーン拡張しPTAを行った。'},
//           {'title': 'エリル動注', 'description':'マイクロカテーテルを狭窄部近位に留置し、エリル動注を行った。'},
//           {'title': '確認造影', 'description':'Spasmによる狭窄部が拡張していることを確認した。'},
//           {'title': 'カテ回収', 'description':'マイクロカテーテル、DAC, 親カテを回収。'},
//           {'title': '止血', 'description':'exosheelを使用して止血。'},
//           {'title': '終了', 'description':'手術終了。'},
//         ]
//     }, 
//     'その他 血管内手術':{
//       'details':
//       [
//           {'title':'シース挿入', 'description':'8Frシースを右大腿動脈に挿入。'},
//           {'title':'親カテ挿入', 'description':'Branchor XS 8Fr  + JB2 6Fr アングル 0.035inch 150cmにてICAまで親カテを挿入。',
//             'Items':{'firstItem':['Branchor XS', '8Fr', ''], 'secondItem':['JB2', '6Fr', ''], 'thirdItem':['アングル', '0.035inch', '150cm']}
//           },
//           {'title': '頭頚部DSA ', 'description':'頭部DSA所見:'},
//           {'title': 'DAC挿入', 'description':'Tactics, SL-10, ChikaiでDACをICに留置した。',
//             'Items':{'firstItem':['Tactics', '4Fr', '150cm'], 'secondItem':['SL-10', '0.014inch', ''], 'thirdItem':['Chikai', '0.014inch', '150cm']}
//           },
//           {'title': 'マイクロカテーテルを挿入', 'description':'マイクロカテーテルを挿入した。',
//             'Items':{'firstItem':['SL-10', '0.014inch', ''], 'secondItem':['Chikai', '0.014inch', '150cm']}
//           },
//           {'title': '確認造影', 'description':'Spasmによる狭窄部が拡張していることを確認した。'},
//           {'title': 'カテ回収', 'description':'マイクロカテーテル、DAC, 親カテを回収。'},
//           {'title': '止血', 'description':'exosheelを使用して止血。'},
//           {'title': '終了', 'description':'手術終了。'},
//         ]
//     }
//   };
  // const detailInformationOfTreatment = ref(detailInformationOfTreatmentList['Coil']['details']);
  const detailInformationOfTreatment = ref([]);

  watch(operationType, (newVal) => {
    console.log(newVal);
    detailInformationOfTreatment.value = detailInformationOfTreatmentList[newVal]['details'];
  }, { immediate: true });

  const items = ref([
    'シース挿入',
      '親カテ挿入',
      '頭頚部DSA',
      '3D DSA 造影',
      'フィルター挿入',
      'CCA造影',
      'DAC挿入',
      'バルーン留置',
      'FD留置', 
      'ステントスタンバイ', 
      'コイル挿入 フレーミング', 
      'コイル挿入 フィリング', 
      'コイル挿入 フィニッシング',
      'prestent ballooning',
      'stent留置',
      'poststent ballooning',
      'stent後造影',
      '診断DSA', 
      '吸引カテーテル挿入', 
      '血栓回収',
      'ステントリトリーバー留置', 
      'バルーン留置(PTA)',
      '親カテ回収',
      '止血',
      '終了',
  ]);


  // 初期化時にtempTitleを設定
  watch(detailInformationOfTreatment, (newVal) => {
    newVal.forEach(element => {
      element.tempTitle = element.title;
    });
  }, { immediate: true });

  const updateModel = (element) => {
    element.title = element.tempTitle;
  };
  const addNewDetail = () => {
  const newDetail = { title: '', description: '', tempTitle: '' };
  if (selectedIndex.value !== null) {
    detailInformationOfTreatment.value.splice(selectedIndex.value + 1, 0, newDetail);
  } else {
    detailInformationOfTreatment.value.push(newDetail);
  }
};
</script>