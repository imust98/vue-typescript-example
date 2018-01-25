<template>
  <div class="g-doc">
    测试一下
  </div>
</template>
<script lang="ts">
import Vue from 'vue';
import { Component, Prop, Watch } from 'vue-property-decorator';

@Component
export default class App extends Vue {}
</script>
<style lang="scss">
.g-doc {
  color: #000;
}
</style>
