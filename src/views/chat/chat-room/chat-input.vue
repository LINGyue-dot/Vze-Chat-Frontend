<template>
  <div class="ci-container">
    <div class="input">
      <div id="editor"></div>
      <!--      <a-textarea class="input-area" v-model:value="msg" @pressEnter.prevent="send"/>-->
    </div>
    <a-button class="btn" type="primary" @click="sendHTML">发送</a-button>
    <UploadFile ref="ufRef"/>
  </div>
</template>
<script lang="ts" setup>
import { ref } from '@vue/reactivity'
import { sendBlock, sendP2P } from '@/websocket/utils'
import { useStore } from 'vuex'
import { ActiveStateProp } from '@/store/active'
import { BlockProp, ChatType, MessageType, UserProp } from '@/websocket/type'
import { PermissionStateType } from '@/store/permission'
import initEditor, { addImg, clearContent, getHTML } from '@/editor'
import { onMounted } from '@vue/runtime-core'
import UploadFile from '@/components/upload-file/index.vue'
import { ComponentPublicInstance } from 'vue'

const ufRef = ref<ComponentPublicInstance<typeof UploadFile>>()
const imgCb = () => {
  // 图片 url
  ufRef.value?.overwriteByParent(getImgUrl)
  // 调用 input file 聚焦
  ufRef.value?.callInputClick()
  console.log('-------')
}
// 获取图片 url
const getImgUrl = (url: string) => {
  addImg(url)
}

onMounted(() => {
  initEditor(imgCb)
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
        // TODO 由於 node-mysql 插入時候 ' " 插入會造成錯誤，所以這是一個臨時方案
        message: msg.value.trim(),
        chat_type: ChatType.BLOCK,
        send_time: Date.now(),
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
        send_time: Date.now(),
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
  /*overflow-x: hidden;*/
}

.input {
  display: block;
  width: 100%;
  height: 100%;
  z-index: 10 !important;
}

.input >>> p {
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
  z-index: 10000 !important;
}


</style>
