<script lang="ts" setup>
import { useSentencesStore } from "@/stores/sentences";
import { useBotStore } from "@/stores/botStore";
import { useAcceptedSentencesStore } from "@/stores/acceptedSentences";

const botStore = useBotStore();
const sentencesStore = useSentencesStore();
const acceptedSentencesStore = useAcceptedSentencesStore();

async function updateCurrentPage(page: number) {
  acceptedSentencesStore.currentPage = page;
  // Здесь вызовите метод для получения данных новой страницы
}
const activeCheckboxes = computed(() => {
  if (botStore.fetchDialogsResult) {
    if (botStore.fetchDialogsResult.dialogs) {
      return botStore.fetchDialogsResult.dialogs.filter(dialog => dialog.checkedStatus);
    } 
  }
});
</script>
<template>
  <div>
    <div class="row">
      <div class="col-lg-3">
        <sentences-sidebar-component></sentences-sidebar-component>
      </div>
      <div class="col-lg-9">
        <main>
          <section id="pending-dialogs">
            <div class="custom-row">
              <h5>Диалоги</h5>
              <button
                class="btn btn-dark btn-sm"
                @click="botStore.toggleModal()"
              >
                Новый диалог
              </button>
            </div>

            <p v-if="botStore.isLoadingFetchBotDialogs">Загрузка</p>
            <div v-else-if="botStore.isErrorSelectedDialogLoading">
              {{ botStore.errorSelectedDialogLoading?.message }}
            </div>
            <div v-else-if="botStore.fetchDialogsResult">
              <p>
                <!-- {{ botStore.fetchDialogsResult.message }}
                {{ botStore.fetchDialogsResult.dialogs.length }} -->
              </p>
              <div v-if="botStore.selectedBot">
                <table class="table table-borderless">
                  <thead>
                    <tr>
                      <th scope="col" style="width: 25px">
                        <input type="checkbox" class="form-check-input">
                      </th>
                      <th scope="col" style="width: 25px">#</th>
                      <th scope="col">Название диалога</th>
                      <th scope="col">Сообщений</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="(element, index) in botStore.fetchDialogsResult
                        .dialogs"
                      :key="element._id"
                    >
                      <th><sentences-sentence-checkbox :sentence-id="element._id" :checked="element.checkedStatus"></sentences-sentence-checkbox></th>
                      <th scope="row">{{ index + 1 }}</th>
                      <td><NuxtLink :to="'/dialogs/' + element._id">{{ element.name }}</NuxtLink></td>
                      <td>{{ element.messages.length }}</td>
                    </tr>
                  </tbody>
                </table>
                <button class="btn btn-danger" :disabled="!activeCheckboxes?.length">Удалить</button>
              </div>
              <div v-else>
                <h4>Выберите бота</h4>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
    <div
      class="modal-wrapper"
      id="create-dialog"
      v-if="botStore.createDialogModal"
    >
      <div class="modal-content">
        <div class="custom-row">
          <h5>Создание диалога</h5>
          <button class="btn btn-dark btn-sm" @click="botStore.closeModal()">
            Закрыть
          </button>
        </div>
        <form @submit.prevent="botStore.createDialog()">
          <div class="mb-2">
            <label for="selectedbot" class="form-label">Укажите бота</label>
            <select
              id="select-bot"
              class="form-select"
              v-model="botStore.selectedBot"
            >
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
            <label for="new-dialog-name" class="form-label"
              >Название дилога</label
            >
            <input
              type="text"
              id="new-dialog-name"
              class="form-control"
              style="min-width: 400px"
              v-model="botStore.createDialogName"
            />
          </div>
          <input type="submit" class="btn btn-primary" value="Создать" />
          <div v-if="botStore.isErrorCreateDialog">
            <p>
              {{
                botStore.errorCreateDialog !== null
                  ? botStore.errorCreateDialog.message
                  : "Ошибка"
              }}
            </p>
          </div>
          <div class="my-2" v-else>
            <p class="text-success">
              {{ botStore.createDialogResult?.message }}
            </p>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.modal-wrapper {
  position: fixed;
  height: 100vh;
  width: 100vw;
  top: 0;
  left: 0;
  display: flex;
  background: var(--modal-wrapper-background-color);
  .modal-content {
    margin: auto;
    width: fit-content;
    min-height: 400px;
  }
}
[data-bs-theme="dark"] {
  .table-responsive {
    background-color: #0e0f0f;
    border-radius: 1rem;
    font-size: 14px;
    p {
      font-size: 14px;
    }
  }
}
main {
  padding: 1rem;
  // background-color: var(--main-component-background-color);
  border-radius: 10px;
  section {
    margin-bottom: 1.5rem;
    &:last-child {
      margin-bottom: 0;
    }
  }
}
.custom-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
  h5,
  button {
    margin: auto 0;
  }
}
.form-for-add-sentence {
  padding: 30px;
  width: 450px;
  border-radius: 5px;
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
.createdAt {
  span {
    font-size: 10px;
    text-align: center;
  }
}

.sentenceText {
  width: 400px;
}

td {
  p {
    margin: 0;
  }
}
</style>
