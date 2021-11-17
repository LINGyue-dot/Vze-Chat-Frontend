<template>
  <div class="cr-container" ref="contentRef">
    <ContacterMessageItem v-for="item in p2pList"
                          :key="item.temp_id||item.message_id"
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
import { ref } from '@vue/runtime-core'

const activeStore = useStore<{ active: ActiveStateProp }>()
const historyStore = useStore<{ history: HistoryStateType }>()

const contentRef = ref<HTMLDivElement>(null)

const p2pList = computed(() => historyStore.state.history.p2pHistory.get((activeStore.state.active.activeChat as UserProp).user_id.toString()))

//
const scrollToBottom = () => {
  contentRef.value.scrollTop = contentRef.value.scrollHeight
}

watch(() => historyStore.state.history.p2pHistory.get((activeStore.state.active.activeChat as UserProp).user_id.toString()), () => {
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
