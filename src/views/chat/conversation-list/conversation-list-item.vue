<template>
	<div
		class="conversation-list-item-container"
		:class="{
			active:
				props.conversation.conversation_id ===
				activeStore.state.active.activeConversationId,
		}"
		@click="handlClick"
	>
		<img class="item-img" :src="imgSrc" alt="" />
		<div class="content">
			{{ name }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{
				props.conversation.notice_num
			}}
		</div>
	</div>
</template>
<script lang="ts" setup>
import { ActiveStateProp, ActiveTypes } from "@/store/active";
import { ConversationProp } from "@/store/conversation";
import { InformationStateType } from "@/store/information";
import { onMounted, PropType, ref } from "@vue/runtime-core";
import { useStore } from "vuex";
import { deafultImg } from "@/utils/config";
import { BlockProp, ContacterProp, UserProp } from "@/websocket/type";

const props = defineProps({
	conversation: {
		type: Object as PropType<ConversationProp>,
		required: true,
	},
});

const activeStore = useStore<{ active: ActiveStateProp }>();
const informationStore = useStore<{ information: InformationStateType }>();
const imgSrc = ref<string>(deafultImg);
const name = ref<string | undefined>(
	props.conversation.block_id || props.conversation.contacter_id
);

const tempChat = ref<BlockProp | ContacterProp | undefined>();

const handlClick = () => {
	activeStore.commit(ActiveTypes.CHANGEACTIVECONVERSATION, {
		activeConversationId: props.conversation.conversation_id,
		activeChat: tempChat.value,
	});
};

onMounted(async () => {
	if (props.conversation.is_block) {
		const block: BlockProp = await informationStore.dispatch(
			"information/getBlockInformation",
			props.conversation.block_id
		);
		if (block) {
			tempChat.value = block;
			if (block.block_img) {
				imgSrc.value = block.block_img;
			}
			name.value = block.block_name;
		}
	} else {
		const user: UserProp = await informationStore.dispatch(
			"information/getUserInformation",
			props.conversation.contacter_id
		);
		if (user) {
			tempChat.value = user;
			if (user.user_img) {
				imgSrc.value = user.user_img;
			}
			name.value = user.user_name;
			console.log(name.value, user.user_name);
		}
	}
});
</script>
<style scoped>
.conversation-list-item-container {
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: center;
	box-sizing: border-box;
	width: 100%;
	height: 70px;
	padding: 5px;
	background-color: #e4e4e5;
	border-bottom: solid 1px #000;
}
.active {
	background-color: pink;
}
.item-img {
	display: block;
	width: 60px;
	height: 100%;
	object-fit: cover;
}
.content {
	flex: 1;
	padding-left: 5px;
	height: 100%;
}
</style>
