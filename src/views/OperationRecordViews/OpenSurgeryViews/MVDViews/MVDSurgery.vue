<template>
    <v-card elevation="1">
      <h2 style="padding-left: 15pt;background-color: aquamarine;">{{ operationType }}</h2>
      <v-card v-if="operationType === 'NVC複数合併例'">
        <v-row class="mx-2 my-2">
        <v-checkbox v-model="NVCs" v-for="NVC in ['TN', 'HFS', '舌咽神経痛']" :label="NVC" :value="NVC" multiple></v-checkbox>
        </v-row>
      </v-card>
      <v-card elevation-3>
      <v-card class="my-2" v-if="operationType === 'TN' || NVCs.includes('TN')">
        <v-radio-group v-model="dentalTherapy" label="術前歯科治療" inline>
          <v-radio label="あり" value="あり"></v-radio>
          <v-radio label="なし" value="なし"></v-radio>
        </v-radio-group>
        <v-row class="mx-2">
          <span class="mx-2" style="color: grey;">疼痛部位</span>
        </v-row>
        <v-row class="mx-2">
          <v-checkbox v-model="painArea" label="V1" value="V1" />
          <v-checkbox v-model="painArea" label="V2" value="V2" />
          <v-checkbox v-model="painArea" label="V3" value="V3" />
        </v-row>
      </v-card>

      <v-card class="my-2" v-if="operationType === 'HFS'|| NVCs.includes('HFS')">
        <v-radio-group v-model="botox" label="ボトックス既往" inline>
          <v-radio label="あり" value="あり"></v-radio>
          <v-radio label="なし" value="なし"></v-radio>
        </v-radio-group>
        <v-radio-group label="耳鳴り" v-model="tinnitus" inline>
          <v-radio label="あり" value="あり"></v-radio>
          <v-radio label="なし" value="なし"></v-radio>
        </v-radio-group>
      </v-card>

      <v-component>
        <v-radio-group v-model="operationSide" label="病変側" inline>
          <v-radio label="右" value="右"></v-radio>
          <v-radio label="左" value="左"></v-radio>
        </v-radio-group>
        <v-radio-group v-model="operationCount" label="手術回数" inline>
          <v-radio label="初回" value="初回"></v-radio>
          <v-radio label="再手術" value="再手術"></v-radio>
          <v-radio label="再々手術" value="再々手術"></v-radio>
          <v-radio label="その他" value="その他"></v-radio>
        </v-radio-group>
        <v-text-field v-if="operationCount === 'その他'" v-model="operationCountText" label="手術回数" outlined></v-text-field>
      </v-component>
      </v-card>

      <v-card elevation-3 class="my-1">
        <v-component>
          <v-radio-group v-model="musclesIncision" label="筋肉切開" inline>
            <v-radio label="one layer" value="one layer"></v-radio>
            <v-radio label="layer by layer" value="layer by layer"></v-radio>
          </v-radio-group>
          <v-textarea v-if="!(operationCount === '初回')" v-model="craniotomyForReOperationText" label="再手術時の開頭" outlined rows="2"></v-textarea>
          <v-radio-group label="Mastoid Air Cell開放" v-model="mastoidAirCell" inline>
            <v-radio label="あり" value="あり"></v-radio>
            <v-radio label="なし" value="なし"></v-radio>
          </v-radio-group>
          <v-radio-group v-if="operationType === 'TN'" label="錐体静脈の温存" v-model="petrosalVein" inline>
            <v-radio label="すべて温存" value="すべて温存"></v-radio>
            <v-radio label="一部切断" value="一部切断"></v-radio>
          </v-radio-group>
          <span class="mx-2" style="color: grey;">Offending vessels</span>
          <v-row class="mx-2">
            <v-checkbox v-for="(cause, key) in offendingVesselOptions" v-model="offendingVessels" :label="cause.text" :value="cause.value" multiple></v-checkbox>
          </v-row>
          <v-row class="mx-2">
            <v-text-field v-if="offendingVessels.includes('その他')" v-model="offendingVesselsText" label="その他(複数の場合は ,（カンマ半角） で区切ってください)" style="padding: 5pt;"></v-text-field>
          </v-row>
          <v-row v-if="offendingVessels.length > 0" class="mx-2">
            <span  style="color: grey;">Most responsible offending vessel</span>
          </v-row>
          <v-row class="mx-2">
            <v-checkbox v-for="(vessel, key) in treatedOffendingVesselOptions" v-model="mostResponsibleOffendingVessels" :label="vessel.text" :value="vessel.value" multiple></v-checkbox>
          </v-row>
          <v-radio-group v-if="operationType === 'TN'" v-model="internalNeurolysis" label="Internal neurolysis" inline>
            <v-radio label="あり" value="あり"></v-radio>
            <v-radio label="なし" value="なし"></v-radio>
          </v-radio-group>
          <v-radio-group v-model="VaTransposition" label="VA transposition" inline>
            <v-radio label="あり" value="あり"></v-radio>
            <v-radio label="なし" value="なし"></v-radio>
          </v-radio-group>
          <span class="mx-2" style="color: grey;">Transpositionに使用した材料</span>
          <v-row class="mx-2">
            <v-checkbox v-model="materials" v-for="material in materialsOptions" :label="material" :value="material" multiple></v-checkbox>
          </v-row>
          <v-text-field class="mx-2" v-if="materials.includes('その他')" v-model="materialsText" label="その他" outlined></v-text-field>
          <span class="mx-2" style="color: grey;">硬膜閉鎖</span>
          <v-row class="mx-2">
            <v-checkbox v-model="duraClosureMaterials" v-for="material in duraClosureMaterialsOptions" :label="material" :value="material" multiple></v-checkbox>
          </v-row>
          <v-text-field class="mx-2" v-if="duraClosureMaterials.includes('その他')" v-model="duraClosureMaterialsOptionsText" label="その他" outlined></v-text-field>
          <span class="mx-2" style="color: grey;">特記すべき症例</span>
          <v-row class="mx-2">
            <v-checkbox v-model="specificCase" v-for="cause in specificCasesOptions" :label="cause" :value="cause" multiple></v-checkbox>
          </v-row>
          <v-text-field class="mx-2 flex" v-if="specificCase.includes('その他')" v-model="specificCaseText" label="その他" outlined></v-text-field>
        </v-component>
      </v-card>

      <v-card elevation-3>
        <v-textarea class="my-2, mx-2" v-model="record" label="手術記録" outlined rows="5"></v-textarea>
      </v-card>

    </v-card>
  </template>
  
  <script setup>
    import { ref, defineModel, defineExpose, watch } from 'vue';
    // parent component
    const operationType = defineModel('operationType');
    const OpeRecordByType = defineModel('OpeRecordByType');
    const AnesthesiaHeadPosition = defineModel('AnesthesiaHeadPosition');

    const NVCs = ref([]);
    // TN
    const dentalTherapy = ref('');
    const painArea = ref([]);
    // HFS
    const botox = ref('');
    const tinnitus = ref('');
    // operation
    const operationSide = ref('');
    const operationCount = ref('初回');
    const operationCountText = ref('');
    const musclesIncision = ref('');
    const craniotomyForReOperationText = ref('');
    const mastoidAirCell = ref('');
    const petrosalVein = ref('');
    // offending vessels
    const offendingVessels = ref([]);
    const offendingVesselOptions = ref([
      { text: 'SCA', value: 'SCA' },
      { text: 'AICA', value: 'AICA' },
      { text: 'PICA', value: 'PICA' },
      { text: 'VA', value: 'VA' },
      { text: 'BA', value: 'BA' },
      { text: 'petrosal vein', value: 'petrosal vein' },
      { text: '癒着', value: '癒着' },
      { text: 'TCA', value: 'TCA' },
      { text: 'PTA', value: 'PTA' },
      { text: 'branch of AICA', value: 'branch of AICA' },
      { text: 'branch of PICA', value: 'branch of PICA' },
      { text: 'AICA/PICA trunk', value: 'AICA/PICA trunk' },
      { text: 'その他', value: 'その他' },
    ]);
    const offendingVesselsText = ref('');
    const treatedOffendingVesselOptions = ref([]);
    watch (() => offendingVessels.value, (newVal) => {
      treatedOffendingVesselOptions.value = offendingVesselOptions.value.filter((vessel) => newVal.includes(vessel.value));
    }, { immediate: true });
    const mostResponsibleOffendingVessels = ref([]);
    const internalNeurolysis = ref('');
    const VaTransposition = ref('');
    const materials = ref(['フィブリン糊']);
    const materialsOptions = ref([
      'デュラウェーブ', 'サージセル', 'フィブリン糊', 'タコシール', 'DuraGen', 'その他'
    ]);
    const materialsText = ref('');
    const duraClosureMaterials = ref(['縫合']);
    const duraClosureMaterialsOptions = ref([
      'デュラウェーブ', 'DuraGen', '筋膜', '縫合', 'サージセル', 'その他'
    ]);
    const duraClosureMaterialsOptionsText = ref('');

    const specificCasesOptions = ref([
      '手術難易度高い', '術中モニター異常', '教育症例', '変わった症例', 'その他'
    ]);
    const specificCase = ref([]);
    const specificCaseText = ref('');

    const record = ref('');

    const AnesthesiaHeadPositionForMVD = ref({
      'anesthesia': '全身麻酔',
      'bodyPosition': '側臥位',
      'headPosition': 'Mayfield 3-pin',
      'headFlexion': '屈曲位',
      'headFlexionDegree': '20',
      'headLateralFlexion': '健側',
      'headLateralFlexionDegree': '20',
      'headRotation': '健側',
      'headRotationDegree': '30',
    });
    AnesthesiaHeadPosition.value = AnesthesiaHeadPositionForMVD.value;
  
    function createRecordForMVD() {
      let opeInfoItems = {
        '今回手術は': (operationCount.value === 'その他') ? operationCountText.value : operationCount.value,
        '筋肉切開': musclesIncision.value,
        'Mastoid Air Cell開放': mastoidAirCell.value,
        '錐体静脈の温存': petrosalVein.value,
        'Offending vessels': offendingVessels.value.join(','),
        'Most responsible offending vessel': mostResponsibleOffendingVessels.value.join(','),
        'Internal neurolysis': internalNeurolysis.value,
        'VA transposition': VaTransposition.value,
        'Transpositionに使用した材料': materials.value.join(','),
        '硬膜閉鎖': duraClosureMaterials.value.join(','),
        '特記すべき症例': specificCase.value.join(','),
      };

      const info =  (operationType.value === 'NVC複数合併例') ? operationSide.value + NVCs.value.join('と') + '合併症例':
                    (operationType.value === 'TN') ? operationSide.value + operationType.value + ' ' + painArea.value.join(',') :
                    (operationType.value === 'HFS'|| operationType.value === '舌咽神経痛') ? operationSide.value + operationType.value : 'no';

      const craniotomy = '無剃毛。trans sigmoid approachで開頭する。皮膚切開は開頭部位に合わせmastoid processの付け根を中心に弧状に5cmの切開した。'
          + '皮膚切開は' + musclesIncision.value + 'に行った。'
          +'perforatorにて開頭予定部位でsinusから最も離れた場所にburr holeを開けた。硬膜を十分に骨から剥離し、ケリーソンパンチで開頭を広げた。'
          + 'sinusを十分に確認できる位置まで開頭を広げた。'
      const mastoidAirCellOpening = (mastoidAirCell.value === 'あり') ? '開頭中mastoid air cellの開放あり。骨片を開放部に充填し、デュラウェーブでSealした。':
                              '開頭中mastoid air cellの開放なし。'
      const duraCut = '周囲骨を止血し、硬膜外にサージセルを詰め止血した。硬膜を弧状に切開し、4-0ニューロロンでつり上げた。' + '\r\n'
                      + 'CSFを吸引しながら小脳半球をslackにさせ、深部に至る。'
      const intraDuralProcessForTN = (operationType.value === 'TN' || NVCs.value.includes('TN')) ? 
                                'tentとpetrous boneのcornerを確認しながら深部に至る。petrosal veinは' + petrosalVein.value + 'した。': '';
      const intraDuralProcessForHFS = (operationType.value === 'HFS' || NVCs.value.includes('HFS')||operationType.value === '舌咽神経痛' ||NVCs.value.includes('舌咽神経痛')) ? 
                                      '尾側から確認した。まずIX神経を確認し、小脳との間のくも膜を切離する。そのままX神経、IX神経と小脳との間を十分に剥離した。'
                                    + '次いでIX神経とflocculus間のくも膜を十分に剥離し切離した。':'';

      const closure = '術野の止血を十分に確認した後、アートセレブを頭蓋内に十分に注入した。'
      const duraClosure = (duraClosureMaterials.value.includes('DuraGen')) ? '硬膜は数カ所縫合し他後、DuraGenを用い修復した。' :
                          (duraClosureMaterials.value.includes('デュラウェーブ')) ? '硬膜を4-0ニューロロンで縫合した後、デュラウェーブを硬膜表面に敷き詰めフィブリン糊で固定した。':
                          '硬膜を4-0ニューロロンで縫合した後、サージセルで縫合部を補強しフィブリン糊で固定した。'
      const closeText = '止血を確認し、Burr holeはサージセルを充填しBurr hole buttonをおいた。型どおりに皮下、皮膚を縫合し終了した。'
      const skinClosure = '骨片を開頭部位に充填し、フィブリン糊で固定した。筋層を2-0バイクリルで縫合し、皮下は3-0バイクリルで縫合した。'
                          + '表皮はステープラーで縫合し、手術を終了した。'
  
      const finalRecord = info + '\r\n\r\n' + craniotomy + mastoidAirCellOpening + duraCut + intraDuralProcessForTN + intraDuralProcessForHFS + '\r\n\r\n' + record.value + '\r\n\r\n' + closure + duraClosure + closeText + skinClosure
  
      opeInfoItems = Object.fromEntries(
        Object.entries(opeInfoItems).filter(([key, value]) => value !== '' || value.length !== 0)
      );
      const text = Object.entries(opeInfoItems).map(([key, value]) => `${key}: ${value}`).join(', ');
      return finalRecord + '\n\n{' + text + '}';
    };
  

    function createRecordForEachOperation() {
      return createRecordForMVD();
    };
  
    defineExpose({
      createRecordForEachOperation,
    });
  </script>