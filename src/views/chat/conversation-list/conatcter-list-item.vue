<template>
  <div
    class="conversation-list-item-container"
    @click="handlClick"
  >
    <img class="item-img" :src="$props.conatcter.user_img" alt=""/>
    <div class="content">
      {{ $props.conatcter.user_name }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ActiveStateProp, TabProp } from '@/store/active'
import { PropType, ref } from '@vue/runtime-core'
import { useStore } from 'vuex'
import { deafultImg } from '@/utils/config'
import { UserProp } from '@/websocket/type'

const props = defineProps({
  conatcter: {
    type: Object as PropType<UserProp>,
    required: true,
  },
})
//
const activeStore = useStore<{ active: ActiveStateProp }>()

// 激活后修改 active 以及 对应的 notice 数目
const handlClick = () => {
// 该联系人的 conversation id ，如果有则直接将 activeChat 赋值为此，如果没有则新建会话并将其 active
  const tempConversationId = 'c_' + props.conatcter.user_id
  activeStore.dispatch('conversation/topConversation', {
    conversation_id: tempConversationId,
    user: props.conatcter
  })
  // 将其变为 active
  activeStore.commit('active/changeActiveConversation', {
    activeConversationId: tempConversationId,
    activeChat: {
      ...props.conatcter,
      user_id: props.conatcter.user_id?.toString()
    }
  })
  activeStore.commit('active/switchTab', TabProp.Conversation)
}

</script>
<style scoped>
.conversation-list-item-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  width: 100%;
  height: 70px;
  padding: 5px;
  background-color: #e4e4e5;
  border-bottom: solid 1px #000;
}

.active {
  background-color: pink;
}

.item-img {
  display: block;
  width: 60px;
  height: 100%;
  object-fit: cover;
}

.content {
  flex: 1;
  padding-left: 5px;
  height: 100%;
}
</style>
