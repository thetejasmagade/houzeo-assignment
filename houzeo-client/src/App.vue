<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import router from '@/router'
import { useCookies } from 'vue3-cookies'

const { cookies } = useCookies()

const logout = () => {
  cookies.remove('request_token')
  router.push('/auth')
}
</script>

<template>
  <header class="h-[8vh] bg-gray-200 p-2 flex items-center justify-between sticky top-0">
    <h2 class="text-2xl font-semibold">💥 Houzeo Assignment</h2>
    <div>
      <nav class="flex items-center justify-between gap-4">
        <RouterLink v-if="!cookies.get('request_token')" to="/">Home</RouterLink>
        <div v-else @click="logout" class="cursor-pointer">Logout</div>
      </nav>
    </div>
  </header>

  <div class="h-[92vh] overflow-y-auto">
    <RouterView />
  </div>
</template>

<style scoped></style>
