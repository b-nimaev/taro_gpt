<script lang="ts" setup>
import { useThemeStore } from "./stores/themeStore";
const themeStore = useThemeStore();
useHead({
  title: "TaroGPT",
});
// Реактивно отслеживаем изменения темы
watch(
  () => themeStore.theme,
  (newTheme) => {
    updateTheme();
  }
);
onMounted(() => {
  updateTheme();
});
function updateTheme() {
  const theme = themeStore.theme;
  const element = document.body;
  element.setAttribute("data-bs-theme", theme);
}
</script>
<template>
  <div>
    <div class="page-wrapper">
      <!-- <NuxtWelcome /> -->
      <div class="container-fluid">
        <navbarComponent />
      </div>
      <NuxtPage />
      <!-- <footer>
      <div class="container my-4">
        <h6>Цветовая схема</h6>
        <div class="btn-group" role="group" aria-label="Basic example">
          <button type="button" class="btn btn-light">День</button>
          <button type="button" class="btn btn-black">Ночь</button>
        </div>
      </div>
    </footer> -->
    </div>
    <div class="app-notify">
      <div class="app-notify-content success">
        <div class="heading">
          <h6>Успешно</h6>
        </div>
        <p>Lorem ipsum dolor sit amet consectetur</p>
      </div>
      <div class="app-notify-content error">
        <div class="heading">
          <h6>Не успешно</h6>
        </div>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius hic
          repellendus quae.
        </p>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
// @import '@/node_modules/bootstrap/scss/bootstrap';
@import url("https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;1,300&display=swap");
:root,
[data-bs-theme="light"],
[data-bs-theme="dark"] {
  --bs-body-font-size: 0.85rem;
}
[data-bs-theme="dark"] {
  /* Для темной темы */
  --scrollbar-track-color: #111;
  --scrollbar-thumb-color: #222;
  --scrollbar-thumb-hover-color: #333;
  /* Для темной темы */
  // --body-background-color: #0b0b0b;
  --bs-heading-color: #dee2e6;
  --bs-link-color-rgb: #dee2e6;
  --bs-link-hover-color-rgb: #dee2e6;
  --bs-body-bg-rgb: #dee2e6;
  --bs-body-color: #dee2e6;
  --bs-table-bg: transparent;
  --bs-body-font-size: 0.85rem !important;
  --notify-background-color: #111;

  --body-background-color: #4a3718;
  --page-wrapper-background-image: linear-gradient(45deg, #000000d1, #000000);
  --body-background-image: linear-gradient(90deg, #169089, #9e86de);
  --main-component-background-color: #69543242;

  --messages-background-image: linear-gradient(90deg, #2723141c, #1a1a1ac2);
  --messages-main-component-background-color: #111;
  --message-component-background-color: #1a1a1a;
  --modal-wrapper-background-color: #ffffffa3;

  --background-image: linear-gradient(269deg, #171f2085, #14141482);
  --component-background-image: linear-gradient(
    109deg,
    rgb(14 14 14),
    rgb(0 0 0 / 11%)
  );
  .table {
    --bs-table-bg: transparent;
  }
  a {
    color: #d1d1d1;
    transition: 400ms;
    &:hover {
      color: var(--bs-body-color);
    }
  }
  --bs-success-rgb: #0ffd8e;
}
[data-bs-theme="light"] {
  --bs-heading-color: #222;
  --bs-link-color-rgb: #333;
  --bs-link-hover-color-rgb: #111;
  // --body-background-color: #eee;
  --bs-body-bg-rgb: #dee2e6;
  --bs-body-color: #333;

  --body-background-color: #fafafa;
  --body-background-image: linear-gradient(90deg, #169089, #9e86de);
  --page-wrapper-background-image: linear-gradient(45deg, white, white);

  --main-component-background-color: #fdfdfd;

  --messages-background-image: linear-gradient(45deg, #e5edff, #e5e7ff);
  --messages-main-component-background-color: transparent;
  --message-component-background-color: #fff;
  --modal-wrapper-background-color: #ffffffa3;

  --notify-background-color: #e6e6e6;

  --background-image: linear-gradient(
    269deg,
    rgb(255 255 255),
    rgb(255 255 255)
  );
  --component-background-image: linear-gradient(
    109deg,
    rgb(247 247 247),
    rgb(245 245 245)
  );
  &:body {
    background-color: #e5e5e5;
  }
  .table {
    --bs-table-bg: transparent;
    padding: 1rem;
  }
}

.app-notify {
  padding: 1.5rem 1rem;
  .app-notify-content {
    background-color: var(--notify-background-color);
    padding: 1rem;
    width: fit-content;
    border-radius: 10px;
    margin-bottom: 1rem;
    max-width: 350px;
    &:last-child {
      margin-bottom: 0;
    }
    .heading {
      h6 {
        color: $success;
      }
    }
    p {
      margin: 0;
      font-size: 14px;
    }

    &.error {
      .heading {
        h6 {
          color: $danger;
        }
      }
    }
  }
}

.text-success {
  color: var(--bs-success-rgb) !important;
  opacity: 1;
}
.table {
  padding: 1rem;
}

/* Стилизация полосы прокрутки */
::-webkit-scrollbar {
  width: 10px; /* Ширина полосы прокрутки */
}

/* Полоса прокрутки */
::-webkit-scrollbar-track {
  background: var(--scrollbar-track-color); /* Цвет фона полосы прокрутки */
}

/* Дорожка, по которой перемещается ползунок */
::-webkit-scrollbar-thumb {
  background-color: var(--scrollbar-thumb-color); /* Цвет ползунка */
  border-radius: 5px; /* Скругление углов ползунка */
}

/* Ползунок при наведении на него курсора */
::-webkit-scrollbar-thumb:hover {
  background-color: var(
    --scrollbar-thumb-hover-color
  ); /* Цвет ползунка при наведении */
}

.page-wrapper {
  padding: 1.5rem 1rem;
  border-radius: 1rem;
  background-image: var(--page-wrapper-background-image);
}
body,
.page-wrapper {
  font-family: "Montserrat", sans-serif;
  min-height: calc(100vh - 2rem);
  // background-color: #101010;
  // background-color: var(--bs-body-bg);
}
.page {
  min-height: calc(100vh - 7.5rem);
}
body {
  padding: 1rem;
  // background-color: var(--body-background-color);
  background-image: var(--body-background-image);
  font-size: var(--bs-body-font-size) !important;
}
.btn.btn-success {
  color: #fff;
  &:active {
    color: #fff;
  }
}
.page-enter-active,
.page-leave-active {
  transition: all 0.4s;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
  filter: blur(1rem);
}
footer {
  padding: 15px 0;
  background-color: #f8f8f8;
  margin-top: 3rem;
}
@media screen and (max-width: 1400px) {
  html {
    font-size: 80%;
  }
}
@media screen and (max-width: 768px) {
  :root,
  [data-bs-theme="light"],
  :root,
  [data-bs-theme="dark"] {
    --bs-body-font-size: 1rem !important;
  }
  body {
    padding: 0;
  }
  .page-wrapper {
    border-radius: 0;
  }
}
</style>
