<script setup>
import { useEmployeesStore } from "@/store/Employees"
import moment from "moment"
import { useI18n } from "vue-i18n"

const { t } = useI18n()

const employeesListStore = useEmployeesStore()
const searchQuery = ref('')
const rowPerPage = ref(10)
const currentPage = ref(1)
const totalPage = ref(1)
const totalEmployees = ref(0)
const dataFrom = ref(1)
const dataTo = ref(1)
const employees = ref([])
const selectedRows = ref([])
const isAddOpen = ref(false)
const isDeleteOpen = ref(false)
const selectedEmployee = ref({})
const isEditOpen = ref(false)
const isLoading = ref(false)

const getEmployees = () => {
  isLoading.value = true
  employeesListStore.fetchEmployees({
    q: searchQuery.value,
    per_page: rowPerPage.value,
    page: currentPage.value,
  }).then(response => {
    employees.value = response.data?.data?.data
    totalPage.value = response.data.data.last_page
    dataFrom.value = response.data.data.from
    dataTo.value = response.data.data.to
    totalEmployees.value = response.data.data.total
  }).catch(error => {
    console.log(error)
  }).finally(() => {
    isLoading.value = false
  })
}

watch(rowPerPage, () => {
  getEmployees()
})

watch(() => currentPage.value, () => {
  getEmployees()
})

const paginateEmployees = computed(() => {
  totalPage.value = Math.ceil(employees.value.length / rowPerPage.value)

  return employees.value.filter((row, index) => {
    let start = (currentPage.value - 1) * rowPerPage.value
    let end = currentPage.value * rowPerPage.value
    if (index >= start && index < end) return true
  })
})

const nextPage = () => {
  if ((currentPage.value * rowPerPage.value) < employees.value.length) currentPage.value
}

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value
}

// 👉 Computing pagination data
const paginationData = computed(() => {
  return ` عرض من ${ConvertToArabicNumbers(dataFrom.value)} إلي ${ConvertToArabicNumbers(dataTo.value)} من ${ConvertToArabicNumbers(totalEmployees.value)} الإجمالي `
})

const changeStatus = data => {
  // employeesListStore.changeCountryStatus(data).then(response => {
  //   getCities()
  // })
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
  getEmployees()
})
</script>

<template>
  <div>
    <VCard :loading="isLoading">
      <VCardTitle class="d-flex align-center">
        <VIcon
          icon="ph:users-four"
          size="24"
          color="primary"
        />
        <span class="mx-1">{{ t('Employees') }}</span>
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
        <!--         👉 Create product :to="{ name: 'apps-product-add' }" -->
        <VBtn
          v-can="'create-user'"
          prepend-icon="tabler-plus"
          :disabled="isLoading"
          @click="isAddOpen = true"
        >
          {{ t('Add_Employee') }}
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
              {{ t('forms.name') }}
            </th>
            <th
              scope="col"
              class="font-weight-semibold"
            >
              {{ t('forms.age') }}
            </th>
            <th
              scope="col"
              class="font-weight-semibold"
            >
              {{ t('forms.country_code') }}
            </th>
            <th
              scope="col"
              class="font-weight-semibold"
            >
              {{ t('forms.gender') }}
            </th>
            <th
              scope="col"
              class="font-weight-semibold"
            >
              {{ t('forms.email') }}
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
              {{ t('forms.status') }}
            </th>
            <th
              scope="col"
              class="font-weight-semibold"
            >
              الادوار
            </th>
            <th
              scope="col"
              class="font-weight-semibold"
            >
              {{ t('forms.created_at') }}
            </th>
            <th
              v-can="'read-user' || 'update-user' || 'delete-user'"
              scope="col"
              class="font-weight-semibold"
            >
              {{ t('forms.actions') }}
            </th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="(employee, i) in employees"
            :key="employee.id"
          >
            <td>
              #{{ (++i) }}
            </td>
            <td>
              {{ employee.username }}
            </td>
            <td>
              {{ employee.age }}
            </td>
            <td>
              {{ employee.country_code }}
            </td>
            <td>
              <VIcon :icon="employee.gender == 0 ? 'material-symbols-light:female' : 'material-symbols-light:male'" />
              <span class="mx-1">
                {{ employee.gender == 0 ? 'أنثي' : 'ذكر' }}
              </span>
            </td>
            <td>
              {{ employee.email }}
            </td>
            <td>
              {{ employee.mobile }}
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
              {{ employee.display_roles ? employee.display_roles : '-' }}
            </td>
            <td>
              {{ (formatDateTime(employee.created_at).date) }}
            </td>

            <td v-can="'read-user' || 'update-user' || 'delete-user'">
              <!--              <VBtn -->
              <!--                icon -->
              <!--                variant="plain" -->
              <!--                color="default" -->
              <!--                size="x-small" -->
              <!--              > -->
              <!--                <VIcon -->
              <!--                  :size="22" -->
              <!--                  icon="tabler-eye" -->
              <!--                /> -->
              <!--              </VBtn> -->
              <VBtn
                v-can="'update-user'"
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
                v-can="'delete-user'"
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
        <tfoot v-show="!employees.length">
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

    <AddEmployeeDialog
      v-model:isAddOpen="isAddOpen"
      @refreshTable="getEmployees"
    />
    <EditEmployeeDialog
      v-model:isEditOpen="isEditOpen"
      :employee="selectedEmployee"
      @refreshTable="getEmployees"
    />
    <DeleteEmployeeDialog
      v-model:isDeleteOpen="isDeleteOpen"
      :employee="selectedEmployee"
      @refreshTable="getEmployees"
    />
  </div>
</template>
