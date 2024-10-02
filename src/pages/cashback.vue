<script setup>
import AddCashbackDialog from "@/@core/components/pages/AdditionDialogs/AddCashbackDialog.vue"
import DeleteCashbackDialog from "@/@core/components/pages/DeleteDialogs/DeleteCashbackDialog.vue"
import EditCashbackDialog from "@/@core/components/pages/EditDialogs/EditCashbackDialog.vue"
import { useCashbackStore } from "@/store/Cashback"
import moment from "moment"
import { useI18n } from "vue-i18n"

const { t } = useI18n()

const cashbackStore = useCashbackStore()
const searchQuery = ref('')
const selectedStatus = ref()
const rowPerPage = ref(5)
const currentPage = ref(1)
const totalPage = ref(1)
const totalCashbacks = ref(0)
const Cashbacks = ref([])
const selectedRows = ref([])
const isAddOpen = ref(false)
const isDeleteOpen = ref(false)
const selectedCashback = ref({})
const Cashback = ref({})
const isEditOpen = ref(false)
const isLoading = ref(false)

const getCashbacks = () => {
  isLoading.value = true
  cashbackStore.fetchCashbacks({
    q: searchQuery.value,
  }).then(response => {
    Cashbacks.value = response.data.data
    totalPage.value = Cashbacks.value / rowPerPage
    totalCashbacks.value = Cashbacks.value.length
    currentPage.value = 1
    isLoading.value = false
  }).catch(error => {
    isLoading.value = false
    console.log(error)
  })
}

// 👉 Fetch Categories
watchEffect(() => {
  getCashbacks()
})


// 👉 Fetch Countrys
watchEffect(() => {
  if (rowPerPage.value) {
    currentPage.value = 1
  }
})

const paginateCashbacks = computed(() => {
  totalPage.value = Math.ceil(Cashbacks.value.length / rowPerPage.value)

  return Cashbacks.value.filter((row, index) => {
    let start = (currentPage.value - 1) * rowPerPage.value
    let end = currentPage.value * rowPerPage.value
    if (index >= start && index < end) return true
  })
})

const nextPage = () => {
  if ((currentPage.value * rowPerPage.value) < Cashbacks.value.length) currentPage.value
}

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value
}

// 👉 Computing pagination data
const paginationData = computed(() => {
  const firstIndex = Cashbacks.value.length ? (currentPage.value - 1) * rowPerPage.value + 1 : 0
  const lastIndex = firstIndex + (rowPerPage.value - 1) <= Cashbacks.value.length ? firstIndex + (rowPerPage.value - 1) : totalCashbacks.value

  return ` عرض من ${ConvertToArabicNumbers(firstIndex)} إلي ${ConvertToArabicNumbers(lastIndex)} من ${ConvertToArabicNumbers(totalCashbacks.value)} الإجمالي `
})

const changeStatus = (id, data) => {
  cashbackStore.updateCashbackStatus(id, data).then(response => {
    getCashbacks()
  })
}

const openDelete =
  cashback => {
    isDeleteOpen.value = true
    selectedCashback.value =
      cashback
  }

