<template>
  <div class="chat-tab-container">
    <img
      class="owner-img"
      :src="permissionStore.state.permission.user_img || deafultAvatar"
      alt=""
    />
    <div
      class="tab-icon iconfont icon-dangqianhuihua"
      :class="{
				'tab-icon-active':
					activeStore.state.active.activeTab === TabProp.Conversation,
			}"
      @click="activeStore.commit(ActiveTypes.SWITCHTAB, TabProp.Conversation)"
    >
    </div>
    <div
      class="tab-icon iconfont icon-lianxiren"
      :class="{
				'tab-icon-active':
					activeStore.state.active.activeTab === TabProp.Contacter,
			}"
      @click="clickContacter"
    ></div>
    <div
      class="tab-icon iconfont icon-tianjiahaoyou"
      @click="openJoinContacter"
    ></div>
    <div
      class="tab-icon iconfont icon-jiaqun"
      @click="openJoinBlock"
    ></div>
    <div
      class="tab-icon iconfont icon-jurassic_add-users"
      @click="openNewBlock"
    ></div>

    <ContacterDrawer ref="contacterRef"/>
    <BlockDrawer ref="blockRef"/>
    <NewModal ref="nRef"/>

  </div>
</template>
<script lang="ts" setup>
import { ActiveStateProp, ActiveTypes, TabProp } from '@/store/active'
import { PermissionStateType } from '@/store/permission'
import { useStore } from 'vuex'
import { deafultAvatar } from '@/utils/config'
import { ref } from '@vue/runtime-core'
import ContacterDrawer from '@/views/chat/chat-tab/drawers/contacter-drawer.vue'
import BlockDrawer from '@/views/chat/chat-tab/drawers/block-drawer.vue'
import NewModal from '@/views/chat/chat-tab/drawers/new-modal.vue'

const permissionStore = useStore<{ permission: PermissionStateType }>()

const activeStore = useStore<{ active: ActiveStateProp }>()
// 点击联系人
const clickContacter = () => {
  permissionStore.commit(ActiveTypes.SWITCHTAB, TabProp.Contacter)
// 获取联系人列表
  activeStore.dispatch('information/getContacterList')
}

// 添加联系人
const contacterRef = ref()
const openJoinContacter = () => {
  contacterRef.value?.openDrawer()
}
// 加入群
const blockRef = ref()
const openJoinBlock = () => {
  blockRef.value?.openDrawer()
}
// 新建群
const nRef = ref()
const openNewBlock = () => {
  nRef.value?.openModal()
}


</script>
<style scoped>
.chat-tab-container {
  background-color: #2e2e2e;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100%;
}

.owner-img {
  margin-top: 30px;
  display: inline-block;
  width: 45px;
  height: 45px;
  object-fit: cover;
  border: solid 1px #eee;
}

.tab-icon {
  margin-top: 30px;
  width: 45px;
  height: 45px;
  font-size: 30px;
  text-align: center;
  line-height: 45px;
  color: #fff;
}

.tab-icon-active {
  color: #07c160;
}
</style>
