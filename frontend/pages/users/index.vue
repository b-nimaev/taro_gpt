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
});
</script>
<template>
  <div class="page">
    <div class="container-fluid">
      <DashboardHeadingComponent title="Пользователи" />
      <div v-if="userStore.isFetchingUsers">
        <p>Загрузка пользователей</p>
      </div>
      <div v-else-if="userStore.isErrorFetchingUsers">
        <p>{{ userStore.errorFetchingUsers }}</p>
      </div>
      <div v-else>
        <p>
          <i>Пользователей найдено: {{ userStore.users.length }}</i>
        </p>
        <div v-if="userStore.users.length">
          <div class="user" v-for="(user, index) in userStore.users" :key="user._id">
            <div class="avatar">
              <NuxtImg :src="user.avatar" alt="" v-if="user.avatar" />
              <NuxtImg src="https://placehold.co/96x96" alt="" v-else />
            </div>
            <div class="userdata">
              <span class="user-fullname">{{
                user.firstName + " " + user.lastName
              }}</span>
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
</style>
