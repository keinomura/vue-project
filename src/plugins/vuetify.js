// src/plugins/vuetify.js
import 'vuetify/styles'; // Vuetifyのスタイルをインポート
import { createVuetify } from 'vuetify';
import { aliases, mdi } from 'vuetify/iconsets/mdi';
import { VTimePicker } from 'vuetify/labs/VTimePicker'

export default createVuetify({
  theme: {
    themes: {
      light: {
        primary: '#1976D2',
        secondary: '#424242',
        accent: '#82B1FF',
        error: '#FF5252',
        info: '#2196F3',
        success: '#4CAF50',
        warning: '#FFC107'
      }
    }
  },
  icons: {
    iconfont: 'mdi',
    aliases,
    sets: {
      mdi,
    }, // 'mdi'を使用
  },
  components: {
    VTimePicker,
  },
});
