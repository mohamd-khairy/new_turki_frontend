<script setup>
import { useCitiesStore } from "@/store/Cities";
import { useEmployeesStore } from "@/store/Employees";
import { useStoresStore } from "@/store/Stores";
import moment from "moment/moment";

const storesStore = useStoresStore()
const citiesListStore = useCitiesStore()
const employeesStore = useEmployeesStore()

const searchQuery = ref('')
const rowPerPage = ref(5)
const currentPage = ref(1)
const totalPage = ref(1)
const dataFrom = ref(1)
const dataTo = ref(1)
const totalItems = ref(0)
const storesItems = ref([])
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
  city_id: null,
  user_id: null,
})

const { t } = useI18n()
const router = useRouter()

const getStores = () => {
  isLoading.value = true
  // products.value = []
  storesStore.getAll({
    ...filters,
    q: searchQuery.value,
    per_page: rowPerPage.value,
    page: currentPage.value,
  }).then(response => {
    storesItems.value = response.data?.data?.data;
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
  getStores();
}

const clearFilter = () => {
  filters.city_id = null
  filters.user_id = null

  getStores();
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
  getStores();
})

watch(() => currentPage.value, () => {
  getStores();
})

onMounted(() => {
  getStores();

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
              <VCol cols="12" lg="4" md="3" sm="6" class="d-flex align-center gap-3">
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
              <VCol cols="12" lg="4" md="3" sm="6" class="d-flex align-center gap-3">
                <div class="icon">
                  <VIcon icon="clarity:users-line" color="primary"></VIcon>
                </div>
                <VSelect
                  v-model="filters.user_id"
                  :items="employees"
                  label="المسئول عن المخزن"
                  item-title="username"
                  item-value="id"
                />
              </VCol>
            </VRow>
          </VCol>
          <VCol
          cols="12" lg="4"
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
        <VIcon icon="carbon:store"
          size="24"
          color="primary"
        ></VIcon>
        <span class="mx-1">المخازن</span>
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
          إضافة مخزن
        </VBtn>

        <VSpacer/>


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
            المسئول عن المخزن
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
          v-for="(store, i) in storesItems"
          :key="store.id"
        >
          <td>
            {{ store.id }}
          </td>
          <td>
            {{ store.name }}
          </td>
          <td>
            {{ store.user.username }}
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
        <tfoot v-show="!storesItems.length">
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

    <AddStoreDialog v-if="isAddOpen" v-model:is-add-open="isAddOpen" @refreshTable="getStores"/>
    <EditStoreDialog v-if="isEditOpen" v-model:is-edit-open="isEditOpen" :item="selectedItem" @refreshTable="getStores"/>
    <DeleteStoreDialog v-if="isDeleteOpen" v-model:is-delete-open="isDeleteOpen" :item="selectedItem" @refreshTable="getStores"/>
  </div>
</template>
