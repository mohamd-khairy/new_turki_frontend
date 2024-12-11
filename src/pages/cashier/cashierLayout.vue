<template>
  <div>
    <VRow>
      <VCol cols="9" lg="9" sm="7">
        <slot />
      </VCol>
      <VCol lg="3" cols="3" sm="5">
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
