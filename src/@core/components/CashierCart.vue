<template>
  <div class="screen-layout">
    <div
      v-if="isLoading"
      class="loader-overlay"
    >
      <div class="loader" />
    </div>
    <VCard
      v-if="!isPayment"
      class="mb-5 pa-5"
    >
      <VRow justify="space-between">
        <VCol cols="12">
          <VTextField
            ref="searchInput"
            v-model="scanValue"
            label="مسح الكود"
            class="search-wrap"
            :readonly="isReadonly"
            @click="enableKeyboard"
          />
        </VCol>
      </VRow>
    </VCard>

    <VCard
      class="cart-wrap"
      :class="isPayment ? 'screen-layout' : ''"
    >
      <div class="cart">
        <div class="cart__items">
          <div
            v-for="(item, index) in cashierStore.cart"
            :key="item.id"
            class="cart__item"
          >
            <div class="info">
              {{ parseFloat(item.quantity).toFixed(2) }} x {{ item.name }}
            </div>
            <div class="d-flex gap-4 align-center">
              <span class="nowrap">{{ item.total_price.toFixed(2) }} ريال</span>
              <VBtn
                icon
                variant="text"
                color="default"
                class="ms-n3"
                size="small"
                @click="cashierStore.removeItem(index)"
              >
                <VIcon
                  icon="tabler-x"
                  size="20"
                />
              </VBtn>
            </div>
          </div>
        </div>
        <div class="cart__result">
          <div
            v-if="cashierStore.isCodeSubmitted || cashierStore.order?.other_discount > 0"
            class="discount mb-3"
          >
            <div
              class="discount__info"
            >
              <div
                v-if="cashierStore.isCodeSubmitted || cashierStore.order?.other_discount > 0"
                class=""
              >
                <span>السعر قبل الخصم</span>
                <span>{{ totalPrice.toFixed(2) }} ريال</span>
              </div>
              <div
                v-if="cashierStore.isCodeSubmitted"
                class="mb-3"
              >
                <span>الخصم</span>
                <span>{{ cashierStore.discount?.toFixed(2) }} ريال</span>
              </div>
              <div
                v-if="cashierStore.order?.other_discount > 0"
              >
                <span>خصم إضافي للعميل</span>
                <span>{{ cashierStore.order?.other_discount ?? 0 }} ريال</span>
              </div>
            </div>

            <AppButton
              v-if="cashierStore.isCodeSubmitted"
              type="primary icon-only"
              title="x"
              style="width: 30px;height: 30px;"
              class="mb-5"
              @click="removeDiscount"
            />
          </div>


          <div
            v-if="!cashierStore.isCodeSubmitted && !isPayment"
            class="discount"
          >
            <VTextField
              ref="promoCode"
              v-model="discountCode.discount_code"
              label="كود الخصم"
              @mouseenter="promoCodeFocus"
              @mouseleave="isPromoCodeFocused = false"
            />
            <AppButton
              type="primary"
              :is-loading="isDiscountSubmit"
              title="تطبيق"
              @click="makeDiscount"
            />
          </div>
          <button
            v-if="cashierStore.cart.length != 0 && !isPayment && !isEdit"
            class="total"
            @click="addCustomerInfo"
          >
            <p>الاجمالي</p>

            <p>{{ finalTotalAmount.toFixed(2) }} ريال</p>
          </button>
          <button
            v-else-if="isEdit"
            class="total"
            @click="editOrder"
          >
            <p>اكمال الطلب</p>
            <p>{{ finalTotalAmount.toFixed(2) }} ريال</p>
          </button>

          <div
            v-else
            class="total"
          >
            <p>الاجمالي</p>
            <p>{{ finalTotalAmount.toFixed(2) }} ريال</p>
          </div>
        </div>
      </div>
      <Modal
        v-model="showCustomerInfoModal"
        width="600px"
        :custom-action="true"
      >
        <template #content>
          <VRow>
            <VCol
              cols="12"
              md="12"
            >
              <VTextField
                v-model="client.customer_mobile"
                dirty
                name="mobile"
                type="number"
                suffix="+966"
                label="رقم الجوال"
                placeholder="202 555 0111"
                class="mb-5"
              />
            </VCol>
          </VRow>
          <div class="buttons">
            <AppButton
              type="primary"
              title="أضافة"
              :disabled="preventMakeOrder"
              :is-loading="isLoading"
              @click="makeOrder"
            />
            <AppButton
              type="close"
              title="الغاء"
              @click="resetModal"
            />
            <AppButton
              type="primary"
              title="زائر"
              :is-loading="isCustomerLoading"
              @click="makeOrderAsCustomer"
            />
          </div>
        </template>
      </Modal>
    </VCard>
  </div>
</template>

<script setup>
import { useCashierStore } from '@/store/Cashier'
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps({
  isPayment: {
    type: Boolean,
    default: false,
  },
  isEdit:{
    type: Boolean,
    default: false,
  },
})

const scanValue = ref('')
const searchInput = ref(null)
const promoCode = ref(null)
const isPromoCodeFocused = ref(false)
const isReadonly = ref(true)// Control readonly state


