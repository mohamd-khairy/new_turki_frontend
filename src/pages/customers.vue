<script setup>
import { useEmployeesStore } from "@/store/Employees"
import moment from "moment"
import { useI18n } from "vue-i18n"

const { t } = useI18n()

const customersListStore = useEmployeesStore()
const searchQuery = ref('')
const rowPerPage = ref(10)
const currentPage = ref(1)
const totalPage = ref(1)
const totalOrders = ref(0)
const dataFrom = ref(1)
const dataTo = ref(1)
const totalCities = ref(0)
const customers = ref([])
const selectedRows = ref([])
const isAddOpen = ref(false)
const isDeleteOpen = ref(false)
const selectedEmployee = ref({})
const isEditOpen = ref(false)
const isLoading = ref(false)
const isFiltered = ref(false)

const filters = reactive({
  wallet: "all",
})

const filterOptions = reactive([
  {
    name: 'الكل',
    value: "all",
  },
  {
    name: 'يملك محفظة',
    value: 1,
  },
  {
    name: 'لا يملك محفظة',
    value: 0,
  },
])

const getCustomers = () => {
  isLoading.value = true
  customersListStore.fetchCustomers({
    ...filters,
    search: searchQuery.value,
    per_page: rowPerPage.value,
    page: currentPage.value,
  }).then(response => {
    customers.value = response.data?.data?.data
    totalPage.value = response.data.data.last_page
    dataFrom.value = response.data.data.from
    dataTo.value = response.data.data.to
    totalOrders.value = response.data.data.total
    isLoading.value = false
  }).catch(error => {
    console.log(error)
  })
}

watch(rowPerPage, () => {
  getCustomers()
})

watch(() => currentPage.value, () => {
  getCustomers()
})

// 👉 Computing pagination data
const paginationData = computed(() => {
  return ` عرض من ${ConvertToArabicNumbers(dataFrom.value)} إلي ${ConvertToArabicNumbers(dataTo.value)} من ${ConvertToArabicNumbers(totalOrders.value)} الإجمالي `
})

const filterCustomers = () => {
  isFiltered.value = true
  getCustomers()
}

const clearFilter = () => {
  filters.wallet = "all"
  searchQuery.value = null
  getCustomers()
  isFiltered.value = false
}

const openDelete = employee => {
  isDeleteOpen.value = true
  selectedEmployee.value = employee
}

const openEdit = employee => {
  isEditOpen.value = true
  selectedEmployee.value = employee
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
  getCustomers()
})
</script>

