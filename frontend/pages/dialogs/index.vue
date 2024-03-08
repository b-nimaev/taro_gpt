<template>
  <div>
    <div class="container-fluid">
      <DashboardHeadingComponent title="Список диалогов" />

      <sentences-content-component />
    </div>
  </div>
</template>
<script setup lang="ts">
useSeoMeta({
  title: 'Диалоги'
})
definePageMeta({
  middleware: ["authed"],
});

</script>
<style lang="scss" scoped>
main {
  width: 100%;
  padding: 1rem;
  border-radius: 3px;
  margin-top: 0.5rem;
}

.form-filter {
  display: flex;
  justify-content: space-between;
}

.calendar {
  user-select: none;
  width: 180px;
  text-align: center;
}

.dateFillTo {
}
</style>
