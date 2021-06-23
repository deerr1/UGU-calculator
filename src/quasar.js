import Vue from "vue";

import "./styles/quasar.sass";
import lang from "quasar/lang/ru.js";
import "@quasar/extras/material-icons/material-icons.css";
import "@quasar/extras/ionicons-v4/ionicons-v4.css";
import "@quasar/extras/mdi-v4/mdi-v4.css";
import "@quasar/extras/eva-icons/eva-icons.css";
import { Quasar } from "quasar";

Vue.use(Quasar, {
  config: {},
  plugins: {},
  lang: lang,
});
