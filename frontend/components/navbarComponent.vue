<template>
  <nav>
    <NuxtLink to="/"><h4>Dating project</h4></NuxtLink>
    <div class="menu-wrapper">
      <div class="menu-content" :class="{ active: isExspand }">
        <div class="menu-content-mobile-heading">
          <h4>Dating project</h4>
          <button class="btn btn-primary close-button" @click="inactiveExspand()">Закрыть</button>
        </div>
        <div class="theme-switcher">
          <button
            class="btn btn-sm"
            :class="{ active: themeStore.isLightTheme }"
            @click="setTheme('light')"
          >
            <i class="bi bi-sun"></i>
          </button>
          <button
            class="btn btn-sm"
            :class="{ active: !themeStore.isLightTheme }"
            @click="setTheme('dark')"
          >
            <i class="bi bi-moon"></i>
          </button>
        </div>
        <ul class="menu">
          <li>
            <NuxtLink @click="inactiveExspand()" to="/">Главная</NuxtLink>
          </li>
          <li v-if="role === 'creator' || roleLogin === 'creator'">
            <NuxtLink @click="inactiveExspand()" to="/users">Пользователи</NuxtLink>
          </li>
          <li>
            <NuxtLink @click="inactiveExspand()" to="/sentences">Обучение бота</NuxtLink>
          </li>
          <li>
            <NuxtLink @click="inactiveExspand()" to="/bots">Боты</NuxtLink>
          </li>
          <!-- <li>
        <NuxtLink to="/dialogs">Диалоги</NuxtLink>
      </li> -->
        </ul>
        <div class="userdata" v-if="userAuthStore.authenticated">
          <div v-if="user.isLoading">
            <p>Загрузка</p>
          </div>
          <div v-else-if="user.firstName">
            <NuxtLink @click="inactiveExspand()" class="to-dashboard" to="/dashboard">
              <h6>{{ user.firstName }}</h6>
            </NuxtLink>
          </div>
          <div v-else-if="user.username">
            <NuxtLink @click="inactiveExspand()" class="to-dashboard" to="/dashboard">
              <h6>{{ user.username }}</h6>
            </NuxtLink>
          </div>
        </div>
        <div v-else class="my-auto auth">
          <p class="mb-0">
            <NuxtLink @click="inactiveExspand()" to="/auth">Вход</NuxtLink>
          </p>
        </div>
      </div>
      <div class="menu-toggler">
        <button class="btn btn-primary" @click="activeExspand">Меню</button>
      </div>
    </div>
  </nav>
</template>

<script lang="ts" setup>
import { useUserStore } from "@/stores/userStore";
import { useThemeStore } from "@/stores/themeStore"; // Импортируем наше новое хранилище
import { useAuthStore } from "@/stores/auth/login"; // Импортируем наше новое хранилище
const isExspand = ref(false);
const userStore = useUserStore();
const userAuthStore = useAuthStore();
const role = useCookie("role").value
let roleLogin = ref("")
const { authenticateUser } = useAuthStore(); // use authenticateUser action from  auth store
const themeStore = useThemeStore(); // Используем хранилище темы
const token = ref(useCookie("token").value);
async function activeExspand () {
  return isExspand.value = true
}
async function inactiveExspand () {
  return isExspand.value = false
}
onMounted(() => {
  userStore.fetchUser();
});

const user = computed(() => userStore.user); // Реактивное свойство для доступа к пользователю

// Функция для смены темы через хранилище
const setTheme = (theme: string) => {
  themeStore.setTheme(theme);
};
</script>

<style lang="scss" scoped>
.menu-wrapper {
  display: flex;
  margin: auto 0 auto auto;
  position: relative;
}
.menu-content {
  position: fixed;
  display: flex;
  margin: auto 0 auto auto;
  position: relative;
  .close-button {
    margin: auto 0 1rem auto;
    display: none;
  }
}
.menu-content-mobile-heading {
  display: none;
}
.menu-toggler {
  display: none;
}
@media screen and (max-width: 768px) {
  .menu-toggler {
    display: block;
  }
  .menu-wrapper {
    position: inherit;
    overflow: auto;
  }
  .menu-content-mobile-heading {
    display: flex;
    margin-bottom: 1rem;
    h4,
    .close-button {
      margin: auto 0;
    }

    .close-button {
      margin: auto 0 auto auto;
    }
  }
  .menu-content {
    position: absolute;
    background-color: var(--menu-content-background-color);
    padding: 1rem;
    font-size: 1.5rem;
    top: 0;
    left: -100%;
    flex-direction: column;
    width: 100%;
    min-height: 100vh;
    z-index: 1;
    &.active {
      left: 0;
    }
    .close-button {
      display: inline-block;
    }
    .theme-switcher {
      margin: 0 0 0 auto;
    }
    // background-color: #ccc;
    .menu {
      flex-direction: column;
      margin: 2rem 0 !important
    }
  }

  .userdata {
    margin: 1rem !important;
    h6 {
      font-size: 1.5rem;
    }
  }
}
.auth {
  margin-left: 1rem;
}
.theme-switcher {
  margin: auto 0 auto auto;
  background-color: var(--notify-background-color);
  display: flex;
  border-radius: 1rem;
  transition: 400ms;
}
.btn-sm {
  border-radius: 1rem;
  font-size: 12px;
  padding: 2px 5px;
  display: block;
  margin: auto 0;
  border: 0;
  transition: 400ms;
  &.active {
    background-color: var(--bs-body-color);
    color: var(--body-background-color);
  }
}
nav {
  display: flex;
  margin-bottom: 1rem;
  ul {
    margin: auto 0 auto 1rem;
    padding: 0;
    list-style-type: none;
    li {
      a {
        text-decoration: none;
      }
    }
  }
}

.userdata {
  margin: auto 15px;
  h6 {
    margin: 0;
  }
}

.menu {
  display: flex;
  li {
    margin: 0 0.5rem;
  }
}

.to-dashboard {
  text-decoration: none;
}
</style>
