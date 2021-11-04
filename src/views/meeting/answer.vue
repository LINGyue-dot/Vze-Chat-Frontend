<template>
	<video ref="videoRef" style="border: solid 2px red"></video>
	<button @click="beginTransport">begin</button>
</template>
<script lang="ts" setup>
import initSocket from "@/webrtc";
import { ref } from "@vue/reactivity";
import { Socket } from "socket.io-client";

const videoRef = ref<HTMLVideoElement>();
const answerPeer = ref<RTCPeerConnection>();

const socket = ref<Socket>();

const beginTransport = async () => {
	socket.value = await initSocket();
	console.log("begin");
	document.title = "answer";
	socket.value.on("room-ok", () => {
		boostrap();
		console.log("answer-room is ok");
	});
	socket.value.on("offer", afterGetOffer);
	socket.value.on("offer-candidate", afterGetOfferICE);
};

const boostrap = () => {
	answerPeer.value = new RTCPeerConnection();
	answerPeer.value.ontrack = function (e) {
		if (videoRef.value) {
			videoRef.value.srcObject = e.streams[0];
		}
		if (videoRef.value) {
			videoRef.value.onloadedmetadata = () => {
				videoRef.value?.play();
			};
		}
		console.log("from offer", e.streams);
	};
	answerPeer.value.onicecandidate = function (event) {
		if (event.candidate) {
			sendCandidate(event.candidate);
		}
	};
};

const sendAnswer = () => {
	socket.value?.emit("answer", answerPeer.value?.localDescription);
};

const sendCandidate = (candidate: RTCIceCandidate) => {
	socket.value?.emit("answer-candidate", candidate);
};

// 接收到 offer 之后
const afterGetOffer = (sdp: RTCSessionDescriptionInit) => {
	let desc = new RTCSessionDescription(sdp);
	answerPeer.value?.setRemoteDescription(desc).then(() => {
		answerPeer.value?.createAnswer().then(answer => {
			answerPeer.value?.setLocalDescription(answer).then(sendAnswer);
		});
	});
};
// 获取到 offer 的 ICE
const afterGetOfferICE = (ice: RTCIceCandidateInit) => {
	answerPeer.value?.addIceCandidate(new RTCIceCandidate(ice));
	console.log("answer add ice candidate ok");
};
</script>
<style scoped></style>
