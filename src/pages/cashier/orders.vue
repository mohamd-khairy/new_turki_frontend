<template>
  <VCard height="400">
    <VTable class="text-no-wrap order-list-table">
      <thead>
        <tr>
          <th scope="col" class="font-weight-semibold">
            {{ t('forms.id') }}
          </th>
          <th scope="col" class="font-weight-semibold">
            {{ t('forms.customer_name') }}
          </th>
          <th scope="col" class="font-weight-semibold">
            {{ t('forms.mobile') }}
          </th>
          <th scope="col" class="font-weight-semibold">
            {{ t('forms.payment_type') }}
          </th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="order in cashierStore.orderList" :key="order?.id">
          <td>#{{ order.id }}</td>
          <td>{{ order.customer_name }}</td>
          <td>{{ order.customer_mobile }}</td>
          <td>{{ order.payment_type_name }}</td>
        </tr>
      </tbody>

      <tfoot v-show="!1">
        <tr>
          <td colspan="8" class="text-center text-body-1">
            لا يوجد بيانات
          </td>
        </tr>
      </tfoot>
    </VTable>
  </VCard>
</template>


<script setup>
import { useCashierStore } from '@/store/Cashier';
import { onMounted } from 'vue';

const cashierStore = useCashierStore()
const { t } = useI18n()
const orders = ref([])

const ConvertToArabicNumbers = num => {
  const arabicNumbers = "\u0660\u0661\u0662\u0663\u0664\u0665\u0666\u0667\u0668\u0669"

  return String(num).replace(/[0123456789]/g, d => {
    return arabicNumbers[d]
  })
}

onMounted(async () => {
  await cashierStore.ordersList()
})
</script>
