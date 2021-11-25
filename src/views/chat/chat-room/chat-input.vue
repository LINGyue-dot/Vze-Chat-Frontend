<template>
  <div class="ci-container">
    <div class="input">
      <div id="editor" ></div>
      <!--      <a-textarea class="input-area" v-model:value="msg" @pressEnter.prevent="send"/>-->
    </div>
    <a-button class="btn" type="primary" @click="sendHTML">发送</a-button>
  </div>
</template>
<script lang="ts" setup>
import { ref } from '@vue/reactivity'
import { sendBlock, sendP2P } from '@/websocket/utils'
import { useStore } from 'vuex'
import { ActiveStateProp } from '@/store/active'
import { BlockProp, ChatType, MessageType, UserProp } from '@/websocket/type'
import { PermissionStateType } from '@/store/permission'
import initEditor, { clearContent, getHTML } from '@/editor'
import { onMounted } from '@vue/runtime-core'

onMounted(() => {
  initEditor()
})

const sendHTML = () => {
  msg.value = getHTML()
  send()
}

const msg = ref()

const activeStore = useStore<{ active: ActiveStateProp }>()
const permissionStore = useStore<{ permission: PermissionStateType }>()
const send = () => {
  if (!msg.value.trim()) {
    return
  } else {
    // 群消息
    if ((activeStore.state.active.activeChat as BlockProp)?.block_id) {
      sendBlock({
        type: MessageType.MESSAGE,
        // @ts-ignore
        from_user_id: permissionStore.state.permission.user_id.toString(),
        message_id: '-2',
        message: msg.value.trim(),
        chat_type: ChatType.BLOCK,
        send_time:Date.now(),
        // @ts-ignore
        block_id: activeStore.state.active.activeChat.block_id,
        at_user_id: undefined,
      })
    } else
      // p2p 消息
    if ((activeStore.state.active.activeChat as UserProp)?.user_id) {
      sendP2P({
        type: MessageType.MESSAGE,
        // @ts-ignore
        from_user_id: permissionStore.state.permission.user_id.toString(),
        message_id: '-2',
        message: msg.value.trim(),
        chat_type: ChatType.PTP,
        send_time:Date.now(),
        // @ts-ignore
        to_user_id: (activeStore.state.active.activeChat as UserProp).user_id.toString(),
      })
    }
    msg.value = ''
    clearContent()
  }
}
</script>
<style scoped>
@import "../../../editor/style.css";

.ci-container {
  width: 100%;
  height: 100%;
  position: relative;
  overflow-x:hidden;

}

.input {
  display: block;
  width: 100%;
  height: 100%;
}
.input >>> p{
  word-break: break-all;
}

.input-area {
  display: block;
  width: 100%;
  height: 100%;
}

.btn {
  position: absolute;
  bottom: 10px;
  right: 10px;
  z-index: 999999 !important;
}


</style>
