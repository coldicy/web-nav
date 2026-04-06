<template>
  <div class="container">
    <div class="fixed">
      <div class="add item" @click="addNavItem">
        <el-icon><Plus /></el-icon>
      </div>
      <div class="top item" @click="handleUp">
        <el-icon><Top /></el-icon>
      </div>

    </div>
  </div>
</template>

<script setup>
const emit = defineEmits(['addNavItem'])

//点击事件 添加navItem
const addNavItem = () => {
  emit('addNavItem', 'new')
}
const handleUp = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}
</script>

<style scoped>
.fixed {
  position: fixed;
  right: 2em;
  bottom: 4em;
  display: flex;
  flex-direction: column;
  gap: .5em;
  width: 4em;
  justify-content: center;
  align-items: center;
}
.fixed .item {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 2em;
  height: 2em;
  border: 1px solid rgba(200, 200, 200, .1);
  border-radius: 1em;
  background-color: rgba(200, 200, 200, .1);
  cursor: pointer;
}
.fixed .item:hover {
  box-shadow: var(--box-shadow-primary);
}
</style>