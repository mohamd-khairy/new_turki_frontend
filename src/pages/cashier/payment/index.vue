<template>
  <div>
    <VRow>
      <VCol :cols="cashierStore.cart.length > 0 ? 9 : 12">
        <div class="payment-mathods">
          <div class="info">
            <VTextarea v-model="paymentInfo.comment" rows="3" label="الملاحظات" />
            <h2 class="cart">
              طرق الدفع
            </h2>
            <div v-if="isLoading" class="h-full d-flex align-center justify-center">
              <AppLoading />
            </div>
            <div v-else class="payment-methods-grid">
              <div v-for="method in paymentMethods" :key="method.id" class="payment-method-item" :class="{ 'selected': paymentInfo?.payment_type_id === method.id }" @click="selectPaymentMethod(method.id)">
                <div class="radio-circle">
                  <div v-if="paymentInfo?.payment_type_id === method.id" class="radio-circle-inner" />
                </div>
                <span class="payment-method-name">{{ method.name_ar }}</span>
              </div>
            </div>
          </div>
          <div class="buttons">
            <AppButton type="primary" title="تم الدفع" :disabled="preventPay" :is-loading="cashierStore.isClicked" @click="storePaymentTypes" />
            <AppButton type="close" title="الغاء" @click="cancelOrder" />
          </div>
        </div>
      </VCol>
      <VCol v-if="cashierStore.cart.length != 0" cols="3">
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

console.log(preventPay.value)



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
.payment-mathods {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  block-size: 80vh;
  gap: 1rem;
}

.button {
  display: flex;
  justify-content: flex-end;
}

.goBack,
.payment-methods-grid,
.info {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.payment-method-item {
  display: flex;
  flex: 1;
  align-items: center;
  background-color: #fff;
  border-inline-start: 5px solid rgba(var(--v-theme-primary), 1);
  cursor: pointer;
  gap: 0.5rem;
  min-block-size: 60px;
  padding-block: 0.75rem;
  padding-inline: 1rem;
  transition: all 0.3s ease;

  &.selected {
    background-color: rgba(var(--v-theme-primary), 1);
    color: #fff;
  }
}

.buttons {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;

  > button {
    flex: 1;
    border-radius: 8px;
    background-color: #fff;
    block-size: 50px;

    &.pay {
      background-color: rgba(var(--v-theme-primary), 1);
      color: #fff;
    }
  }
}
</style>
