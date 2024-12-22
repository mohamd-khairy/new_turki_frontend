<script setup>
import { useCitiesStore } from "@/store/Cities";
import { useEmployeesStore } from "@/store/Employees";
import { useInvoicesStore } from "@/store/Invoices";
import moment from "moment/moment";

const invoicesStore = useInvoicesStore()
const citiesListStore = useCitiesStore()
const employeesStore = useEmployeesStore()
const { t } = useI18n()

const searchQuery = ref('')
const rowPerPage = ref(5)
const currentPage = ref(1)
const totalPage = ref(1)
const dataFrom = ref(1)
const dataTo = ref(1)
const totalItems = ref(0)
const invoiceItems = ref([])
const selectedRows = ref([])
const isAddOpen = ref(false)
const isDeleteOpen = ref(false)
const selectedItem = ref({})
const isEditOpen = ref(false)
const isPayInvoice = ref(false)
const isLoading = ref(false)
const isFiltered = ref(false)
const cities = ref([])
const employees = ref([])

const filters = reactive({
  city_id: null,
  user_id: null,
  date: null,
})

const getInvoices = () => {
  isLoading.value = true

  invoicesStore.getAll({
    ...filters,
    q: searchQuery.value,
    per_page: rowPerPage.value,
    page: currentPage.value,
  }).then(response => {
    invoiceItems.value = response.data?.data?.data
    totalPage.value = response.data.data.last_page
    dataFrom.value = response.data.data.from
    dataTo.value = response.data.data.to
    totalItems.value = response.data.data.total
  }).catch(error => {
    console.log(error)
  }).finally(() => {
    isLoading.value = false
  })
}

watchEffect(() => {
  if (rowPerPage.value) {
    currentPage.value = 1
  }
})

const paginationData = computed(() => {
  return ` عرض من ${ConvertToArabicNumbers(dataFrom.value)} إلي ${ConvertToArabicNumbers(dataTo.value)} من ${ConvertToArabicNumbers(totalItems.value)} الإجمالي `
})

const openDelete = store => {
  isDeleteOpen.value = true
  selectedItem.value = store
}

const openEdit = item => {
  isEditOpen.value = true
  selectedItem.value = {
    ...item,
    stocks: item.stocks.map(stock => ({
      id: stock.id,
      product_id: stock.product_id,
      product_name: stock.product_name,
      name_ar: stock.product_name,
      name: sstock.product_name,
      store_id: stock.store.id,
      quantity: stock.quantity,
      price: stock.price,
    })),
  }
}

const openPayInvoice = store => {
  isPayInvoice.value = true
  selectedItem.value = store
}


const filterItems = () => {
  isFiltered.value = true
  getInvoices()
}

const clearFilter = () => {
  filters.city_id = null
  filters.user_id = null
  filters.date = null

  getInvoices()
}

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

watch(rowPerPage, () => {
  getInvoices()
})

watch(() => currentPage.value, () => {
  getInvoices()
})

onMounted(() => {
  getInvoices()

  citiesListStore.fetchCities({ pageSize: -1 }).then(response => {
    cities.value = response.data.data
  })

  employeesStore.fetchEmployees({ pageSize: -1 }).then(response => {
    employees.value = response.data.data?.data
  })
})
</script>

