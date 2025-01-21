<template>
  <div :loading="cashierStore.isLoading">
    <VExpansionPanels class="mb-6">
      <VExpansionPanel>
        <VExpansionPanelTitle expand-icon="mdi-menu-down">
          <div class="py-2 d-flex align-center gap-1">
            <span>
              <VIcon
                icon="tabler:search"
                :size="24"
                color="primary"
              />
            </span>
            <span style="font-weight: 400;">البحث في الطلبات</span>
          </div>
        </VExpansionPanelTitle>
        <VExpansionPanelText>
          <div class="py-4 px-2">
            <VRow>
              <VCol
                cols="3"
                sm="12"
                class="d-flex align-center gap-3"
              >
                <div class="icon">
                  <VIcon
                    icon="material-symbols:globe"
                    color="primary"
                  />
                </div>
                <VSelect
                  v-model="filters.country_ids"
                  :items="countries"
                  :label="t('forms.countries')"
                  item-title="name_ar"
                  item-value="id"
                  :disabled="isLoading"
                />
              </VCol>


              <VCol
                cols="3"
                sm="12"
                class="d-flex align-center gap-3"
              >
                <div class="icon">
                  <VIcon
                    icon="solar:delivery-broken"
                    color="primary"
                  />
                </div>
                <VTextField
                  v-model="filters.ref_no"
                  label="البحث برقم الطلب"
                  :disabled="isLoading"
                />
              </VCol>
              <VCol
                cols="6"
                sm="12"
                class="d-flex align-center gap-3"
              >
                <div class="icon">
                  <VIcon
                    icon="clarity:users-line"
                    color="primary"
                  />
                </div>

                <VAutocomplete
                  v-model="filters.customer_id"
                  :items="customers"
                  label="البحث باسم أو رقم جوال العميل"
                  item-title="name_mobile"
                  item-value="id"
                  clearable
                  :loading="isLoadingCustomers"
                  @update:search="searchCustomer"
                  @update:menu="updateCutomersMenu"
                />
              </VCol>


              <VCol
                cols="12"
                lg="6"
                md="12"
                sm="12"
              >
                <VRow>
                  <VCol
                    cols="12"
                    sm="12"
                    class="d-flex align-center gap-3"
                  >
                    <div class="icon">
                      <VIcon
                        icon="solar:delivery-broken"
                        color="primary"
                      />
                    </div>
                    <VSelect
                      v-model="filters.order_state_ids"
                      :items="allOrderStatuses"
                      label="حالة الطلب"
                      item-title="state_ar"
                      item-value="code"
                      multiple
                      :disabled="isLoading"
                    />

                    <div class="icon">
                      <VIcon
                        icon="solar:delivery-broken"
                        color="primary"
                      />
                    </div>
                    <VSelect
                      v-model="filters.payment_type_ids"
                      :items="paymentTypes"
                      label="طريقة الدفع"
                      item-title="name_ar"
                      item-value="id"
                      multiple
                      :disabled="isLoading"
                    />
                  </VCol>
                </VRow>
              </VCol>

              <VCol
                cols="12"
                lg="6"
                md="12"
                sm="12"
              >
                <VRow>
                  <VCol
                    cols="12"
                    sm="12"
                    class="d-flex align-center gap-3"
                  >
                    <div class="icon">
                      <VIcon
                        icon="fluent-mdl2:date-time"
                        color="primary"
                      />
                    </div>
                    <VTextField
                      v-model="filters.date_from"
                      type="date"
                      :label="t('forms.from')"
                      :disabled="isLoading"
                    />

                    <div class="icon">
                      <VIcon
                        icon="fluent-mdl2:date-time"
                        color="primary"
                      />
                    </div>
                    <VTextField
                      v-model="filters.date_to"
                      type="date"
                      :label="t('forms.to')"
                      :disabled="isLoading"
                    />
                  </VCol>
                </VRow>
              </VCol>



              <VCol
                cols="12"
                class="d-flex align-center gap-3"
              >
                <VBtn
                  v-if="!isLoading"
                  prepend-icon="solar:filter-bold-duotone"
                  :disabled="isLoading"
                  @click.stop="filterOrders"
                >
                  {{ t('Filter') }}
                </VBtn>
                <VBtn
                  v-else
                  type="submit"
                  class="position-relative"
                  style="width: 152px;max-width: 100%;"
                >
                  <VIcon
                    icon="mingcute:loading-line"
                    class="loading"
                    size="32"
                  />
                </VBtn>
                <VBtn
                  prepend-icon="healthicons:x"
                  :disabled="isLoading || !isFiltered"
                  @click.stop="clearFilter"
                >
                  {{ t('Clear_Filter') }}
                </VBtn>
              </VCol>
            </VRow>
          </div>
        </VExpansionPanelText>
      </VExpansionPanel>
    </VExpansionPanels>
    <VCard>
      <VCardTitle class="d-flex align-center">
        <VIcon
          icon="solar:delivery-broken"
          size="24"
          color="primary"
        />
        <span class="mx-1">{{ t('Orders') }}</span>
        <div style="min-width: 10rem;">
          <VSelect
            v-model="rowPerPage"
            variant="outlined"
            :items="[5, 10, 20, 30, 50, 100, 200, 300, 500, 700, 1000]"
            :disabled="isLoading"
          />
        </div>
      </VCardTitle>

      <EditCashierStatusDialog
        v-if="isEditOpen"
        v-model:is-edit-open="isEditOpen"
        :item="selectedOrder"
        :order-statuses="orderStatuses"
        @refreshTable="getOrders"
      />
      <EditCashierStatusPaymentDialog
        v-if="isEditPaymentOpen"
        v-model:is-edit-open="isEditPaymentOpen"
        :item="selectedOrder"
        @refreshTable="getOrders"
      />
      <div class="">
        <VTable
          height="600px"
          fixed-header
          class="text-no-wrap product-list-table text-center"
        >
          <thead>
            <tr>
              <th
                scope="col"
                class="font-weight-semibold"
              >
                {{ t('forms.actions') }}
              </th>
              <th
                scope="col"
                class="font-weight-semibold"
              >
                {{ t('ref_no') }}
              </th>
              <th
                scope="col"
                class="font-weight-semibold"
              >
                {{ t('forms.customer_name') }}
              </th>
              <th
                scope="col"
                class="font-weight-semibold"
              >
                {{ t('customer_mobile') }}
              </th>
              <th
                scope="col"
                class="font-weight-semibold"
              >
                {{ t('forms.order_state_ar') }} <br>
                <span class="text-primary">( {{ t('forms.click_change_status') }} )</span>
              </th>
              <th
                scope="col"
                class="font-weight-semibold"
              >
                {{ t('forms.order_payment_status') }}
              </th>
              <th
                scope="col"
                class="font-weight-semibold"
              >
                {{ t('forms.total_amount_before_discount') }}
              </th>
              <th
                scope="col"
                class="font-weight-semibold"
              >
                {{ t('forms.total_amount_after_discount') }}
              </th>
              <th
                scope="col"
                class="font-weight-semibold"
              >
                {{ t('forms.delivery_date') }}
              </th>
              <th
                scope="col"
                class="font-weight-semibold"
              >
                {{ t('forms.payment_type_name') }}
              </th>
              <th
                scope="col"
                class="font-weight-semibold"
              >
                مسئول المبيعات
              </th>
            </tr>
          </thead>
          <tbody v-if="cashierStore.isLoading">
            <tr
              v-for="tableRow in 9"
              :key="tableRow"
            >
              <td
                v-for="tableTD in 15"
                :key="tableTD"
              >
                <div>
                  <VSkeletonLoader
                    type="text"
                    :height="40"
                    :width="100"
                  />
                </div>
              </td>
            </tr>
          </tbody>

          <tbody v-else>
            <tr
              v-for="order in cashierStore.orderList"
              :key="order.id"
            >
              <td>
                <VTooltip text="تفاصيل الطلب">
                  <template #activator="{ props }">
                    <VBtn
                      v-bind="props"
                      icon
                      variant="plain"
                      color="default"
                      size="x-small"
                      @click="openDetails(order)"
                    >
                      <VIcon
                        :size="22"
                        icon="tabler-eye"
                      />
                    </VBtn>
                  </template>
                </VTooltip>
                <VTooltip
                  v-if="order.paid != 1"
                  text=" تعديل الطلب"
                >
                  <template #activator="{ props }">
                    <VBtn
                      v-bind="props"
                      icon
                      variant="plain"
                      color="default"
                      size="x-small"
                      @click="cashierStore.openOrder(order.ref_no)"
                    >
                      <VIcon
                        :size="22"
                        icon="tabler-edit"
                      />
                    </VBtn>
                  </template>
                </VTooltip>
                <VTooltip text="ارجاع الطلب">
                  <template #activator="{ props }">
                    <VBtn
                      v-bind="props"
                      icon
                      variant="plain"
                      color="default"
                      size="x-small"
                      @click="openRefundDetails(order)"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        width="24"
                        height="24"
                        stroke-width="2"
                      >
                        <path d="M12 19h-6a3 3 0 0 1 -3 -3v-8a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v4.5" />
                        <path d="M3 10h18" />
                        <path d="M7 15h.01" />
                        <path d="M11 15h2" />
                        <path d="M16 19h6" />
                        <path d="M19 16l-3 3l3 3" />
                      </svg>
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
                <VChip
                  style="cursor: pointer;"
                  :class="getOrderStatusColorClass(order.order_state_id)"
                >
                  {{ order.order_state_ar }}
                </VChip>
              </td>
              <td @click="openEditPayment(order)">
                <VChip
                  v-if="order.paid == 1"
                  style="cursor: pointer;"
                  class="text-success"
                >
                  مدفوع
                </VChip>

                <VChip
                  v-else-if="(order.wallet_amount_used > 0 && order.remain_amount > 0) || order.paid == 2"
                  style="cursor: pointer;"
                  class="text-warning"
                >
                  مدفوع جزئياً
                </VChip>
                <VChip
                  v-else-if="order.paid == 0"
                  style="cursor: pointer;"
                  class="text-error"
                >
                  غير مدفوع
                </VChip>
              </td>

              <td>
                <span v-if="order.total_amount_before_discount">
                  {{ ConvertToArabicNumbers(order.total_amount_before_discount) }}
                </span>
                <span v-else>--</span>
              </td>
              <td>
                <span v-if="order.total_amount_after_discount">
                  {{ ConvertToArabicNumbers(order.total_amount_after_discount) }}
                </span>
                <span v-else>--</span>
              </td>

              <td>
                {{ formatDateTime(order.delivery_date).date }}
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
            </tr>
          </tbody>
          <tfoot v-show="!cashierStore.isLoading && cashierStore.orderList.length == 0">
            <tr>
              <td
                colspan="8"
                class="text-center text-body-1"
              >
                لا يوجد بيانات
              </td>
            </tr>
          </tfoot>
        </VTable>
        <VDivider />

        <VCardText class="d-flex align-center flex-wrap justify-space-between gap-4 py-3">
          <span class="text-sm text-disabled">{{ paginationData }}</span>

          <VPagination
            v-model="currentPage"
            size="small"
            :total-visible="5"
            :length="cashierStore.orderListPaginated?.total"
          />
        </VCardText>
      </div>
    </VCard>
  </div>
