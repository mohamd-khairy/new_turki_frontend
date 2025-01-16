<template>
  <div>
    <VRow>
      <VCol
        cols="9"
        lg="9"
        sm="7"
      >
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

        <slot v-if="searchQuery.length <= 0" />
        <CashierProducts
          v-else
          :products="products"
        />
      </VCol>
      <VCol
        lg="3"
        cols="3"
        sm="5"
      >
        <CashierCart />
      </VCol>
    </VRow>
  </div>
</template>

<script setup>
import CashierCart from '@/@core/components/CashierCart.vue'
import CashierProducts from '@/@core/components/CashierProducts.vue'
import { useCashierStore } from '@/store/Cashier'

const cashierStore = useCashierStore()
const searchQuery = ref('')
const products = ref([])
const isLoading = ref(false)


const getItems = async () => {
  let payload = {
    id: 227,
    search: searchQuery.value,
  }

  try {
    isLoading.value = true
    products.value = await cashierStore.getAllProducts(payload)
  } catch (error) {
    console.error('Failed to load products:', error)
  } finally {
    isLoading.value = false
  }
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

<style lang='scss' scoped></style>
