<template>
  <CashierLayout>
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
          cols="4"
          lg="2"
          md="3"
          sm="6"
        >
          <RouterLink
            to="/cashier/categories"
            class="default item"
          >
            رجوع
          </RouterLink>
        </VCol>
        <VCol
          v-for="subCategory in subCategories"
          :key="subCategory.id"
          cols="4"
          lg="2"
          md="3"
          sm="6"
        >
          <RouterLink
            :to="`/cashier/products/${subCategory.id}`"
            class="item"
          >
            <img
              :src="subCategory.image_url"
              :alt="subCategory.type_ar"
              :placeholder="placeholderImage"
              @error="handleImageError"
            >
            <p>{{ subCategory.type_ar }}</p>
          </RouterLink>
        </VCol>
      </VRow>
    </VCard>
  </CashierLayout>
</template>

<script setup>
import { useCashierStore } from '@/store/Cashier'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import CashierLayout from '../cashierLayout.vue'

const router = useRouter()

// Create reactive reference for search query and subCategories
const searchQuery = ref('')
const subCategories = ref([])

// Placeholder image URL for fallback
const placeholderImage = 'https://via.placeholder.com/350x150'

// Access cashier store
const cashierStore = useCashierStore()
const isLoading = ref(false)
const id = ref(router.currentRoute.value.params.id)

const getItems = async () => {
  let payload = {
    id: id.value,
    search: searchQuery.value,
  }
  try {
    isLoading.value = true
    subCategories.value = await cashierStore.getAllSubCategories(payload)
  } catch (error) {
    console.error('Failed to load categories:', error)
  } finally {
    isLoading.value = false
  }
}


onMounted(async () => await getItems())

const handleImageError = event => event.target.src = placeholderImage


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

  &.default {
    align-items: center;
    justify-content: center;
    background-color: #f2f2f2;
  }

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
