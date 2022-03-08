<template>
  <div class="conversation-list-container">
    <template v-if="activeStore.state.active.activeTab===TabProp.Conversation">
      <ConversationListItem
        v-for="item in store.state.conversation.conversationList"
        :key="item.conversation_id"
        :conversation="item"
      />
    </template>
    <template v-else-if="activeStore.state.active.activeTab===TabProp.Contacter">
      <ConatcterListItem
        v-for="item in informationStore.state.information.contacterList"
        :key="item.conversation_id||item.user_id"
        :conatcter="item"
      />
    </template>

  </div>
</template>
<script lang="ts" setup>
import { ConversationStateType } from '@/store/conversation'
import { useStore } from 'vuex'
import { ActiveStateProp, TabProp } from '@/store/active'

import ConversationListItem from './conversation-list-item.vue'
import { computed } from '@vue/reactivity'
import { InformationStateType } from '@/store/information'
import ConatcterListItem from '@/views/chat/conversation-list/conatcter-list-item.vue'
import { onMounted } from '@vue/runtime-core'

const store = useStore<{ conversation: ConversationStateType }>()
const activeStore = useStore<{ active: ActiveStateProp }>()
const informationStore = useStore<{ information: InformationStateType }>()

onMounted(() => {
  console.log(store.state.conversation.conversationList)
})

</script>
<style scoped>
.conversation-list-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  overflow-y: scroll;
}

.conversation-list-container::-webkit-scrollbar {
  width: 0;
  display: none;
}
</style>
