import Vue from 'vue'; // 'vue' is the alias in webpack.config.js
let app = new Vue({
  el: '#app',
  data: {
    message: 'Hello Vue!'
  }
})
let quality = new Vue({
  el: "#quality",
  data: {
      qualitydata: "quality"
  },
  methods: {

  }
});