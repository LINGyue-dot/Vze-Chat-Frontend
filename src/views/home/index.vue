<template>
	<div style="height: 100%; width: 190px">
		<DoubleColumn left-name="会话" rigth-name="联系人">
			<template #left>hello</template>
			<template #right>hello</template>
		</DoubleColumn>
	</div>
</template>
<script lang="ts" setup>
import DoubleColumn from "@/components/double-column/index.vue";
</script>
<style scoped>
.item {
	width: 100%;
	height: 60px;
	background-color: #eee;
	margin-bottom: 10px;
}
</style>
