<template>
	<div
		class="scroll-container"
		ref="scrollRef"
		@touchstart.stop="handlerTouchStart"
		@touchmove.stop="handlerTouchMove"
		@touchend.stop="handlerTouchEnd"
		:class="{ transition: isTransition }"
	>
		<!-- 添加刷新图片 -->
		<div class="refresh">
			<img
				src="https://www.easyicon.net/api/resizeApi.php?id=1190769&size=48"
			/>
		</div>

		<slot></slot>
		<div class="load">
			<img
				src="https://img.lanrentuku.com/img/allimg/1212/5-121204193R5-50.gif"
			/>
		</div>
	</div>
</template>
<script lang="ts" setup>
// 下拉刷新和上拉加载更多

import { ref } from "@vue/reactivity";

const scrollRef = ref<HTMLDivElement>();

const isTransition = ref<Boolean>(false);

const startLocationY = ref(0);

const handlerTouchStart = (e: TouchEvent) => {
	startLocationY.value = e.touches[0].pageY;
	isTransition.value = false;
	console.log("touchStart");
};

const handlerTouchMove = (e: TouchEvent) => {
	const moveDistanceY = Math.floor(e.touches[0].pageY - startLocationY.value);
	if (scrollRef.value) {
		scrollRef.value.style.transform = `translateY(${moveDistanceY}px)`;
	}
};

const handlerTouchEnd = (e: TouchEvent) => {
	isTransition.value = true;

	if (scrollRef.value) {
		scrollRef.value.style.transform = `translateY(${0}px)`;
	}
};
</script>
<style scoped>
.transition {
	transition: all 0.7s;
}
</style>
