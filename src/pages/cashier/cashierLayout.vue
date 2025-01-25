<template>
  <div>
    <div
      v-if="cashierStore.isLoading"
      class="loader-overlay"
    >
      <div class="loader" />
    </div>
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
        <CashierCart :is-edit="cashierStore.ref_no != null ? true : false" />
      </VCol>
    </VRow>
    <CashierLaterOrder />
  </div>
</template>

<script setup>
import CashierCart from '@/@core/components/CashierCart.vue'
import CashierLaterOrder from '@/@core/components/CashierLaterOrder.vue'
import CashierProducts from '@/@core/components/CashierProducts.vue'
import { useCashierStore } from '@/store/Cashier'
import { onMounted, ref, watch } from 'vue'
import { VRow } from 'vuetify/lib/components/index.mjs'

const cashierStore = useCashierStore()
const searchQuery = ref('')
const products = ref([])
const isLoading = ref(false)
const route = useRoute()

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

onMounted(async () => {

})
</script>

<style lang='scss' scoped>
.loader-overlay {
  position: fixed;
  z-index: 1000;

  /* Ensure it's above other content */
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(1px);

  /* Optional: Blur effect */
  background: rgba(255, 255, 255, 80%);

  /* Semi-transparent white background */
  block-size: 100%;
  inline-size: 100%;
  inset-block-start: 0;
  inset-inline-start: 0;
}

/* Loader Spinner */
.loader {
  border: 4px solid #f3f3f3;

  /* Light grey */
  border-radius: 50%;
  animation: spin 1s linear infinite;

  /* Spin animation */
  block-size: 40px;
  border-block-start: 4px solid #3498db;

  /* Blue */
  inline-size: 40px;
}

/* Spin Animation */
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>
