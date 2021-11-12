<template>
	<div class="chat-container">
		<div class="chat-tab">
			<ChatTab />
		</div>
		<div class="contacter-list">
			<ConversationList />
		</div>
		<div class="chat-room">
			<ChatRoom />
		</div>
	</div>
</template>
<script lang="ts" setup>
import ChatTab from "./chat-tab.vue";
import ChatRoom from "./chat-room.vue";
import ConversationList from "./conversation-list.vue";
</script>
<style scoped>
.chat-container {
	width: 100%;
	height: 100%;
	display: flex;
	/* row 是竖着的 */
	flex-direction: row;
}
.chat-tab {
	width: 60px;
	height: 100%;
	background-color: #eee;
}

.contacter-list {
	width: 200px;
	height: 100%;
	background-color: #aaa;
}
.chat-room {
	flex: 1;
	height: 100%;
	background-color: pink;
}
</style>
