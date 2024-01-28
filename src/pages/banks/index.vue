<script setup>
import { useBanksStore } from "@/store/Banks";
import { useCitiesStore } from "@/store/Cities";
import { useEmployeesStore } from "@/store/Employees";
import moment from "moment/moment";

const banksStore = useBanksStore()
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
  city_id: null,
  user_id: null,
})

const { t } = useI18n()
const router = useRouter()

const getBanks = () => {
  isLoading.value = true

  banksStore.getAll({
    ...filters,
    q: searchQuery.value,
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
  getBanks();
}

const clearFilter = () => {
  filters.city_id = null
  filters.user_id = null

  getBanks();
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
  getBanks();
})

watch(() => currentPage.value, () => {
  getBanks();
})

onMounted(() => {
  getBanks();

  // citiesListStore.fetchCities({}).then(response => {
  //   cities.value = response?.data.data
  // })

  // employeesStore.fetchEmployees({ pageSize: -1 }).then(response => {
  //   employees.value = response.data.data?.data;
  // })
})
</script>

<template>
  <div>
    <VCard :loading="isLoading">
      <VCardTitle class="d-flex align-center gap-2">
        <VIcon icon="mdi-bank-outline"
          size="24"
          color="primary"
        ></VIcon>
        <span class="mx-1">البنوك</span>
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
          إضافة بنك
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
            المسئول
          </th>
          <th
            scope="col"
            class="font-weight-semibold"
          >
            العملة
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
            {{ store.user?.username }}
          </td>
          <td>
            {{ store.currency }}
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

    <AddBankDialog v-if="isAddOpen" v-model:is-add-open="isAddOpen" @refreshTable="getBanks"/>
    <EditBankDialog v-if="isEditOpen" v-model:is-edit-open="isEditOpen" :item="selectedItem" @refreshTable="getBanks"/>
    <DeleteBankDialog v-if="isDeleteOpen" v-model:is-delete-open="isDeleteOpen" :item="selectedItem" @refreshTable="getBanks"/>
  </div>
</template>