</template>


<script setup>
import EditCashierStatusDialog from '@/@core/components/pages/EditDialogs/EditCashierStatusDialog.vue'
import EditCashierStatusPaymentDialog from '@/@core/components/pages/EditDialogs/EditCashierStatusPaymentDialog.vue'
import { useCashierStore } from '@/store/Cashier'
import { useCitiesStore } from "@/store/Cities"
import { useCountriesStore } from "@/store/Countries"
import { useEmployeesStore } from "@/store/Employees"
import { useOrdersStore } from "@/store/Orders"
import { usePaymentTypesStore } from "@/store/PaymentTypes"
import { useSettingsStore } from "@/store/Settings"
import moment from "moment"
import { onMounted, ref, watch } from 'vue'
import { useRouter } from "vue-router"

const citiesListStore = useCitiesStore()
const countriesListStore = useCountriesStore()
const settingsListStore = useSettingsStore()
const employeesStore = useEmployeesStore()
const paymentTypesStore = usePaymentTypesStore()

const searchQuery = ref('')
const cities = ref([])
const customers = ref([])
const countries = ref([])
const router = useRouter()
const cashierStore = useCashierStore()
const ordersListStore = useOrdersStore()
const isFiltered = ref(true)
const paymentTypes = ref([])
const allOrderStatuses = ref([])
const rowPerPage = ref(10)
const totalOrders = ref(0)

