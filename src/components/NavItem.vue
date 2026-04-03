<template>
  <div class="container">
    <div class="item" @click="handleOpenUrl" @contextmenu="handleContextmenu">
      <div class="icon">
        <div class="icon-img">
          <img v-show="imgShow" :src="props.icon">
          <div class="icon-alt"><span>{{ iconAlt }}</span></div>
        </div>
      </div>
      <div class="title row_two">
        {{ props.title + ' ' + props.id }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  id: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  category: {
    type: String
  },
  icon: {
    type: String
  }
})

const iconAlt = computed(() => {
  if (!props.icon || props.icon.toString().trim() === '') {
    return props.title.substring(0, 1)
  }
  return ''
})
const imgShow = computed(() => {
  return iconAlt.value === '';
})


const emit = defineEmits(['openOptionList'])

const handleOpenUrl = () => {
  window.open(props.url, '_target')
}

const handleContextmenu = (event) => {
  event.preventDefault()
  console.log(`被右键点击的item, id is ${props.id}, title is ${props.title}, props is ${props}`)
  emit('openOptionList', {
    navItemId: props.id,
    positionx: event.clientX,
    positiony: event.clientY
  })
}

</script>

<style scoped>
.container {
  display: flex;
  width: 6em;
  padding: .5em 0;
  justify-content: center;
  align-items: start;
}
.container:hover {
  /* box-shadow: 1px 1px 1em 0em rgba(0, 0, 0, 0.1); */
  border-radius: 1em;
}
.item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: .5em;
  cursor: pointer;
}
.item .icon {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 4em;
  height: 4em;
  background-color: rgba(200, 200, 200, .0);
  border-radius: 1em;

}
.item .icon:hover {
    box-shadow: var(--box-shadow-primary);
}

.item .icon .icon-img {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 3em;
  height: 3em;
  background-color: rgba(100, 100, 100, 0);
  border-radius: .8em;
}

.item .icon .icon-img img {
  width: 3em;
  height: 3em;
  /* border: 1px solid #eee; */
  outline: none;
  /* border-radius: .8em; */
}

.item .icon .icon-img .icon-alt {
  display: flex;
  width: 1.5em;
  height: 1.5em;
  justify-content: center;
  align-items: center;
  border-radius: .4em;
  background-color: #333;
  color: white;
  font-size: 2em;
}

.item .title {
  width: 6em;
  line-height: 1.4em;
  font-size: .7em;
  text-align: center;
}
</style>