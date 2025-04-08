<script setup lang="ts">
import { defineProps } from 'vue'

const props = defineProps(['data'])

const headers = ['#', 'DOB', 'Gender', 'Language', 'City', 'Group Fields']
</script>

<template>
  <table class="min-w-full divide-y divide-gray-200 border border-gray-300">
    <thead class="bg-gray-100">
      <tr>
        <th
          v-for="header in headers"
          :key="header"
          class="px-4 py-2 text-left text-sm font-medium text-gray-700"
        >
          {{ header }}
        </th>
      </tr>
    </thead>
    <tbody class="divide-y divide-gray-200 bg-white">
      <tr v-if="props.data.length == 0">
        <span class="flex items-center justify-center"> No Records Found. </span>
      </tr>
      <tr v-else v-for="(item, index) in props.data" :key="index">
        <td class="px-4 py-2 text-sm text-gray-700">{{ index + 1 }}</td>
        <td class="px-4 py-2 text-sm text-gray-700">{{ item.dob || 'NA' }}</td>
        <td class="px-4 py-2 text-sm text-gray-700">{{ item.gender || 'NA' }}</td>
        <td class="px-4 py-2 text-sm text-gray-700">{{ item.language || 'NA' }}</td>
        <td class="px-4 py-2 text-sm text-gray-700">{{ item.city || 'NA' }}</td>
        <td class="px-4 py-2 text-sm text-gray-700">
          <div v-for="(group, gIndex) in item.groupFields" :key="gIndex">
            {{ gIndex + 1 }}. {{ group.name }}, {{ group.email }}, {{ group.mobile }}
          </div>
        </td>
      </tr>
    </tbody>
  </table>
</template>
