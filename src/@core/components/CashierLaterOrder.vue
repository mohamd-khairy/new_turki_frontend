<template>
  <!-- Categories Card -->
  <div>
    <VRow
      justify="flex-start"
      class="later"
    >
      <VBtn
        v-for="(item, index) in cashierStore.laterOrders"
        :key="item"
        cols="3"
        :class="{active: item.ref_no == cashierStore.ref_no}"
        @click="cashierStore.openOrder(item.ref_no)"
      >
        {{ item.ref_no }}

        <VBtn
          icon
          variant="text"
          color="default"
          class="ms-n1"
          size="small"
          @click.stop="deleteOrder(item.ref_no)"
        >
          <VIcon
            icon="tabler-x"
            size="25"
          />
        </VBtn>
      </VBtn>
    </VRow>
  </div>
</template>

<script setup>
import { useCashierStore } from '@/store/Cashier'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps({
  products: {
    type: Array,
    required: true,
  },
})

const router = useRouter()
const cashierStore = useCashierStore()
const isLoading = ref(false)
const route = useRoute()




const deleteOrder = async ref_no => {
  isLoading.value = true

  const { code } = await cashierStore.cancelOrder(ref_no)
  if (code == 200){
    isLoading.value = false
    cashierStore.laterOrders = cashierStore.laterOrders?.filter(item => item.ref_no !== ref_no)
  }
}

const getLaterOrders = async () => {
  try {
    isLoading.value = true
    await cashierStore.getLaterOrders()
  } catch (error) {
    console.error('Failed to load products:', error)
  } finally {
    isLoading.value = false
  }
}


onMounted(async () => {
  getLaterOrders()
})
</script>

<style lang='scss' scoped>
.later {
  display: flex;

  /* Use flexbox for the row */
  flex-wrap: nowrap;

  /* Prevent wrapping of child elements */
  padding: 2px;

  /* Add some padding */
  gap: 16px;

  /* Add spacing between items */
  inline-size: 100%;

  /* Ensure the container takes full width */
  max-inline-size: 100%;

  /* Prevent overflow */
  overflow-x: auto;

  /* Enable horizontal scrolling */
}

.later > button {
  background-color: unset !important;
  color: rgba(var(--v-theme-primary), 1) !important;

  &.active {
    background-color: rgba(var(--v-theme-primary), 1) !important; /* Primary color for active button */
    color: white !important; /* White text for active button */
  }
}
</style>
