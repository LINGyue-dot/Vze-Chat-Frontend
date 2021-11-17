<template>
  <div class="chat-container">
    <div class="chat-tab">
      <ChatTab/>
    </div>
    <div class="contacter-list">
      <ConversationList/>
    </div>
    <div class="chat-room">
      <ChatRoom/>
    </div>
  </div>
</template>
<script lang="ts" setup>
import ChatTab from './chat-tab/index.vue'
import ChatRoom from './chat-room/index.vue'
import ConversationList from './conversation-list/index.vue'
import { useStore } from 'vuex'
import { onMounted } from '@vue/runtime-core'
import { initWs } from '@/websocket'
import { nextTick } from 'process'
import { sendInitMessage } from '@/websocket/utils'

const store = useStore()

onMounted(() => {
  store.dispatch('conversation/getConversation')
})
nextTick(() => {
  initWs()

})
</script>
<style scoped>
.chat-container {
  width: 100%;
  height: 100%;
  display: flex;
  /* row 是竖着的 */
  flex-direction: row;
  border: solid 2px #000;
}

.chat-tab {
  width: 60px;
  height: 100%;
  background-color: #2e2e2e;
}

.contacter-list {
  width: 200px;
  height: 100%;
  border-right: solid 2px #eee;

  background-color: #f7f7f7;
}

.chat-room {
  flex: 1;
  height: 100%;
}
</style>
