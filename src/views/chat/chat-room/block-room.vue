<template>
  <div class="cr-container" ref="contentRef">
    <BlockMessage v-for="item in blockList"
                  :key="item.temp_id||item.message_id"
                  :message="item"
    />
  </div>
</template>
<script lang="ts" setup>

import { useStore } from 'vuex'
import { HistoryStateType } from '@/store/history'
import { ActiveStateProp } from '@/store/active'
import { computed } from '@vue/reactivity'
import { BlockProp, UserProp } from '@/websocket/type'
import { watch } from 'vue'
import { ref } from '@vue/runtime-core'
import BlockMessage from '@/views/chat/chat-room/message-item/block-message.vue'

const activeStore = useStore<{ active: ActiveStateProp }>()
const historyStore = useStore<{ history: HistoryStateType }>()

const contentRef = ref<HTMLDivElement>(null)

const blockList = computed(() => historyStore.state.history.blockHistory.get((activeStore.state.active.activeChat as BlockProp).block_id.toString()))

//
const scrollToBottom = () => {
  contentRef.value.scrollTop = contentRef.value.scrollHeight
}

// watch(() => historyStore.state.history.blockHistory, () => {
//   console.log(historyStore.state.history.blockHistory)
//   console.log(typeof (activeStore.state.active.activeChat as BlockProp).block_id)
// }, {
//   deep: true
// })

watch(() => historyStore.state.history.blockHistory.get((activeStore.state.active.activeChat as BlockProp).block_id.toString()), () => {
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
