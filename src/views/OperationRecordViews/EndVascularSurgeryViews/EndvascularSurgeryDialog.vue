<template>
            <v-col cols="7"  v-if="buttonDisplay">
            <v-btn @click="dialog = true;"  style="width: auto;">
              <h3>ヒントを選択</h3>
            </v-btn>
          </v-col>
    <!-- ダイアログの定義 -->
    <v-dialog v-model="dialog" max-width="700px">
          <v-card>
            <v-card-title class="headline">{{ elementTitle }}</v-card-title>
            <v-card-text>

            <template v-if="elementTitle === 'シース挿入'">
              <v-row>
                <v-radio-group v-model="punctureSide" inline>
                  <v-radio v-model="punctureSide" v-for="side in ['右','左']" :label="side" :value="side" inline></v-radio>
                </v-radio-group>
                </v-row>
                <v-row>
                  <v-radio-group v-model="punctureSite" inline>
                    <v-radio v-model="punctureSite" v-for="site in ['femoral','radial','brachial','distal radial', 'その他']" :label="site" :value="site" inline></v-radio>
                  </v-radio-group>
                  <v-radio-group v-model="vesselType" inline>
                    <v-radio v-model="vesselType" v-for="type in ['artery','vein']" :label="type" :value="type" inline></v-radio>
                  </v-radio-group>
                </v-row>
                <v-row>
                  <v-radio-group v-model="sheathLength" inline>
                    <v-radio v-for="type in ['Long', 'Short']" :label="type" :value="type" inline></v-radio>
                  </v-radio-group>
                  <v-radio-group v-model="sheathSize" inline>
                    <v-radio v-model="sheathSize" v-for="size in ['5Fr','6Fr','7Fr','8Fr','9Fr', 'その他']" :label="size" :value="size" inline></v-radio>
                  </v-radio-group>
                </v-row>
            </template>

            <template v-if="elementTitle === '親カテ挿入'">
              <v-row>
                <itemSelector 
                  v-for="item in ItemsForParentCatheter"
                  :key="item.id"
                  v-model:childList="item.list"
                  v-model:selectedItem="item.selectedItem"
                  class="mx-2"></itemSelector>
              </v-row>
              <v-radio-group v-model="settingPoint" class="my-2 mx-2" inline label="留置位置">
                <v-radio v-for="settingPoint in ['CCA', 'ICA', 'ECA', 'その他']" :label="settingPoint" :value="settingPoint" inline></v-radio>
              </v-radio-group>
              <v-textarea class="my-2" v-model="parentCatheterText" label="親カテ挿入" outlined color="grey darken-1"></v-textarea>
            </template>

            <template v-if="elementTitle === 'フィルター挿入'">
              <v-row>
                <itemSelector
                  v-model:childList="protectionDeviceList"
                  v-model:selectedItem="firstSelectedItem"
                  class="mx-2"></itemSelector>
                <itemSelector
                  v-if="firstSelectedItem.includes('SpiderFX') "
                  v-model:childList="microGuideWireList"
                  v-model:selectedItem="secondSelectedItem"
                  class="mx-2"></itemSelector>
              </v-row>
            </template>

            <template v-if="elementTitle.includes('ballooning')">
                <itemSelector 
                  v-model:childList="ballooningList" 
                  v-model:selectedItem="firstSelectedItem"
                  class="mx-2"></itemSelector>
            </template>

            <template v-if="elementTitle === 'stent留置'">
                <itemSelector 
                  v-model:childList="stentForCarotidList"
                  v-model:selectedItem="firstSelectedItem"
                  class="mx-2"></itemSelector>
            </template>

            <template v-if="elementTitle === 'DAC挿入'">
              <v-row></v-row>
              <v-row>
                <itemSelector 
                  v-for="item in ItemsForDAC"
                  :key="item.id"
                  v-model:childList="item.list"
                  v-model:selectedItem="item.selectedItem"
                  class="mx-2"></itemSelector>
              </v-row>
            </template>

            <template v-if="elementTitle.includes('バルーン留置')">
              <v-row></v-row>
              <v-row>
                <itemSelector 
                  v-for="item in ItemsForBalloon"
                  :key="item.id"
                  v-model:childList="item.list"
                  v-model:selectedItem="item.selectedItem"
                  class="mx-2"></itemSelector>
              </v-row>
            </template>

            <template v-if="elementTitle === 'ステントスタンバイ'">
              <v-row></v-row>
              <v-row>
                <itemSelector 
                  v-for="item in ItemsForStent"
                  :key="item.id"
                  v-model:childList="item.list"
                  v-model:selectedItem="item.selectedItem"
                  class="mx-2"></itemSelector>
              </v-row>
            </template>

            <template v-if="elementTitle.includes('コイル挿入')">
              <v-row v-for="(coil, index) in coils" :key="coil.id" class="align-center mb-2">
                <v-col cols="5">
                  <itemSelector 
                    v-model:childList="coil.list"
                    class="mx-2"
                    v-model:selectedItem="coil.selectedItem"></itemSelector>
                </v-col>
                <v-col cols="3">
                  <v-text-field
                    label="本数"
                    type="number"
                    min="1"
                    class="mx-2"
                    v-model="coil.count"
                  ></v-text-field>
                </v-col>
                <v-col cols="2">
                  <v-btn @click="addCoil" class="mx-2">追加</v-btn>
                </v-col>
                <v-col cols="2">
                  <v-btn @click="removeCoil(index)" class="mx-2" v-if="coils.length > 1">削除</v-btn>
                </v-col>
              </v-row>
            </template>

            <template v-if="elementTitle === 'FD留置'">
              <v-row>
                <itemSelector 
                  v-for="item in ItemsForFD"
                  :key="item.id"
                  v-model:childList="item.list"
                  v-model:selectedItem="item.selectedItem"
                  class="mx-2"></itemSelector>
              </v-row>
            </template>

            <template v-if="elementTitle === '診断DSA'">
              <v-row>
                <itemSelector 
                  v-for="item in ItemsForDSA"
                  :key="item.id"
                  v-model:childList="item.list"
                  v-model:selectedItem="item.selectedItem"
                  class="mx-2"></itemSelector>
              </v-row>
              <v-radio-group v-model="occlusionSite" class="my-2 mx-2" inline label="閉塞血管">
                <v-radio v-for="occlusionSite in ['頚部ICA', '頭蓋内ICA', 'MCA:M1', 'MCA:M2', 'MCA:M3', 'ACA:A1', 'ACA:A2', 'ACA:A3', 'VA', 'BA']" :label="occlusionSite" :value="occlusionSite" inline></v-radio>
              </v-radio-group>
            </template>

            <template v-if="elementTitle === '吸引カテーテル挿入'">
              <v-row>
                <itemSelector 
                  v-for="item in ItemsForSuctionCatheter"
                  :key="item.id"
                  v-model:childList="item.list"
                  v-model:selectedItem="item.selectedItem"
                  class="mx-2"></itemSelector>
              </v-row>
            </template>

            <template v-if="elementTitle === 'ステントリトリーバー留置'">
              <v-row>
                <itemSelector 
                  v-for="item in ItemsForStentRetriever"
                  :key="item.id"
                  v-model:childList="item.list"
                  v-model:selectedItem="item.selectedItem"
                  class="mx-2"></itemSelector>
              </v-row>
            </template>

            <template v-if="elementTitle === '血栓回収'">
              <v-row>
                <v-radio-group v-model="thrombectomyPass" class="my-2 mx-2" inline label="回収回数">
                  <v-radio v-for="pass in ['1 pass', '2 pass', '3 pass', '4 pass', 'more']" :label="pass" :value="pass" inline></v-radio>
                </v-radio-group>
                <v-text-field
                  v-if="thrombectomyPass === 'more'"
                  label="回数"
                  type="number"
                  min="5"
                  class="mx-2"
                  v-model="thrombectomyPassCount"
                ></v-text-field>
                <!-- TICIスコア入力する -->
                <v-radio-group v-model="ticiScore" class="my-2 mx-2" inline label="TICIスコア">
                  <v-radio
                    v-for="tici in ticiScores"
                    :key="tici.value"
                    :label="tici.value"
                    :value="tici.value"
                    inline
                  >
                    <v-tooltip
                        activator="parent"
                        bottom>{{ tici.description }}</v-tooltip>
                  </v-radio>
                </v-radio-group>

              </v-row>
            </template>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="dialog = false;elementText = createText()">上書き</v-btn>
              <v-btn color="blue darken-1" text @click="dialog = false;elementText = elementText + createText()">最後に追加</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
