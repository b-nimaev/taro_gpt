<template>
  <div>
    <div class="container-fluid">
      <DashboardHeadingComponent title="Боты" />
      <div class="row">
        <div class="col-lg-3">
          <bots-create-component></bots-create-component>
        </div>
        <div class="col-lg-9">
          <div v-if="botStore.isLoading">
            <p>Загрузка...</p>
          </div>
          <div v-else-if="botStore.isError">
            <p>{{ botStore.error }}</p>
          </div>
          <div v-else>
            <table class="table">
              <thead>
                <tr>
                  <th scope="col" style="width: 25px"><input type="checkbox" class="form-check-input"></th>
                  <th scope="col" style="width: 25px">#</th>
                  <th scope="col">Название</th>
                  <th scope="col">Описание</th>
                  <th scope="col">Количество диалогов</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(element, index) in botStore.botList" :key="element._id">
                  <th><bots-checkbox-component :bot-id="element._id" :checked="element.checkStatus"></bots-checkbox-component></th>
                  <th scope="row">{{ index + 1 }}</th>
                  <td>{{ element.name }}</td>
                  <td>{{ element.description }}</td>
                  <td>{{ element.dialogs.length }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useBotStore } from "@/stores/botStore";
const botStore = useBotStore();
onMounted(() => {
  botStore.fetchBotlist()
});
useSeoMeta({
  title: "Боты",
});
definePageMeta({
  middleware: ["authed"],
});
</script>
