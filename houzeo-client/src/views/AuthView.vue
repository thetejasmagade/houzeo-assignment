<script setup lang="ts">
import router from '@/router'
import { ref } from 'vue'
import { useCookies } from 'vue3-cookies'

const { cookies } = useCookies()

const formData = ref({
  username: '',
  password: '',
})

const checkAuth = async ($event: Event) => {
  $event.preventDefault()

  if (formData.value.username === '' || formData.value.password === '') {
    alert('Please fill all the fields')
    return
  }

  const res: Response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/form/auth`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData.value),
  })

  const data = await res.json()

  if (res.ok) {
    cookies.set('request_token', data.token)
    alert('Logged in successfully')
    router.push('/')
  } else {
    alert(data.message)
  }
}
</script>

<template>
  <main
    class="bg-gradient-to-r from-gray-500 via-slate-500 to-black-500 flex items-center justify-center h-full"
  >
    <div class="bg-white rounded-2xl shadow-xl p-10 w-full max-w-md">
      <h2 class="text-3xl font-bold text-center text-gray-800 mb-6">Welcome Back 👋</h2>
      <form>
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-semibold mb-2" for="username"
            >Username</label
          >
          <input
            v-model="formData.username"
            id="username"
            type="text"
            placeholder="Enter your username"
            class="w-full px-4 py-3 rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>

        <div class="mb-6">
          <label class="block text-gray-700 text-sm font-semibold mb-2" for="password"
            >Password</label
          >
          <input
            v-model="formData.password"
            id="password"
            type="password"
            placeholder="Enter your password"
            class="w-full px-4 py-3 rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>

        <button
          @click="checkAuth"
          type="submit"
          class="w-full bg-indigo-600 text-white font-semibold py-3 rounded-lg hover:bg-indigo-700 transition duration-300 cursor-pointer"
        >
          Sign In
        </button>
      </form>
    </div>
  </main>
</template>
