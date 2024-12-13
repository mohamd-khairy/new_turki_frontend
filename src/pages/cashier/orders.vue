<template>
  <VCard :loading="cashierStore.isLoading">
    <VCardTitle class="d-flex align-center">
      <VIcon icon="solar:delivery-broken" size="24" color="primary" />
      <span class="mx-1">{{ t('Orders') }}</span>
    </VCardTitle>
    <EditCashierStatusDialog v-if="isEditOpen" v-model:is-edit-open="isEditOpen" :item="selectedOrder" :order-statuses="orderStatuses" @refreshTable="getOrders" />
    <div class="">
      <VTable height="600px" fixed-header class="text-no-wrap product-list-table text-center">
        <thead>
          <tr>
            <th scope="col" class="font-weight-semibold">
              {{ t('forms.actions') }}
            </th>
            <th scope="col" class="font-weight-semibold">
              {{ t('ref_no') }}
            </th>
            <th scope="col" class="font-weight-semibold">
              {{ t('forms.customer_name') }}
            </th>
            <th scope="col" class="font-weight-semibold">
              {{ t('customer_mobile') }}
            </th>
            <th scope="col" class="font-weight-semibold">
              {{ t('forms.order_state_ar') }} <br>
              <span class="text-primary">( {{ t('forms.click_change_status') }} )</span>
            </th>
            <th scope="col" class="font-weight-semibold">
              {{ t('forms.order_payment_status') }}
            </th>

            <th scope="col" class="font-weight-semibold">
              {{ t('forms.payment_type_name') }}
            </th>
            <th scope="col" class="font-weight-semibold">
              مسئول المبيعات
            </th>
            <th scope="col" class="font-weight-semibold">
              {{ t('forms.delivery_date') }}
            </th>

            <th scope="col" class="font-weight-semibold">
              {{ t('forms.total_amount_before_discount') }}
            </th>
            <th scope="col" class="font-weight-semibold">
              {{ t('forms.total_amount_after_discount') }}
            </th>
          </tr>
        </thead>
        <tbody v-if="cashierStore.isLoading">
          <tr v-for="tableRow in 9" :key="tableRow">
            <td v-for="tableTD in 15" :key="tableTD">
              <div>
                <VSkeletonLoader type="text" :height="40" :width="100" />
              </div>
            </td>
          </tr>
        </tbody>

        <tbody v-else>
          <tr v-for="order in cashierStore.orderList" :key="order.id">
            <td>
              <VTooltip text="تفاصيل الطلب">
                <template #activator="{ props }">
                  <VBtn v-bind="props" icon variant="plain" color="default" size="x-small" @click="openDetails(order)">
                    <VIcon :size="22" icon="tabler-eye" />
                  </VBtn>
                </template>
              </VTooltip>
            </td>
            <td>
              {{ order.ref_no }}
            </td>
            <td>
              {{ order.customer_name }}
            </td>
            <td>
              {{
                order.customer_mobile }}
            </td>
            <td @click="openEdit(order)">
              {{
                order.order_state_ar }}
            </td>
            <td>
              <VChip v-if="order.paid == 1" style="cursor: pointer;" class="text-success">
                مدفوع
              </VChip>

              <VChip v-else-if="(order.wallet_amount_used > 0 && order.remain_amount > 0)" style="cursor: pointer;" class="text-warning">
                مدفوع جزئياً
              </VChip>
              <VChip v-else-if="order.paid == 0" style="cursor: pointer;" class="text-error">
                غير مدفوع
              </VChip>
            </td>
            <td>
              {{ order.payment_type_name }}
              {{ order.payment_type_id != 8 && order.wallet_amount_used > 0 ? "+ المحفظة (" + order.wallet_amount_used
                + ")" :
                "" }}
            </td>
            <td>
              <span v-if="order.sales_officer_name">
                {{ order.sales_officer_name }}
              </span>
              <span v-else>--</span>
            </td>
            <td>
              {{ ConvertToArabicNumbers(formatDateTime(order.delivery_date).date) }}
            </td>
            <td>
              <span v-if="order.total_amount_after_discount">
                {{ ConvertToArabicNumbers(order.total_amount_after_discount) }}
              </span>
              <span v-else>--</span>
            </td>

            <td>
              <span v-if="order.total_amount_before_discount">
                {{ ConvertToArabicNumbers(order.total_amount_before_discount) }}
              </span>
              <span v-else>--</span>
            </td>
          </tr>
        </tbody>
        <tfoot v-show="!cashierStore.isLoading && cashierStore.orderList.length == 0">
          <tr>
            <td colspan="8" class="text-center text-body-1">
              لا يوجد بيانات
            </td>
          </tr>
        </tfoot>
      </VTable>
      <VDivider />

      <VCardText class="d-flex align-center flex-wrap justify-space-between gap-4 py-3">
        <span class="text-sm text-disabled">{{ paginationData }}</span>

        <VPagination v-model="currentPage" size="small" :total-visible="5" :length="cashierStore.orderListPaginated?.total" />
      </VCardText>
    </div>
  </VCard>
</template>


<script setup>
import EditCashierStatusDialog from '@/@core/components/pages/EditDialogs/EditCashierStatusDialog.vue'
import { useCashierStore } from '@/store/Cashier'
import { useOrdersStore } from "@/store/Orders"
import moment from "moment"
import { onMounted, ref, watch } from 'vue'
import { useRouter } from "vue-router"

const router = useRouter()
const cashierStore = useCashierStore()
const ordersListStore = useOrdersStore()

const { t } = useI18n()
const dataFrom = ref(1)
const dataTo = ref(1)
const currentPage = ref(1)
const isEditOpen = ref(false)
const selectedOrder = ref({})
const orderStatuses = ref([])

const openEdit = order => {
  isEditOpen.value = true
  selectedOrder.value = order
}

const handleDeliveryDate = (date, createdDate) => {
  const newDate = moment(date).format("DD-MM-YYYY")

  return ConvertToArabicNumbers(newDate)
}

const paginationData = computed(() => {
  return ` عرض من ${ConvertToArabicNumbers(dataFrom.value)} إلي ${ConvertToArabicNumbers(dataTo.value)} من ${ConvertToArabicNumbers(cashierStore.orderListPaginated?.total)} الإجمالي `
})

const ConvertToArabicNumbers = num => {
  const arabicNumbers = "\u0660\u0661\u0662\u0663\u0664\u0665\u0666\u0667\u0668\u0669"

  return String(num).replace(/[0123456789]/g, d => {
    return arabicNumbers[d]
  })
}

const formatDateTime = data => {
  let date = moment(data).format("YYYY-MM-DD")
  let time = moment(data).format("hh:mm:ss A")

  return { date, time }
}

const getOrders = async () => {
  cashierStore.ordersList({ page: currentPage.value })
}

const openDetails = order => {
  router.push(`/cashier/order-details/${order.ref_no}`)
}


onMounted(async () => {
  ordersListStore.fetchOrderStatus().then(response => {
    orderStatuses.value = response.data.data
  })
  await getOrders()
})

watch(() => currentPage.value, () => {
  getOrders()
})
</script>