watch(() => scanValue.value, () => {
  if (scanValue.value.length === 12) {
    cashierStore.scanCode(scanValue.value)
    scanValue.value = ''
  }
})


const enableKeyboard = () => {
  isReadonly.value = false // Remove readonly to allow keyboard interaction
}


const router = useRouter()
const cashierStore = useCashierStore()
const totalPrice = computed(() => cashierStore.cart.reduce((acc, item) => acc + item.price * item.quantity, 0))
const totalPriceAfterDiscount = computed(() => totalPrice.value - cashierStore.discount)
const finalTotalAmount = computed(() => totalPriceAfterDiscount.value - (cashierStore.order?.other_discount ?? 0))
const totalQuantity = cashierStore.cart.reduce((total, item) => total + Number(item.quantity), 0)
const isLoading = ref(false)
const isCustomerLoading = ref(false)
const isDiscountSubmit = ref(false)
const showCustomerInfoModal = ref(false)

const discountCode = reactive({
  discount_code: '',
  total_amount: totalPrice,
})


const client = reactive({
  customer_mobile: '',
  total_amount: totalQuantity,
  using_wallet: 0,
  applied_discount_code: '',
  comment: "",
})

const resetClient = () => client.customer_mobile = ''

const makeDiscount = async () => {
  isDiscountSubmit.value = true
  await cashierStore.hasCoupon(discountCode)
  isDiscountSubmit.value = false
}

const removeDiscount = () => {
  discountCode.discount_code = ''
  cashierStore.discount = 0
  cashierStore.isCodeSubmitted = false
}


const resetModal = () => {
  showCustomerInfoModal.value = false
  resetClient()
}

const addCustomerInfo = () => showCustomerInfoModal.value = true

const preventMakeOrder = computed(() => {
  let mobileSelected = client.customer_mobile == '' ? true : false

  return mobileSelected || cashierStore.isClicked
})

const editOrder = async () => {

  isLoading.value = true

  client['ref_no'] = cashierStore.order?.ref_no
  client["products"] = cashierStore.cart
  client["total_amount"] = totalPrice
  client["customer_mobile"] = cashierStore.order?.customer?.mobile
  client["applied_discount_code"] = discountCode.discount_code

  let { code } = await cashierStore.editOrder(client)
  if (code == '200') {
    router.push('/cashier/payment')
    resetModal()

  }
  isLoading.value = false
}

const makeOrder = async () => {
  client["products"] = cashierStore.cart
  client["total_amount"] = totalPrice
  client["customer_mobile"] = `+966${client.customer_mobile}`
  client["applied_discount_code"] = discountCode.discount_code

  isLoading.value = true
  let { code } = await cashierStore.createOrder(client)
  if (code == '200') {
    router.push('/cashier/payment')
    resetModal()
  }
  isLoading.value = false
}

const makeOrderAsCustomer = async () => {
  client["products"] = cashierStore.cart
  client["total_amount"] = totalPrice
  client["customer_mobile"] = `+9660123456789`
  client["applied_discount_code"] = discountCode.discount_code

  isCustomerLoading.value = true
  let { code } = await cashierStore.createOrder(client)
  if (code == '200') {
    router.push('/cashier/payment')
    resetModal()
  }
  isCustomerLoading.value = false
}

const promoCodeFocus = () => {
  isPromoCodeFocused.value = true
  promoCode.value.focus()
}


const focusInput = () => {
  if (showCustomerInfoModal.value || isPromoCodeFocused.value)
    return searchInput.value.focus()
}

watch(
  () => [isPromoCodeFocused.value, showCustomerInfoModal.value],
  ([newPromoFocused, newShowCustomer]) => {
    if (!newPromoFocused && !newShowCustomer) focusInput()
  },
  { immediate: false },
)

onMounted(() => {
  focusInput()
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

.screen-layout {
  position: sticky;
  block-size: 80vh;
  inset-block-start: 100px;

  .cart-wrap {
    block-size: calc(80vh - 100px);

    &.screen-layout {
      position: sticky;
      block-size: 80vh;
    }
  }
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
    max-block-size: 90%;
    overflow-y: auto;
  }

  &__item {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  &__result {
    display: flex;
    flex-direction: column;

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

.discount {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  block-size: 70px;
  gap: 1rem;
  padding-block: 0;
  padding-inline: 10px;

  :deep(.v-field) {
    border-radius: 20px;
  }

  :deep(input) {
    block-size: 50px !important;
    padding-block: 10px;
    padding-inline: 10px 80px;
  }

  :deep(button) {
    padding: 0;

    .icon-only {
      border-radius: 50%;
      block-size: 40px !important;
      inline-size: 40px !important;
    }

    &:not(.icon-only) {
      position: absolute;
      block-size: 40px;
      inset-block-start: 50%;
      inset-inline-end: 15px;
      transform: translateY(-50%);
    }
  }

  &__info {
    flex: 1;

    >div {
      display: flex;
      justify-content: space-between;
      color: rgba(var(--v-theme-primary), 1);
    }
  }
}

.nowrap {
  white-space: nowrap;
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
