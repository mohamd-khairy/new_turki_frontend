<script setup>
import { useCountriesStore } from "@/store/Countries"
import { useCustomersStore } from "@/store/Customers"
import { useDashboardStore } from "@/store/Dashboard"
import { useEmployeesStore } from "@/store/Employees"
import { useOrdersStore } from "@/store/Orders"

import { useI18n } from "vue-i18n"

const dashboardList = useDashboardStore()
const countriesListStore = useCountriesStore()
const employeesStore = useEmployeesStore()
const customersStore = useCustomersStore()
const ordersListStore = useOrdersStore()

const orders = ref([])
const _timerId = ref(null)
const isLoadingCustomers = ref(false)
const isCustomersMenuOpen = ref(false)
const customers = ref([])
const customer = ref(null)
const countries = ref([])
const carts = reactive([])
const searchQuery = ref('')
const rowPerPage = ref(10)
const currentPage = ref(1)
const totalPage = ref(1)
const totalOrders = ref(0)
const dataFrom = ref(1)
const dataTo = ref(1)
const isLoading = ref(false)
const isFiltered = ref(false)
const length = ref(0)

const filters = reactive({
  customer_id: null,
})


const { t } = useI18n()

const ConvertToArabicNumbers = num => {
  const arabicNumbers = "\u0660\u0661\u0662\u0663\u0664\u0665\u0666\u0667\u0668\u0669"

  return String(num).replace(/[0123456789]/g, d => {
    return arabicNumbers[d]
  })
}

const paginationData = computed(() => {
  return ` عرض من ${ConvertToArabicNumbers(dataFrom.value)} إلي ${ConvertToArabicNumbers(dataTo.value)} من ${ConvertToArabicNumbers(totalOrders.value)} الإجمالي `
})



const getOrders = () => {
  if (filters.customer_id) {
    isLoading.value = true
    customersStore.getOne(filters.customer_id).then(response => {
      customer.value = response.data.data
    })
    ordersListStore.fetchOrders({
      ...filters,
      q: searchQuery.value,
      per_page: rowPerPage.value,
      page: currentPage.value,
      customer_id: filters.customer_id,
    }).then(response => {
      orders.value = response.data.data.data

      totalPage.value = response.data.data.last_page
      dataFrom.value = response.data.data.from
      dataTo.value = response.data.data.to
      totalOrders.value = response.data.data.total

    }).catch(error => {
      console.log(error)
    }).finally(() => {
      isLoading.value = false
    })
  } else {
    orders.value = []
  }
}



const filterCarts = () => {
  isFiltered.value = true
  isLoading.value = true
  getOrders()
}

const clearFilter = () => {
  searchQuery.value = null
  isFiltered.value = false
  filters.customer_id = null

  getOrders()
}

const getOrderStatusColorClass = orderStatusCode => {
  if ([104, 105, 106].includes(orderStatusCode)) {
    return 'text-warning'
  }

  if ([103, 107, 108, 109].includes(orderStatusCode)) {
    return 'text-error'
  }

  // order confirmed
  if (orderStatusCode == 101) {
    return 'text-success'
  }

  // delivered
  if (orderStatusCode == 200) {
    return 'text-delivered'
  }

  if (orderStatusCode == 103) {
    return 'text-secondary'
  }

  // pending
  if (orderStatusCode == 102) {
    return 'text-pending'
  }

  return ''
}

// 👉 Fetch Banners
onMounted(() => {
  getOrders()

  countriesListStore.fetchCountries().then(response => {
    countries.value = response.data.data
  })
})

watch(rowPerPage, () => {
  getOrders()
})

watch(() => currentPage.value, () => {
  getOrders()
})

// 👉 Fetch Banners
watchEffect(() => {
  if (rowPerPage.value) {
    currentPage.value = 1
  }
})

const openDetailsInNewTab = order => {
  window.open(`orders/${order.ref_no}`, '_blank')
}

const searchCustomer = e => {
  customers.value = []
  employeesStore.fetchCustomers({ search: e.target.value, wallet: "all" })
    .then(response => {
      customers.value = response.data?.data?.data
    })
}
</script>

