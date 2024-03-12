<script lang="ts" setup>
const userId = ref(useRoute().params.id);
import { useUserStore } from "@/stores/userStore";
const userStore = useUserStore();
onBeforeMount(() => {
  userStore.fetchRecipient(<string>userId.value);
});
</script>

<template>
  <div>
    <div class="container-fluid">
      <h5>Менеджер</h5>
    </div>
    <main>
      <section class="heading">
        <div class="container-fluid">
          <div>
            <div v-if="userStore.isFetchingRecipient">
              <p>Получение пользователя</p>
            </div>
            <div v-else-if="userStore.isErrorFetchingRecipient">
              <p>{{ userStore.errorFetchingRecipient }}</p>
            </div>
            <div v-else>
              <div class="recipient-data" v-if="userStore.recipient">
                <p v-if="userStore.recipient.firstName">
                  Имя: <span>{{ userStore.recipient.firstName }}</span>
                  <span v-if="userStore.recipient.lastName">{{
                    userStore.recipient.lastName
                  }}</span>
                </p>
                <p v-if="userStore.recipient.username">
                  {{ userStore.recipient.username }}
                </p>
                <p>
                  ID:
                  <span v-if="userStore.recipient.telegramChatId">{{
                    userStore.recipient.telegramChatId
                  }}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section class="messages" v-if="userStore.recipient.messages.length">
        <div class="container-fluid">
          <h5>Сообщения</h5>
          <div class="messages-wrapper">
            <div
              class="message"
              v-for="message in userStore.recipient.messages"
              :key="message._id"
              :class="message.role === 'user' ? 'user' : 'assistant'"
            >
              <h6 class="message-role">
                {{ message.role === "user" ? "Пользователь" : "Бот" }}
              </h6>
              <div class="message-inner">
                <p>{{ message.content }}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<style lang="scss" scoped>
.recipient-data {
  p {
    margin-bottom: 0;
  }
}
section {
  margin-bottom: 1.5rem;
}

$border-radius: 8px;

.messages-wrapper {
  padding: 1rem;
  border-radius: $border-radius;
  background-color: #000;
  max-height: 550px;
  overflow: auto;
  max-width: 700px;
  .message {
    &.assistant {
      margin-left: auto;
      .message-role {
        font-size: 0.7rem;
        width: fit-content;
        display: block;
        margin-left: auto;
      }
    }
    &.user {
      margin-right: auto;
      .message-role {
        font-size: 0.7rem;
        width: fit-content;
        display: block;
        // margin-right: auto;
      }
    }

    max-width: 80%;
    margin-bottom: 1rem;
    width: fit-content;

    .message-inner {
      background-color: #111;
      padding: 1rem;
      border-radius: $border-radius;
    }
    p {
      margin-bottom: 0;
    }
    &:last-child {
      margin-bottom: 0;
      p {
        margin: 0;
      }
    }
  }
}
</style>
