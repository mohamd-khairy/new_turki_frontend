<template>
  <VCard :loading="cashierStore.isLoading">
    <VCardTitle class="d-flex align-center">
      <VIcon icon="solar:delivery-broken" size="24" color="primary" />
      <span class="mx-1">التسويات</span>
    </VCardTitle>
    <VTable height="600px" fixed-header class="text-no-wrap product-list-table text-center">
      <thead>
        <tr>
          <th scope="col" class="font-weight-semibold">
            {{ $t("forms.id") }}
          </th>
          <th scope="col" class="font-weight-semibold">
            اسم الموظف
            {{ }}
          </th>
          <th v-for="paymentType in cashierStore.paymentTypes" :key="paymentType.id" scope="col" class="font-weight-semibold">
            {{ locale == 'en' ? paymentType.name_en : paymentType.name_ar }}
          </th>
        </tr>
      </thead>
      <tbody v-if="cashierStore.isLoading">
        <tr v-for="tableRow in 5" :key="tableRow">
          <td v-for="tableTD in 5" :key="tableTD">
            <div>
              <VSkeletonLoader type="text" :height="40" :width="100" />
            </div>
          </td>
        </tr>
      </tbody>
      <tbody v-else>
        <template v-for="user in cashierStore.usersSales" :key="user.user_id">
          <tr>
            <td>{{ user.user_id }}</td>
            <td>{{ user.user_name }}</td>
            <td v-for="paymentType in cashierStore.paymentTypes" :key="paymentType.id" scope="col" class="font-weight-semibold">
              {{ ConvertToArabicNumbers(user[paymentType.name_en]) }}
            </td>
          </tr>
        </template>
      </tbody>
      <tfoot v-show="!cashierStore.isLoading && cashierStore.usersSales.length == 0">
        <tr>
          <td colspan="8" class="text-center text-body-1">
            لا يوجد بيانات
          </td>
        </tr>
      </tfoot>
    </VTable>
    <VDivider />
  </VCard>
</template>

<script setup>
import { useCashierStore } from '@/store/Cashier'
import { onMounted } from 'vue'
import { useI18n } from 'vue-i18n'

const cashierStore = useCashierStore()
const { t, locale } = useI18n()

const ConvertToArabicNumbers = num => {
  console.log("num", num)

  const arabicNumbers = "\u0660\u0661\u0662\u0663\u0664\u0665\u0666\u0667\u0668\u0669"

  return String(num).replace(/[0123456789]/g, d => arabicNumbers[d])
}

onMounted(async () => {
  await cashierStore.userSalesList()
})
</script>


<style lang="scss" scoped>
td,
th {
  border: thin solid rgba(var(--v-border-color), var(--v-border-opacity));
  border-collapse: collapse;
  text-align: start;
}
</style>