</template>

<script setup>
import { ref,watch } from 'vue';
import itemSelector from './itemSelector.vue';
// jsonファイルを読み込む(endovascularSurgeryItems.json)
import endovascularSurgeryItems from './endovascularSurgeryItems.json';

// 親コンポーネントから受け取るprops
const elementTitle = defineModel('elementTitle');
const elementText = defineModel('elementText');
const elementItem = defineModel('elementItem');

// ボタンを表示させるelementTitleのリスト
const buttonDisplay = ref(false);
const buttonDisplayTitles = 
  [
    'シース挿入', '親カテ挿入', 'フィルター挿入', 'prestent ballooning', 'stent留置', 'poststent ballooning', 'ballooning',
    'DAC挿入', 'バルーン留置', 'FD留置', 'ステントスタンバイ', 'コイル挿入 フレーミング', 'コイル挿入 フィリング', 'コイル挿入 フィニッシング',
    '診断DSA', '吸引カテーテル挿入', 'ステントリトリーバー留置', '血栓回収', 'バルーン留置(PTA)'
  ];

watch (elementTitle, (newValue) => {
  if (buttonDisplayTitles.includes(newValue)) {
    buttonDisplay.value = true;
  } else {
    buttonDisplay.value = false;
  }
}, { immediate: true });


