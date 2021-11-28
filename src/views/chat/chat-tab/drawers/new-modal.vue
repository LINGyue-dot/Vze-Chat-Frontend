<template>
  <a-modal :visible="visible" title="新建群" @ok="hanleOk" :confirmLoading="confirmLoading" :closable="true"
           @cancel="cancel">
    <a-input v-model:value="value" placeholder="起个响亮的名字吧"/>
  </a-modal>
</template>
<script lang='ts' setup>
import { ref } from '@vue/runtime-core'
import { newBlock } from '@/api/ws'
import { message } from 'ant-design-vue'
import { useStore } from 'vuex'
import { PermissionStoreType } from '@/store/permission'
import { sendBlock } from '@/websocket/utils'
import { BlockProp, ChatType, MessageType } from '@/websocket/type'

const visible = ref(false)

const openModal = () => {
  visible.value = true
}

defineExpose({
  openModal
})

const value = ref()
const confirmLoading = ref(false)
const cancel = () => {
  visible.value = false
}
const hanleOk = async () => {
  visible.value = false
  confirmLoading.value = true
  try {
    const {
      code,
      data
    } = await newBlock(value.value)
    if (code == 200) {
      message.success('创建成功')
      sendToNewBlock(data)
    } else {
      message.error('创建失败')
    }
  } catch (e) {
    message.error('创建失败')
  }
  confirmLoading.value = false
}

const permissionStore = useStore<{ permission: PermissionStoreType }>()
const sendToNewBlock = (block: BlockProp) => {
  sendBlock({
    type: MessageType.MESSAGE,
    // @ts-ignore
    from_user_id: permissionStore.state.permission.user_id.toString(),
    message_id: '-2',
    message: `<p>成功创建${block.block_name}</p>`,
    chat_type: ChatType.BLOCK,
    send_time: Date.now(),
    // @ts-ignore
    block_id: block.block_id,
    at_user_id: undefined,
  })
  permissionStore.dispatch('conversation/topConversation', {
    block,
    conversation_id: `b_${block.block_id}`
  })
}
</script>
<style scoped>

</style>
