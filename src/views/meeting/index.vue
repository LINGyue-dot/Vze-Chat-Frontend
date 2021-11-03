<template>
	<div class="meeting-container">
		<video ref="videoARef"></video>
		<video ref="videoBRef"></video>
	</div>
</template>
<script lang="ts" setup>
import { ref, onMounted } from "vue";
import socket from "@/webrtc";

const localStream = ref();

const videoARef = ref<HTMLVideoElement | null>(null);
const videoBRef = ref<HTMLVideoElement | null>(null);

const createMedia = async () => {
	// // 保存数据流
	// localStream.value = await navigator.mediaDevices.getUserMedia({
	// 	audio: true,
	// 	video: true,
	// });
	// // videoARef.value?.srcObject = localStream.value;
	// // above will cause ts error fix like below
	// if (videoARef.value) {
	// 	videoARef.value.srcObject = localStream.value;
	// }
	navigator.mediaDevices
		.getUserMedia({ audio: false, video: true })
		.then(stream => {
			if (videoARef.value) {
				videoARef.value.srcObject = stream;
			}
			if (videoARef.value) {
				videoARef.value.onloadedmetadata = () => {
					videoARef.value?.play();
				};
			}
		});
};

onMounted(() => {
	createMedia();
});
</script>
<style scoped>
.meeting-container {
	border: 1px solid #000;
}
</style>