<template>
  <div>
    <VCard class="mb-5 pa-5">
      <VForm @submit.stop>
        <VRow justify="space-between">
          <VCol
            cols="12"
            lg="8"
          >
            <VRow>
              <VCol
                cols="12"
                lg="4"
                md="3"
                sm="6"
                class="d-flex align-center gap-3"
              >
                <div class="icon">
                  <VIcon
                    icon="solar:city-broken"
                    color="primary"
                  />
                </div>
                <VSelect
                  v-model="filters.city_id"
                  :items="cities"
                  label="المدينة"
                  item-title="name_ar"
                  item-value="id"
                />
              </VCol>
              <VCol
                cols="12"
                lg="4"
                md="3"
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
                  v-model="filters.user_id"
                  :items="employees"
                  label="المسئول"
                  item-title="username"
                  item-value="id"
                />
              </VCol>
              <VCol
                cols="12"
                lg="4"
                md="3"
                sm="6"
                class="d-flex align-center gap-3"
              >
                <div class="icon">
                  <VIcon
                    icon="clarity:users-line"
                    color="primary"
                  />
                </div>
                <VTextField
                  v-model="filters.date"
                  label="تاريخ الفاتورة"
                  type="date"
                />
              </VCol>
            </VRow>
          </VCol>
          <VCol
            cols="12"
            lg="4"
            class="d-flex align-center justify-end gap-3"
          >
            <VBtn
              v-if="!isLoading"
              prepend-icon="solar:filter-bold-duotone"
              :disabled="isLoading"
              @click.stop="filterItems"
            >
              {{ t('Filter') }}
            </VBtn>
            <VBtn
              v-else
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
              :disabled="isLoading"
              @click.stop="clearFilter"
            >
              {{ t('Clear_Filter') }}
            </VBtn>
          </VCol>
        </VRow>
      </VForm>
    </VCard>
    <VCard :loading="isLoading">
      <VCardTitle class="d-flex align-center gap-2">
        <VIcon
          icon="uil:invoice"
          size="24"
          color="primary"
        />
        <span class="mx-1">الفواتير</span>
      </VCardTitle>
      <VCardText class="d-flex align-center flex-wrap gap-2 py-4">
        <!-- 👉 Rows per page -->
        <div style="width: 5rem;">
          <VSelect
            v-model="rowPerPage"
            variant="outlined"
            :items="[5, 10, 20, 30, 50, 100]"
          />
        </div>
        <!--         👉 Create product :to="{ name: 'apps-product-add' }" -->
        <VBtn
          prepend-icon="tabler-plus"
          :disabled="isLoading"
          @click="isAddOpen = true"
        >
          إضافة فاتورة
        </VBtn>

        <VSpacer />
      </VCardText>

      <VDivider />

      <VTable class="text-no-wrap product-list-table">
        <thead>
          <tr>
            <th
              scope="col"
              class="font-weight-semibold"
            >
              #
            </th>
            <th
              scope="col"
              class="font-weight-semibold"
            >
              سعر الفاتورة
            </th>
            <th
              scope="col"
              class="font-weight-semibold"
            >
              تاريخ الفاتورة
            </th>
            <th
              scope="col"
              class="font-weight-semibold"
            >
              الضريبة
            </th>
            <th
              scope="col"
              class="font-weight-semibold"
            >
              حالة الدفع
            </th>
            <th
              scope="col"
              class="font-weight-semibold"
            >
              المسئول
            </th>
            <th
              scope="col"
              class="font-weight-semibold"
            >
              المزود
            </th>
            <th
              scope="col"
              class="font-weight-semibold"
            >
              {{ t('forms.actions') }}
            </th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="(store, i) in invoiceItems"
            :key="store.id"
          >
            <td>
              {{ store.id }}
            </td>
            <td>
              {{ store.invoice_price }}
            </td>
            <td>
              {{ store.date }}
            </td>
            <td>
              <span v-if="store.tax">{{ store.tax }}</span>
              <span v-else>--</span>
            </td>
            <td>
              <VChip :class="{ 'text-error': store.paid == 0, 'text-success': store.paid == 1 }">
                {{ store.paid == 1 ? "مدفوع" : "غير مدفوع" }}
              </VChip>
            </td>
            <td>
              {{ store.user?.username }}
            </td>
            <td>
              {{ store.supplier?.name }}
            </td>
            <td class="d-flex align-center gap-2">
              <div v-if="!store.paid">
                <VTooltip text="سداد الفاتورة">
                  <template #activator="{ props }">
                    <VBtn
                      v-bind="props"
                      icon
                      variant="plain"
                      color="default"
                      size="x-small"
                      @click="openPayInvoice(store)"
                    >
                      <!-- :loading="currentPaidInvoice == store.id" -->
                      <VIcon
                        :size="22"
                        icon="material-symbols:payments-outline-sharp"
                      />
                    </VBtn>
                  </template>
                </VTooltip>
              </div>
              <div
                v-else
                class="px-4"
              />
              <VBtn
                icon
                variant="plain"
                color="default"
                size="x-small"
                @click="openEdit(store)"
              >
                <VIcon
                  :size="22"
                  icon="tabler-pencil"
                />
              </VBtn>
              <VBtn
                icon
                variant="plain"
                color="default"
                size="x-small"
                @click="openDelete(store)"
              >
                <VIcon
                  :size="22"
                  icon="tabler-trash"
                />
              </VBtn>
            </td>
          </tr>
        </tbody>

        <!-- 👉 table footer  -->
        <tfoot v-show="!invoiceItems.length">
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

      <!-- SECTION Pagination -->
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

    <AddInvoiceDialog
      v-if="isAddOpen"
      v-model:is-add-open="isAddOpen"
      @refreshTable="getInvoices"
    />

    <EditInvoiceDialog
      v-if="isEditOpen"
      v-model:is-edit-open="isEditOpen"
      :item="selectedItem"
      @refreshTable="getInvoices"
    />

    <DeleteInvoiceDialog
      v-if="isDeleteOpen"
      v-model:is-delete-open="isDeleteOpen"
      :item="selectedItem"
      @refreshTable="getInvoices"
    />

    <PayInvoiceDialog
      v-if="isPayInvoice"
      v-model:is-pay-open="isPayInvoice"
      :item="selectedItem"
      @refreshTable="getInvoices"
    />
  </div>
</template>
