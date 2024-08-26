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
        <h2 align="left" :style="{ backgroundColor: backGroundColor }" style="padding-left: 10pt"> {{ typeOfOperation1 }}</h2>
      </v-card>
      <v-row style="margin-top: 10pt;">
        <v-text-field v-if="typeOfOperation1 === 'その他'"
          v-model="typeOfOperation1Text" label="その他手術種類" outlined @input="emitOperationText"></v-text-field>
      </v-row>
    </v-card>
  </template>
  
<script setup>
import { ref, defineEmits, watch } from 'vue';

const props = defineProps({
  detailOperationOptions: {
    type: Object,
    required: true
  }
});
const typeOfOperation1 = ref('');

const backGroundColor = ref('');
watch(() => props.detailOperationOptions, () => {
  typeOfOperation1.value = '';
  backGroundColor.value = Object.keys(props.detailOperationOptions).includes('Craniotomy') ? 'lightgreen' : 'orange';
}, { immediate: true });


const emit = defineEmits(['update:operation', 'update:operationText']);

const currentItem = ref('');
const typeOfOperation1Text = ref('');

const selectOperation = (operation) => {
  typeOfOperation1.value = operation;
  emit('update:operation', operation);
};

const emitOperationText = () => {
  emit('update:operationText', typeOfOperation1Text.value);
};

watch(typeOfOperation1, (newVal) => {
  if (newVal !== 'その他') {
    typeOfOperation1Text.value = '';
    emitOperationText();
  }}, { immediate: true });

</script>
  
  <style scoped>
  /* 必要に応じてスタイルを追加 */
  </style>