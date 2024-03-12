<script lang="ts" setup>
import { useUserStore } from "@/stores/userStore";
const userStore = useUserStore();
useSeoMeta({
  title: "Пользователи",
});
definePageMeta({
  middleware: ["authed"],
});
onBeforeMount(() => {
  userStore.fetchUsers();
  userStore.fetchRecipients();
});
</script>
<template>
  <div class="page">
    <div class="container-fluid">
      <!-- <DashboardHeadingComponent title="Пользователи" /> -->
      <div class="fetchUsers">
        <div v-if="userStore.isFetchingUsers">
          <p>Загрузка пользователей</p>
        </div>
        <div v-else-if="userStore.isErrorFetchingUsers">
          <p>{{ userStore.errorFetchingUsers }}</p>
        </div>
        <div v-else>
          <div class="mb-3"><h5>Администраторы</h5></div>
          <div v-if="userStore.users.length">
            <div
              class="user"
              v-for="(user, index) in userStore.users"
              :key="user._id"
            >
              <div class="avatar">
                <NuxtImg :src="user.avatar" alt="" v-if="user.avatar" />
                <NuxtImg src="https://placehold.co/96x96" alt="" v-else />
              </div>
              <div class="userdata">
                <span class="user-fullname">{{
                  user.firstName ? user.firstName : user.username
                }}</span>
                <span v-if="user.role === 'user'" class="user-role"
                  >Роль: Пользователь</span
                >
                <span v-else-if="user.role === 'creator'" class="user-role"
                  >Роль: Главный</span
                >
                <span v-else-if="user.role === 'admin'" class="user-role"
                  >Роль: Администратор</span
                >
                <span v-else-if="user.role === 'manager'" class="user-role"
                  >Роль: Менеджер</span
                >
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="fetchRecipients mt-5">
        <div v-if="userStore.isFetchingRecipients">
          <p>Загрузка клиентов</p>
        </div>
        <div v-else-if="userStore.isErrorFetchingRecipients">
          <p>{{ userStore.errorFetchingRecipients }}</p>
        </div>
        <div v-else>
          <div class="mb-3"><h5>Клиенты</h5></div>
          <div v-if="userStore.recipients.length">
            <div
              class="user"
              v-for="(user, index) in userStore.recipients"
              :key="user._id"
            >
              <div class="avatar">
                <NuxtImg src="https://placehold.co/96x96" alt="" />
              </div>
              <NuxtLink :to="'/recipients/' + user._id">
                <div class="userdata">
                  <span class="firstname" v-if="user.firstName">{{ user.firstName }} <br></span>
                  <span class="lastname" v-if="user.lastName">{{ user.lastName }} <br></span>
                  <span class="user-id" v-if="user.telegramChatId">id: {{ user.telegramChatId }} <br></span>
                  <span class="phone" v-if="user.phoneNumber">телефон: {{ user.phoneNumber }}</span>
                  <span class="messages" v-if="user.messages">сообщений: {{ user.messages.length }}</span>
                </div>
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.user {
  margin-bottom: 1rem;
  display: flex;
  &:last-child {
    margin-bottom: 0;
  }
}
.avatar {
  width: 96px;
  height: 96px;
  border-radius: 8px;
  overflow: hidden;
  margin: auto 1rem auto 0;
  img {
    width: 100%;
    height: 100%;
  }
}

.user-fullname {
  font-size: 16px;
}
.custom-row {
  display: flex;
  justify-content: space-between;

  h5,
  button {
    margin: auto 0;
  }
}
.userdata {
  span {
    &.user-role {
      display: block;
      font-size: 12px;
    }
  }
}
</style>
