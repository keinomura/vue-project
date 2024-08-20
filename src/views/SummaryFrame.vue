<template>
    <v-container fluid>
      <v-row>
        <v-col cols="12" md="6">
          <h2 class="mb-4">{{ title }}</h2>

            <component :is="createCalledComponent()" ref="child"></component>

            <v-container class="d-flex justify-center pa-2">
              <v-btn color="primary" @click="createSummary">作成</v-btn>
            </v-container>
          </v-col>
        <v-col cols="12" md="6"  >
        <v-card>
          <v-card-title>{{ title }}</v-card-title>
          <v-card-text>
            <v-textarea v-model="summary" outlined rows="30"></v-textarea>
          </v-card-text>
        </v-card>
        </v-col>
      </v-row>
    </v-container>
  </template>

  <script setup>
    import { ref, shallowRef, defineProps, watch } from 'vue';
    import summaryAtEView from './SummaryAtEViews/SummaryAtEForm.vue';
  // Props
  const props = defineProps({
      title: String,
    });

    const child = shallowRef(null);
    const calledComponent = ref('');
    const summary = ref('');
    const createCalledComponent = () => {
      if (props.title === '入院サマリですよ') {
        return summaryAtEView;
      } else {
        return '';
      }
    };

    function createSummary() {
      summary.value = child.value.createSummary();

    }

    //definee
    defineExpose({
      createSummary,
    });
  </script>

  <style scoped>

  .no-horizontal-scroll {
    overflow-x: hidden;
    max-height: 800px;
  }
  </style>
