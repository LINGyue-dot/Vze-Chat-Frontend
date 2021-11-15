<template>
	<div class="mi-container" :class="{ own: isOwn() }">
		<a-avatar class="avatar" :src="user?.user_img"></a-avatar>
		<div class="content">
			<MessageContent
				:content="props.message.message"
				:user-name="user?.user_name"
			/>
		</div>
	</div>
</template>
<script lang="ts" setup>
import { InformationStateType } from "@/store/information";
import { PermissionStateType } from "@/store/permission";
import { MessageProp, UserProp } from "@/websocket/type";
import { onMounted, PropType, ref } from "@vue/runtime-core";
import { useStore } from "vuex";
import MessageContent from "./message-content.vue";

const props = defineProps({
	message: {
		type: Object as PropType<MessageProp>,
		required: true,
	},
});

const user = ref<UserProp>();
const informationStore = useStore<{ information: InformationStateType }>();
const permissionStore = useStore<{ permission: PermissionStateType }>();
const isOwn = () => {
	return (
		permissionStore.state.permission.user_id === props.message.from_user_id
	);
};
const getImgSrc = async () => {
	user.value = await informationStore.dispatch(
		"information/getUserInformation"
	);
};

onMounted(() => {
	getImgSrc();
});
</script>
<style scoped>
.mi-container {
	width: 100%;
	min-height: 40px;
	margin: 10px 0;
	padding: 0 10px;
	display: flex;
	flex-direction: row;
}

.own {
	flex-direction: row-reverse;
}
.avatar {
	width: 35px;
	height: 35px;
	margin-left: 20px;
}
.content {
	width: 60%;
}
</style>
