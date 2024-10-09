<template>
    <div class="side-menu">
    <h3>入退院サマリ</h3>
    <v-list>
      <v-list-item>
        <v-btn @click.prevent="menuClicked('/summaryFrame/hospitalization')" class="my-2" block>
          入院サマリ
        </v-btn>
      </v-list-item>
      <v-list-item>
        <v-btn @click.prevent="menuClicked('/summaryFrame/discharge')" class="my-2" block>
          退院サマリ
        </v-btn>
      </v-list-item>
    </v-list>
    <h3>手術記録</h3>
    <v-list>
      <v-list-item>
        <v-btn @click.prevent="menuClicked('/summaryFrame/operationRecord')" class="my-2" block>
          手術記録
        </v-btn>
      </v-list-item>
    </v-list>
  </div>
  </template>
  
  <script setup>
  import { defineEmits } from 'vue';
  
  const emit = defineEmits(['menu-clicked']);
  const menuClicked = (path) => {
    emit('menu-clicked', path);
  };
  </script>
  
  <style>
 .side-menu {
  padding: 16px;
}
  </style>
  