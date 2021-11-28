<template>
  <a-drawer :width="500" title="加群" placement="left" :visible="visible" @close="onClose">
    <template #extra>
      <a-button style="margin-right: 8px" @click="onClose">Cancel</a-button>
      <a-button type="primary" @click="onClose">Submit</a-button>
    </template>
    <a-input-search
      v-model:value="value"
      placeholder="模糊搜索"
      @search="search"
    />
    <a-list
      item-layout="horizontal"
      :data-source="dataList"
    >
      <template #renderItem="{item}">
        <a-list-item>
          <template #actions>
            <template v-if="isOwn(item.block_id)">
              <a disabled>已加入</a>
            </template>
            <template v-else>
              <a @click="handleClick(item.block_id)">加入</a>
            </template>
          </template>
          <a-list-item-meta>
            <template #title>
              {{ item.block_name }}
            </template>
            <template #avatar>
              <a-avatar :src="item.block_img"/>
            </template>
          </a-list-item-meta>
        </a-list-item>
      </template>
    </a-list>
  </a-drawer>

</template>
<script lang='ts' setup>

import { ref } from '@vue/runtime-core'
import { BlockProp, ChatType, MessageType } from '@/websocket/type'
import { joinBlock, searchBlock } from '@/api/ws'
import { useStore } from 'vuex'
import { InformationStateType, InformationStoreType } from '@/store/information'
import { message } from 'ant-design-vue'
import { PermissionStoreType } from '@/store/permission'
import { sendBlock, sendP2P } from '@/websocket/utils'

const visible = ref(false)

const onClose = () => {
  visible.value = false
}
const openDrawer = () => {
  visible.value = true
}
defineExpose({
  openDrawer
})

const dataList = ref<BlockProp[]>()
const value = ref()
const search = async () => {
  const { data } = await searchBlock(value.value)
  dataList.value = data
}
const informationStore = useStore<{ information: InformationStoreType }>()
// 是否已加入
const isOwn = (block_id: string) => {
  const data = informationStore.state.information.blockList
  for (let i = 0; i < data.length; i++) {
    if (data[i].block_id == block_id) {
      return true
    }
  }
  return false
}

// 添加
const handleClick = async (block_id: string) => {
  try {
    const { code } = await joinBlock(block_id)
    if (code == 200) {
      message.success('加入成功')
      sendToJoinBlock(block_id)
      onClose()

    } else {
      message.error('加入失败')
    }
  } catch (e) {
    console.error(e)
    message.error('加入失败')
  }
}

const permissionStore = useStore<{ permission: PermissionStoreType }>()
const sendToJoinBlock = (block_id: string) => {
  sendBlock({
    type: MessageType.MESSAGE,
    // @ts-ignore
    from_user_id: permissionStore.state.permission.user_id.toString(),
    message_id: '-2',
    message: `<p>hello 大家好，我是新加入的 ${permissionStore.state.permission.user_name}</p>`,
    chat_type: ChatType.BLOCK,
    send_time: Date.now(),
    // @ts-ignore
    block_id,
    at_user_id: undefined,
  })
  permissionStore.dispatch('conversation/topConversation', {
    block: { block_id },
    conversation_id: `b_${block_id}`
  })
}
</script>
<style scoped>

</style>
