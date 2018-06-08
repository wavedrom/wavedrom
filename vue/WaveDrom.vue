<template>
  <div>
    <textarea v-model="text" placeholder="JSON (WaveDrom)"></textarea>
    <br>
    <div :id="'a' +  id"></div>
  </div>
</template>

<script>
window.WaveSkin = require('wavedrom/skins/default.js');
var WaveDrom = require('wavedrom');

export default {
  name: 'WaveDrom',
  props: {
    id: Number,
    parentText: String
  },
  data () {
    return {
      text: this.parentText
    }
  },
  watch: {
    text: function() {
      WaveDrom.renderWaveForm( this.id, JSON.parse(this.text), 'a' );
    }
  }
}
</script>

<style>
</style>
