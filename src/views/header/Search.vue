<template>
  <div class="container">
    <el-row justify="center">
      <el-col :span="20">
        <div class="search">

          <el-select size="large" class="search-select" v-model="searchEngineAddress" placeholder="Select" style="width: 8em">
            <el-option v-for="item in options" :key="item.id" :label="item.label" :value="item.value" />
          </el-select>

          <el-input size="large" v-model="searchContent" v-on:keyup.enter="handleSearch" class="search-input"
            placeholder="请输入搜索内容">
            <template #append>
              <el-button :icon="Search" @click="handleSearch" />
            </template>
          </el-input>

        </div>
      </el-col>

    </el-row>


  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import idUtil from '@/assets/js/idUtil'
import { Search } from '@element-plus/icons-vue'

//搜索引擎选项
const options = [
  {
    value: 'baidu.com/s?wd=',
    label: 'Baidu',
  },
  {
    value: 'google.com/search?q=',
    label: 'Google',
  },
]
options.forEach((item, index) => {
  item.id = idUtil.createRandomId()
})

//搜索引擎网址
const defaultEngineAddress = "baidu.com/s?wd="
const searchEngineAddress = ref(defaultEngineAddress)
//搜索关键词
const searchContent = ref('')
//搜索请求
const searchEngineRequest = computed(() => {
  return "https://www." + searchEngineAddress.value + searchContent.value
})


//点击事件进行搜索
const handleSearch = () => {
  if (searchContent.value.trim() != '') {
    window.open(searchEngineRequest.value, '_blank')
  }
}

onMounted(() => {

})


</script>

<style scoped>
.search {
  display: flex;
  width: 100%;
}

.select {
  border-right: 0;
}
</style>