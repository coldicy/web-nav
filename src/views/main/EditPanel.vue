<template>
  <div class="container">
    <el-dialog v-model="dialogVisible" :title="props.action" width="30em">

      <el-form :model="form" size="large" label-width="auto">
        <el-form-item label="网址">
          <el-input v-model="form.url" autocomplete="off" placeholder="请输入网址" />
        </el-form-item>
        <el-form-item label="标题">
          <el-input v-model="form.title" placeholder="请输入网址标题"></el-input>
        </el-form-item>
        <el-form-item label="图标">
          <el-input v-model="form.icon" placeholder="请输入图标地址"></el-input>
        </el-form-item>
        <el-form-item label="分组">
          <el-select v-model="form.category" placeholder="请选择网址分类">
              <el-option v-for="category in props.categories" :label="category" :value="category" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="cancel">Cancel</el-button>
          <el-button type="primary" @click="save">
            Confirm
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { watch, ref, onUnmounted } from 'vue'
const props = defineProps({
  action: {
    type: String,
    default: '编辑'
  },
  url: {
    type: String
  },
  title: {
    type: String
  },
  icon: {
    type: String
  },
  category: {
    type: String
  },
  categories: {
    type: Array
  }
})
const emit = defineEmits(['closeEditPanel', 'saveNavItem'])

const dialogVisible = ref(true)

watch(dialogVisible, (newVal, oldVal) => {
  console.log(`${newVal} <-- ${oldVal}`)
  if (newVal === false) {
    emit('closeEditPanel')
  }

})



//表单数据
const form = ref({
  title: props.title,
  url: props.url,
  icon: props.icon,
  category: props.category
})

//按钮的点击事件
const cancel = () => {
  dialogVisible.value = false
}
const save = () => {
  dialogVisible.value = false
  emit('saveNavItem', { ...form.value })
}

onUnmounted(() => {
  console.log('editPanel 组件被销毁')
})
</script>

<style scoped></style>