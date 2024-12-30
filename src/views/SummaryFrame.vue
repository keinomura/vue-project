<template>
  <v-container fluid>
    <v-row>
      <!-- 情報入力画面 -->
      <v-col cols="12" md="6">
        <h2 class="mb-4">{{ title }}</h2>
        <component :is="calledComponent" ref="child"></component>
        <v-container class="d-flex justify-center pa-2">
          <v-btn color="primary" @click="createSummary">作成</v-btn>
        </v-container>
      </v-col>
      <!-- サマリ表示画面 -->
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
    import { ref, shallowRef, defineProps, watch, markRaw } from 'vue';
    import summaryAtEView from './SummaryAtEViews/SummaryAtEForm.vue';
    import summaryAtDView from './SummaryAtDViews/SummaryAtDForm.vue';
    import operationRecordView from './OperationRecordViews/OperationRecordForm.vue';
  // Props
  const props = defineProps({
      title: String,
    });

    const child = ref(null);
    const calledComponent = ref('');
    const summary = ref('');

  // Watch for title changes to update the called component
  watch(
  () => props.title,
  (newTitle) => {
    calledComponent.value =
      newTitle === '入院サマリ'
        ? markRaw(summaryAtEView)
        : newTitle === '退院サマリ'
        ? markRaw(summaryAtDView)
        : newTitle === '手術記録'
        ? markRaw(operationRecordView)
        : null;
  },
  { immediate: true }
);

    function createSummary() {
      console.log('summaryframeからoperationrecordFormのcreateSummary()呼び出し')
      summary.value = child.value.createSummary();
    }

    //define
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
