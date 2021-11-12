<template></template>
<script lang="ts" setup>
import { ConversationProp } from "@/store/active";
import { PropType } from "@vue/runtime-core";

defineProps({
	conversation: {
		type: Object as PropType<ConversationProp>,
		required: true,
	},
});
</script>
<style scoped></style>
