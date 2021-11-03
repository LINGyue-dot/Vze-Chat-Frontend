<template>
	<video ref="videoRef"></video>
</template>
<script lang="ts" setup>
import { ref } from "@vue/reactivity";

const videoRef = ref<HTMLVideoElement>();
const answerPeer = ref<RTCPeerConnection>();

const boostrap = () => {
	answerPeer.value = new RTCPeerConnection();
	answerPeer.value.ontrack = function (e) {
		console.log("from offer", e.streams);
	};

	answerPeer.value.onicecandidate = function (event) {
		if (event.candidate) {
			sendCandidate(event.candidate);
		}
	};
};

const sendCandidate = (candidate: RTCIceCandidate) => {};

const handleSuccess = (stream: MediaStream) => {};

// 接收到 offer 之后
const afterGetOffer = (sdp: RTCSessionDescriptionInit) => {
	let desc = new RTCSessionDescription(sdp);
	answerPeer.value?.setRemoteDescription(desc).then(() => {
		answerPeer.value?.createAnswer().then(answer => {
			answerPeer.value?.setLocalDescription(answer).then(sendAnswer);
		});
	});
};
const sendAnswer = () => {};
</script>
<style scoped></style>
