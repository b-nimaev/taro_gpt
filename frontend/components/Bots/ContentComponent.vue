<script lang="ts" setup>
import { useBotStore } from "@/stores/botStore";

const botStore = useBotStore();
const activeCheckboxes = computed(() => {
  if (botStore.fetchDialogsResult) {
    if (botStore.fetchDialogsResult.dialogs) {
      return botStore.fetchDialogsResult.dialogs.filter(
        (dialog) => dialog.checkedStatus
      );
    }
  }
});
onMounted(() => {
  // botStore.fetchBotlist()
});
</script>
<template>
  <div>
    <main>
      <section id="pending-dialogs">
        <div class="custom-row">
          <h5>Пользователи</h5>
          <button class="btn btn-dark btn-sm" @click="botStore.toggleModal()">
            + Добавить пользователя
          </button>
        </div>

        <p v-if="botStore.isLoadingFetchDialogMessages">Загрузка</p>
        <div v-else-if="botStore.isErrorSelectedDialogLoading">
          {{ botStore.errorSelectedDialogLoading?.message }}
        </div>
        <div v-else-if="botStore.fetchMessagesResult">
          {{ botStore.fetchMessagesResult.message }}
          <div v-if="botStore.fetchMessagesResult.dialog">
            <div
              class="messages"
              v-if="botStore.fetchMessagesResult.dialog.messages.length"
            >
              <div
                class="message"
                :class="message.role === 'user' ? 'user' : 'assistant'"
                v-for="message in botStore.fetchMessagesResult.dialog.messages"
                :key="message._id"
              >
                <div class="sender-role">
                  <div v-if="message.role === 'user'">
                    <span>Пользователь</span>
                  </div>
                  <div v-else>
                    <span>Бот</span>
                  </div>
                </div>
                <div class="message-content">
                  <p>{{ message.content }}</p>
                </div>
              </div>
            </div>
            <div v-else>
              <p>Сообщений не найдено</p>
            </div>
          </div>
          <div v-else>
            <p>Пользователей не найдено!</p>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<style lang="scss" scoped>
.messages {
  min-height: 400px;
  max-height: 600px;
  overflow-y: auto;
  padding: 1rem;
  background-image: var(--messages-background-image);
  border-radius: 8px;
}
.sender-role {
  span {
    font-size: 13px;
    margin-bottom: 0.5rem;
  }
}
.message-content {
  p {
    font-size: 14px;
    margin-bottom: 0;
  }
}
.message {
  padding: 0.5rem 1rem;
  background-color: var(--message-component-background-color);
  width: fit-content;
  max-width: 80%;
  border-radius: 10px;
  margin-bottom: 1rem;
  &:last-child {
    margin-bottom: 0;
  }
  &.user {
    margin-left: auto;
  }
}
.modal-wrapper {
  position: fixed;
  height: 100vh;
  width: 100vw;
  top: 0;
  left: 0;
  display: flex;
  background: #000000c2;
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
  background-color: var(--message-main-component-background-color);
  border-radius: 1rem;
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
