<template>
  <div class="chat-container">
    <div class="chat-message" id="style-5" ref="mgRef">
      <message-item
        v-for="(item, index) in msgArr"
        :key="index"
        :message-item="item"
      />
    </div>
    <div class="chat-send">
      <a-textarea
        class="chat-input"
        v-model:value="sendMessage"
        size="large"
        @pressEnter.prevent="send"
      />
      <a-button class="chat-btn" type="primary" @click="send"> send</a-button>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { StateProp, Types } from "@/store";
import WS, { WS_API } from "@/websocket";
import { MessageProp } from "@/websocket/type";
import { onMounted, ref } from "@vue/runtime-core";
import { useStore } from "vuex";
import MessageItem from "./message-item.vue";

const store = useStore<StateProp>();

const mgRef = ref();

const msgArr = ref<MessageProp[]>([]);

const scrollToBottom = () => {};

const connectSuccess = () => {
  console.log("connect success");
};

const onmessage = (data: MessageProp) => {
  msgArr.value.push(data);
  scrollToBottom();
};

const onopen = () => {
  console.log("onopen");
};

const onerror = () => {
  console.log("onerror");
};

const boostrap = () => {
  const ws = new WS(WS_API, {
    connectSuccess,
    onmessage,
    onopen,
    onerror,
  });
  store.commit(Types.CHANGE_WS, ws);
};

const sendMessage = ref();

const send = () => {
  store.state.ws?.send(sendMessage.value);
  sendMessage.value = "";
};

const closeWs = () => {
  store.state.ws?.closeWs();
};

onMounted(() => {
  boostrap();
});
</script>
<style scoped>
.chat-container {
  display: flex;
  width: 100%;
  height: 100%;
  border: solid 1px #000;
  overflow: hidden;
  flex-direction: column;
}
.chat-message {
  flex: 4;
  /* border-bottom: solid 1px pink; */
  overflow-y: auto;
}

.chat-send {
  flex: 1;
  position: relative;
}

.chat-input {
  height: 100%;
}
.chat-btn {
  position: absolute;
  bottom: 10px;
  right: 10px;
}

#style-5::-webkit-scrollbar,
.chat-input::-webkit-scrollbar {
  width: 10px;
  background-color: #f5f5f5;
}

#style-5::-webkit-scrollbar-thumb,
.chat-input::-webkit-scrollbar {
  background-color: #cccccc;
}
</style>
