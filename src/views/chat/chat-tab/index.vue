<template>
	<div class="chat-tab-container">
		<img
			class="owner-img"
			:src="permissionStore.state.permission.user_img || deafultAvatar"
			alt=""
		/>
		<div
			class="tab-icon"
			:class="{
				'tab-icon-active':
					activeStore.state.active.activeTab === TabProp.Contacter,
			}"
			@click="activeStore.commit(ActiveTypes.SWITCHTAB, TabProp.Contacter)"
		></div>
		<div
			class="tab-icon"
			:class="{
				'tab-icon-active':
					activeStore.state.active.activeTab === TabProp.Conversation,
			}"
			@click="
				permissionStore.commit(ActiveTypes.SWITCHTAB, TabProp.Conversation)
			"
		></div>
	</div>
</template>
<script lang="ts" setup>
import { ActiveStateProp, ActiveTypes, TabProp } from "@/store/active";
import { PermissionStateType } from "@/store/permission";
import { useStore } from "vuex";
import { deafultAvatar } from "@/utils/config";

const permissionStore = useStore<{ permission: PermissionStateType }>();

const activeStore = useStore<{ active: ActiveStateProp }>();
</script>
<style scoped>
.chat-tab-container {
	background-color: #2e2e2e;
	display: flex;
	flex-direction: column;
	align-items: center;
	width: 100%;
	height: 100%;
}

.owner-img {
	margin-top: 30px;
	display: inline-block;
	width: 45px;
	height: 45px;
	object-fit: cover;
	border: solid 1px #eee;
}
.tab-icon {
	margin-top: 30px;
	width: 45px;
	height: 45px;
	border: solid 1px #eee;
}
.tab-icon-active {
	background-color: #07c160;
}
</style>
