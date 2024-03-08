<template>
  <input
    class="form-check-input"
    type="checkbox"
    :checked="isChecked"
    @change="handleChange"
    style="cursor: pointer"
  />
</template>

<script setup lang="ts">
import { ref, defineProps } from "vue";
import { useBotStore } from "@/stores/botStore";

const props = defineProps({
  botId: String,
  checked: Boolean,
});

const store = useBotStore();
const isChecked = ref(props.checked);

function handleChange() {
  if (props.botId) {
    isChecked.value = !isChecked.value;
    store.toggleBotCheckStatus(props.botId, isChecked.value);
  }
}
</script>
