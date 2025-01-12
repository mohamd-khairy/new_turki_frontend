<template>
  <div>
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
                :class="{ 'selected': paymentInfo?.payment_type_id === method.id }"
                @click="selectPaymentMethod(method.id)"
              >
                <div class="radio-circle">
                  <div
                    v-if="paymentInfo?.payment_type_id === method.id"
                    class="radio-circle-inner"
                  />
                </div>
                <span class="payment-method-name">{{ method.name_ar }}</span>
              </div>
            </div>
          </div>

          <!-- Total Section and Buttons -->
          <div class="total-section">
            <div class="buttons">
              <AppButton
                class="pay"
                type="primary"
                title="تم الدفع"
                :disabled="!paymentInfo.payment_type_id"
                :is-loading="cashierStore.isClicked"
                @click="storePaymentTypes"
              />
              <AppButton
                class="cancel"
                type="close"
                title="إلغاء"
                @click="cancelOrder"
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
  </div>
</template>


<script setup>
import AppButton from '@/@core/components/AppButton.vue'
import CashierCart from '@/@core/components/CashierCart.vue'
import { useCashierStore } from '@/store/Cashier'
import { computed, onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

const cashierStore = useCashierStore()

const isLoading = ref(false)
const paymentMethods = ref([])
const router = useRouter()

const paymentInfo = reactive({
  payment_type_id: null,
  order_ref_no: null,
  comment: '',
})

const preventPay = computed(() => {
  let paymentSelected = paymentInfo.payment_type_id == null ? true : false
  let isClicked = cashierStore.isClicked

  return paymentSelected || isClicked

})




const selectPaymentMethod = methodId => {
  paymentInfo.payment_type_id = methodId
}

const storePaymentTypes = async () => {
  paymentInfo.order_ref_no = cashierStore?.order?.ref_no

  const { code, data } = await cashierStore.storePayment(paymentInfo)

  if (code == 200) router.push(`/cashier/order-details/${data.ref_no}`)
}

const cancelOrder = async () => {
  const { code } = await cashierStore.cancelOrder(cashierStore?.order?.ref_no)
  if (code == 200) router.push(`/cashier/categories`)

}


onMounted(async () => {

  if (cashierStore.order?.ref_no == undefined) router.go(-1)
  else {
    isLoading.value = true
    paymentMethods.value = await cashierStore.getAllPaymentTypes()
    isLoading.value = false
  }


})
</script>

<style lang="scss" scoped>
.cart {
  font-size: 1.5rem;
  font-weight: 600;
  margin-block: 1rem;
}

.payment-methods {
  display: flex;
  flex-direction: column;
  justify-content: space-between; /* Push the buttons to the bottom */
  padding: 2rem;
  border-radius: 8px;
  background-color: #f9f9f9;
  block-size: 80vh; /* Full height */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 10%);
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

.buttons {
  display: flex;
  align-items: center; /* Align buttons vertically */
  justify-content: space-between; /* Place buttons side-by-side with space between */
  gap: 1rem; /* Add spacing between the buttons */
  margin-block-start: auto; /* Push buttons to the bottom of the container */
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
}

.total-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 1.2rem;
  font-weight: bold;
  margin-block-end: 1rem; /* Add spacing between total and buttons */
}
</style>
