<template>
  <VCard class="screen-layout">
    <div class="cart">
      <div class="cart__items">
        <div v-for="item in cart" :key="item.id" class="cart__item">
          <div class="info">
            {{ item.quantity }} x {{ item.name }}
          </div>
          <div class="price">
            {{ item.price }}
          </div>
        </div>
      </div>
      <div class="cart__result">
        <div class="total">
          <p>الاجمالي</p>
          <p>{{ totalPrice }} ريال</p>
        </div>
      </div>
    </div>
  </VCard>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  cart: {
    type: Array,
    required: true,
  },
})


const totalPrice = computed(() => props.cart.reduce((acc, item) => acc + item.price * item.quantity, 0))
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

      p {
        margin-block-end: 0;
      }
    }
  }
}
</style>
