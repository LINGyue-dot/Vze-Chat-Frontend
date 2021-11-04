<template>
	<div class="offer-container">
		<video ref="offerRef"></video>
		<button @click="beginTransport">begin</button>
	</div>
</template>
<script lang="ts" setup>
import { ref } from "vue";
import initSocket from "@/webrtc";
import { Socket } from "socket.io-client";
const offerRef = ref<HTMLVideoElement | null>(null);

const socket = ref<Socket>();

const beginTransport = async () => {
	document.title = "offer";
	socket.value = await initSocket();
	// 先建立 client 与 server socket 通信再进行下面逻辑
	socket.value.on("room-ok", () => {
		console.log("offer-room ok");
		createStream();
	});
	// createStream();
	// 监听获取 answer
	socket.value.on("answer", afterGetAnswer);
	socket.value.on("answer-candidate", afterGetAnswerCandidate);
};

// 发起方
const createStream = () => {
	// 获取本地设备数据流
	navigator.mediaDevices
		.getUserMedia({ audio: false, video: true })
		.then(hanleSuccess)
		.catch(err => console.log(err));
};

const offerPeer = ref<RTCPeerConnection>();

const hanleSuccess = (stream: MediaStream) => {
	if (offerRef.value) {
		offerRef.value.srcObject = stream;
	}
	if (offerRef.value) {
		offerRef.value.onloadedmetadata = () => {
			offerRef.value?.play();
		};
	}
	offerPeer.value = new RTCPeerConnection();
	// polyfill  update from addStream to addTrack correctly?
	// https://stackoverflow.com/questions/40756693/how-to-update-from-addstream-to-addtrack-correctly
	stream.getTracks().forEach(track => offerPeer.value?.addTrack(track, stream));
	// update from onaddstream from ontrack
	offerPeer.value.ontrack = function (e: RTCTrackEvent) {
		console.log("get from other video message", e.streams);
	};
	// 寻找其 SDP 合适的 ice 候选人
	offerPeer.value.onicecandidate = function (event) {
		if (event.candidate) {
			sendCandidate(event.candidate);
		}
	};

	offerPeer.value.createOffer().then(offer => {
		// setLocalDescription 将 localDescription 设置为 offer，localDescription即我们需要发送的 SDP
		offerPeer.value?.setLocalDescription(offer).then(sendOffer);
	});
};

const sendCandidate = (candidate: RTCIceCandidate) => {
	socket.value?.emit("offer-candidate", candidate);
};

const sendOffer = () => {
	socket.value?.emit("offer", offerPeer.value?.localDescription);
	// RTCSessionDescriptionInit 与 RTCSessionDescriptio type 基本一致
};

// 获取到 answer 的 answer
const afterGetAnswer = (sdp: RTCSessionDescriptionInit) => {
	let desc = new RTCSessionDescription(sdp);
	offerPeer.value?.setRemoteDescription(desc).then(() => {
		console.log("peer connection success");
	});
};
//
const afterGetAnswerCandidate = (ice: RTCIceCandidateInit) => {
	offerPeer.value?.addIceCandidate(new RTCIceCandidate(ice));
};
</script>
<style scoped>
.offer-container {
	border: solid 2px pink;
}
</style>
