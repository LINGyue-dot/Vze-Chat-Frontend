<template>
  <div class="cr-container" ref="contentRef">
    <ContacterMessageItem v-for="(item,index) in p2pList"
                          :key="item.temp_id||item.message_id"
                          :lastTime="index>0?p2pList[index-1].send_time:0"
                          :message="item"
    />
  </div>
</template>
<script lang="ts" setup>

import { useStore } from 'vuex'
import ContacterMessageItem from './message-item/contacter-message.vue'
import { HistoryStateType } from '@/store/history'
import { ActiveStateProp } from '@/store/active'
import { computed } from '@vue/reactivity'
import { UserProp } from '@/websocket/type'
import { watch } from 'vue'
import { onMounted, ref } from '@vue/runtime-core'

const activeStore = useStore<{ active: ActiveStateProp }>()
const historyStore = useStore<{ history: HistoryStateType }>()

const contentRef = ref<HTMLDivElement>(null)

// @ts-ignore
const p2pList = computed(() => historyStore.state.history.p2pHistory.get((activeStore.state.active.activeChat as UserProp).user_id))

// onMounted(() => {
//   setInterval(() => {
//     console.log(historyStore.state.history.p2pHistory, typeof (activeStore.state.active.activeChat as UserProp).user_id)
//     console.log(p2pList)
//   }, 1000)
// })

//
const scrollToBottom = () => {
  contentRef.value.scrollTop = contentRef.value.scrollHeight
}

// @ts-ignore
watch(() => historyStore.state.history.p2pHistory.get((activeStore.state.active.activeChat as UserProp).user_id), () => {
  scrollToBottom()
}, {
  deep: true
})


</script>
<style scoped>

.cr-container {
  height: 100%;
  width: 100%;
  background-color: #f5f5f5;
  overflow-y: scroll;
}
</style>
