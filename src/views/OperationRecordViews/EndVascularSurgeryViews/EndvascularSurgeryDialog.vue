<template>
            <v-col cols="7">
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
              <v-row class="mx-2 my-2
              ">
                <itemSelector 
                  v-model:childList="parentCatheterList" 
                  v-model:selectedItem="selectedParentCatheter"
                  class="mx-2"></itemSelector>
                <itemSelector 
                  v-model:childList="catheterForDiagnosticList" 
                  v-model:selectedItem="selectedCatheterForDiagnostic"
                  class="mx-2"></itemSelector>
                <itemSelector
                  v-model:childList="guideWireList"
                  v-model:selectedItem="selectedGuideWire"
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
                  v-model:selectedItem="selectedProtectionDevice"
                  class="mx-2"></itemSelector>
                <itemSelector
                  v-if="selectedProtectionDevice.includes('SpiderFX') "
                  v-model:childList="guideWireForFilterList"
                  v-model:selectedItem="selectedGuideWireForFilter"
                  class="mx-2"></itemSelector>
              </v-row>
            </template>

            <template v-if="elementTitle === 'prestent ballooning'">
                <itemSelector 
                  v-model:childList="ballooningList" 
                  v-model:selectedItem="selectedBallooning"
                  class="mx-2"></itemSelector>

            </template>

            <template v-if="elementTitle === 'stent留置'">
                <itemSelector 
                  v-model:childList="stentForCarotidList" 
                  class="mx-2"></itemSelector>
            </template>

            <template v-if="elementTitle === 'poststent ballooning'">
                <itemSelector 
                  v-model:childList="ballooningList" 
                  class="mx-2"></itemSelector>
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


const elementTitle = defineModel('elementTitle');
const elementText = defineModel('elementText');
const elementItem = defineModel('elementItem');
// console.log('elementItem')
// console.log(elementItem.value)
const dialog = ref(false);

const mappingArrayForCreateText = () => {
  return {
  'シース挿入': sheathInsertionText(),
  '親カテ挿入': parentCatheterText.value,
    'フィルター挿入': filterInsertionText.value,

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

// 親カテ挿入
// 親カテのリスト　endovascularSurgeryItemsからguidingCatheter、occulusionBallonCatheterを取り出して一つのリストにする
const parentCatheterList = ref([]);
parentCatheterList.value = endovascularSurgeryItems.guidingCatheter.concat(endovascularSurgeryItems.occlusionBallonCatheter);
const catheterForDiagnosticList = ref(endovascularSurgeryItems.catheterForDiagnostic);
const guideWireList = ref(endovascularSurgeryItems.guideWire);

//初期値がある場合は、ref()の引数に初期値を渡す
// 親カテの選択
const selectedParentCatheter = ref([]);
const selectedCatheterForDiagnostic = ref([]);
const selectedGuideWire = ref([]);

watch(elementItem, (newValue) => {
  if (!newValue) {
    return;
  }
  if (newValue.parentCatheter) {
    selectedParentCatheter.value = newValue.parentCatheter;
  }
  if (newValue.catheterForDiagnosis) {
    selectedCatheterForDiagnostic.value = newValue.catheterForDiagnosis;
  }
  if (newValue.guideWire) {
    selectedGuideWire.value = newValue.guideWire;
  }
}, { immediate: true }); //immediate: trueオプションを使用して、watchが初期化時にも実行されるようにします。

const settingPoint = ref('CCA');

const parentCatheterText = ref('');
watch([selectedParentCatheter, selectedCatheterForDiagnostic, selectedGuideWire, settingPoint], () => {
  parentCatheterText.value = selectedParentCatheter.value.join(' ') + ' + ' + selectedCatheterForDiagnostic.value.join(' ') 
  + selectedGuideWire.value.join(' ') + 'にて' + settingPoint.value + 'まで親カテを挿入。';
}, { immediate: true  });

// filter挿入
const protectionDeviceList = ref([]);
protectionDeviceList.value = endovascularSurgeryItems.protectionDevice;
const guideWireForFilterList = ref([]);
guideWireForFilterList.value = endovascularSurgeryItems.microGideWire;

const selectedProtectionDevice = ref([]);
const selectedGuideWireForFilter = ref([]);
watch (selectedProtectionDevice, (newValue) => {
  if (!newValue.includes('SpiderFX')) {
    selectedGuideWireForFilter.value = [];
  }
}, { immediate: true });

const filterInsertionText = ref('');
watch([selectedProtectionDevice, selectedGuideWireForFilter], () => {
  filterInsertionText.value = 'lesion crossする際に親カテのバルーンを拡張し総頚動脈遮断。' + selectedProtectionDevice.value.join(' ') + ' ' + selectedGuideWireForFilter.value.join(' ') + 'をICに挿入し展開した。';
}, { immediate: true, deep: true });



// prestent ballooning
const ballooningList = ref(endovascularSurgeryItems.PTABalloon);

// stent留置
const stentForCarotidList = ref(endovascularSurgeryItems.stentForCarotid);



</script>