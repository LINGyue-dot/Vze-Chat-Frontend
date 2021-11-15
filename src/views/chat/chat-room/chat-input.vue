<template>
	<div class="ci-conatiner">
		<div class="input">
			<a-textarea v-model:value="msg" @pressEnter.prevent="sendMessage" />
		</div>
		<a-button class="btn" type="primary" @click="sendMessage">发送</a-button>
	</div>
</template>
<script lang="ts" setup>
import { ref } from "@vue/reactivity";

const msg = ref();

const sendMessage = () => {
	if (!msg.value.trim()) {
		return;
	} else {
	}
};
</script>
<style scoped>
.ci-container {
	width: 100%;
	height: 100%;
}
</style>
