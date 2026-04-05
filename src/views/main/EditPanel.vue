<template>
  <div class="container">
    <el-dialog v-model="dialogVisible" :title="props.action" width="30em">

      <el-form ref="refForm" :rules="rules" :model="form" size="large" label-width="auto">
        <el-form-item label="网址" prop="url">
          <el-input v-model="form.url" autocomplete="off" placeholder="请输入网址" />
        </el-form-item>
        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入网址标题" maxlength="20" show-word-limit></el-input>
        </el-form-item>
        <el-form-item label="图标">
          <el-input v-model="form.icon" placeholder="请输入图标地址"></el-input>
          <el-button size="small" style="color: rgb(65, 158, 255); border: none; padding: 0;"
            @click.prevent="handleOpenIconSite">在线图标库</el-button>
        </el-form-item>
        <el-form-item label="分组">
          <el-select v-model="form.category" placeholder="请选择网址分类">
            <el-option v-for="category in props.categories" :label="category" :value="category" />
          </el-select>
        </el-form-item>
        <el-form-item label="新建分组"  prop="category">
          <el-input v-model="form.category" placeholder="请输入分组名" maxlength="10" show-word-limit clearable />
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
import { ElMessage } from 'element-plus'
import { watch, ref, onUnmounted } from 'vue'
const refForm = ref()
//在线图标网站地址
const iconSiteUrl = 'https://icon-sets.iconify.design/'
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
  },
  unGroupedCategory: {
    type: String
  }
})
const emit = defineEmits(['closeEditPanel', 'saveNavItem', 'addNewCategory'])
const dialogVisible = ref(true)

//
const validateCategory = (rule, value, callback) => {
  if (value && value.trim() === props.unGroupedCategory) {
    callback(new Error('分组名不合法，请更换组名'))
  } else {
    callback()
  }
}
const rules = ref({
  url: [
    { required: true, message: '请输入网址', trigger: 'blur' }
  ],
  title: [
    { required: true, message: '请输入网址标题', trigger: 'blur' }
  ],
  category: [
    { validator: validateCategory, trigger: 'blur'}
  ]
})

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
const save = async () => {
  if (!refForm.value) return
  try {
    await refForm.value.validate()
    dialogVisible.value = false
    if (isNewCategory()) {
      console.log('editPanel save(): isNewCategory')
      emit('addNewCategory', form.value.category.trim())
    }
    emit('saveNavItem', { ...form.value })
  } catch (e) {
    ElMessage.error('请按提示正确填写表单！')
  }

}

const isNewCategory = () => {
  if (!form.value.category) {
    return false
  }
  return !props.categories.some((item) => {
    if (item.trim() === form.value.category.trim()) {
      return true
    }
  })
}

const handleOpenIconSite = () => {
  window.open(iconSiteUrl, '_target')
}

onUnmounted(() => {
  console.log('editPanel 组件被销毁')
})
</script>

<style scoped></style>