// ダイアログの表示
const dialog = ref(false);

const mappingArrayForCreateText = () => {
  return {
  'シース挿入': sheathInsertionText(),
  '親カテ挿入': parentCatheterText.value,
  'フィルター挿入': filterInsertionText.value,
  'prestent ballooning': preBalloonText.value,
  'stent留置': stentForCarotidText.value,
  'poststent ballooning': postBalloonText.value,
  'DAC挿入': DACText.value,
  'バルーン留置': balloonText.value,
  'バルーン留置(PTA)': balloonText.value,
  'ステントスタンバイ': stentText.value,
  'コイル挿入 フレーミング': getCoilsDescription(),
  'コイル挿入 フィリング': getCoilsDescription(),
  'コイル挿入 フィニッシング': getCoilsDescription(),
  'FD留置': FDText.value,
  '診断DSA': mTDiagnosisText.value,
  '吸引カテーテル挿入': suctionCatheterText.value,
  'ステントリトリーバー留置': stentRetrieverText.value,
  '血栓回収': AISText.value
  }
}
function createText () {
  return mappingArrayForCreateText()[elementTitle.value];
}



// シース挿入
const punctureSide = ref('右');
const punctureSite = ref('femoral');
const punctureSiteText = ref('');
const vesselType = ref('artery');
const sheathLength = ref('Long');
const sheathSize = ref('8Fr');
const sheathSizeText = ref('');
const sheathInsertionText = () => {
  return punctureSide.value + punctureSite.value + ' ' + vesselType.value + 'より、' + sheathLength.value + ' ' + sheathSize.value + 'シースを挿入。';
}


//初期値がある場合は、ref()の引数に初期値を渡す
// 親カテの選択
const firstSelectedItem = ref([]);
const secondSelectedItem = ref([]);
const thirdSelectedItem = ref([]);

//
const coilsDescription = ref([]);

watch(elementItem, (newValue) => {
  if (!newValue) {
    return;
  }
  if (newValue.firstItem) {
    firstSelectedItem.value = newValue.firstItem;
  }
  if (newValue.secondItem) {
    secondSelectedItem.value = newValue.secondItem;
  }
  if (newValue.thirdItem) {
    thirdSelectedItem.value = newValue.thirdItem;
  }
}, { immediate: true }); //immediate: trueオプションを使用して、watchが初期化時にも実行されるようにします。


// 親カテ
const parentCatheterList = endovascularSurgeryItems.guidingCatheter.concat(endovascularSurgeryItems.occlusionBallonCatheter);
const catheterForDiagnosticList = endovascularSurgeryItems.catheterForDiagnostic;
const guideWireList = endovascularSurgeryItems.guideWire;
const settingPoint = ref('CCA');

//CAS
const protectionDeviceList = endovascularSurgeryItems.protectionDevice;
const ballooningList = endovascularSurgeryItems.PTABalloon;
const stentForCarotidList = endovascularSurgeryItems.stentForCarotid;
const microGuideWireList = endovascularSurgeryItems.microGuideWire;

//Coil
const DACList = endovascularSurgeryItems.DAC;
const microCatheterList = endovascularSurgeryItems.microCatheter;
const balloonList = endovascularSurgeryItems.balloon;
const stentList = endovascularSurgeryItems.stent;
const coilList = endovascularSurgeryItems.coil;

// FD
const FDList = endovascularSurgeryItems.flowDiverter;

