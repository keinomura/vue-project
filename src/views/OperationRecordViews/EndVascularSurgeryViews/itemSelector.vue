<template>


      <div class="text-center">{{ selectedItem }}
    <v-btn color="primary">
      {{ buttonText }}
      <v-menu activator="parent">
        <v-list>
          <v-list-item v-for="firstLevelItem in firstLevelItems" :key="firstLevelItem" link>
            <v-list-item-title> {{ firstLevelItem }}</v-list-item-title>
            <template v-slot:append>
              <v-icon icon="mdi-menu-right" size="x-small"></v-icon>
            </template>

            <v-menu :open-on-focus="false" activator="parent" open-on-hover submenu>
              <v-list>
                <v-list-item
                  v-for="secondLevelItem in getSecondLevelItems(firstLevelItem, nestedItems)"
                  :key="secondLevelItem"
                  
                  link
                  @click="selectItem(firstLevelItem, secondLevelItem, '')"
                >
                  <v-list-item-title>{{ secondLevelItem }}</v-list-item-title>

                  <v-menu v-if="hasDiameterLevelItems === true" :open-on-focus="false" activator="parent" open-on-hover submenu>
                    <v-list>
                      <v-list-item
                        v-for="thirdLevelItem in getThirdLevelItems(firstLevelItem, secondLevelItem, nestedItems)"
                        :key="thirdLevelItem"
                        
                        link
                        @click="selectItem(firstLevelItem, secondLevelItem, thirdLevelItem)"
                      >
                        <v-list-item-title>{{ thirdLevelItem }}</v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-btn>
  </div>
</template>


<script setup>
  import { ref, watch } from 'vue';
  const childList = defineModel('childList');
  const selectedItem = defineModel('selectedItem');

  const hasDiameterLevelItems = ref(false);
  // const buttonText = ref('選択してください');
  // console.log('child')
  // console.log(selectedItem.value)

  // const buttonText = ref(Array.isArray(selectedItem.value) ? selectedItem.value.join(' ') : '選択してください');
  const buttonText = ref('選択してください');
  watch(selectedItem, () => {
    console.log(selectedItem.value);
    buttonText.value = (selectedItem.value === undefined || selectedItem.value[0] === ''|| selectedItem.value[0] === undefined) ? '選択してください' : selectedItem.value.join(' ');
  }, {immediate: true});


// nestedItemのkeyを一般名にする。...Name, ...Size -> name, size
const normalizeKeys = childList.value.map(item => {
  const newItem = {};
  for (const key in item) {
    if (key.toLowerCase().includes('name')) {
      newItem.name = item[key];
    } else if (key.toLowerCase().includes('size')) {
      newItem.size = item[key];
    } else {
      newItem[key] = item[key];
    }
  }

  // item.sizeが["5F", "6Fr", "7Fr"]のような形式だった場合はそのまま
  // もしitem.sizeが{'diameter': '5Fr', 'length': '100cm'}のような形式だった場合、
  // item.size.diameterをitem.size.diameterに、item.size.lengthをitem.size.lengthに変更する
  // item.size = [{'diameter': '5Fr', 'length': '100cm'}, {'diameter': '6Fr', 'length': '120cm'}]の場合に処理する。

  function isArrayOfObjects(array) {
    // 配列が存在し、配列であることを確認
    if (!Array.isArray(array)) {
      return false;
    }
    // 配列の各要素がオブジェクトであることを確認
    return array.every(item => typeof item === 'object' && item !== null && !Array.isArray(item));
  }

  if (Array.isArray(newItem.size)&& isArrayOfObjects(newItem.size)) {
    hasDiameterLevelItems.value = true;
    newItem.size = newItem.size.map(size => {
      const newSize = {};
      for (const key in size) {
        if (key.toLowerCase().includes('diameter')) {
          newSize.diameter = size[key];
        } else if (key.toLowerCase().includes('length')) {
          newSize.length = size[key];
        } else {
          newSize[key] = size[key];
        }
      }
      return newSize;
    });
  }
  return newItem;
});

  const nestedItems = normalizeKeys;

  const firstLevelItems = nestedItems.map(item => item.name);


  const getSecondLevelItems = (selectedFirstLevelItem, nestedItems) => {
    const ObjectOfSelectedFirstLevelItem = nestedItems.find(item => item.name === selectedFirstLevelItem);
    if (hasDiameterLevelItems.value) {
      return ObjectOfSelectedFirstLevelItem.size.map(size => size.diameter);
    } else {
      return ObjectOfSelectedFirstLevelItem.size;
    }
  };

  const getThirdLevelItems = (selectedFirstLevelItem, selectedSecondLevelItem, nestedItems) => {
    const ObjectOfSelectedFirstLevelItem = nestedItems.find(item => item.name === selectedFirstLevelItem);
    const ObjectOfSelectedSecondLevelItem = ObjectOfSelectedFirstLevelItem.size.find(item => item.diameter === selectedSecondLevelItem);
    console.log(ObjectOfSelectedSecondLevelItem);
    return ObjectOfSelectedSecondLevelItem ? ObjectOfSelectedSecondLevelItem.length : [];
  };

  const selectItem = (firstLevelItem, secondLevelItem, thirdLevelItem) => {
    if (hasDiameterLevelItems.value && thirdLevelItem === '') {
      return;
    }

    selectedItem.value = [firstLevelItem, secondLevelItem, thirdLevelItem];
  };



</script>
<style scoped>
.hovered-item {
  background-color: #c03d3d; /* ホバー時の背景色 */
}
</style>