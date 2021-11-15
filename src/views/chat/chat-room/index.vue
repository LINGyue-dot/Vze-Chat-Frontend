<template>
	<div
		v-if="activeStore.state.active.activeConversationId"
		class="chat-room-container"
	>
		<div class="title">{{ title }}</div>
		<div class="content"><ChatRoomContent /></div>
		<div class="input"><ChatInput /></div>
	</div>
	<div v-else class="white"></div>
</template>
<script lang="ts" setup>
import { ActiveStateProp } from "@/store/active";
import { BlockProp, UserProp } from "@/websocket/type";
import { computed } from "@vue/reactivity";
import { useStore } from "vuex";
import ChatRoomContent from "./chat-room-content.vue";
import ChatInput from "./chat-input.vue";

const activeStore = useStore<{ active: ActiveStateProp }>();

const title = computed(() => {
	return (
		(activeStore.state.active.activeChat as UserProp).user_name ||
		(activeStore.state.active.activeChat as BlockProp).block_name ||
		"哈哈哈哈"
	);
});
</script>
<style scoped>
.chat-room-container {
	display: flex;
	flex-direction: column;
	width: 100%;
	height: 100%;
}

.title {
	width: 100%;
	height: 60px;
	font-size: 20px;
	border-bottom: solid 1px #eee;
}
.content {
	width: 100%;
	flex: 5;
	border-bottom: solid 2px #000;
}

.input {
	width: 100%;
	flex: 2;
}

.white {
	width: 100%;
	height: 100%;
	background-color: #eee;
}
</style>
