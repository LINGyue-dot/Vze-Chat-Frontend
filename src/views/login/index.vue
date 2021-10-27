<template>
  <div class="login-container">
    <a-input
      placeholder="输入昵称"
      size="large"
      class="login-input"
      v-model:value="name"
    ></a-input>
    <a-button type="primary" @click="login">确认</a-button>
  </div>
</template>
<script lang="ts" setup>
import { StateProp } from "@/store";
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";

const store = useStore<StateProp>();
const router = useRouter();

const name = ref();
const login = () => {
  store.dispatch("login", name.value).then(() => {
    router.push("/chat");
  });
};
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
