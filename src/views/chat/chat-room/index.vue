<template>
  <div
    v-if="activeStore.state.active.activeConversationId"
    class="chat-room-container"
  >
    <div class="title">{{ title }}</div>
    <div class="content">
      <template v-if="!activeStore.state.active.activeChat.block_id">
        <P2pRoom/>
      </template>
      <template v-else>
        <BlockRoom/>
      </template>
    </div>
    <div class="input">
      <ChatInput/>
    </div>
  </div>
  <div v-else class="white"></div>
</template>
<script lang="ts" setup>
import { ActiveStateProp } from '@/store/active'
import { BlockProp, UserProp } from '@/websocket/type'
import { computed } from '@vue/reactivity'
import { useStore } from 'vuex'
import ChatInput from './chat-input.vue'
import P2pRoom from '@/views/chat/chat-room/p2p-room.vue'
import BlockRoom from '@/views/chat/chat-room/block-room.vue'

const activeStore = useStore<{ active: ActiveStateProp }>()

const title = computed(() => {
  return (
    (activeStore.state.active.activeChat as UserProp).user_name ||
    (activeStore.state.active.activeChat as BlockProp).block_name ||
    '哈哈哈哈'
  )
})
</script>
<style scoped>
.chat-room-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
}

.title {
  width: 100%;
  height: 60px;
  font-size: 20px;
  padding-left: 10px;
  padding-top: 10px;
  border-bottom: solid 2px #eee;
  background-color: #f5f5f5;
}

.content {
  width: 100%;
  flex: 5;
  border-bottom: solid 1px #eee;
  overflow: hidden;
}

.content p {
  margin: 0 !important;
}

.input {
  width: 100%;
  flex: 2;
}

.white {
  width: 100%;
  height: 100%;
  background-color: #f7f7f7;
}
</style>
