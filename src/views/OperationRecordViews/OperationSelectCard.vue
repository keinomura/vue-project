<template>
    <v-card style="margin-top: 10pt;margin-bottom: 10pt;">
      <v-card>
        <v-tabs v-model="currentItem" fixed-tabs :style="{ backgroundColor: backGroundColor }">
          <v-tab
            v-for="(item, key) in Object.keys(detailOperationOptions)"
            :key="item"
            :value="item"
          >
            {{ item }}
            <v-menu activator="parent">
              <v-btn
                height="100%"
                width="100%"
                rounded="0"
                v-on="on"
                v-bind="props"
                variant="plain"
              ></v-btn>
              <v-list>
                <v-list-item v-for="operation in detailOperationOptions[item]" :key="operation" @click="selectOperation(operation)">
                  <v-list-item-title>{{ operation }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-tab>
        </v-tabs>
      </v-card>
      <v-card style="margin-top: 10pt;">
        <h2 align="left" :style="{ color: black }" style="padding-left: 10pt"> {{ typeOfOperation }}</h2>
      </v-card>
      <v-row style="margin-top: 10pt;">
        <v-text-field v-if="typeOfOperation === 'その他'"
          v-model="typeOfOperationText" label="その他手術種類" outlined ></v-text-field>
      </v-row>
    </v-card>
  </template>
  
<script setup>
import { ref, watch } from 'vue';

const detailOperationOptions = defineModel('detailOperationOptions')
const typeOfOperation = defineModel('typeOfOperation');
const typeOfOperationText = defineModel('typeOfOperationText');

const backGroundColor = ref('');
watch(() => detailOperationOptions.value, () => {
  console.log(detailOperationOptions);
  typeOfOperation.value = '';
  backGroundColor.value = Object.keys(detailOperationOptions.value).includes('Craniotomy') ? 'lightgreen' : 'orange';
}, { immediate: true });

const currentItem = ref('');
const selectOperation = (operation) => {
  typeOfOperation.value = operation;
};


</script>
  
  <style scoped>
  /* 必要に応じてスタイルを追加 */
  </style>