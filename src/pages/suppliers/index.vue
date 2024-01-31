<script setup>
import { useCitiesStore } from "@/store/Cities";
import { useEmployeesStore } from "@/store/Employees";
import { useSuppliersStore } from "@/store/Suppliers";
// import DateRangeFilter from '@core/components/DateRangeFilter';
import moment from "moment/moment";
// import printJS from 'print-js';
import '@vuepic/vue-datepicker/dist/main.css';

const suppliersStore = useSuppliersStore()
const citiesListStore = useCitiesStore()
const employeesStore = useEmployeesStore()

const searchQuery = ref('')
const rowPerPage = ref(5)
const currentPage = ref(1)
const totalPage = ref(1)
const dataFrom = ref(1)
const dataTo = ref(1)
const totalItems = ref(0)
const suppliersItems = ref([])
const selectedRows = ref([])
const isAddOpen = ref(false)
const isDeleteOpen = ref(false)
const selectedItem = ref({})
const isEditOpen = ref(false)
const isLoading = ref(false)
const isFiltered = ref(false)
const cities = ref([])
const employees = ref([])

const filters = reactive({
  search: null,
  city_id: null,
  date_from: null,
  date_to: null,
})

const { t } = useI18n()
const router = useRouter()
const dateFilter = ref("");
const updateRangeDate = ([startDate, endDate]) => {
  filters.start_date = startDate;
  filters.end_date = endDate;
  getSuppliers();
}

