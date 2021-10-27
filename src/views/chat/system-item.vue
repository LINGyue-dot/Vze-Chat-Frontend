<template>
  <div class="si-container">
    {{ $props.messageItem.username + "  " + $props.messageItem.message }}
  </div>
</template>
<script lang="ts" setup>
import { MessageProp } from "@/websocket/type";
import { PropType } from "@vue/runtime-core";

defineProps({
  messageItem: {
    type: Object as PropType<MessageProp>,
    required: true,
  },
});
</script>
<style scoped>
.si-container {
  width: 80%;
  height: 25px;
  line-height: 25px;
  text-align: center;
  margin: 0 10%;
  background-color: #eee;
  border-radius: 10px;
}
</style>
