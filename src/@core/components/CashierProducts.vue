<template>
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
        <button
          class="default item"
          @click="$router.go(-1)"
        >
          رجوع
        </button>
      </VCol>
      <VCol
        v-for="product in products"
        :key="product.id"
        cols="4"
        lg="3"
        md="3"
        sm="6"
      >
        <button
          class="item"
          @click="selectProduct(product)"
        >
          <img
            :src="product.image_url"
            :alt="product.type_ar"
            :placeholder="placeholderImage"
            @error="handleImageError"
          >
          <p>{{ product.name_ar }}</p>
        </button>
      </VCol>
    </VRow>
    <Modal
      v-model="showAddingPropertiesModal"
      width="800px"
      :custom-action="true"
    >
      <template #content>
        <VRow>
          <VCol
            v-if="selectedProduct?.cuts?.length > 0"
            cols="12"
            md="6"
          >
            <VSelect
              v-model="item.cut_id"
              label="قطع المنتجات"
              :items="selectedProduct?.cuts"
              item-title="name_ar"
              item-value="id"
            />
          </VCol>
          <VCol
            v-if="selectedProduct?.sizes?.length > 0"
            cols="12"
            md="6"
          >
            <VSelect
              v-model="item.size_id"
              label="احجام المنتجات"
              :items="selectedProduct?.sizes"
              item-title="name_ar"
              item-value="id"
            />
          </VCol>
          <VCol
            v-if="selectedProduct?.preparations?.length > 0"
            cols="12"
            md="6"
          >
            <VSelect
              v-model="item.preparation_id"
              label="تجهيز المنتجات"
              :items="selectedProduct?.preparations"
              item-title="name_ar"
              item-value="id"
            />
          </VCol>
          <VCol
            v-if="selectedProduct?.preparations?.length > 0"
            cols="12"
            md="12"
            class="d-flex gap-9"
          >
            <VCheckbox
              v-model="item.shalwata"
              label="مع شلوطة"
              :false-value="0"
              :true-value="1"
            />
            <VCheckbox
              v-model="item.is_karashah"
              label="بدون كرشة"
              :false-value="0"
              :true-value="1"
            />
            <VCheckbox
              v-model="item.is_kwar3"
              label="بدون كوارع"
              :false-value="0"
              :true-value="1"
            />
            <VCheckbox
              v-model="item.is_lyh"
              label="بدون لية"
              :false-value="0"
              :true-value="1"
            />
            <VCheckbox
              v-model="item.is_Ras"
              label="بدون رأس"
              :false-value="0"
              :true-value="1"
            />
          </VCol>
        </VRow>
        <div class="buttons">
          <AppButton
            type="primary"
            title="تم"
            @click="addingProperties"
          />
          <AppButton
            type="close"
            title="الغاء"
            @click="resetModal"
          />
        </div>
      </template>
    </Modal>
    <Modal
      v-model="showAddingModal"
      width="400px"
      :custom-action="true"
    >
      <template #content>
        <Calculation v-model="item.quantity" />
        <div class="buttons ">
          <AppButton
            type="primary"
            title="تم"
            @click="handleQuantity"
          />
          <AppButton
            type="close"
            title="الغاء"
            @click="resetModal"
          />
        </div>
      </template>
    </Modal>
  </VCard>
</template>

<script setup>
import Calculation from '@/@core/components/Calculation.vue'
import Modal from '@/@core/components/Modal.vue'
import { useCashierStore } from '@/store/Cashier'
import { onMounted, reactive, ref, toRaw } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps({
  products: {
    type: Array,
    required: true,
  },
})

const router = useRouter()
const cashierStore = useCashierStore()
const isLoading = ref(false)
const quantity = ref('')
const selectedProduct = ref({})
const searchQuery = ref('')
const showAddingPropertiesModal = ref(false)
const showAddingModal = ref(false)

const item = reactive({
  cut_id: null,
  size_id: null,
  preparation_id: null,
  price: null,
  quantity: null,
  total_price: null,
  product_id: null,
  name: null,
  quantity: null,
  is_Ras: 0,
  is_lyh: 0,
  is_kwar3: 0,
  is_karashah: 0,
  shalwata: 0,
})

const resetItem = () => {
  item.cut_id = null
  item.size_id = null
  item.preparation_id = null
  item.price = null
  item.quantity = null
  item.total_price = null
  item.id = null
  item.name = null
  item.is_Ras = 0
  item.is_lyh = 0
  item.is_kwar3 = 0
  item.is_karashah = 0
  item.shalwata = 0

}

const addingProperties = () => {
  showAddingPropertiesModal.value = false
  showAddingModal.value = true
}

const handleQuantity = async () => {
  let selectedSize = selectedProduct.value?.sizes.find(size => size.id == item.size_id)
  item.price = selectedSize == undefined ? selectedProduct.value.sale_price : selectedSize?.price
  item.product_id = selectedProduct.value.id
  item.name = selectedProduct.value.name_ar
  item.total_price = item.quantity * item.price

  const itemToAdd = toRaw({ ...item })

  cashierStore.addToCart(itemToAdd)
  resetItem()
  showAddingModal.value = false
}

const resetModal = () => {
  showAddingModal.value = false
  showAddingPropertiesModal.value = false
  resetItem()
}

// Placeholder image URL for fallback
const placeholderImage = 'https://media.istockphoto.com/id/1409329028/vector/no-picture-available-placeholder-thumbnail-icon-illustration-design.jpg?s=612x612&w=0&k=20&c=_zOuJu755g2eEUioiOUdz_mHKJQJn-tDgIAhQzyeKUQ='

// Access cashier store
const selectProduct = product => {
  selectedProduct.value = product

  if (product.sizes.length == 0) showAddingModal.value = true

  // if (product.preparations.length == 0 && product.cuts.length == 0) showAddingModal.value = true
  else showAddingPropertiesModal.value = true
}

const getItems = async () => {
  let payload = {
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
    block-size: 40px !important;
    font-size: 1rem;
    text-align: center;
  }
}
</style>
