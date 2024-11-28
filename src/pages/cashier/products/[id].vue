<template>
  <div>
    <!-- Search Card -->
    <VRow>
      <VCol :cols="cashierStore.cart.length > 0 ? 9 : 12">
        <VCard class="mb-5 pa-5">
          <VRow justify="space-between">
            <VCol cols="12">
              <VTextField v-model="searchQuery" label="بحث" class="search-wrap" prepend-inner-icon="iconamoon:search-thin" />
            </VCol>
          </VRow>
        </VCard>

        <!-- Categories Card -->
        <VCard class="pa-5">
          <div v-if="isLoading" class="h-full d-flex align-center justify-center">
            <AppLoading />
          </div>
          <VRow v-else justify="flex-start">
            <VCol cols="4" lg="2" md="3" sm="6">
              <button class="default item" @click="$router.go(-1)">
                رجوع
              </button>
            </VCol>
            <VCol v-for="product in products" :key="product.id" cols="4" lg="2" md="3" sm="6">
              <button class="item" @click="selectProduct(product)">
                <img :src="product.image_url" :alt="product.type_ar" :placeholder="placeholderImage" @error="handleImageError">
                <p>{{ product.name_ar }}</p>
              </button>
            </VCol>
          </VRow>
          <Modal v-model="showAddingModal" width="400px" :custom-action="true">
            <template #content>
              <Calculation v-model="quantity" />
              <div class="buttons">
                <VBtn @click="handleQuantity">
                  تم
                </VBtn>
                <VBtn @click="showAddingModal = false">
                  إلغاء
                </VBtn>
              </div>
            </template>
          </Modal>
        </VCard>
      </VCol>
      <VCol v-if="cashierStore.cart.length != 0" cols="3">
        <VCard class="h-full visible">
          <CachierCart :cart="cashierStore.cart" />
        </VCard>
      </VCol>
    </VRow>
  </div>
</template>

<script setup>
import CachierCart from '@/@core/components/CachierCart.vue'
import Calculation from '@/@core/components/Calculation.vue'
import Modal from '@/@core/components/Modal.vue'
import { useCashierStore } from '@/store/Cashier'
import { onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { VCol } from 'vuetify/lib/components/index.mjs'

const router = useRouter()
const cashierStore = useCashierStore()
const isLoading = ref(false)
const quantity = ref('')
const selectedProduct = ref({})
const cart = ref([])
const searchQuery = ref('')
const products = ref([])
const showAddingModal = ref(false)
const id = ref(router.currentRoute.value.params.id)


const handleQuantity = () => {
  let payload = {
    id: selectedProduct.value?.id,
    name: selectedProduct.value?.name_ar,
    price: selectedProduct.value?.['sale price'],
    quantity: quantity.value,
  }
  cashierStore.addToCart(payload)
  quantity.value = ''
  showAddingModal.value = false
}


// Placeholder image URL for fallback
const placeholderImage = 'https://via.placeholder.com/350x150'

// Access cashier store


const selectProduct = product => {
  selectedProduct.value = product
  showAddingModal.value = true
}

const getItems = async (search = '') => {
  let payload = {
    id: id.value,
    search,
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

onMounted(async () => await getItems())

const handleImageError = event => event.target.src = placeholderImage

watch(
  () => searchQuery.value,
  async newSearch => {
    await getItems(newSearch)
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
  inline-size: 100%;

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

.visible {
  overflow: visible;
}

.buttons {
  display: flex;
  gap: 0.5rem;
  margin-block-start: 1rem;

  :deep(.v-btn) {
    flex: 1;
    background-color: #fff !important;
    block-size: 60px !important;
    color: #333 !important;
    font-size: 1.2rem;
    text-align: center;
  }
}
</style>
