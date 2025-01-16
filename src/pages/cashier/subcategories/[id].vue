<template>
  <CashierLayout>
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
          lg="3"
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
          lg="3"
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
const subCategories = ref([])

// Placeholder image URL for fallback
const placeholderImage = 'https://media.istockphoto.com/id/1409329028/vector/no-picture-available-placeholder-thumbnail-icon-illustration-design.jpg?s=612x612&w=0&k=20&c=_zOuJu755g2eEUioiOUdz_mHKJQJn-tDgIAhQzyeKUQ='

// Access cashier store
const cashierStore = useCashierStore()
const isLoading = ref(false)
const id = ref(router.currentRoute.value.params.id)

const getItems = async () => {
  let payload = {
    id: id.value,
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