const today = new Date()
const threeWeeksFromToday = new Date(today)

threeWeeksFromToday.setDate(today.getDate() + 21)

const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0)
const formattedToday = today.toISOString().split('T')[0]
const yesterday = new Date(today)

yesterday.setDate(today.getDate() - 1)

const formattedYesterday = yesterday.toISOString().split('T')[0]
const formattedThreeWeeksFromToday = threeWeeksFromToday.toISOString().split('T')[0]
const formattedLastDay = lastDayOfMonth.toISOString().split('T')[0]

watch(rowPerPage, () => {
  getOrders()
})

const filters = reactive({
  ref_no: null,
  city_ids: [],
  country_ids: 1,
  order_state_ids: [],
  date_from: formattedYesterday,
  date_to: formattedThreeWeeksFromToday,
  customer_id: null,
  payment_type_ids: [],
})

const _timerId = ref(null)
const isLoadingCustomers = ref(false)
const isCustomersMenuOpen = ref(false)

const updateCutomersMenu = status => {
  isCustomersMenuOpen.value = status
}

const getOrderStatusColorClass = orderStatusCode => {
  if ([204, 209, 4001, 300].includes(orderStatusCode)) {
    return 'text-warning'
  }

  if ([207, 206, 208, 4000].includes(orderStatusCode)) {
    return 'text-error'
  }

  // order confirmed
  if (orderStatusCode == 201) {
    return 'text-success'
  }

  // delivered
  if (orderStatusCode == 203) {
    return 'text-delivered'
  }

  if (orderStatusCode == 205) {
    return 'text-secondary'
  }

  // pending
  if (orderStatusCode == 202) {
    return 'text-pending'
  }

  return ''
}

