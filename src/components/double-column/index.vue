<template>
	<div class="double-column-conatiner">
		<div class="select-container">
			<div
				class="left"
				:class="{ 'active-selector': isLeft }"
				@click.stop="changeToLeft"
			>
				{{ $props.leftName }}
			</div>
			<div
				class="right"
				:class="{ 'active-selector': !isLeft }"
				@click.stop="changeToRight"
			>
				{{ $props.rigthName }}
			</div>
		</div>

		<div class="content">
			<div class="left-content" :class="{ 'left-is-left': !isLeft }">
				<slot name="left"></slot>
			</div>
			<div class="right-content" :class="{ 'right-is-left': !isLeft }">
				<slot name="right"></slot>
			</div>
		</div>
	</div>
</template>
<script lang="ts">
import { defineComponent, ref } from "vue";
export default defineComponent({
	props: {
		leftName: {
			type: String,
			required: true,
		},
		rigthName: {
			type: String,
			required: true,
		},
	},
	setup() {
		const isLeft = ref<Boolean>(true);
		const changeToLeft = () => {
			isLeft.value = true;
		};
		const changeToRight = () => {
			isLeft.value = false;
		};

		return {
			isLeft,
			changeToLeft,
			changeToRight,
		};
	},
});
</script>
<style scoped>
.double-column-conatiner {
	width: 100%;
	height: 100%;
	border: solid 1px #eee;
	overflow: hidden;
}
.select-container {
	display: flex;
	flex-direction: row;
	width: 100%;
	height: 60px;
	align-items: center;
	justify-content: center;
	border-bottom: solid 1px #000;
}
.left,
.right {
	flex: 1;
	text-align: center;
	/* width: 100%; */
}
.active-selector {
	color: #1890ff;
}

.content {
	display: flex;
	flex-direction: row;
	width: 200%;
	height: calc(100% - 60px);
	overflow: hidden;
}

.left-content,
.right-content {
	width: 100%;
	height: 100%;
	transition: all 0.2s;
}
.left-content {
	/* transform: translateX(-100%); */
}
.right-content {
	/* transform: translateX(-100%); */
}

.left-is-left {
	transform: translateX(-100%);
}
.right-is-left {
	transform: translateX(-100%);
}
</style>
