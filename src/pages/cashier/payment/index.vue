<template>
  <div>
    <VRow>
      <VCol :cols="cashierStore.cart.length > 0 ? 9 : 12">
        <div class="payment-mathods">
          <div class="info">
            <div class="button">
              <button class="goBack" @click="$router.go(-1)">
                رجوع
              </button>
            </div>
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
          <button class="pay" @click="storePaymentTypes">
            دفع
          </button>
        </div>
      </VCol>
      <VCol v-if="cashierStore.cart.length != 0" cols="3">
        <CashierCart :is-payment="true" />
      </VCol>
    </VRow>
  </div>
</template>

<script setup>
import CashierCart from '@/@core/components/CashierCart.vue';
import { useCashierStore } from '@/store/Cashier';
import { onMounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';

const cashierStore = useCashierStore()

const isLoading = ref(false)
const paymentMethods = ref([])
const router = useRouter()

const paymentInfo = reactive({
  payment_type_id: null,
  order_ref_no: null,
  comment: '',
})

const selectPaymentMethod = methodId => {
  paymentInfo.payment_type_id = methodId
}

const storePaymentTypes = () => {
  paymentInfo.order_ref_no = cashierStore?.order?.ref_no
  cashierStore.storePayment(paymentInfo)
}


onMounted(async () => {

  if (cashierStore.order?.ref_no == undefined) router.go(-1)

  isLoading.value = true
  paymentMethods.value = await cashierStore.getAllPaymentTypes()
  isLoading.value = false

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
.pay {
  border-radius: 8px;
  background-color: rgba(var(--v-theme-primary), 1);
  block-size: 50px;
  color: #fff;
  inline-size: 100px;
}

.pay {
  inline-size: 100%;
}

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

  // &:hover {
  //   border-color: #007bff;
  // }

  &.selected {
    background-color: rgba(var(--v-theme-primary), 1);
    color: #fff;
  }
}
</style>
