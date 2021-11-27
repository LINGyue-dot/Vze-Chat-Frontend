<template>
  <div class="mc-container">
    <quick-preview :code="$props.content"/>
    <!--    <div class="content" v-html="$props.content"></div>-->
  </div>
</template>
<script lang="ts" setup>
defineProps({
  content: String,
})
</script>
<style scoped>
.mc-container {
  display: inline-block;
  flex-direction: column;
  padding: 5px;
  border-radius: 2px;
}

.content {
  display: inline-block;
  min-width: 30px;
  max-width: 100%;
  min-height: 30px;
  line-height: 30px;
  word-break: break-all;
  word-wrap: anywhere;
}

.content >>> p {
  margin: 0;
}


</style>
