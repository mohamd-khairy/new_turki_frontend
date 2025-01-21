<template>
  <div>
    <div
      v-if="isLoading"
      class="loader-overlay"
    >
      <div class="loader" />
    </div>
    <VRow>
      <VCol :cols="cashierStore.cart.length > 0 ? 9 : 12">
        <div class="payment-methods">
          <div class="info">
            <VTextarea
              v-model="paymentInfo.comment"
              rows="3"
              label="الملاحظات"
            />
            <h2 class="cart">
              طرق الدفع
            </h2>
            <div
              v-if="isLoading"
              class="h-full d-flex align-center justify-center"
            >
              <AppLoading />
            </div>
            <div
              v-else
              class="payment-methods-grid"
            >
              <div
                v-for="method in paymentMethods"
                :key="method.id"
                class="payment-method-item"
                :class="{ 'selected': paymentInfo?.payment_types?.includes(method.id) }"
                @click="selectPaymentMethod(method.id)"
              >
                <span class="payment-method-name">{{ method.name_ar }}</span>
              </div>
            </div>
          </div>


          <!-- Total Section and Buttons -->
          <div class="total-section">
            <div class="buttons">
              <AppButton
                v-if="paymentInfo.payment_types.length == 1"
                class="pay"
                type="primary"
                title="تم الدفع"
                :disabled="!paymentInfo.payment_type_id"
                :is-loading="cashierStore.isClicked"
                @click="storePaymentTypes"
              />
              <AppButton
                v-else
                class="pay"
                type="primary"
                title="تم الدفع"
                :disabled="!paymentInfo.payment_type_id"
                @click="openPaymentModal"
              />
              <AppButton
                class="save"
                type="primary"
                title=" الدفع في وقت اخر"
                @click="storeForLater"
              />
              <AppButton
                class="cancel"
                type="close"
                title="حذف الطلب"
                @click="cancelOrder"
              />
              <AppButton
                class="cancel"
                type="close"
                title=" الرجوع"
                @click="router.go(-1)"
              />
            </div>
          </div>
        </div>
      </VCol>
      <VCol
        v-if="cashierStore.cart.length != 0"
        cols="3"
      >
        <CashierCart :is-payment="true" />
      </VCol>
    </VRow>
    <CashierLaterOrder />




    <Modal
      v-model="showPaymentModal"
      width="700px"
      :custom-action="true"
    >
      <template #content>
        <VRow>
          <VCol
            v-for="item in paymentMethods"
            :key="item.id"
            cols="12"
            md="4"
          >
            <VTextField
              v-if="paymentInfo.payment_types.includes(item.id)"
              v-model="paymentInfo.prices[item.id]"
              dirty
              :name="item.name_ar"
              type="number"
              :label="item.name_ar"
              placeholder="المبلغ المدفوع"
              class="mb-5"
            />
          </VCol>
        </VRow>
        <div class="buttons">
          <AppButton
            type="primary"
            title="تم"
            :disabled="preventMakeOrder"
            @click="storePaymentTypes"
          />
          <AppButton
            type="close"
            title="الغاء"
            @click="resetModal"
          />
        </div>
      </template>
    </Modal>
  </div>
</template>


