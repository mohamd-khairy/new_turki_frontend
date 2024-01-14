<script setup>
import { hasRole } from '@/helpers'
import { useAuthStore } from "@/store/Auth"
import { useCitiesStore } from "@/store/Cities"
import { useCountriesStore } from "@/store/Countries"
import { useEmployeesStore } from "@/store/Employees"
import { useOrdersStore } from "@/store/Orders"
import { usePaymentTypesStore } from "@/store/PaymentTypes"
import { useSettingsStore } from "@/store/Settings"
import moment from "moment"
import { ref } from "vue"
import { useI18n } from "vue-i18n"


const { t } = useI18n()
const router = useRouter()
const authStore = useAuthStore()

const ordersListStore = useOrdersStore()
const citiesListStore = useCitiesStore()
const countriesListStore = useCountriesStore()
const settingsListStore = useSettingsStore()
const employeesStore = useEmployeesStore()
const paymentTypesStore = usePaymentTypesStore()
const searchQuery = ref('')
const searchTerm = ref('')
const rowPerPage = ref(10)
const currentPage = ref(1)
const totalPage = ref(1)
const totalOrders = ref(0)
const orders = ref([])
const cities = ref([])
const customers = ref([])
const countries = ref([])
const deliveryPeriods = ref([])
const orderStatuses = ref([])
const allOrderStatuses = ref([])
const dataFrom = ref(1)
const dataTo = ref(1)
const selectedRows = ref([])
const isAddOpen = ref(false)
const isOpen = ref(false)
const selectedOrder = ref({})
const isEditOpen = ref(false)
const isPrinting = ref(false)

const isLoading = ref(false)
const isFiltered = ref(false)
const paymentTypes = ref([])
const salesAgents = ref([])
const salesRepresentatives = ref([])
const isAssignDeligateDialog = ref(false)
const allOrdersSelected = ref(false)
const currentPrintedInvoice = ref(null);

const filters = reactive({
  city_ids: [],
  country_ids: [],
  order_state_ids: [],
  date_from: null,
  date_to: null,
  delivery_date: null,
  customer_id: null,
  delivery_period_id: null,
  payment_type_ids: [],
  sales_agent_id: null,
  sales_representative_id: null,
})

const selectedOrders = computed(() => orders.value.filter(order => order.selected).map(order => order.id))

const selectAllOrders = selectedAll => {
  orders.value = orders.value.map(order => {
    order.selected = selectedAll
    
    return order
  })
}

watch(selectedOrders, value => {
  if(value.length < orders.value.length) {
    allOrdersSelected.value = false
  }
})

const resetSelections = () => {
  allOrdersSelected.value = false
}

const openAssignDeligateDialog = () => {
  isAssignDeligateDialog.value = true
}

const authUser = computed(() => authStore.currentUser)

const canEditOrder = order => {
  if(hasRole(['general_manager', 'production_manager', 'production_supervisor', 'admin'])) {
    return true
  }

  if(
    hasRole('store_manager') && 
    order.sales_representative_id == authUser.value?.id
  ) {
    return true
  }

  return false
}

const canTakeOrder = order => {
  if(hasRole(['store_manager']) && !order.sales_representative_id) {
    return true
  }

  return false
}

const canChangeOrderStatus = computed(() => hasRole(['production_manager', 'production_supervisor', 'logistic_manager', 'admin', 'general_manager']))

const delegateCanUpdateOrderStatus = order => {
  return hasRole('delegate') && order.driver_id == authUser.value?.id
}

const storeMangerCanUpdateOrderStatus = order => {
  return hasRole('store_manager') && order.sales_representative_id == authUser.value?.id
}

const printOrderInvoice = async (order) => {
  if(hasRole(['production_manager'])) {
    try {
      currentPrintedInvoice.value = order.ref_no;
      await ordersListStore.editOrder({is_printed: true})
    } catch (error) {
      console.error(error);
    } finally {
      currentPrintedInvoice.value = null;
    }
  }

  router.push(`orders/${order.ref_no}/invoice`);
}

watch(() => filters.country_ids, (newVal, oldVal) => {
  citiesListStore.fetchCitiesByCountry(filters.country_ids).then(response => {
    cities.value = response.data.data
  })
})

