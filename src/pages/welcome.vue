<script setup>
import AddWelcomeDialog from "@/@core/components/pages/AdditionDialogs/AddWelcomeDialog.vue"
import DeleteWelcomeDialog from "@/@core/components/pages/DeleteDialogs/DeleteWelcomeDialog.vue"
import EditWelcomeDialog from "@/@core/components/pages/EditDialogs/EditWelcomeDialog.vue"
import { useWelcomeStore } from "@/store/Welcome"

import moment from "moment"
import { useI18n } from "vue-i18n"

const { t } = useI18n()

const welcomeStore = useWelcomeStore()
const searchQuery = ref('')
const selectedStatus = ref()
const rowPerPage = ref(5)
const currentPage = ref(1)
const totalPage = ref(1)
const totalWelcomes = ref(0)
const Welcomes = ref([])
const selectedRows = ref([])
const isAddOpen = ref(false)
const isDeleteOpen = ref(false)
const selectedWelcome = ref({})
const isEditOpen = ref(false)
const isLoading = ref(false)

const getWelcomes = () => {
  isLoading.value = true
  welcomeStore.fetchWelcomes({
    q: searchQuery.value,
  }).then(response => {
    Welcomes.value = response.data.data
    totalPage.value = Welcomes.value / rowPerPage
    totalWelcomes.value = Welcomes.value.length
    currentPage.value = 1
    isLoading.value = false
  }).catch(error => {
    isLoading.value = false
    console.log(error)
  })
}

// 👉 Fetch Categories
watchEffect(() => {
  getWelcomes()
})


// 👉 Fetch Countrys
watchEffect(() => {
  if (rowPerPage.value) {
    currentPage.value = 1
  }
})

const paginateWelcomes = computed(() => {
  totalPage.value = Math.ceil(Welcomes.value.length / rowPerPage.value)

  return Welcomes.value.filter((row, index) => {
    let start = (currentPage.value - 1) * rowPerPage.value
    let end = currentPage.value * rowPerPage.value
    if (index >= start && index < end) return true
  })
})

const nextPage = () => {
  if ((currentPage.value * rowPerPage.value) < Welcomes.value.length) currentPage.value
}

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value
}

// 👉 Computing pagination data
const paginationData = computed(() => {
  const firstIndex = Welcomes.value.length ? (currentPage.value - 1) * rowPerPage.value + 1 : 0
  const lastIndex = firstIndex + (rowPerPage.value - 1) <= Welcomes.value.length ? firstIndex + (rowPerPage.value - 1) : totalWelcomes.value

  return ` عرض من ${ConvertToArabicNumbers(firstIndex)} إلي ${ConvertToArabicNumbers(lastIndex)} من ${ConvertToArabicNumbers(totalWelcomes.value)} الإجمالي `
})

const changeStatus = (id, data) => {
  welcomeStore.updateWelcomeStatus(id, data).then(response => {
    getWelcomes()
  })
}

const openDelete =
  Welcome => {
    isDeleteOpen.value = true
    selectedWelcome.value =
      Welcome
  }

const openEdit =
  Welcome => {
    isEditOpen.value = true
    selectedWelcome.value =
      Welcome
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
          Welcome-broken"
          size="24"
          color="primary"
        />
        <span class="mx-1">{{ t('Welcomes') }}</span>
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
          {{ t('Add_Welcome') }}
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
              {{ t('forms.welcome_amount') }}
            </th>
            <th
              scope="col"
              class="font-weight-semibold"
            >
              {{ t('forms.welcome_start_date') }}
            </th>
            <th
              scope="col"
              class="font-weight-semibold"
            >
              {{ t('forms.welcome_end_date') }}
            </th>
            <th
              scope="col"
              class="font-weight-semibold"
            >
              {{ t('forms.expired_days') }}
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
              {{ t('forms.actions') }}
            </th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="(Welcome, i) in paginateWelcomes"
            :key="Welcome.id"
          >
            <td>
              #{{ (++i) }}
            </td>
            <td>
              {{ Welcome.welcome_amount }}
            </td>
            <td>
              {{
                Welcome.welcome_start_date }}
            </td>
            <td>
              {{
                Welcome.welcome_end_date }}
            </td>
            <td>
              {{
                Welcome.expired_days }}
            </td>
            <td
              style="cursor: pointer;"
              @click="changeStatus(
                Welcome.id,
                Welcome
              )"
            >
              <VIcon
                icon="ph:dot-bold"
                :color="Welcome.is_active == true ? '#008000' : '#f00000'"
                size="32"
              />
              <span>
                {{
                  Welcome.is_active == true ? t('forms.statuses.active') : t('forms.statuses.inactive') }}
              </span>
            </td>
            <td>{{ Welcome.country.name_ar }}</td>


            <td>
              <VBtn
                icon
                variant="plain"
                color="default"
                size="x-small"
                @click="openEdit(
                  Welcome
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
                  Welcome
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
        <tfoot v-show="!Welcomes.length">
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
    <AddWelcomeDialog
      v-model:isAddOpen="isAddOpen"
      welcome-dialog
      @refreshTable="getWelcomes"
    />
    <EditWelcomeDialog
      v-model:isEditOpen="isEditOpen"
      welcome-dialog
      :welcome="selectedWelcome"
      @refreshTable="getWelcomes"
    />
    <DeleteWelcomeDialog
      v-model:isDeleteOpen="isDeleteOpen"
      welcome-dialog
      :welcome="selectedWelcome"
      @refreshTable="getWelcomes"
    />
  </div>
</template>
