<script lang="ts" setup>
import { useSentencesStore } from "@/stores/sentences";
import { useBotStore } from "@/stores/botStore";
const botStore = useBotStore();

const sentencesStore = useSentencesStore();
const selectedLanguage = sentencesStore.addSentencesLanguage;
const options: any = ref([
  { text: "Русский", value: "ru" },
  { text: "Бурятский", value: "bur" },
  { text: "Английский", value: "en" },
]);
const selectedBot = ref('');
onMounted(() => {
  botStore.fetchBotlist();
});
</script>
<template>
  <div>
    <article class="form-for-add-sentence">
      <form @submit.prevent="">
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
            <select id="select-bot" class="form-select" v-model="selectedBot">
              <option disabled value="">Выберите бота</option>
              <option v-for="bot in botStore.botList" :key="bot._id" :value="bot._id">
                {{ bot.name }}
              </option>
            </select>
          </div>
          <div class="for-translate">
            <label for="sentence" class="form-label">Предложение</label>
            <textarea
              id="sentence"
              class="form-control"
              placeholder="Предложение для перевода"
              v-model="sentencesStore.addSentences"
            >
            </textarea>
            <input type="submit" class="mt-3 btn btn-primary" />
            <div class="my-2" v-if="sentencesStore.isErrorAddSentence">
              <p class="text-muted">{{ sentencesStore.errorAddSentence }}</p>
            </div>
          </div>
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
  background-image: linear-gradient(109deg, rgb(14 14 14), rgb(0 0 0 / 11%));
  .custom-form-row {
    display: flex;
    #sentence {
      margin-right: 1rem;
    }
  }
}
</style>