const getOrders = () => {
  isLoading.value = true
  ordersListStore.fetchOrders({
    ...filters,
    q: searchQuery.value,
    per_page: rowPerPage.value,
    page: currentPage.value,
  }).then(response => {
    orders.value = response.data.data.data
    totalPage.value = response.data.data.last_page
    dataFrom.value = response.data.data.from
    dataTo.value = response.data.data.to
    totalOrders.value = response.data.data.total
    isLoading.value = false
    
    resetSelections()
  }).catch(error => {
    isLoading.value = false
    console.log(error)
  })
}

watch(rowPerPage, () => {
  getOrders()
})

watch(() => currentPage.value, () => {
  getOrders()
})

const _timerId = ref(null)
const isLoadingCustomers = ref(false)

const searchCustomer = e => {
  clearTimeout(_timerId.value)
  _timerId.value = setTimeout(() => {
    isLoadingCustomers.value = true
    employeesStore.fetchCustomers({ search: e.target.value, wallet: "all" })
      .then(response => {
        customers.value = response.data?.data?.data || []
      })
      .finally(() => {
        isLoadingCustomers.value = false
      })
  }, 800)
}


// 👉 Computing pagination data
const paginationData = computed(() => {
  return ` عرض من ${ConvertToArabicNumbers(dataFrom.value)} إلي ${ConvertToArabicNumbers(dataTo.value)} من ${ConvertToArabicNumbers(totalOrders.value)} الإجمالي `
})

const activeActionOrderId = ref(null)

const takeOrder = order => {
  activeActionOrderId.value = order.id
  ordersListStore.takeOrder(order.id).then(response => {
    getOrders()

    settingsListStore.alertColor = "success"
    settingsListStore.alertMessage = "تم تعديل حالة الطلب بنجاح"
    settingsListStore.isAlertShow = true
    setTimeout(() => {
      settingsListStore.isAlertShow = false
      settingsListStore.alertMessage = ""
      isLoading.value = false
    }, 1000)
  })
    .catch(error => {
      if (error.response.data.errors) {
        const errs = Object.keys(error.response.data.errors)

        errs.forEach(err => {
          settingsListStore.alertMessage = t(`errors.${err}`)
        })
      } else {
        settingsListStore.alertMessage = "حدث خطأ ما !"
      }
    
      isLoading.value = false
      settingsListStore.alertColor = "error"
      settingsListStore.isAlertShow = true
      setTimeout(() => {
        settingsListStore.isAlertShow = false
        settingsListStore.alertMessage = ""
      }, 2000)
    }).finally(() => {
      activeActionOrderId.value = null
    })

}

const filterOrders = () => {
  isFiltered.value = true
  getOrders()
}

const clearFilter = () => {
  filters.city_ids = []
  filters.country_ids = []
  filters.order_state_ids = []
  filters.date_from = null
  filters.date_to = null
  filters.delivery_date = null
  filters.delivery_period_id = null
  filters.customer_id = null
  filters.payment_type_ids = []
  filters.sales_agent_id = null
  filters.sales_representative_id = null
  filterOrders()
}

const openDetails = order => {
  router.push(`orders/${order.ref_no}`)
}

const closePriniting = order => {
  isPrinting.value = false
  selectedOrder.value = {}
}

const openEdit = order => {
  isEditOpen.value = true
  selectedOrder.value = order
}

// Functions
const ConvertToArabicNumbers = num => {
  const arabicNumbers = "\u0660\u0661\u0662\u0663\u0664\u0665\u0666\u0667\u0668\u0669"

  return String(num).replace(/[0123456789]/g, d => {
    return arabicNumbers[d]
  })
}

const formatDateTime = data => {
  let date = moment(data).format("DD-MM-YYYY")
  let time = moment(data).format("hh:mm:ss A")

  return { date, time }
}

