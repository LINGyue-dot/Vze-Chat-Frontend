<template>
	<div style="height: 100%; width: 190px">
		<a-button type="primary" @click="router.push('/chat')">websocket</a-button>
		<a-button type="primary" @click="router.push('/offer')">webrtc</a-button>
    <a-button type="primary" @click="router.push('/upload')">upload</a-button>

  </div>
</template>
<script lang="ts" setup>
import { useRouter } from "vue-router";
const router = useRouter();
</script>
<style scoped>
.item {
	width: 100%;
	height: 60px;
	background-color: #eee;
	margin-bottom: 10px;
}
</style>
