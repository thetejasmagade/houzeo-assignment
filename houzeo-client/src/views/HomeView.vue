<script setup lang="ts">
import { ref } from 'vue'
import Form from '@/components/Form.vue'
import Table from '@/components/Table.vue'

const data = ref<{ submissions: object } | null>(null)
</script>
<template>
  <main class="flex items-center justify-between w-full">
    <div class="h-[92vh] w-1/2 px-4 py-2">
      <Form @data="(val) => (data = val)" />
    </div>
    <div class="h-[92vh] w-1/2 px-4 py-2 bg-amber-50">
      <Table :data="data?.submissions" />
    </div>
  </main>
</template>
