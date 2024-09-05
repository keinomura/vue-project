<template>
  <v-card elevation="3" >
    <v-tabs v-model="currentTab" fixed-tabs style="background-color: greenyellow;">
      <v-tab>Shape: {{ selectedClipShape }}</v-tab>
      <v-tab>Series: {{ selectedClipSeries }}</v-tab>
      <v-tab>Length: {{ selectedClipLength }}</v-tab>
    </v-tabs>

    <v-tabs-window v-model="currentTab">
      <v-tabs-window-item>
        <v-radio-group label="クリップ形状" inline v-model="selectedClipShape" row style="justify-content: center;display: flex;">
          <v-radio v-for="clipShape in ['直', '曲', 'バイオネット', '弱弯', '弯', 'L型', 'その他']" :key="clipShape" :label="clipShape" :value="clipShape"></v-radio>
        </v-radio-group>
      </v-tabs-window-item>

      <v-tabs-window-item>
        <v-radio-group label="Series" inline v-model="selectedClipSeries" row style="justify-content: center;display: flex;">
          <v-radio v-for="clipSeries in ['Standard', 'Mini', 'Fenestrated', 'Standard Temporary', 'Mini Temporary', 'Long']" :key="clipSeries" :label="clipSeries" :value="clipSeries"></v-radio>
        </v-radio-group>
      </v-tabs-window-item>

      <v-tabs-window-item >  
        <v-radio-group label="Length" inline v-model="selectedClipLength" row style="justify-content: center;display: flex;">
          <v-radio v-for="clipLength in [{'label':'<5', 'min': 0, 'max':4.9}, {'label':'5-9', 'min': 5, 'max':9.9}, {'label':'10<', 'min': 10, 'max':50}]" :key="clipLength" :label="clipLength.label" :value="clipLength.label"></v-radio>
        </v-radio-group>
      </v-tabs-window-item>

    </v-tabs-window>
    <v-component style="justify-content: center;display: flex;">
      <v-menu>
        <template v-slot:activator="{ props }">
          <v-btn
            color="primary"
            v-bind="props"
          >
            select clip
          </v-btn>
        </template>
        <v-list>
          <v-list-item
            v-for="(item, index) in clipSelectionListForVSelect"
            :key="item.text"
            :value="item.text"
            @click="selectedClip = item.text"
          >
            <v-list-item-title>{{ item.text }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-component>
  </v-card>


</template>

<script setup>
import { ref, watch } from 'vue';
import clipData from './new_sugita_clips_from_uploaded_excel.json';

const selectedClipShape = ref('直');
const selectedClipSeries = ref('Standard');
const selectedClipLength = ref('5-9');

const clipSelectionLists = ref([]);
const clipSelectionListForVSelect = ref([]);

watch ([selectedClipShape, selectedClipSeries, selectedClipLength], () => {
  //clipDataを引数にして、選択されたselectedClipShape, selectedClipSeries, selectedClipLengthに合致するデータを返す
  // それぞれが選択されていないときには全てのデータを返す
  clipSelectionLists.value = clipData.filter((clip) => {
    const excludedShapes = ['直', '曲', 'バイオネット', '弱弯', '弯', 'L型'];

    return ((selectedClipShape.value === '') ? clip:
      (selectedClipShape.value === 'その他') ? !excludedShapes.includes(clip['Shape'])
      :clip['Shape'] === selectedClipShape.value)
      && ((selectedClipSeries.value === '') ? clip: clip['Series'] === selectedClipSeries.value)
      && ((selectedClipLength.value === '') ? clip:
          (selectedClipLength.value === '<5') ? clip['Effective_Blade_Length_mm'] < 5:
          (selectedClipLength.value === '10<') ? clip['Effective_Blade_Length_mm'] >= 10:
          (selectedClipLength.value === '5-9') ? clip['Effective_Blade_Length_mm'] >= 5 && clip['Effective_Blade_Length_mm'] < 10:
          false);
  });

  // clipSelectionLists.valueから {text:'No, Series, Shape, length', No:No} の形式に変換したclipSelectionListForV-Selectを作成
  // clipSelectionLists.valueの各要素をformatClipText関数に渡して、{text:'No, Series, Shape, length', No:No} の形式に変換
  // その後、clipSelectionListForV-Selectにpush
  // clipSelectionLists.valueが変更されるたびにclipSelectionListForV-Selectも更新される
  // v-selectのitemsにclipSelectionListForV-Selectを渡す
  // v-selectで選択されたclipをselectedClipに格納
  clipSelectionListForVSelect.value = clipSelectionLists.value.map((clip) => {
    return {text: formatClipText(clip), value: clip['No']};
  });

}, { immediate: true, deep: true });

const selectedClip = ref('');

function formatClipText(clip) {
      return `No:${clip['No']}  ${clip['Series']} ${clip['Shape']} ${clip['Effective_Blade_Length_mm']}mm`;
}

const currentTab = ref('0');


</script>