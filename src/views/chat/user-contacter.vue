<template>
	<div class="user-contactor-container">
		<div class="user-profile">
			<a-avatar size="large">
				<template #icon><UserOutlined /></template>
			</a-avatar>
			<span>{{ store.state.user_name }}</span>
		</div>
		<div class="user-contactor-list">
			<DoubleColumn left-name="会话" rigth-name="联系人">
				<template #left> left </template>
				<template #right> right </template>
			</DoubleColumn>
		</div>
	</div>
</template>
<script lang="ts" setup>
import { StateProp } from "@/store";
import { useStore } from "vuex";
import DoubleColumn from "@/components/double-column/index.vue";

const store = useStore<StateProp>();
</script>
<style scoped>
.user-contactor-container {
	width: 100%;
	height: 100%;
	border: solid 1px red;
}
.user-profile {
	height: 80px;
	padding-left: 10px;
	width: 100%;
	background-color: #eee;
	line-height: 80px;
	border-bottom: solid 1px #000;
}
.user-profile span {
	padding-left: 5px;
	color: pink;
}
.user-contactor-list {
	height: calc(100% - 60px);
	width: 100%;
}
</style>