const openEdit =
  cashback => {
    isEditOpen.value = true
    selectedCashback.value =
      cashback
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
</script>

<template>
  <div>
    <VCard :loading="isLoading">
      <VCardTitle class="d-flex align-center">
        <VIcon
          icon="solar:
          cashback-broken"
          size="24"
          color="primary"
        />
        <span class="mx-1">{{ t('Cashbacks') }}</span>
      </VCardTitle>
      <VCardText class="d-flex align-center flex-wrap gap-2 py-4">
        <!-- 👉 Rows per page -->
        <div style="width: 5rem;">
          <VSelect
            v-model="rowPerPage"
            variant="outlined"
            :items="[5, 10, 20, 30, 50]"
          />
        </div>
        <VBtn
          prepend-icon="tabler-plus"
          @click="isAddOpen = true"
        >
          {{ t('Add_cashback') }}
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
              {{ t('forms.id') }}
            </th>
            <th
              scope="col"
              class="font-weight-semibold"
            >
              {{ t('forms.cash_back_amount') }}
            </th>
            <th
              scope="col"
              class="font-weight-semibold"
            >
              {{ t('forms.cash_back_start_date') }}
            </th>
            <th
              scope="col"
              class="font-weight-semibold"
            >
              {{ t('forms.cash_back_end_date') }}
            </th>
            <th
              scope="col"
              class="font-weight-semibold"
            >
              {{ t('forms.is_active') }}
              <br> ( {{ t('forms.statuses.change') }} )
            </th>
            <th
              scope="col"
              class="font-weight-semibold"
            >
              {{ t('forms.country') }}
            </th>
            <th
              scope="col"
              class="font-weight-semibold"
            >
              {{ t('forms.cities') }}
            </th>
            <th
              scope="col"
              class="font-weight-semibold"
            >
              {{ t('forms.categories') }}
            </th>
            <th
              scope="col"
              class="font-weight-semibold"
            >
              {{ t('forms.sub_categories') }}
            </th>
            <th
              scope="col"
              class="font-weight-semibold"
            >
              {{ t('forms.customers') }}
            </th>
            <th
              scope="col"
              class="font-weight-semibold"
            >
              {{ t('forms.products') }}
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
            v-for="(
              cashback, i) in paginateCashbacks"
            :key="cashback.id"
          >
            <td>
              #{{ (++i) }}
            </td>
            <td>
              {{ '%' + cashback.cash_back_amount }}
            </td>
            <td>
              {{
                cashback.cash_back_start_date }}
            </td>
            <td>
              {{
                cashback.cash_back_end_date }}
            </td>
            <td
              style="cursor: pointer;"
              @click="changeStatus(
                cashback.id,
                cashback
              )"
            >
              <VIcon
                icon="ph:dot-bold"
                :color="cashback.is_active == true ? '#008000' : '#f00000'"
                size="32"
              />
              <span>
                {{
                  cashback.is_active == true ? t('forms.statuses.active') : t('forms.statuses.inactive') }}
              </span>
            </td>
            <td>
              <tr
                v-for="item in cashback.countries"
                v-if="cashback.countries.length > 0"
                :key="item.name_ar"
              >
                <td>{{ item.name_ar }}</td>
              </tr>
              <tr v-else>
                <td>لا يوجد</td>  
              </tr>
            </td>
            <td>
              <tr
                v-for="item in cashback.cities"
                v-if="cashback.cities.length > 0"
                :key="item.name_ar"
              >
                <td>{{ item.name_ar }}</td>
              </tr>
              <tr v-else>
                <td>لا يوجد</td>  
              </tr>
            </td>
            <td>
              <tr
                v-for="item in cashback.categories"
                v-if="cashback.categories.length > 0"
                :key="item.type_ar"
              >
                <td>{{ item.type_ar }}</td>
              </tr>
              <tr v-else>
                <td>لا يوجد</td>  
              </tr>
            </td>
            <td>
              <tr
                v-for="item in cashback.sub_categories"
                v-if="cashback.sub_categories.length > 0"
                :key="item.type_ar"
              >
                <td>{{ item.type_ar }}</td>
              </tr>
              <tr v-else>
                <td>لا يوجد</td>  
              </tr>
            </td>
            <td>
              <tr
                v-for="item in cashback.customers"
                v-if="cashback.customers.length > 0"
                :key="item.type_ar"
              >
                <td>{{ item.name +"|"+ item.mobile }}</td>
              </tr>
              <tr v-else>
                <td>لا يوجد</td>  
              </tr>
            </td>
            <td>
              <tr
                v-for="item in cashback.products"
                v-if="cashback.products.length > 0"
                :key="item.type_ar"
              >
                <td>{{ item.name_ar }}</td>
              </tr>
              <tr v-else>
                <td>لا يوجد</td>  
              </tr>
            </td>
            <td>
              <VBtn
                icon
                variant="plain"
                color="default"
                size="x-small"
                @click="openEdit(
                  cashback
                )"
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
                @click="openDelete(
                  cashback
                )"
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
        <tfoot v-show="!Cashbacks.length">
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
          :total-visible="rowPerPage"
          :length="totalPage"
          @next="nextPage"
          @prev="prevPage"
        />
      </VCardText>
    </VCard>
    <AddCashbackDialog
      v-model:isAddOpen="isAddOpen"
      cashback-dialog
      @refreshTable="getCashbacks"
    />
    <EditCashbackDialog
      v-model:isEditOpen="isEditOpen"
      cashback-dialog
      :cashback="selectedCashback"
      @refreshTable="getCashbacks"
    />
    <DeleteCashbackDialog
      v-model:isDeleteOpen="isDeleteOpen"
      cashback-dialog
      :cashback="selectedCashback"
      @refreshTable="getCashbacks"
    />
  </div>
</template>
