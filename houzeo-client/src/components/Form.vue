<script setup lang="ts">
import { ref, defineEmits, onMounted } from 'vue'
import { useCookies } from 'vue3-cookies'

const { cookies } = useCookies()
const emits = defineEmits(['data'])

// Form data
const formFields = ref({
  groupFields: [
    { name: '', email: '', mobile: '' },
    { name: '', email: '', mobile: '' },
  ],
  dob: '',
  gender: '',
  language: [] as string[],
  city: '',
})

// Error tracking
const formErrors = ref({
  groupFields: [
    { name: [] as string[], email: [] as string[], mobile: [] as string[] },
    { name: [] as string[], email: [] as string[], mobile: [] as string[] },
  ],
  dob: [] as string[],
  gender: [] as string[],
  language: [] as string[],
  city: [] as string[],
})

// Regex patterns
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const mobileRegex = /^\(\d{3}\) \d{3}-\d{4}$/

onMounted(async () => {
  await getSubmissions()
})

// Add new group
const addNewGroup = () => {
  formFields.value.groupFields.push({ name: '', email: '', mobile: '' })
  formErrors.value.groupFields.push({ name: [], email: [], mobile: [] })
}

// Remove group (min 2)
const removeGroup = (index: number) => {
  if (formFields.value.groupFields.length > 2) {
    formFields.value.groupFields.splice(index, 1)
    formErrors.value.groupFields.splice(index, 1)
  } else {
    alert('At least 2 groups are required.')
  }
}

// Validate all fields
const validateForm = (): boolean => {
  let isValid = true

  // Reset errors
  formErrors.value = {
    groupFields: formFields.value.groupFields.map(() => ({ name: [], email: [], mobile: [] })),
    dob: [],
    gender: [],
    language: [],
    city: [],
  }

  // Validate group fields
  formFields.value.groupFields.forEach((group, index) => {
    // Name validation
    if (!group.name.trim()) {
      formErrors.value.groupFields[index].name.push('Name is required')
      isValid = false
    }

    // Email validation
    if (!group.email) {
      formErrors.value.groupFields[index].email.push('Email is required')
      isValid = false
    } else if (!emailRegex.test(group.email)) {
      formErrors.value.groupFields[index].email.push('Invalid email format')
      isValid = false
    }
  })

  // Date of Birth validation
  if (!formFields.value.dob) {
    formErrors.value.dob.push('Date of Birth is required')
    isValid = false
  }

  // Gender validation
  if (!formFields.value.gender) {
    formErrors.value.gender.push('Gender is required')
    isValid = false
  }

  // Language validation
  if (formFields.value.language.length === 0) {
    formErrors.value.language.push('At least one language is required')
    isValid = false
  }

  // City validation
  if (!formFields.value.city) {
    formErrors.value.city.push('City is required')
    isValid = false
  }

  return isValid
}

// Submit form
const submitForm = async () => {
  if (!validateForm()) {
    alert('Please fix the errors before submitting.')
    return
  }

  try {
    const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/form/submit`, {
      method: 'POST',
      body: JSON.stringify(formFields.value),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${cookies.get('request_token')}`,
      },
    })

    const result = await response.json()

    if (response.ok) {
      await getSubmissions()
      alert('Form submitted successfully!')
      console.log(result)
    } else {
      alert('Submission failed.')
      console.error(result)
    }
  } catch (error) {
    console.error('Error submitting form:', error)
    alert('An error occurred.')
  }
}

// Fetch submissions
const getSubmissions = async () => {
  const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/form/submissions`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${cookies.get('request_token')}`,
    },
  })
  const result = await response.json()

  if (response.ok) {
    emits('data', result)
  }
}

// Mobile number formatting
const formatPhoneNumber = (value: string) => {
  const cleaned = value.replace(/\D/g, '')
  const match = cleaned.match(/^(\d{0,3})(\d{0,3})(\d{0,4})$/)

  if (match) {
    const [, area, prefix, line] = match
    let formatted = ''
    if (area) formatted = `(${area}`
    if (area?.length === 3) formatted += ') '
    if (prefix) formatted += prefix
    if (prefix?.length === 3) formatted += '-'
    if (line) formatted += line
    return formatted
  }
  return value
}

// Handle mobile input
const handleMobileInput = (index: number, value: string) => {
  const formatted = formatPhoneNumber(value)
  formFields.value.groupFields[index].mobile = formatted
}

// Live email validation
const handleEmailInput = (index: number, value: string) => {
  formFields.value.groupFields[index].email = value
  formErrors.value.groupFields[index].email = []

  if (!value) {
    formErrors.value.groupFields[index].email.push('Email is required')
  } else if (!emailRegex.test(value)) {
    formErrors.value.groupFields[index].email.push('Invalid email format')
  }
}
</script>

