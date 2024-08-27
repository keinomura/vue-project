<template>
  <v-card style="padding: 10pt;margin-top: 10pt;background-color: antiquewhite;">
    <v-row style="vertical-align: center;">
      <v-col cols="4">
        <v-btn @click="dialogStart = true" width="100%"><h2>開始時間 {{ StartTime }}</h2></v-btn>
      </v-col>
      <v-dialog v-model="dialogStart" width="auto">
        <v-card
          max-width="400"
          prepend-icon="mdi-update"
          title="開始時間入力"
          background-color="antiquewhite"
        >
          <v-col>
            <v-time-picker
              format="24hr"
              v-model="StartTime"
              style="background-color: antiquewhite;"
            ></v-time-picker>
          </v-col>
            <template v-slot:actions>
              <v-btn
                class="ms-auto"
                text="Ok"
                @click="dialogStart = false"
              ></v-btn>
            </template>
        </v-card>
      </v-dialog>
      <v-col cols="4">
        <v-btn @click="dialogEnd = true" width="100%"><h2>終了時間 {{ EndTime }}</h2></v-btn>
      </v-col>
      <v-dialog v-model="dialogEnd" width="auto">
        <v-card
          max-width="400"
          prepend-icon="mdi-update"
          title="終了時間入力"
          background-color="antiquewhite"
        >
          <v-col>
            <v-time-picker
              format="24hr"
              v-model="EndTime"
              style="background-color: antiquewhite;"
            ></v-time-picker>
          </v-col>
            <template v-slot:actions>
              <v-btn
                class="ms-auto"
                text="Ok"
                @click="dialogEnd = false"
              ></v-btn>
            </template>
        </v-card>
      </v-dialog>
      <v-col cols="4">
        <h2>総手術時間 {{ totalTime }}</h2>
      </v-col>
    </v-row>
  </v-card>
</template>

<script setup>
  import { ref, watch } from 'vue';
  import { defineModel } from 'vue';
  import { VTimePicker } from 'vuetify/labs/VTimePicker'

  const StartTime = defineModel('StartTime');
  const EndTime = defineModel('EndTime');
  const totalTime = defineModel('totalTime');
  const dialogStart = ref(false);
  const dialogEnd = ref(false);


  const calculateTotalTime = () => {
    const startTime = StartTime.value.split(':');
    const endTime = EndTime.value.split(':');
    const startHour = parseInt(startTime[0], 10);
    const startMinute = parseInt(startTime[1], 10);
    const endHour = parseInt(endTime[0], 10);
    const endMinute = parseInt(endTime[1], 10);
    const start = startHour * 60 + startMinute;
    const end = endHour * 60 + endMinute;
    const time = (end - start < 0) ? end - start + 1440 : end - start;
    let hour = Math.floor(time / 60);
    // hour = (hour < 0) ? hour + 24 : hour;
    let minute = time % 60;
    //minuteは二桁表示
    let minuteStr = minute.toString();
    minute = (minuteStr.length === 1) ? '0' + minuteStr : minuteStr;
    totalTime.value = `${hour}:${minute}`;
  };

  watch(() => [StartTime.value, EndTime.value], () => {
    calculateTotalTime(); 
  }, { immediate: true });

</script>