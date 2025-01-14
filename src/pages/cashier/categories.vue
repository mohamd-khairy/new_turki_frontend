<template>
  <CashierLayout>
    <!-- Search Card -->
    <VCard class="mb-5 pa-5">
      <VRow justify="space-between">
        <VCol cols="12">
          <VTextField
            v-model="searchQuery"
            label="بحث"
            class="search-wrap"
            prepend-inner-icon="iconamoon:search-thin"
          />
        </VCol>
      </VRow>
    </VCard>

    <!-- Categories Card -->
    <VCard class="pa-5">
      <div
        v-if="isLoading"
        class="h-full d-flex align-center justify-center"
      >
        <AppLoading />
      </div>
      <VRow
        v-else
        justify="flex-start"
      >
        <VCol
          v-for="category in categories"
          :key="category.id"
          cols="4"
          lg="3"
          md="3"
          sm="6"
        >
          <RouterLink
            :to="`/cashier/subcategories/${category.id}`"
            class="item"
          >
            <img
              :src="category.image_url"
              :alt="category.type_ar"
              :placeholder="placeholderImage"
              @error="handleImageError"
            >
            <p>{{ category.type_ar }}</p>
          </RouterLink>
        </VCol>
      </VRow>
    </VCard>
  </CashierLayout>
</template>

<script setup>
import AppLoading from '@/@core/components/AppLoading.vue'
import { useCashierStore } from '@/store/Cashier'
import { onMounted, ref, watch } from 'vue'
import CashierLayout from './cashierLayout.vue'

// Create reactive reference for search query and categories
const searchQuery = ref('')


const categories = ref([])

// Placeholder image URL for fallback
const placeholderImage = 'https://via.placeholder.com/350x150'

// Access cashier store
const cashierStore = useCashierStore()
const isLoading = ref(false)



const getItems = async () => {
  let payload = {
    search: searchQuery.value,
  }
  try {
    isLoading.value = true
    categories.value = await cashierStore.getAllCategories(payload)
  } catch (error) {
    console.error('Failed to load categories:', error)
  } finally {
    isLoading.value = false
  }
}

onMounted(async () => await getItems())



// Handle image loading failure
const handleImageError = event => {
  event.target.src = placeholderImage
}

function debounce(func, wait) {
  let timeout

  return function (...args) {
    clearTimeout(timeout)
    timeout = setTimeout(() => func.apply(this, args), wait)
  }
}


const debouncedGetItems = debounce(async () => {
  await getItems()
}, 800) // 300ms delay

watch(
  () => searchQuery.value,
  async () => {
    debouncedGetItems()
  },
)
</script>

<style lang="scss" scoped>
.item {
  position: relative;
  display: flex;
  overflow: hidden;
  padding: 0;
  border-radius: 5px;
  block-size: 200px;

  img {
    block-size: 100%;
    inline-size: 100%;
    object-fit: cover;
  }

  p {
    position: absolute;
    padding: 0.5rem;
    background-color: rgba($color: #fff, $alpha: 50%);
    block-size: fit-content;
    inline-size: 100%;
    inset-block-end: 0;
    margin-block-end: 0;
    max-inline-size: 100%;
    text-align: center;
  }
}
</style>
