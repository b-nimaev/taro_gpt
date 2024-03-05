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
                {{ botStore.botList }}
            </div>
        </div>        
      </div>
    </div>
  </div>
</template>

<script setup>
import { useBotStore } from '@/stores/botStore';
const botStore = useBotStore();

useSeoMeta({
  title: 'Боты'
})
definePageMeta({
  middleware: ["authed"],
});
</script>
