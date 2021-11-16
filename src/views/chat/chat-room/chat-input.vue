<template>
	<div class="ci-conatiner">
		<div class="input">
			<a-textarea v-model:value="msg" @pressEnter.prevent="send" />
		</div>
		<a-button class="btn" type="primary" @click="send">发送</a-button>
	</div>
</template>
<script lang="ts" setup>
import { ref } from "@vue/reactivity";
import { sendUserMessage } from "@/websocket/utils";
import { useStore } from "vuex";
import { ActiveStateProp } from "@/store/active";
import { BlockProp, ChatType, MessageType, UserProp } from "@/websocket/type";
import { PermissionStateType } from "@/store/permission";

const msg = ref();

const activeStore = useStore<{ active: ActiveStateProp }>();
const permissionStore = useStore<{ permission: PermissionStateType }>();
const send = () => {
	if (!msg.value.trim()) {
		return;
	} else {
		// 群消息
		if ((activeStore.state.active.activeChat as BlockProp)?.block_id) {
			sendUserMessage({
				type: MessageType.MESSAGE,
				// @ts-ignore
				from_user_id: permissionStore.state.permission.user_id,
				message_id: "-2",
				message: msg.value.trim(),
				chat_type: ChatType.BLOCK,
				// @ts-ignore
				block_id: activeStore.state.active.activeChat.block_id,
				at_user_id: undefined,
			});
		}
		// p2p 消息
		if ((activeStore.state.active.activeChat as UserProp)?.user_id) {
			sendUserMessage({
				type: MessageType.MESSAGE,
				// @ts-ignore
				from_user_id: permissionStore.state.permission.user_id,
				message_id: "-2",
				message: msg.value.trim(),
				chat_type: ChatType.PTP,
				// @ts-ignore
				to_user_id: (activeStore.state.active.activeChat as UserProp).user_id,
			});
		}
	}
};
</script>
<style scoped>
.ci-container {
	width: 100%;
	height: 100%;
}
</style>
