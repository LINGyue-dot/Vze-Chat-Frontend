<template>
  <div class="mi-container" :class="{ 'mi-container-own': isOwner }">
    <template v-if="showMessage">
      <div class="mi-ava">
        <a-avatar size="noraml">
          <template #icon><UserOutlined /></template>
        </a-avatar>
      </div>
      <div class="mi-data">
        <p class="mi-name" :class="{ 'mi-name-own': isOwner }">
          {{ $props.messageItem?.username }}
        </p>
        <p class="mi-msg">
          {{ $props.messageItem?.message }}
        </p>
      </div>
    </template>
    <template v-else>
      <system-item :message-item="$props.messageItem" />
    </template>
  </div>
</template>
<script lang="ts">
import { StateProp } from "@/store";
import { MessageProp, MessageType } from "@/websocket/type";
import { UserOutlined } from "@ant-design/icons-vue";
import { defineComponent, PropType, computed, onMounted } from "vue";
import { useStore } from "vuex";
import SystemItem from "./system-item.vue";
export default defineComponent({
  name: "MessageItem",
  props: {
    messageItem: {
      type: Object as PropType<MessageProp>,
      require: true,
    },
  },
  components: {
    UserOutlined,
    SystemItem,
  },
  setup(props) {
    const store = useStore<StateProp>();
    const showMessage = computed(
      () => props.messageItem?.type !== MessageType.SYSTEM
    );

    const isOwner = computed(() => {
      return props.messageItem?.id === store.state.id;
    });

    onMounted(() => console.log(props.messageItem));

    return {
      showMessage,
      isOwner,
    };
  },
});
</script>
<style scoped>
.mi-container {
  width: 100%;
  margin: 10px 0;
  padding: 0 10px;
  display: flex;
  flex-direction: row;
}
.mi-container-own {
  flex-direction: row-reverse;
}

.mi-ava {
  width: 40px;
  display: flex;
  justify-content: center;
}

.mi-data {
  /* flex: 1; */
  width: 80%;
  display: flex;
  flex-direction: column;
}
.mi-name {
  height: 20px;
  color: pink;
  font-size: 16px;
}

.mi-name-own {
  text-align: right;
  color: red;
}
.mi-msg {
  font-size: 12px;
  border: solid 1px #000;
  padding: 5px;
  border-radius: 10px;
  word-wrap: break-word;
  word-break: break-all;
}

.mi-container::-webkit-scrollbar {
  width: 1em;
}
</style>
