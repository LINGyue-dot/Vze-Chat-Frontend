<template>
	<div class="chat-tab-container">
		<img class="owner-img" :src="store.state.user_img" alt="" />
		<div
			class="tab-icon"
			:class="{
				'tab-icon-active': activeStore.state.active.tab === TabProp.Contacter,
			}"
			@click="store.commit(ActiveTypes.SWITCHTAB, TabProp.Contacter)"
		></div>
		<div
			class="tab-icon"
			:class="{
				'tab-icon-active':
					activeStore.state.active.tab === TabProp.Conversation,
			}"
			@click="store.commit(ActiveTypes.SWITCHTAB, TabProp.Conversation)"
		></div>
	</div>
</template>
<script lang="ts" setup>
import { StateProp } from "@/store";
import { ActiveStateProp, ActiveTypes, TabProp } from "@/store/active";
import { useStore } from "vuex";
ActiveTypes.SWITCHTAB;
const store = useStore<StateProp>();

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