// MT
const suctionCatheterList = endovascularSurgeryItems.suctionCatheter;
const stentRetrieverList = endovascularSurgeryItems.stentRetriever;


// 親カテ挿入
const ItemsForParentCatheter = ref([
  { id: 1, list: parentCatheterList, selectedItem: firstSelectedItem },
  { id: 2, list: catheterForDiagnosticList, selectedItem: secondSelectedItem },
  { id: 3, list: guideWireList, selectedItem: thirdSelectedItem }
]);
const parentCatheterText = ref('');
watch([firstSelectedItem, secondSelectedItem, thirdSelectedItem], () => {
  parentCatheterText.value = firstSelectedItem.value.join(' ') + ' + ' + secondSelectedItem.value.join(' ') + ' + ' + thirdSelectedItem.value.join(' ') + 'にて' + settingPoint.value + 'まで親カテを挿入。';
}, { immediate: true, deep: true });



// filter挿入
watch (firstSelectedItem, (newValue) => {
  if (elementTitle !== 'フィルター挿入') {
    return;
  }
  if (!newValue.includes('SpiderFX')) {
    secondSelectedItem.value = [];
  }
}, { immediate: true });

const filterInsertionText = ref('');
watch([firstSelectedItem, secondSelectedItem], () => {
  filterInsertionText.value = 'lesion crossする際に親カテのバルーンを拡張し総頚動脈遮断。' + firstSelectedItem.value.join(' ') + ' ' + secondSelectedItem.value.join(' ') + 'をICに挿入し展開した。';
}, { immediate: true, deep: true });

// prestent ballooning
const preBalloonText = ref('');
watch(firstSelectedItem, () => {
  preBalloonText.value = firstSelectedItem.value.join(' ') + 'を狭窄部に挿入し、prestent ballooningを行った。8atm, 30sec';
}, { immediate: true });

// stent留置
const stentForCarotidText = ref('');
watch(firstSelectedItem, () => {
  stentForCarotidText.value = firstSelectedItem.value.join(' ') + 'を狭窄部に留置した。';
}, { immediate: true });

// poststent ballooning
const postBalloonText = ref('');
watch(firstSelectedItem, () => {
  postBalloonText.value = firstSelectedItem.value.join(' ') + 'をステント内、狭窄拡張部に挿入し、poststent ballooningを行った。8atm, 30sec';
}, { immediate: true });


// DAC挿入
const ItemsForDAC = ref([
  { id: 1, list: DACList, selectedItem: firstSelectedItem },
  { id: 2, list: microCatheterList, selectedItem: secondSelectedItem },
  { id: 3, list: microGuideWireList, selectedItem: thirdSelectedItem }
]);

const DACText = ref('');
watch([firstSelectedItem, secondSelectedItem, thirdSelectedItem], () => {
  DACText.value = firstSelectedItem.value.join(' ') + 'を' + secondSelectedItem.value.join(' ') + ' + ' +  thirdSelectedItem.value.join(' ') + 'にてIC topに留置した。';
}, { immediate: true, deep: true });

// balloon留置
// idをつけることでリアルタイムに反映できた
const ItemsForBalloon = ref([
  { id: 1, list: balloonList, selectedItem: firstSelectedItem },
  { id: 3, list: microGuideWireList, selectedItem: thirdSelectedItem }
]);

const balloonText = ref('');
watch([firstSelectedItem, secondSelectedItem, thirdSelectedItem], () => {
  const position = (elementTitle.value.includes('PTA')) ? '狭窄部' : '動脈瘤Neck';
  balloonText.value = firstSelectedItem.value.join(' ') + 'を' + secondSelectedItem.value.join(' ') + 'にて' + position + 'にかけられるように留置した。';
}, { immediate: true, deep: true });

// ステントスタンバイ
const ItemsForStent = ref([
  { id: 1, list: stentList, selectedItem: firstSelectedItem },
  { id: 2, list: microCatheterList, selectedItem: secondSelectedItem },
  { id: 3, list: microGuideWireList, selectedItem: thirdSelectedItem }
]);
const stentText = ref('');
watch([firstSelectedItem, secondSelectedItem, thirdSelectedItem], () => {
  stentText.value = firstSelectedItem.value.join(' ') + 'を' + secondSelectedItem.value.join(' ') + ' + ' + thirdSelectedItem.value.join(' ') + 'にて動脈瘤Neckに展開できるようにスタンバイした。';
}, { immediate: true, deep: true });


