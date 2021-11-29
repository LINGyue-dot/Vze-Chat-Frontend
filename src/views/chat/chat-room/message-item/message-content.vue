<template>
  <div class="mc-container">
    <div class="content">
      <quick-preview :code="xss($props.content,options)"/>
    </div>
    <!--    <div class="content" v-html="$props.content"></div>-->
  </div>
</template>
<script lang="ts" setup>
import * as xss from 'xss'

defineProps({
  content: String,
})
const options = {
  whiteList: {
    'a-image': ['class', 'src'],
    p: ['class'],
    br: []
  }
}

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
