<script lang="ts" setup>
import { useSentencesStore } from "@/stores/sentences";
import { useBotStore } from "@/stores/botStore";
import { ref, onMounted, watch } from "vue";

const botStore = useBotStore();
const sentencesStore = useSentencesStore();
const selectedDialog = ref("");

onMounted(() => {
  botStore.fetchBotlist();
});

watch(() => botStore.selectedBot, (newVal, oldVal) => {
  if (newVal) {
    console.log(newVal); // Новое значение selectedBot
    botStore.fetchDialogs(newVal);
  }
}, { immediate: true }); // immediate: true гарантирует, что наблюдатель выполнит функцию обратного вызова сразу после инициализации
</script>

<template>
  <div>
    <article class="form-for-add-sentence">
      <form @submit.prevent="botStore.appendDialog(selectedDialog)">
        <h6>Обучение бота</h6>
        <div v-if="botStore.isLoadingFetchBotlist">
          <p>Загрузка ...</p>
        </div>
        <div v-else-if="botStore.isErrorBotlistLoading">
          <p>{{ botStore.errorBotlistLoading }}</p>
        </div>
        <div v-else>
          <div class="mb-2">
            <label for="select-bot" class="form-label">Бот</label>
            <select id="select-bot" class="form-select" v-model="botStore.selectedBot">
              <option disabled value="">Выберите бота</option>
              <option
                v-for="bot in botStore.botList"
                :key="bot._id"
                :value="bot._id"
              >
                {{ bot.name }}
              </option>
            </select>
          </div>

          <div class="mb-2">
            <label for="select-dialog" class="form-label">Диалог</label>
            <select
              id="select-dialog"
              class="form-select"
              v-model="selectedDialog"
              :disabled="!botStore.selectedBot"
            >
              <option disabled value="">Выберите диалог</option>
              <option
                v-for="dialog in botStore.fetchDialogsResult.dialogs"
                :key="dialog._id"
                :value="dialog._id"
              >
                {{ dialog.name }}
              </option>
            </select>
          </div>

          <div class="userMessage">
            <label for="user-message" class="form-label"
              >Сообщение пользователя</label
            >
            <textarea
              id="user-message"
              class="form-control"
              :disabled="!selectedDialog"
              placeholder="Сообщение пользователя"
              v-model="botStore.userMessage"
            >
            </textarea>
          </div>

          <div class="assistantMessage">
            <label for="assistant-message" class="form-label"
              >Сообщение бота</label
            >
            <textarea
              id="assistant-message"
              class="form-control"
              :disabled="!botStore.userMessage"
              placeholder="Сообщение бота"
              v-model="botStore.assistantMessage"
            >
            </textarea>
          </div>

          <input type="submit" class="mt-3 btn btn-primary" />
        </div>
      </form>
    </article>
  </div>
</template>

<style lang="scss" scoped>
.form-for-add-sentence {
  padding: 1.5rem;
  width: 100%;
  border-radius: 1rem;
  margin: 1rem 0;
  color: #2c2c2c;
  background-image: var(--component-background-image);
  .custom-form-row {
    display: flex;
    #sentence {
      margin-right: 1rem;
    }
  }
}
.userMessage {
  margin-bottom: 0.5rem;
  margin-top: 0.5rem;
}
.assistantMessage {
  margin-bottom: 0.5rem;
}
</style>