// Coil挿入 共通
// Dialogからもとのコンポーネントに返す値は elementText に格納する.
// elementItem には選択したアイテムを格納する.ここではcoilsにする。

const coils = ref([
  { id: 1, list: coilList, selectedItem: [], count: 1 }
]);

const addCoil = () => {
  const newId = coils.value.length + 1;
  coils.value.push({ id: newId, list: coilList, selectedItem: [], count: 1 });
};

const removeCoil = (index) => {
  if (coils.value.length > 1) {
    coils.value.splice(index, 1);
  }
};

watch(coils, (newValue) => {
  elementItem.value = coils.value;
}, { immediate: true });


//最終的に選択したコイルと、本数を取得する。
//([{ id: 1, list: coilList, selectedItem: ref([]), count: 1 }, { id: 2, list: coilList, selectedItem: ref([]), count: 1 }]);...
//これから　すべてのコイル名　本数　を取得する。
function getCoilsDescription() {
  let description = '';
  coils.value.forEach((coil, index) => {
    if (coil.selectedItem.length > 0) {
      description += coil.selectedItem.join(' ') + ' ' + coil.count + '本\n';
    }
  });
  return description;
}

// FD留置
const ItemsForFD = ref([
  { id: 1, list: FDList, selectedItem: firstSelectedItem },
  { id: 2, list: microCatheterList, selectedItem: secondSelectedItem },
]);
const FDText = ref('');
watch([firstSelectedItem, secondSelectedItem], () => {
  FDText.value = firstSelectedItem.value.join(' ') + 'を' + secondSelectedItem.value.join(' ') + 'にて展開、留置した。';
}, { immediate: true, deep: true });

// 診断DSA
const ItemsForDSA = ref([
  { id: 1, list: catheterForDiagnosticList, selectedItem: firstSelectedItem },
  { id: 2, list: guideWireList, selectedItem: secondSelectedItem },
]);
const occlusionSite = ref('');

const mTDiagnosisText = ref('');
watch([firstSelectedItem, secondSelectedItem], () => {
  mTDiagnosisText.value = firstSelectedItem.value.join(' ') + ' + ' + secondSelectedItem.value.join(' ') +  'にて診断DSAを行った。閉塞血管は' + occlusionSite.value + '。';
}, { immediate: true, deep: true });

// 吸引カテーテル挿入
const ItemsForSuctionCatheter = ref([
  { id: 1, list: suctionCatheterList, selectedItem: firstSelectedItem },
  { id: 2, list: microCatheterList, selectedItem: secondSelectedItem },
  { id: 3, list: microGuideWireList, selectedItem: thirdSelectedItem },
]);
const suctionCatheterText = ref('');
watch([firstSelectedItem, secondSelectedItem], () => {
  suctionCatheterText.value = firstSelectedItem.value.join(' ') + 'を' + secondSelectedItem.value.join(' ') + ' + ' + thirdSelectedItem.value.join(' ') + 'にて閉塞部位近傍まで進めた。';
}, { immediate: true, deep: true });

// ステントリトリーバー留置
const ItemsForStentRetriever = ref([
  { id: 1, list: stentRetrieverList, selectedItem: firstSelectedItem },
]);

const stentRetrieverText = ref('');
watch(firstSelectedItem, () => {
  stentRetrieverText.value = firstSelectedItem.value.join(' ') + 'を閉塞部位に展開した。';
}, { immediate: true });

// 血栓回収
const thrombectomyPass = ref('');
const thrombectomyPassCount = ref(1); // 'more'の場合の回数を保持する変数
const ticiScore = ref('');

const ticiScores = [
  { value: '0', description: 'Grade 0 灌流なし' },
  { value: '1', description: 'Grade 1 再開通あるも抹消灌流なし' },
  { value: '2a', description: 'Grade 2a 血管支配領域の半分以下の灌流' },
  { value: '2b', description: 'Grade 2b 血管支配領域の半分以上の灌流' },
  { value: '3', description: 'Grade 3 抹消までの完全な灌流' }
];

const AISText = ref('');
watch([thrombectomyPass, thrombectomyPassCount, ticiScore], () => {
  if (thrombectomyPass.value === 'more') {
    AISText.value = '血栓回収を' + thrombectomyPassCount.value + '回行い、TICIスコアは' + ticiScore.value + '。';
  } else {
    AISText.value = '血栓回収を' + thrombectomyPass.value + '行い、TICIスコアは' + ticiScore.value + '。';
  }
}, { immediate: true });

</script>