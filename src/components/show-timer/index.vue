<template>
  <div v-if="needRender" class="st-container">
    {{ timer }}
  </div>
</template>
<script lang='ts' setup>
import { computed } from '@vue/reactivity'
import { dateFormat, isCloser } from '@/utils/timer'

const props = defineProps({
  lastTime: {
    type: Number,
    default: () => 0
  },
  thisTime: {
    type: Number,
    required: true
  }
})
const needRender = computed(() => !isCloser(props.lastTime, props.thisTime))
const timer = computed(() => dateFormat(props.thisTime))
</script>
<style scoped>
.st-container {
  width: 50%;
  height: 40px;
  line-height: 40px;
  text-align: center;
  margin: 10px 25%;
  border-radius: 5px;
  background-color: #eee;
  color: #000;
}
</style>
