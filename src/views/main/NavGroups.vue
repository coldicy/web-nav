<template>
  <div class="container">
    <div v-for="category in categoriesAndUnGrouped">
      <span class="groupName">{{ category }}</span>
      <!-- https://sortablejs.github.io/vue.draggable.next/#/two-lists -->
      <draggable class="navs" :list="navMap[category]" group="people" item-key="id" animation="300"
        ghost-class="ghost-class" chosen-class="chosen-class" @end="onDragEnd">

        <template #item="{ element, index }">
          <div>
            <NavItem :id="element.id" :title="element.title" :url="element.url" :icon="element.icon"
              @openOptionList="handleOpenOptionList" />
            <!-- {{ index }} -->
          </div>
        </template>
      </draggable>
    </div>

    <OptionList v-if="optionListState.visible" :positionx="optionListState.positionx"
      :positiony="optionListState.positiony" @optionList_open="handle_optionList_open"
      @optionList_edit="handle_optionList_edit" @optionList_delete="handle_optionList_delete"></OptionList>

    <EditPanel v-if="editPanelState.visible" @close-edit-panel="handle_editPanel_close"
      @saveNavItem="handle_editPanel_save" @addNewCategory="handle_editPanel_addCategory"
      :url="editPanelState.currentNavItem.url" :title="editPanelState.currentNavItem.title"
      :icon="editPanelState.currentNavItem.icon" :category="editPanelState.currentNavItem.category"
      :un-grouped-category="unGroupedCategory"
      :action="editPanelState.action" :categories="categories">
    </EditPanel>

    <FixedButtons @addNavItem="handle_fixedButtons_add"></FixedButtons>
  </div>
</template>

<script setup>
import NavItem from '@/components/NavItem.vue';
import OptionList from './OptionList.vue';
import EditPanel from './EditPanel.vue';
import FixedButtons from '../common/FixedButtons.vue';
import { computed, onMounted, onUnmounted, ref } from 'vue';
import idUtil from '@/assets/js/idUtil';
import draggable from 'vuedraggable'

//vuedraggable
const onDragEnd = (evt) => {
  console.log('拖拽结束，新顺序:', navItemList.value)
  // 这里可以调用 API 保存新的排序
  const newNavs = []
  Object.entries(navMap.value).forEach(([key, value]) => {
    //如果是没有category的navItem所在的默认分组
    if (key === unGroupedCategory) {
      value.some((nav) => {
        if (nav.category) {
          nav.category = ''
          return true
        }
      })
      newNavs.push(...value)
      return
    }
    //key对应category value是一个数组，其中的item是属于这个分类下的navItem对象
    value.some((nav) => {
      if (nav.category !== key) {
        nav.category = key
        return true
      }
    })
    newNavs.push(...value)
  })
  navItemList.value = newNavs
  saveAll()
  initNavMap()
}
//这是组件实例，而不是dom实例，因为这是个组件，要获取其中的Dom元素应该refNavs.value.$el
const refNavs = ref(null)


//optionList的状态维护
const optionListState = ref({
  visible: false,
  positionx: 0,
  positiony: 0,
  currentNavItem: null
})

//editPanel的状态维护
const editPanelState = ref({

  visible: false,
  currentNavItem: null,
  actions: { add: '新增', edit: '编辑' },
  action: '编辑'
})

//navItemList的数据
const navItemList = ref([])
//categories
const categories = ref([])
//未分组的item 默认分类到 组名为
const unGroupedCategory = '默认'
const categoriesAndUnGrouped = computed(() => {
  let hasUnGrouped = navItemList.value.some((nav) => {
    if (!nav.category) {
      return true
    } else {
      return false
    }
  })
  let res;
  if (!hasUnGrouped) {
    res = [...categories.value]
  } else {
    res = [...categories.value, unGroupedCategory]
  }
  return res
})
//navMap
const navMap = ref({})
//初始化数据
const initNavs = () => {
  try {
    const loaded = loadNavs()
    if (loaded && loaded.length > 0) {
      navItemList.value = loaded
      console.log('localStorage getItem(navs) 成功，length is: ', loaded.length)
    }
  } catch (e) {
    console.error('localStorage 取值失败：e is ', e)
    navItemList.value = []
  }
}

