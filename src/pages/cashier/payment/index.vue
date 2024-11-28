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
            <div class="payment-methods-grid">
              <div v-for="method in paymentMethods" :key="method.id" class="payment-method-item" :class="{ 'selected': selectedPaymentMethod === method.id }" @click="selectPaymentMethod(method.id)">
                <div class="radio-circle">
                  <div v-if="selectedPaymentMethod === method.id" class="radio-circle-inner" />
                </div>
                <span class="payment-method-name">{{ method.name }}</span>
              </div>
            </div>
          </div>
          <button class="pay">
            دفع
          </button>
        </div>
      </VCol>
      <VCol v-if="cashierStore.cart.length != 0" cols="3">
        <CashierCart :cart="cashierStore.cart" />
      </VCol>
    </VRow>
  </div>
</template>

<script setup>
import CashierCart from '@/@core/components/CashierCart.vue';
import { useCashierStore } from '@/store/Cashier';
import { ref } from 'vue';

const cashierStore = useCashierStore()


const paymentMethods = ref([
  {
    id: 1,
    name: 'كاش',
  },
  {
    id: 2,
    name: 'بطاقة ائتمان',
  },
])

const selectedPaymentMethod = ref(null)

const selectPaymentMethod = methodId => {
  selectedPaymentMethod.value = methodId
}
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
