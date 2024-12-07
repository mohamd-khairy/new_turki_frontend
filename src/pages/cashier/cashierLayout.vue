<template>
  <div>
    <VRow>
      <VCol :cols="cashierStore.cart.length > 0 ? 9 : 12" :lg="cashierStore.cart.length > 0 ? 9 : 12" :sm="cashierStore.cart.length > 0 ? 7 : 12">
        <slot />
      </VCol>
      <VCol v-if="cashierStore.cart.length != 0" lg="3" cols="3" sm="5">
        <CashierCart />
      </VCol>
    </VRow>
  </div>
</template>

<script setup>
import CashierCart from '@/@core/components/CashierCart.vue';
import { useCashierStore } from '@/store/Cashier';

const cashierStore = useCashierStore()
</script>

<style lang='scss' scoped></style>