onMounted(() => {
  getOrders()
  ordersListStore.fetchOrderStatus().then(response => {
    orderStatuses.value = response.data.data
  })
  ordersListStore.fetchAllOrderStatus().then(response => {
    allOrderStatuses.value = response.data.data
  })
  countriesListStore.fetchCountries().then(response => {
    countries.value = response.data.data
  })
  settingsListStore.fetchDelivery_Periods().then(response => {
    deliveryPeriods.value = response.data.data
  })
 
  paymentTypesStore.getAll().then(response => {
    paymentTypes.value = response.data.data
  })
  employeesStore.fetchEmployees({ pageSize: 100, role_name: 'delegate' }).then(response => {
    salesAgents.value = response.data?.data?.data || []
  })
  employeesStore.fetchEmployees({ pageSize: 100, role_name: 'store_manager' }).then(response => {
    salesRepresentatives.value = response.data?.data?.data || []
  })

})
</script>

<template>
  <div>
    <div>
      <VCard class="mb-5 pa-5">
        <VRow>
          <VCol
            cols="12"
            lg="3"
            md="4"
            sm="6"
          >
            <VRow>
              <VCol
                cols="12"
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
                cols="12"
                class="d-flex align-center gap-3"
              >
                <div class="icon">
                  <VIcon
                    icon="solar:city-broken"
                    color="primary"
                  />
                </div>
                <VSelect
                  v-model="filters.city_ids"
                  :items="cities"
                  :label="t('forms.cities')"
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
            lg="3"
            md="4"
            sm="6"
          >
            <VRow>
              <VCol
                cols="12"
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
              </VCol>
              <VCol
                cols="12"
                class="d-flex align-center gap-3"
              >
                <div class="icon">
                  <VIcon
                    icon="clarity:users-line"
                    color="primary"
                  />
                </div>
                <VSelect
                  v-model="filters.customer_id"
                  :items="customers"
                  label="العميل"
                  item-title="name_mobile"
                  item-value="id"
                  :disabled="isLoading || isLoadingCustomers"
                  :loading="isLoadingCustomers"
                >
                  <template #prepend-item>
                    <VTextField
                      v-model="searchTerm"
                      class="mx-2"
                      clearable
                      placeholder="ابحث عن العميل"
                      @input="searchCustomer"
                    />
                    <VDivider class="mt-2" />
                  </template>
                </VSelect>
              </VCol>
            </VRow>
          </VCol>
          <VCol
            cols="12"
            lg="3"
            md="4"
            sm="6"
          >
            <VRow>
              <VCol
                cols="12"
                class="d-flex align-center gap-3"
              >
                <div class="icon">
                  <VIcon
                    icon="fluent-mdl2:date-time"
                    color="primary"
                  />
                </div>
                <VSelect
                  v-model="filters.delivery_period_id"
                  :items="deliveryPeriods"
                  :label="t('Delivery_Periods')"
                  item-title="name_ar"
                  item-value="id"
                  :disabled="isLoading"
                />
              </VCol>
              <VCol
                cols="12"
                class="d-flex align-center gap-3"
              >
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
            lg="3"
            md="4"
            sm="6"
          >
            <VRow>
              <VCol
                cols="12"
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
              </VCol>
              <VCol
                cols="12"
                class="d-flex align-center gap-3"
              >
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
            lg="3"
            md="4"
            sm="6"
          >
            <VRow>
              <VCol
                cols="12"
                class="d-flex align-center gap-3"
              >
                <div class="icon">
                  <VIcon
                    icon="fluent-mdl2:date-time"
                    color="primary"
                  />
                </div>
                <VTextField
                  v-model="filters.delivery_date"
                  type="date"
                  :label="t('forms.delivery_date')"
                  :disabled="isLoading"
                />
              </VCol>
            </VRow>
          </VCol>
          <VCol
            cols="12"
            lg="3"
            md="4"
            sm="6"
            class="d-flex align-center gap-3"
          >
            <div class="icon">
              <VIcon
                icon="clarity:users-line"
                color="primary"
              />
            </div>
            <VSelect
              v-model="filters.sales_agent_id"
              :items="salesAgents"
              label="مندوب المبيعات"
              item-title="username"
              item-value="id"
              :disabled="isLoading"
            />
          </VCol>
          <VCol
            cols="12"
            lg="3"
            md="4"
            sm="6"
            class="d-flex align-center gap-3"
          >
            <div class="icon">
              <VIcon
                icon="clarity:users-line"
                color="primary"
              />
            </div>
            <VSelect
              v-model="filters.sales_representative_id"
              :items="salesRepresentatives"
              label="مسئول المبيعات"
              item-title="username"
              item-value="id"
              :disabled="isLoading"
            />
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
      </VCard>
      <VCard :loading="isLoading">
        <VCardTitle class="d-flex align-center">
          <VIcon
            icon="solar:delivery-broken"
            size="24"
            color="primary"
          />
          <span class="mx-1">{{ t('Orders') }}</span>
        </VCardTitle>
        <VCardText class="d-flex align-center flex-wrap gap-2 py-4">
          <!-- 👉 Rows per page -->
          <div style="width: 5rem;">
            <VSelect
              v-model="rowPerPage"
              variant="outlined"
              :items="[5, 10, 20, 30, 50]"
              :disabled="isLoading"
            />
          </div>
          <VBtn
            v-if="hasRole(['general_manager', 'store_manager', 'admin'])"
            prepend-icon="tabler-plus"
            :disabled="isLoading"
            @click="isAddOpen = true"
          >
            إضافة طلب
          </VBtn>

          <div v-if="hasRole(['logistic_manager', 'admin'])">
            <Transition>
              <div
                v-if="selectedOrders.length"
                class="d-flex gap-2 mx-4"
              >
                <VBtn @click="openAssignDeligateDialog">
                  تعيين مندوب
                </VBtn>
              </div>
            </Transition>
          </div>

          <VSpacer />
        </VCardText>

        <VDivider />
        <!--
          v-model="selected"
          <v-data-table
          :items="orders"
          item-value="id"
          show-select
          ></v-data-table> 
        -->
        <VTable 
          class="text-no-wrap product-list-table text-center"
        >
          <thead>
            <tr>
              <th
                v-if="hasRole(['logistic_manager', 'admin'])"
                scope="col"
                class="font-weight-semibold"
              >
                <VCheckbox
                  v-model="allOrdersSelected"
                  @update:modelValue="selectAllOrders"
                />
              </th>
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
                {{ t('forms.customer_name') }}
              </th>
              <th
                scope="col"
                class="font-weight-semibold"
              >
                {{ t('forms.address_address') }}
              </th>
              <th
                scope="col"
                class="font-weight-semibold"
              >
                المدينة
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
                المندوب
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
                {{ t('forms.order_state_ar') }} <br>
                <span
                  v-if="canChangeOrderStatus || hasRole(['delegate', 'store_manager'])" 
                  class="text-primary"
                >( {{ t('forms.click_change_status') }} )</span>
              </th>
              <th
                scope="col"
                class="font-weight-semibold"
              >
                {{ t('forms.order_payment_status') }}
              </th>
              <!--
                <th
                scope="col"
                class="font-weight-semibold"
                >
                {{ t('forms.order_subtotal') }}
                </th>
              -->
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
                {{ t('forms.paid_amount') }}
              </th>
              <th
                scope="col"
                class="font-weight-semibold"
              >
                {{ t('forms.remain_amount') }}
              </th>
              <th
                scope="col"
                class="font-weight-semibold"
              >
                {{ t('forms.total_amount_after_discount') }}
              </th>

              <!--
                <th
                scope="col"
                class="font-weight-semibold"
                >
                {{ t('forms.created_at') }}
                </th>
              -->
              <th
                scope="col"
                class="font-weight-semibold"
              >
                {{ t('forms.actions') }}
              </th>
            </tr>
          </thead>

          <tbody v-if="!isLoading">
            <tr
              v-for="(order, i) in orders"
              :key="order.id"
            >
              <td v-if="hasRole(['logistic_manager', 'admin'])">
                <VCheckbox v-model="order.selected" />
              </td>
              <td>
                {{ order.ref_no }}
              </td>
              <td>
                {{ order.customer_name + '(' + order.customer_mobile +')' }}
              </td>
              <td>
                {{ order.address_address.toString().length > 20 ? order.address_address.toString().slice(0,20) + "..." : order.address_address }}
              </td>
              <td>
                <span v-if="order.city_name">
                  {{ order.city_name }}
                </span>
                <span v-else>--</span>
              </td>
              <td>
                <span v-if="order.sales_officer_name">
                  {{ order.sales_officer_name }}
                </span>
                <span v-else>--</span>
              </td>
              <td>
                <span v-if="order.driver_name">
                  {{ order.driver_name }}
                </span>
                <span v-else>--</span>
              </td>
              <td>
                {{ ConvertToArabicNumbers(formatDateTime(order.delivery_date).date) }}
              </td>
              <td>
                <span
                  v-if="canChangeOrderStatus || storeMangerCanUpdateOrderStatus(order) || delegateCanUpdateOrderStatus(order)" 
                  @click="openEdit(order)"
                >
                  <VChip style="cursor: pointer;">
                    {{ order.order_state_ar }}
                  </VChip>
                </span>
                <span v-else>
                  <VChip>
                    {{ order.order_state_ar }}
                  </VChip>
                </span>
              </td>
              <td>
                <VChip
                  style="cursor: pointer;"
                  :class="{'text-error': order.paid == 0, 'text-success': order.paid == 1}"
                >
                  {{ order.paid == 1 ? "مدفوع" : "غير مدفوع" }}
                </VChip>
              </td>
              <!--
                <td>
                {{ ConvertToArabicNumbers(Intl.NumberFormat().format(order.order_subtotal)) }}
                </td>
              -->
              <td>
                {{ order.payment_type_name }}
              </td>
              <td>
                <span v-if="order.payment_price">
                  {{ ConvertToArabicNumbers(Intl.NumberFormat().format(order.payment_price)) }}
                </span>
                <span v-else>--</span>
              </td>
            
              <td>
                <span v-if="order.remain_amount">
                  {{ ConvertToArabicNumbers(Intl.NumberFormat().format(order.remain_amount)) }}
                </span>
                <span v-else>--</span>
              </td>
                
              <td>
                {{ ConvertToArabicNumbers(Intl.NumberFormat().format(order.total_amount_after_discount)) }}
              </td>
              <!--
                <td>
                {{ ConvertToArabicNumbers(formatDateTime(order.created_at).date) }}
                </td>
              -->
              <td>
                <div class="d-flex align-center gap-2">
                  <div v-if="!hasRole(['production_manager']) || (hasRole(['production_manager']) && !order.is_printed)">
                    <VTooltip text="طباعة الفاتورة">
                      <template #activator="{ props }">
                        <VBtn
                          v-bind="props"
                          icon
                          variant="plain"
                          color="default"
                          size="x-small"
                          @click="printOrderInvoice(order)"
                          :loading="currentPrintedInvoice == order.ref_no"
                        >
                          <VIcon
                            :size="22"
                            icon="iconamoon:invoice-thin"
                          />
                        </VBtn>
                      </template>
                    </VTooltip>
                  </div>
                  <VTooltip
                    v-if="canEditOrder(order)"
                    text="تفاصيل الطلب"
                  >
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
                    v-if="canTakeOrder(order)"
                    text="اخذ الطلب"
                  >
                    <template #activator="{ props }">
                      <VBtn
                        v-bind="props"
                        icon
                        variant="plain"
                        color="default"
                        size="x-small"
                        :loading="activeActionOrderId == order.id"
                        :disabled="activeActionOrderId == order.id || activeActionOrderId"
                        @click="takeOrder(order)"
                      >
                        <VIcon
                          :size="22"
                          icon="material-symbols:swipe-down-outline"
                        />
                      </VBtn>
                    </template>
                  </VTooltip>
                </div>
              </td>
            </tr>
          </tbody>

          <!-- 👉 table footer  -->
          <tfoot v-show="orders.length == 0">
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
        <!-- !SECTION -->

        <VDivider />

        <VCardText class="d-flex align-center flex-wrap justify-space-between gap-4 py-3">
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

    <OrderInvoice
      v-if="isPrinting"
      :order-details="selectedOrder"
      @close="closePriniting"
    />
    
    <AddOrdersDialog
      v-model:is-add-open="isAddOpen"
      :countries="countries"
      :cities="cities"
      :customers="customers"
      :delivery-periods="deliveryPeriods"
      @refreshTable="getOrders"
    />
    <EditOrderStatusDialog
      v-model:is-edit-open="isEditOpen"
      :item="selectedOrder"
      @refreshTable="getOrders"
    />

    <AssignOrderDeligationDialog
      v-model:is-open="isAssignDeligateDialog"
      :order-ids="selectedOrders"
      @refreshTable="getOrders"
    />
  </div>
</template>