const getSuppliers = () => {
  isLoading.value = true
  // products.value = []
  suppliersStore.getAll({
    ...filters,
    // q: searchQuery.value,
    per_page: rowPerPage.value,
    page: currentPage.value,
  }).then(response => {
    suppliersItems.value = response.data?.data?.data;
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

const openDelete = (store) => {
  isDeleteOpen.value = true
  selectedItem.value = store
}

const openEdit = (store) => {
  isEditOpen.value = true
  selectedItem.value = store
}

const filterItems = () => {
  isFiltered.value = true
  getSuppliers();
}

const clearFilter = () => {
  filters.search = null
  filters.city_id = null
  filters.date_from = null
  filters.date_to = null
  
  getSuppliers();
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

const printSuppliers = () => {
  const queryParams = new URLSearchParams();

  for (const key in filters) {
    if (filters[key] !== null && filters[key] !== undefined) {
      queryParams.append(key, filters[key]);
    }
  }

  const queryString = queryParams.toString();
  const finalUrl = queryString ? `suppliers/reports?${queryString}` : 'suppliers/reports';
  window.open(finalUrl, '_blank');
  // printJS({
	// 	printable: suppliersItems.value,
	// 	type: 'json',
	// 	properties: [
  //     { field: 'name', displayName: 'الاسم'},
  //     { field: 'mobile', displayName: 'الهاتف'},
  //     { field: 'balance', displayName: 'الرصيد'}
  //   ],
	// 	header: '<h2 class="custom-h3">بيانات الموردين</h2>',
  //   headerStyle: `
  //     th { padding: 10px 15px; }
  //   `,
	// 	style: `
  //     body { 
  //       direction: rtl; text-align: right; 
  //       font-family: "Tahoma", sans-serif; 
  //       line-height: 1.5;
  //     }
  //     h2 { text-transform: underline; }
  //     td, th { padding: 10px 15px; }
  //   `
	// })
}

watch(rowPerPage, () => {
  getSuppliers();
})

watch(() => currentPage.value, () => {
  getSuppliers();
})

onMounted(() => {
  getSuppliers();

  citiesListStore.fetchCities({}).then(response => {
    cities.value = response?.data.data
  })

  employeesStore.fetchEmployees({ pageSize: -1 }).then(response => {
    employees.value = response.data.data?.data;
  })
})
</script>

<template>
  <div>
    <VCard class="mb-5 pa-5">
      <VForm @submit.stop>
        <VRow justify="space-between">
          <VCol cols="12" lg="8">
            <VRow>
              <VCol cols="12" sm="6" class="d-flex align-center gap-3">
                <div class="icon">
                  <VIcon icon="clarity:users-line" color="primary"></VIcon>
                </div>
                <VTextField  v-model="filters.search" 
                  label="البحث باسم المورد"
                  :disabled="isLoading"
                />
              </VCol>
              <VCol cols="12" sm="6" class="d-flex align-center gap-3">
                <div class="icon">
                  <VIcon icon="solar:city-broken" color="primary"></VIcon>
                </div>
                <VSelect
                  v-model="filters.city_id"
                  :items="cities"
                  label="المنطقة"
                  item-title="name_ar"
                  item-value="id"
                />
              </VCol>
             
            </VRow>
          </VCol>
          <VCol
            cols="12"
            lg="8"
          >
            <VRow>
              <VCol
                cols="12"
                sm="6"
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
                sm="6"
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
          <VCol cols="12"
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
        <VIcon icon="heroicons:truck"
          size="24"
          color="primary"
        ></VIcon>
        <span class="mx-1">الموردون</span>
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
        <!--         👉 Create product :to="{ name: 'apps-product-add' }"-->
        <VBtn
          prepend-icon="tabler-plus"
          @click="isAddOpen = true"
          :disabled="isLoading"
        >
          إضافة مورد
        </VBtn>

        <VSpacer/>
        <!-- @selected="updateRangeDate" -->
        <div class="d-flex gap-3">
          <!-- <div dir="ltr">
            <VueDatePicker
              v-model="dateFilter"
              range
              auto-apply
              locale="ar"
              format="dd/MM/yyyy - dd/MM/yyyy"
              :day-names="['أثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة', 'سبت', 'أحد']"
              placeholder="فلترة التاريخ"
            />
          </div> -->
  
          <VBtn @click="printSuppliers"
            prepend-icon="prime-print"
            :disabled="isLoading"
          >
            طباعة
          </VBtn>
        </div>
      </VCardText>

      <VDivider/>

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
            {{ t('forms.name') }}
          </th>
          <th
            scope="col"
            class="font-weight-semibold"
          >
            الهاتف
          </th>
          <th
            scope="col"
            class="font-weight-semibold"
          >
            الرصيد
          </th>
          <th
            scope="col"
            class="font-weight-semibold"
          >
            المنطقة
          </th>
          <th
            scope="col"
            class="font-weight-semibold"
          >
            {{ t('forms.created_at') }}
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
          v-for="(store, i) in suppliersItems"
          :key="store.id"
        >
          <td>
            {{ store.id }}
          </td>
          <td>
            {{ store.name }}
          </td>
          <td>
            {{ store.mobile }}
          </td>
          <td>
            {{ store.balance }}
          </td>
          <td>
            {{ store.city?.name_ar }}
          </td>
          <td>
            {{ ConvertToArabicNumbers(formatDateTime(store.created_at).date) }}
          </td>
          <td class="d-flex align-center gap-2">
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
        <tfoot v-show="!suppliersItems.length">
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

      <VDivider/>

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

    <AddSupplierDialog v-if="isAddOpen" v-model:is-add-open="isAddOpen" @refreshTable="getSuppliers"/>
    <EditSupplierDialog v-if="isEditOpen" v-model:is-edit-open="isEditOpen" :item="selectedItem" @refreshTable="getSuppliers"/>
    <DeleteSupplierDialog v-if="isDeleteOpen" v-model:is-delete-open="isDeleteOpen" :item="selectedItem" @refreshTable="getSuppliers"/>
  </div>
</template>

<style lang="scss">
.dp__range_end, .dp__range_start, .dp__active_date {
  background: var(--initial-loader-color);
  color: #fff;
}

.dp__main {
  --dp-font-family: 'Cairo', 'Tahoma', sans-serif;
  min-width: 250px;
  max-width: 100%;
  
  .dp--menu-wrapper {
    min-width: 380px;
  }
}
</style>
