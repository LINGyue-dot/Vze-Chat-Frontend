<template>
  <div class="login-container">
    <a-input
      placeholder="输入昵称，如果存在就自动登录。"
      size="large"
      class="login-input"
      v-model:value="name"
    ></a-input>
    <p style="color: rgba(0,0,0,0.2)">试试 ”A“ ，为已注册用户</p>
    <a-button type="primary" @click="login">确认</a-button>
  </div>
</template>
<script lang="ts" setup>
import { PermissionStateType } from '@/store/permission'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { message } from 'ant-design-vue'

const store = useStore<{ permission: PermissionStateType }>()
const router = useRouter()

const name = ref()
const login = () => {
  store.dispatch('permission/login', name.value).then(() => {
    router.push('/chat')
  }).catch(() => {
    message.error('登录失败')
  })
}
</script>
<style scoped>
.login-container {
  border: solid 1px #000;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.login-input {
  margin-bottom: 20px;
  width: 50%;
}
</style>