//保存 加载 初始化 categories
const initCategories = () => {
  try {
    const loaded = loadCategories()
    if (loaded && loaded.length > 0) {
      categories.value = loaded
      console.log('initCategories(): 成功加载分类 length is: ', loaded.length)
      saveCategories()
    }
  } catch (e) {
    console.error('加载categories失败,恢复默认分类 e is: ', e)
    categories.value = getDefaultCategories()
    saveCategories()
  }
}

//按category 初始化 navMap
const initNavMap = () => {
  console.log('initNavMap(): categories is', categories.value)

  //根据 分类列表 来分组navItemList
  const willBeDeleteCategories = []
  categories.value.forEach((category, index) => {
    console.log('category is', category)
    navMap.value[category] = navItemList.value.filter((nav) => {
      if (nav.category) {
        return nav.category === category
      }
      return false
    })
    console.log("initNavMap(): navMap.value[category] is", category, navMap.value[category].length)

    //如果某个分类下没有navItem，则从navMap中删除这个分组，同时从分类列表中删除这个分类
    if ((navMap.value[category].length === 0)) {
      console.log('0')
      delete navMap.value[category]
      willBeDeleteCategories.push(category)
      console.log(navMap.value)
    }
  })

  //没有分组的 默认分到未分类
  navMap.value[unGroupedCategory] = navItemList.value.filter((nav) => {
    if (nav.category) {
      return false
    } else {
      return true
    }
  })

  console.log('willbedeleteCategory is: ', willBeDeleteCategories)
  categories.value = categories.value.filter((item) => {
    //返回不在willBeDeleteCategories列表中的item
    return !willBeDeleteCategories.some((beDelete) => {
      return beDelete === item
    })
  })
  saveCategories()
}


const loadCategories = () => {
  const saved = localStorage.getItem('categories')
  if (saved) {
    const parsed = JSON.parse(saved)
    return Array.isArray(parsed) ? parsed : getDefaultCategories()
  }
  return getDefaultCategories()
}

const saveCategories = () => {
  //去掉 空字符串 null undefine
  categories.value = categories.value.filter((item) => {
    return item
  })
  //去重
  categories.value = [...new Set(categories.value)]
  //持久化
  localStorage.setItem('categories', JSON.stringify(categories.value))
}

//saveAll 同时保存分类数组 和 navs
const saveAll = () => {
  saveCategories()
  saveNavs()
}

//保存navItemList
const saveNavs = () => {
  try {
    localStorage.setItem('navs', JSON.stringify(navItemList.value))
    console.log('saveNavs(): 保存成功')
  } catch (e) {
    console.error('saveNavs(): 保存导航数据失败: e is', e)
  }
}
//读取navItemList
const loadNavs = () => {
  let saved = null
  try {
    saved = localStorage.getItem('navs')
    if (saved) {
      const parsed = JSON.parse(saved)
      return Array.isArray(parsed) ? parsed : getDefaultNavs()
    }
  } catch (e) {
    console.log('loadNavs(): 解析失败 catch e:', e)
    //如果解析失败 清除损坏数据
    try {
      localStorage.removeItem('navs')
    } catch (removeErr) {
      console.log('loadNavs(): 清除损坏数据失败, catch e is ', removeErr)
    }
  }
  //返回默认数据
  return getDefaultNavs()

}
const getDefaultCategories = () => {
  return ['nas', '收藏']
}
const getDefaultNavs = () => {
  return [
    {
      title: "百度一下",
      url: "http://www.baidu.com",
      icon: "https://psstatic.cdn.bcebos.com/video/wiseindex/aa6eef91f8b5b1a33b454c401_1660835115000.png"
    },
    {
      title: "谷歌搜索",
      url: "http://www.google.com"
    }
  ]
}