const searchCustomer = e => {
  clearTimeout(_timerId.value)

  _timerId.value = setTimeout(() => {
    if (!isCustomersMenuOpen.value) return

    isLoadingCustomers.value = true
    customers.value = []
    employeesStore.fetchCustomers({ search: e, wallet: "all" })
      .then(response => {
        customers.value = response.data?.data?.data || []
      })
      .finally(() => {
        isLoadingCustomers.value = false
      })
  }, 800)
}


const filterOrders = () => {
  isFiltered.value = true
  getOrders()
}

const clearFilter = () => {
  filters.ref_no = null
  filters.customer_id = null
  filters.city_ids = []
  filters.country_ids = []
  filters.order_state_ids = []
  filters.date_from = null
  filters.date_to = null
  filters.payment_type_ids = []
  isFiltered.value = false
  filterOrders()
}


const { t } = useI18n()
const dataFrom = ref(1)
const dataTo = ref(1)
const currentPage = ref(1)
const isEditOpen = ref(false)
const isEditPaymentOpen = ref(false)
const selectedOrder = ref({})
const orderStatuses = ref([])

const openEdit = order => {
  isEditOpen.value = true
  selectedOrder.value = order
}

const openEditPayment = order => {
  isEditPaymentOpen.value = true
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
  cashierStore.ordersList({
    page: currentPage.value,
    per_page: rowPerPage.value,
    ...filters,
  })
}

const openDetails = order => {
  router.push(`/cashier/order-details/${order.ref_no}`)
}

const openRefundDetails = order => {
  router.push(`/cashier/order-refund/${order.ref_no}`)
}

onMounted(async () => {
  ordersListStore.fetchOrderStatus().then(response => {
    orderStatuses.value = response.data.data
  })

  ordersListStore.fetchAllOrderStatus().then(response => {
    allOrderStatuses.value = response.data.data
  })

  countriesListStore.fetchCountries().then(response => {
    countries.value = response.data.data
  })

  paymentTypesStore.getAll().then(response => {
    paymentTypes.value = response.data.data
  })

  await getOrders()
})

watch(() => currentPage.value, () => {
  getOrders()
})
</script>

<style>
.text-delivered {
  color: #00bcd4;
}

.text-pending {
  color: #5c6bc0;
}
</style>
