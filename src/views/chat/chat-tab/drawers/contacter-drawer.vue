<template>
  <a-drawer :width="500" title="添加好友" placement="left" :visible="visible" @close="onClose">
    <template #extra>
      <a-button style="margin-right: 8px" @click="onClose">Cancel</a-button>
      <a-button type="primary" @click="onClose">Submit</a-button>
    </template>
    <a-input-search
      v-model:value="value"
      placeholder="试试搜索 ”千“（mysql 模糊搜索）"
      @search="search"
    />
    <a-list
      item-layout="horizontal"
      :data-source="dataList"
    >
      <template #renderItem="{item}">
        <a-list-item>
          <template #actions>
            <template v-if="isContacter(item.user_id)">
              <a disabled>已添加</a>
            </template>
            <template v-else>
              <a @click="handleClick(item.user_id)">添加</a>
            </template>
          </template>
          <a-list-item-meta>
            <template #title>
              {{ item.user_name }}
            </template>
            <template #avatar>
              <a-avatar :src="item.user_img"/>
            </template>
          </a-list-item-meta>
        </a-list-item>
      </template>
    </a-list>
  </a-drawer>
</template>
<script lang='ts' setup>
// 父组件点击引起 visiable 变化

import { onMounted, ref } from '@vue/runtime-core'
import { ChatType, ContacterProp, MessageType, UserProp } from '@/websocket/type'
import { addContacter, searchContacter } from '@/api/ws'
import { useStore } from 'vuex'
import { InformationStoreType } from '@/store/information'
import { message } from 'ant-design-vue'
import { sendP2P } from '@/websocket/utils'
import { PermissionStoreType } from '@/store/permission'

const dataList = ref<ContacterProp[]>()

const visible = ref(false)
const openDrawer = () => {
  visible.value = true
}

const onClose = () => {
  visible.value = false
}

const value = ref()
// 搜索
const search = async () => {
  const { data } = await searchContacter(value.value)
  dataList.value = data
}

const informationStore = useStore<{ information: InformationStoreType }>()
const isContacter = (contacter_id: string) => {
  const data = informationStore.state.information.contacterList
  for (let i = 0; i < data.length; i++) {
    if (data[i].user_id == contacter_id) {
      return true
    }
  }
  return false
}

// 添加好友
const handleClick = async (user_id: string) => {
  console.log('-------')
  try {
    const { code } = await addContacter(user_id)
    console.log(code)
    if (code == 200) {
      message.success('添加成功')
      sendToNew(user_id)
      onClose()
    } else {
      message.error('添加失败')
    }
  } catch (e) {
    console.error((e))
  }
}
const permissionStore = useStore<{ permission: PermissionStoreType }>()
const sendToNew = (user_id: string) => {
  sendP2P({
    type: MessageType.MESSAGE,
    // @ts-ignore
    from_user_id: permissionStore.state.permission.user_id.toString(),
    message_id: '-2',
    message: '<p>hello 我们已经成为好友啦</p>',
    chat_type: ChatType.PTP,
    send_time: Date.now(),
    // @ts-ignore
    to_user_id: user_id
  })
  permissionStore.dispatch('conversation/topConversation', {
    user: { user_id },
    conversation_id: `c_${user_id}`
  })
}

defineExpose({
  openDrawer
})

</script>
<style scoped>

</style>