<template>
  <div>
    <VCard :loading="isLoading">
      <VCardTitle class="d-flex align-center">
        <VIcon
          icon="game-icons:vertical-banner"
          size="24"
          color="primary"
        />
        <span class="mx-1"> {{ t('customer-chart') }} </span>
      </VCardTitle>

      <VCol
        cols="12"
        lg="12"
        class="d-flex align-center gap-3 mt-3"
      >
        <div style="width: 10rem;">
          <VSelect
            v-model="rowPerPage"
            variant="outlined"
            :items="[5, 10, 20, 30, 50]"
          />
        </div>

        <div class="icon">
          <VIcon
            icon="clarity:users-line"
            color="primary"
          />
        </div>

        <VSelect
          v-model="filters.customer_id"
          :items="customers"
          label="البحث باسم أو رقم جوال العميل"
          item-title="name_mobile"
          item-value="id"
        >
          <template #prepend-item>
            <VListItem>
              <VListItemContent>
                <VTextField
                  placeholder="البحث باسم أو رقم جوال العميل"
                  @input="searchCustomer"
                />
              </VListItemContent>
            </VListItem>
            <VDivider class="mt-2" />
          </template>
        </VSelect>

        <VBtn
          prepend-icon="solar:filter-bold-duotone"
          :disabled="filters.customer_id == null"
          @click.stop="filterCarts"
        >
          {{ t('Filter') }}
        </VBtn>
        <VBtn
          prepend-icon="healthicons:x"
          :disabled="isLoading || !isFiltered"
          @click.stop="clearFilter"
        >
          {{ t('Clear_Filter') }}
        </VBtn>
      </VCol>

      <VDivider />

      <VCard
        v-if="customer"
        class="mb-8"
      >
        <VCardText>
          <h2 class="py-2 mb-3">
            <VIcon
              color="primary"
              icon="arcticons:destiny-item-manager"
            />
            <span class="ms-2">
              بيانات العميل
            </span>
          </h2>
          <div v-if="customer">
            <VRow class="mb-2">
              <VCol
                v-if="customer.name"
                cols="12"
                md="3"
              >
                <div
                  class=""
                >
                  <VIcon
                    icon="ph:dot-duotone"
                    color="primary"
                    class="ml-2"
                  />
                  <span>
                    الاسم:
                  </span>
                  <VChip
                    size="small"
                    class="font-weight-bold"
                  >
                    {{ customer.name }}
                  </VChip>
                </div>
              </VCol>
              <VCol
                v-if="customer.mobile"
                cols="12"
                md="3"
              >
                <div class="">
                  <VIcon
                    icon="ph:dot-duotone"
                    color="primary"
                    class="ml-2"
                  />
                  <span>
                    رقم التليفون :
                  </span>
                  <VChip
                    size="small"
                    class="font-weight-bold"
                  >
                    {{ customer.mobile }}
                  </VChip>
                </div>
              </VCol>
              <VCol
                v-if="customer.email"
                cols="12"
                md="4"
              >
                <div
                  class=""
                >
                  <VIcon
                    icon="ph:dot-duotone"
                    color="primary"
                    class="ml-2"
                  />
                  <span>
                    البريد الالكتروني :
                  </span>
                  <VChip
                    size="small"
                    class="font-weight-bold"
                  >
                    {{ customer.email }}
                  </VChip>
                </div>
              </VCol>

              <VCol
                v-if="customer.gender != null"
                cols="12"
                md="2"
              >
                <VIcon
                  icon="ph:dot-duotone"
                  color="primary"
                  class="ml-2"
                />
                <span>
                  النوع:
                </span>
                <VChip
                  size="small"
                  class="mx-1 font-weight-bold"
                >
                  {{ customer.gender ? 'ذكر' : 'انثي' }}
                </VChip>
              </VCol>
            </VRow>
            <VRow class="mb-2">
              <VCol
                v-if="customer.age != null"
                cols="12"
                md="2"
              >
                <VIcon
                  icon="ph:dot-duotone"
                  color="primary"
                  class="ml-2"
                />
                <span>
                  السن:
                </span>
                <VChip
                  size="small"
                  class="font-weight-bold"
                >
                  {{ customer.age }}
                </VChip>
              </VCol>
              <VCol
                v-if="customer.country_code"
                cols="12"
                md="3"
              >
                <VIcon
                  icon="ph:dot-duotone"
                  color="primary"
                  class="ml-2"
                />
                <span>
                  البلد:
                </span>
                <VChip
                  size="small"
                  class="font-weight-bold"
                >
                  {{ customer.country_code == 'SA' ? 'السعودية' : 'الامارات' }}
                </VChip>
              </VCol>
            </VRow>
          </div>
        </VCardText>
      </VCard>


      <VDivider />
      <VTable
        v-if="orders"
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
              {{ t('forms.id') }}
            </th>
            <th
              scope="col"
              class="font-weight-semibold"
            >
              {{ t('forms.order_state_ar') }}
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
              {{ t('forms.payment_type_name') }}
            </th>
            <th
              scope="col"
              class="font-weight-semibold"
            >
              مسئول المبيعات
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
              {{ t('forms.total_amount_after_discount') }}
            </th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="(order) in orders"
            :key="order.id"
          >
            <td>
              <VTooltip text="فتح الطلب في نافذة جديدة">
                <template #activator="{ props }">
                  <VBtn
                    v-bind="props"
                    variant="plain"
                    color="default"
                    size="x-medium"
                    class="font-weight-bold"
                    @click="openDetailsInNewTab(order)"
                  >
                    {{ order.ref_no }}
                  </VBtn>
                </template>
              </VTooltip>
            </td>
            <td>
              <VChip
                style="cursor: pointer;"
                :class="getOrderStatusColorClass(order.order_state_id)"
              >
                {{ order.order_state_ar }}
              </VChip>
            </td>
            <td>
              <VChip
                style="cursor: pointer;"
                :class="{ 'text-error': order.paid == 0, 'text-success': order.paid == 1 }"
              >
                {{ order.paid == 1 ? "مدفوع" : "غير مدفوع" }}
              </VChip>
            </td>
            <td>
              {{ order.payment_type_name }}
            </td>
            <td>
              <span v-if="order.sales_officer_name">
                {{ order.sales_officer_name }}
              </span>
              <span v-else>--</span>
            </td>
            <td>
              {{ order.delivery_date }}
            </td>
            <td>
              {{ ConvertToArabicNumbers(Intl.NumberFormat().format(parseFloat(order.total_amount_after_discount) +
                parseFloat(order.wallet_amount_used ?? 0))) }}
            </td>
          </tr>
        </tbody>


        <tfoot v-show="!isLoading && orders.length == 0">
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

      <VCardText
        v-if="orders.length > 0"
        class="d-flex align-center flex-wrap justify-space-between gap-4 py-3"
      >
        <span class="text-sm text-disabled">{{ paginationData }}</span>

        <VPagination
          v-model="currentPage"
          size="small"
          :total-visible="5"
          :length="totalPage"
          @next="selectedRows = []"
          @prev="selectedRows = []"
        />
      </VCardText>
    </VCard>
  </div>
</template>
