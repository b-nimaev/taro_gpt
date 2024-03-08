<script lang="ts" setup>
import { useBotStore } from '@/stores/botStore';
const botStore = useBotStore();
</script>
<template>
  <div>
    <article class="form-for-add-sentence">
      <form @submit.prevent="botStore.createBot()">
        <h6>Создать бота</h6>
        <div class="mb-2">
          <label for="bot-name" class="form-label">Название бота</label>
          <input type="text" v-model="botStore.botName" name="bot-name" id="bot-name" class="form-control" placeholder="Введите название бота">
        </div>
        <label for="description" class="form-label">Описание бота</label>
        <div class="for-translate">
          <textarea
            id="description"
            class="form-control"
            placeholder="Описание бота"
            v-model="botStore.botDescription"
          >
          </textarea>
          <input type="submit" class="mt-3 btn btn-primary" value="Создать" />
          <!-- <div class="my-2" v-if="sentencesStore.isErrorAddSentence">
            <p class="text-muted">{{ sentencesStore.errorAddSentence }}</p>
          </div> -->
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
</style>