<template>
  <section class="h-[90vh] overflow-y-auto">
    <div @submit.prevent="submitForm">
      <div class="bg-amber-100 p-4 rounded-md">
        <div v-for="(group, index) in formFields.groupFields" :key="index" class="mb-4">
          <h5 class="font-bold mb-2">{{ '#' + (index + 1) }}</h5>
          <div class="flex flex-wrap gap-4 items-start">
            <div class="flex-1 min-w-[200px]">
              <label :for="`name-${index}`" class="block mb-2 text-sm font-medium text-gray-900">
                Name
              </label>
              <input
                :id="`name-${index}`"
                v-model="formFields.groupFields[index].name"
                type="text"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:border-blue-500 block w-full p-2.5"
                placeholder="John"
                @input="formErrors.groupFields[index].name = []"
              />
              <div
                v-if="formErrors.groupFields[index].name.length"
                class="text-red-500 text-xs mt-1"
              >
                {{ formErrors.groupFields[index].name[0] }}
              </div>
            </div>

            <div class="flex-1 min-w-[200px]">
              <label :for="`email-${index}`" class="block mb-2 text-sm font-medium text-gray-900">
                Email
              </label>
              <input
                :id="`email-${index}`"
                v-model="formFields.groupFields[index].email"
                type="email"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:border-blue-500 block w-full p-2.5"
                placeholder="example@mail.com"
                @input="handleEmailInput(index, $event.target.value)"
              />
              <div
                v-if="formErrors.groupFields[index].email.length"
                class="text-red-500 text-xs mt-1"
              >
                {{ formErrors.groupFields[index].email[0] }}
              </div>
            </div>

            <div class="flex-1 min-w-[200px]">
              <label :for="`mobile-${index}`" class="block mb-2 text-sm font-medium text-gray-900">
                Mobile
              </label>
              <input
                @change="validateForm"
                :id="`mobile-${index}`"
                :value="formFields.groupFields[index].mobile"
                type="text"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:border-blue-500 block w-full p-2.5"
                placeholder="(844) 448-0110"
                @input="handleMobileInput(index, $event.target.value)"
              />
            </div>

            <img
              v-if="formFields.groupFields.length > 2"
              @click="removeGroup(index)"
              src="@/assets/icons/delete.svg"
              class="cursor-pointer mt-7"
              alt="delete-icon"
            />
          </div>
        </div>

        <div class="flex justify-center">
          <button
            @click="addNewGroup"
            type="button"
            class="text-white bg-gradient-to-br from-green-400 to-blue-600 hover:bg-gradient-to-bl focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center cursor-pointer"
          >
            Add New Group
          </button>
        </div>
      </div>

      <!-- Non-group fields -->
      <div class="mt-4 space-y-4 p-4">
        <div>
          <label class="block mb-2 text-sm font-medium text-gray-900">Date of Birth</label>
          <input
            @change="validateForm"
            v-model="formFields.dob"
            type="date"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          />
          <div v-if="formErrors.dob.length" class="text-red-500 text-xs mt-1">
            {{ formErrors.dob[0] }}
          </div>
        </div>

        <div>
          <label class="block mb-2 text-sm font-medium text-gray-900">Gender</label>
          <div class="flex gap-4">
            <div class="flex items-center">
              <input
                @change="validateForm"
                type="radio"
                id="male"
                value="male"
                v-model="formFields.gender"
                class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
              />
              <label for="male" class="ms-2 text-sm font-medium text-gray-900">Male</label>
            </div>
            <div class="flex items-center">
              <input
                @change="validateForm"
                type="radio"
                id="female"
                value="female"
                v-model="formFields.gender"
                class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
              />
              <label for="female" class="ms-2 text-sm font-medium text-gray-900">Female</label>
            </div>
          </div>
          <div v-if="formErrors.gender.length" class="text-red-500 text-xs mt-1">
            {{ formErrors.gender[0] }}
          </div>
        </div>

        <div>
          <label class="block mb-2 text-sm font-medium text-gray-900">Language</label>
          <div class="flex gap-4">
            <div class="flex items-center">
              <input
                @change="validateForm"
                type="checkbox"
                id="angular"
                value="Angular"
                v-model="formFields.language"
                class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
              />
              <label for="angular" class="ms-2 text-sm font-medium text-gray-900">Angular</label>
            </div>
            <div class="flex items-center">
              <input
                @change="validateForm"
                type="checkbox"
                id="vuejs"
                value="Vuejs"
                v-model="formFields.language"
                class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
              />
              <label for="vuejs" class="ms-2 text-sm font-medium text-gray-900">Vue.js</label>
            </div>
            <div class="flex items-center">
              <input
                @change="validateForm"
                type="checkbox"
                id="reactjs"
                value="ReactJs"
                v-model="formFields.language"
                class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
              />
              <label for="reactjs" class="ms-2 text-sm font-medium text-gray-900">React.js</label>
            </div>
          </div>
          <div v-if="formErrors.language.length" class="text-red-500 text-xs mt-1">
            {{ formErrors.language[0] }}
          </div>
        </div>

        <div>
          <label class="block mb-2 text-sm font-medium text-gray-900">City</label>
          <select
            @change="validateForm"
            v-model="formFields.city"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          >
            <option value="" disabled>Select your city</option>
            <option value="Mumbai">Mumbai</option>
            <option value="Delhi">Delhi</option>
            <option value="Bangalore">Bangalore</option>
            <option value="Hyderabad">Hyderabad</option>
            <option value="Chennai">Chennai</option>
            <option value="Kolkata">Kolkata</option>
            <option value="Pune">Pune</option>
            <option value="Jaipur">Jaipur</option>
            <option value="Ahmedabad">Ahmedabad</option>
            <option value="Surat">Surat</option>
          </select>
          <div v-if="formErrors.city.length" class="text-red-500 text-xs mt-1">
            {{ formErrors.city[0] }}
          </div>
        </div>
      </div>

      <div class="flex justify-center mt-4 p-4">
        <button
          @click="submitForm"
          class="text-white bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-pink-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
        >
          Submit Data
        </button>
      </div>
    </div>
  </section>
</template>
