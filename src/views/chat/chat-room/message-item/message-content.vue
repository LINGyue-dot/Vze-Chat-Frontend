<template>
	<div class="mc-container">
		<div class="name">{{ $props.userName }}</div>
		<div class="content">{{ $props.content }}</div>
	</div>
</template>
<script lang="ts" setup>
defineProps({
	content: String,
	userName: String,
});
</script>
<style scoped>
.mc-container {
	display: flex;
	flex-direction: column;
}
.name {
	height: 20px;
	font-size: 16px;
	line-height: 20px;
}
.content {
	width: 100%;
	min-height: 30px;
}
</style>
