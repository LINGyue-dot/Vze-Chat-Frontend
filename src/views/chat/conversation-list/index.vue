<template>
	<div class="conversation-list-container">
		<ConversationListItem
			v-for="item in store.state.conversation.conversationList"
			:key="item.conversation_id"
			:conversation="item"
		>
		</ConversationListItem>
	</div>
</template>
<script lang="ts" setup>
import { ConversationStateType } from "@/store/conversation";
import { useStore } from "vuex";
import ConversationListItem from "./conversation-list-item.vue";
const store = useStore<{ conversation: ConversationStateType }>();
</script>
<style scoped>
.conversation-list-container {
	display: flex;
	flex-direction: column;
	height: 100%;
	width: 100%;
	background-color: #fff;
	overflow-y: scroll;
}

.conversation-list-container::-webkit-scrollbar {
	width: 0;
	display: none;
}
</style>
