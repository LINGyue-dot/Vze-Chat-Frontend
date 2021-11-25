<template>
  <div class="mi-container" :class="{ own: isOwn }">
    <a-avatar class="avatar" :class="{'own-avatar':isOwn}" shape="square" :src="user?.user_img"
    ></a-avatar>
    <div class="content">
      <div class="name" :class="{'own-name':isOwn}">{{ user?.user_name }}</div>
      <MessageContent
        class="message"
        :class="{'own-content':isOwn}"
        :content="props.message.message"
      />
    </div>
  </div>
</template>
<script lang="ts" setup>
import { InformationStateType } from '@/store/information'
import { PermissionStateType } from '@/store/permission'
import { BlockMessageProp, P2PMessageProp, SendP2PMessageProp, TempMessageState, UserProp } from '@/websocket/type'
import { onMounted, PropType, ref } from '@vue/runtime-core'
import { useStore } from 'vuex'
import MessageContent from './message-content.vue'
import { computed } from '@vue/reactivity'

const props = defineProps({
  message: {
    type: Object as PropType<BlockMessageProp>,
    required: true,
  },
})

const user = ref<UserProp>()
const informationStore = useStore<{ information: InformationStateType }>()
const permissionStore = useStore<{ permission: PermissionStateType }>()
const isOwn = computed(() => permissionStore.state.permission.user_id == props.message.from_user_id)

// 获取用户信息
const getUserInfo = async () => {
  user.value = await informationStore.dispatch(
    'information/getUserInformation',
    props.message.from_user_id
  )
}



onMounted(() => {
  getUserInfo()
})
</script>
<style scoped>
.mi-container {
  width: 100%;
  min-height: 40px;
  margin: 10px 0;
  padding: 0 10px;
  display: flex;
  flex-direction: row;
  box-sizing: border-box;
}

.name {
  height: 30px;
  font-size: 15px;
  line-height: 30px;
  display: inline-block;
}

.avatar {
  width: 35px;
  height: 35px;
  margin-right: 20px;
}

.content {
  max-width: 70%;
  display: flex;
  flex-direction: column;
}

.message {
  background-color: #fff;
}

.own {
  flex-direction: row-reverse;
}

.own-avatar {
  margin-left: 20px;
  margin-right: 0;
}

.own-name {
  text-align: right;
}

.own-content {
  background-color: #9eea6a;
}


</style>
