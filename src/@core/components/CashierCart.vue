<template>
  <VCard class="screen-layout">
    <div class="cart">
      <div class="cart__items">
        <div v-for="item in cashierStore.cart" :key="item.id" class="cart__item">
          <div class="info">
            {{ item.quantity }} x {{ item.name }}
          </div>
          <div class="price">
            {{ item.total_price }} ريال
          </div>
        </div>
      </div>
      <div class="cart__result">
        <!-- to="/cashier/payment" -->
        <button v-if="!isPayment" class="total" @click="addCustomerInfo">
          <p>الاجمالي</p>
          <p>{{ totalPrice }} ريال</p>
        </button>
        <div v-else class="total">
          <p>الاجمالي</p>
          <p>{{ totalPrice }} ريال</p>
        </div>
      </div>
    </div>
    <Modal v-model="showCustomerInfoModal" width="400px" :custom-action="true">
      <template #content>
        <VRow>
          <VCol cols="12" md="12">
            <VTextField v-model="client.customer_mobile" dirty name="mobile" type="number" suffix="+966" label="رقم الجوال" placeholder="202 555 0111" class="mb-5" />
          </VCol>
        </VRow>
        <div class="buttons">
          <VBtn class="primary" @click="makeOrder">
            أضافة
          </VBtn>
          <VBtn class="secondary" @click="resetModal">
            إلغاء
          </VBtn>
        </div>
      </template>
    </Modal>
  </VCard>
</template>

<script setup>
import { useCashierStore } from '@/store/Cashier';
import { computed, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';

const props = defineProps({
  isPayment: {
    type: Boolean,
    default: false,
  },
})


const router = useRouter()
const cashierStore = useCashierStore()
const totalPrice = computed(() => cashierStore.cart.reduce((acc, item) => acc + item.price * item.quantity, 0))
const totalQuantity = cashierStore.cart.reduce((total, item) => total + Number(item.quantity), 0)

console.log("totalQuantity", totalQuantity)

const showCustomerInfoModal = ref(false)


const client = reactive({
  customer_mobile: '',
  total_amount: totalQuantity,
  using_wallet: 0,
  applied_discount_code: null,
  comment: "",
})

const resetClient = () => {
  client.customer_mobile = ''
}

const resetModal = () => {
  showCustomerInfoModal.value = false
  resetClient()
}

const addCustomerInfo = () => showCustomerInfoModal.value = true

const makeOrder = async () => {
  client["products"] = cashierStore.cart
  client["total_amount"] = totalQuantity
  client["customer_mobile"] = `+966${client.customer_mobile}`
  showCustomerInfoModal.value = false

  let { code } = await cashierStore.createOrder(client)
  if (code == '200') {
    router.push('/cashier/payment')
    resetModal()
  }
}
</script>

<style lang='scss' scoped>
.screen-layout {
  position: sticky;
  block-size: 80vh;
  inset-block-start: 100px;
}

.cart {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  block-size: 100%;

  &__items {
    display: flex;
    flex-direction: column;
    padding: 1rem;
    gap: 0.5rem;
  }

  &__item {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  &__result {
    .total {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1rem;
      background-color: rgba(var(--v-theme-primary), 1);
      block-size: 50px;
      color: #fff;
      inline-size: 100%;

      p {
        margin-block-end: 0;
      }
    }
  }
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

    &.primary {
      background-color: rgba(var(--v-theme-primary), 1) !important;
      color: #fff;
    }

    &.secondary {
      background-color: #fff !important;
      color: #333 !important;
    }
  }
}
</style>