//统一添加id 如果没有id就加上随机生成的id
navItemList.value.forEach((item) => {
  if (!item.id) {
    item.id = idUtil.createRandomId()
  }

})

//处理navitem右键打开optionList的事件
const handleOpenOptionList = (data) => {
  console.log(`传来的值是：${data}`)
  optionListState.value.positionx = data.positionx
  optionListState.value.positiony = data.positiony
  optionListState.value.currentNavItem = navItemList.value.find((item) => {
    return item.id === data.navItemId
  })
  console.log(`坐标：${data.positionx}`)
  console.log(`右键打开optionList, 得到了当前数据是 ${optionListState.value.currentNavItem.id}`)
  optionListState.value.visible = true
}

//close optionList
const closeOptionList = () => {
  if (optionListState.value.visible) {
    optionListState.value.visible = false
  }

}

//处理右键弹出框的选项 点击事件
const handle_optionList_open = () => {
  window.open(optionListState.value.currentNavItem.url, '_target')
  closeOptionList()
}
const handle_optionList_edit = () => {
  editPanelState.value.currentNavItem = optionListState.value.currentNavItem
  editPanelState.value.visible = true
  editPanelState.value.action = editPanelState.value.actions.edit
  console.log('edit')
}
const handle_optionList_delete = () => {
  console.log('exe delete')
  navItemList.value = navItemList.value.filter((item) => {
    return item.id !== optionListState.value.currentNavItem.id
  })
  //删除数据后 保存
  saveNavs()
  initNavMap()
  closeOptionList()
}


//<-- 处理 editPanel -->
const handle_editPanel_close = () => {
  editPanelState.value.visible = false
}
//保存编辑的结果
const handle_editPanel_save = (formData) => {
  //表单数据合并到当前editPanel维护的nav对象上
  Object.assign(editPanelState.value.currentNavItem, formData)
  //如果是面板此时执行新增数据的操作，意味着此时对象还没添加到navItemList中，要将其加入
  if (editPanelState.value.action === editPanelState.value.actions.add) {
    editPanelState.value.currentNavItem.id = idUtil.createRandomId()
    navItemList.value.push(editPanelState.value.currentNavItem)
  }
  console.log('handle_editPanel_save(): ', categories.value)
  saveNavs()
  
  initNavMap()
}
// 保存新分类
const handle_editPanel_addCategory = (category) => {
  console.log('handle_editPanel_addCategory(): ', category)
  categories.value.push(category)
  saveCategories()
}

//<-- 处理 fixedButton 发来的事件
const handle_fixedButtons_add = () => {
  //如果是新增对象，则打开editPanel，维护的数据应该是空对象
  editPanelState.value.currentNavItem = {}
  editPanelState.value.action = editPanelState.value.actions.add
  editPanelState.value.visible = true
}

onMounted(() => {
  //执行初始化
  initNavs()
  initCategories()
  initNavMap()
  window.addEventListener('click', closeOptionList)
})
onUnmounted(() => {
  window.removeEventListener('click', closeOptionList)
})


</script>


<style scoped>
.navs {
  display: flex;
  justify-content: flex-start;
  align-content: flex-start;
  flex-wrap: wrap;

}

.groupName {
  display: inline-block;
  margin-top: 2em;
  padding-left: 0em;
  color: #333;
}

.navs span {
  width: 6em;
}

/* 拖拽时的占位符样式 */
.ghost-class {
  opacity: 0.5;
  background: #f0f0f0;
  border: 1px dashed #999;
  border-radius: 1em;
}

/* 选中正在拖拽的项 */
.chosen-class {
  opacity: 0.8;
  transform: scale(1.05);
}
</style>