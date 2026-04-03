<template>
  <div class="container">

    <div class="title">
      <h1>网址导航</h1>
    </div>
    <span class="gap"></span>
    <div class="time-show">
      <time-show></time-show>
    </div>

  </div>
</template>

<script setup>
import TimeShow from '@/components/util/TimeShow.vue';
</script>

<style scoped>
.container {
  position: relative;
  left: -.5em;
  display: flex;
  justify-content: center;
  align-items: center;
}
.container .gap {
  height: 2em;
  margin: 0 1em;
  border: 1px solid #cc0000;
}
h1 {
  font-weight: normal;
  font-size: 2em;
  text-align: right;

}

.time-show {
  display: flex;
  justify-content: start;
  align-items: center;
}
</style>