<script setup>
import AppButton from '@/@core/components/AppButton.vue'
import CashierCart from '@/@core/components/CashierCart.vue'
import { useCashierStore } from '@/store/Cashier'
import { computed, onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { VRow, VTextField } from 'vuetify/lib/components/index.mjs'

const cashierStore = useCashierStore()

const isLoading = ref(false)
const showPaymentModal = ref(false)
const paymentMethods = ref([])
const router = useRouter()

const paymentInfo = reactive({
  payment_type_id: null,
  order_ref_no: null,
  comment: '',
  payment_types: [],
  prices: {},
})

const openPaymentModal = () => {
  showPaymentModal.value = true
}

const filteredObject = () => {
  return Object.fromEntries(
    Object.entries(paymentInfo.prices).filter(([key, value]) => {
      return value !== '' && value !== null && value !== undefined
    }),
  )
}

const resetModal = () => {
  showPaymentModal.value = false
}

const preventMakeOrder = computed(() => {
  return paymentInfo.payment_types.length != Object.keys(filteredObject()).length
})

const preventPay = computed(() => {
  let paymentSelected = paymentInfo.payment_type_id == null ? true : false
  let isClicked = cashierStore.isClicked

  return paymentSelected || isClicked

})

const selectPaymentMethod = methodId => {
  if (paymentInfo?.payment_types?.includes(methodId)) {
    paymentInfo.payment_types = paymentInfo.payment_types?.filter(id => id != methodId)
  } else {
    paymentInfo.payment_type_id = paymentInfo.payment_types.length > 0 ? paymentInfo.payment_types[0] : methodId
    paymentInfo.payment_types?.push(methodId)
  }
}

const storePaymentTypes = async () => {
  isLoading.value = true
  paymentInfo.order_ref_no = cashierStore?.order?.ref_no

  if (paymentInfo.payment_types.length == 1) {
    paymentInfo.prices[paymentInfo.payment_types[0]] = cashierStore.order?.total_amount_after_discount
  }

  const { code, data } = await cashierStore.storePayment(paymentInfo)

  if (code == 200) {
    isLoading.value = false
    cashierStore.resetClient()
    router.push(`/cashier/order-details/${data.ref_no}`)
  }
}

const storeForLater = async () => {
  isLoading.value = true
  paymentInfo.order_ref_no = cashierStore?.order?.ref_no
  paymentInfo.later = true

  const { code, data } = await cashierStore.storePayment(paymentInfo)

  if (code == 200) {
    isLoading.value = false
    cashierStore.resetClient()
    router.push(`/cashier/categories`)
  }
}


const cancelOrder = async () => {
  isLoading.value = true

  const { code } = await cashierStore.cancelOrder(cashierStore?.order?.ref_no)
  if (code == 200) {
    isLoading.value = false
    cashierStore.resetClient()
    router.push(`/cashier/categories`)
  }
}


onMounted(async () => {
  if (cashierStore.order?.ref_no == undefined) router.go(-1)
  else {
    isLoading.value = true
    paymentMethods.value = await cashierStore.getAllPaymentTypes()
    paymentInfo.payment_types = cashierStore.order?.payment_types ?? []
    paymentInfo.payment_type_id = cashierStore.order?.payment_types?.length > 0 ? cashierStore.order?.payment_types[0] : null
    isLoading.value = false
  }
})
</script>

<style lang="scss" scoped>
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

.cart {
  font-size: 1.5rem;
  font-weight: 600;
  margin-block: 1rem;
}

.payment-methods {
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  /* Push the buttons to the bottom */
  padding: 2rem;
  border-radius: 8px;
  background-color: #f9f9f9;
  block-size: 80vh;

  /* Full height */
  gap: 1.5rem;
}

.button {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;

  >button {
    border: none;
    border-radius: 8px;
    background-color: rgba(var(--v-theme-primary), 1);
    color: #fff;
    cursor: pointer;
    padding-block: 0.5rem;
    padding-inline: 1rem;
    transition: background-color 0.3s ease;

    &:hover {
      background-color: rgba(var(--v-theme-primary), 0.8);
    }
  }
}

.payment-methods-grid {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));

  /* Responsive grid */
}

.payment-method-item {
  display: flex;
  align-items: center;
  padding: 1rem;
  border-radius: 8px;
  background-color: #fff;
  border-inline-start: 5px solid rgba(var(--v-theme-primary), 0.6);
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: rgba(var(--v-theme-primary), 0.1);
  }

  &.selected {
    background-color: rgba(var(--v-theme-primary), 1);
    border-inline-start-color: rgba(var(--v-theme-primary), 1);
    color: #fff;
  }

  .radio-circle {
    flex-shrink: 0;
    border: 2px solid rgba(var(--v-theme-primary), 1);
    border-radius: 50%;
    block-size: 24px;
    inline-size: 24px;
    margin-inline-end: 1rem;

    &.selected {
      border-color: #fff;
      background-color: rgba(var(--v-theme-primary), 1);
    }
  }

  .payment-method-name {
    flex: 1;
    font-size: 1rem;
    font-weight: 500;
  }
}

.button_payments {
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

.buttons {
  display: flex;
  align-items: center;

  /* Align buttons vertically */
  justify-content: space-between;

  /* Place buttons side-by-side with space between */
  gap: 1rem;

  /* Add spacing between the buttons */
  margin-block-start: auto;

  /* Push buttons to the bottom of the container */
}

.buttons > button {
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  padding-block: 0.75rem;
  padding-inline: 1.5rem;
  transition: background-color 0.3s ease;

  &.cancel {
    border: 1px solid #ddd;
    background-color: #f5f5f5;
    color: #333;

    &:hover {
      background-color: #eaeaea;
    }
  }

  &.pay {
    border: none;
    background-color: rgba(var(--v-theme-primary), 1);
    color: #fff;

    &:hover {
      background-color: rgba(var(--v-theme-primary), 0.8);
    }
  }

  &.save {
    border: none;
    background-color: rgb(255 187 1) !important;
    color: #fff;

    &:hover {
      background-color: rgba(var(--v-theme-primary), 0.8);
    }
  }
}

.total-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 1.2rem;
  font-weight: bold;
  margin-block-end: 1rem;

  /* Add spacing between total and buttons */
}
</style>
