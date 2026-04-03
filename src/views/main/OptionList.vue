<template>
  <div class="container">
    <div class="optionList" :style="{left: props.positionx + 'px', top: props.positiony + 'px'}">
      <ul>
        <li @click="open">新窗口打开</li>
        <li @click="edit">编辑</li>
        <li @click="optionList_delete">删除</li>
      </ul>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  positionx: {
    type: Number,
    required: true
  },
  positiony: {
    type: Number,
    required: true
  }
})

const emit = defineEmits(['optionList_open', 'optionList_edit', 'optionList_delete'])



const open = () => {
  emit('optionList_open')
}
const edit = () => {
  emit('optionList_edit')
}
const optionList_delete = () => {
  emit('optionList_delete')
}
</script>

<style scoped>
.optionList {
  position: fixed;
  width: 6em;
  padding: .5em .5em;
  border: 1px solid #eee;
  background-color: rgba(100, 100, 100, .5);
  color: rgba(255, 255, 255, .8);
  border-radius: 1em;
}
.optionList ul {
  display: flex;
  flex-direction: column;
  /* gap: .5em; */
  align-items: stretch;
}
.optionList ul li {
  padding: .3em;
  border-bottom: 1px solid #ccc;
  cursor: pointer;
}
.optionList ul li:nth-last-child(1) {
  border-bottom: none;
}
</style>