<template>
  <div>
    <VCard class="mb-5 pa-5">
      <VRow justify="space-between">
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
                  icon="ph:wallet-light"
                  color="primary"
                />
              </div>
              <VSelect
                v-model="filters.wallet"
                :items="filterOptions"
                :label="t('forms.wallets')"
                item-title="name"
                item-value="value"
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
          <VTextField
            v-model="searchQuery"
            label="بحث"
            class="search-wrap"
            prepend-inner-icon="iconamoon:search-thin"
          />
        </VCol>
        <VCol
          cols="12"
          lg="4"
          md="6"
          sm="6"
        >
          <VRow
            align="center"
            justify="end"
          >
            <VCol
              cols="12"
              lg="5"
              md="5"
              sm="6"
            >
              <VBtn
                v-if="!isLoading"
                class="w-100"
                prepend-icon="solar:filter-bold-duotone"
                :disabled="isLoading"
                @click.stop="filterCustomers"
              >
                {{ t('Filter') }}
              </VBtn>
              <VBtn
                v-else
                type="submit"
                class="position-relative me-3 w-100"
              >
                <VIcon
                  icon="mingcute:loading-line"
                  class="loading"
                  size="32"
                />
              </VBtn>
            </VCol>
            <VCol
              cols="12"
              lg="5"
              md="5"
              sm="6"
            >
              <VBtn
                class="w-100"
                prepend-icon="healthicons:x"
                :disabled="isLoading || !isFiltered"
                @click.stop="clearFilter"
              >
                {{ t('Clear_Filter') }}
              </VBtn>
            </VCol>
          </VRow>
        </VCol>
      </VRow>
    </VCard>
    <VCard :loading="isLoading">
      <VCardTitle class="d-flex align-center">
        <VIcon
          icon="ph:users-four"
          size="24"
          color="primary"
        />
        <span class="mx-1">{{ t('Customers') }}</span>
      </VCardTitle>
      <VCardText class="d-flex align-center flex-wrap gap-2 py-4">
        <div style="width: 5rem;">
          <VSelect
            v-model="rowPerPage"
            variant="outlined"
            :items="[5, 10, 20, 30, 50]"
          />
        </div>

        <VBtn
          v-can="'create-user'"
          prepend-icon="tabler-plus"
          :disabled="isLoading"
          @click="isAddOpen = true"
        >
          {{ t('Add_Customer') }}
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
            <!--              {{ t('forms.avatar') }} -->
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
              {{ t('forms.name') }}
            </th>
            <th
              scope="col"
              class="font-weight-semibold"
            >
              {{ t('forms.phone') }}
            </th>
            <th
              scope="col"
              class="font-weight-semibold"
            >
              {{ t('forms.nationality') }}
            </th>
            <th
              scope="col"
              class="font-weight-semibold"
            >
              {{ t('forms.status') }}
            </th>
            <th
              scope="col"
              class="font-weight-semibold"
            >
              {{ t('forms.loyalty_points') }}
            </th>
            <th
              scope="col"
              class="font-weight-semibold"
            >
              {{ t('forms.wallet') }}
            </th>
            <th
              scope="col"
              class="font-weight-semibold"
            >
              foodics_integrate_id
            </th>
            <th
              scope="col"
              class="font-weight-semibold"
            >
              {{ t('forms.created_at') }}
            </th>
            <th
              v-can="'update-customer' || 'delete-customer'"
              scope="col"
              class="font-weight-semibold"
            >
              {{ t('forms.actions') }}
            </th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="(employee, i) in customers"
            :key="employee.id"
          >
            <td>
              <img
                :src="employee.avatarThumbUrl"
                alt=""
                width="75"
              >
            </td>
            <td>
              #{{ (++i) }}
            </td>
            <td>
              {{ employee.name }}
            </td>
            <td>
              {{ employee.mobile }}
            </td>
            <td>
              {{ employee.nationality }}
            </td>
            <td>
              <VIcon
                icon="ph:dot-bold"
                :color="employee.is_active == true ? '#008000' : '#f00000'"
                size="32"
              />
              <span>
                {{ employee.is_active == true ? t('forms.statuses.active') : t('forms.statuses.inactive') }}
              </span>
            </td>
            <td>
              {{ employee.loyalty_points }}
            </td>
            <td>
              {{ employee.wallet }}
            </td>
            <td>
              {{ employee.foodics_integrate_id ? employee.foodics_integrate_id : '-' }}
            </td>
            <td>
              {{ (formatDateTime(employee.created_at).date) }}
            </td>
            <td v-can="'update-customer' || 'delete-customer'">
              <VBtn
                icon
                variant="plain"
                color="default"
                size="x-small"
                @click="openEdit(employee)"
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
                @click="openDelete(employee)"
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
        <tfoot v-show="!customers.length">
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
    <AddCustomerDialog
      v-model:is-add-open="isAddOpen"
      @refreshTable="getCustomers"
    />
    <EditCustomerDialog
      v-model:is-edit-open="isEditOpen"
      :customer="selectedEmployee"
      @refreshTable="getCustomers"
    />
    <DeleteCustomerDialog
      v-model:is-delete-open="isDeleteOpen"
      :customer="selectedEmployee"
      @refreshTable="getCustomers"
    />
  </div>
</template>

<style lang="scss" scoped>
.search-wrap {
  //max-width: 300px;
  //width: 300px;
}
</style>
