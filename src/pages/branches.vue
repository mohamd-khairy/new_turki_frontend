<script setup>
import AddBranchDialog from "@/@core/components/pages/AdditionDialogs/AddBranchDialog.vue"
import DeleteBranchDialog from "@/@core/components/pages/DeleteDialogs/DeleteBranchDialog.vue"
import EditBranchDialog from "@/@core/components/pages/EditDialogs/EditBranchDialog.vue"
import { useBranchesStore } from "@/store/Branches"
import moment from "moment"
import { useI18n } from "vue-i18n"

const { t } = useI18n()

const branchesListStore = useBranchesStore()
const searchQuery = ref('')
const selectedStatus = ref()
const rowPerPage = ref(5)
const currentPage = ref(1)
const totalPage = ref(1)
const totalBranches = ref(0)
const branches = ref([])
const selectedRows = ref([])
const isAddOpen = ref(false)
const isDeleteOpen = ref(false)
const selectedBranch = ref({})
const isEditOpen = ref(false)
const isLoading = ref(false)

const getBranches = () => {
  isLoading.value = true
  branchesListStore.fetchBranches({
    q: searchQuery.value,
  }).then(response => {
    branches.value = response.data.data
    totalPage.value = branches.value / rowPerPage
    totalBranches.value = branches.value.length
    currentPage.value = 1
    isLoading.value = false
  }).catch(error => {
    isLoading.value = false
    console.log(error)
  })
}

// 👉 Fetch Categories
watchEffect(() => {
  getBranches()
})


// 👉 Fetch Countrys
watchEffect(() => {
  if (rowPerPage.value) {
    currentPage.value = 1
  }
})

const paginateBranches = computed(() => {
  totalPage.value = Math.ceil(branches.value.length / rowPerPage.value)

  return branches.value.filter((row, index) => {
    let start = (currentPage.value - 1) * rowPerPage.value
    let end = currentPage.value * rowPerPage.value
    if (index >= start && index < end) return true
  })
})

const nextPage = () => {
  if ((currentPage.value * rowPerPage.value) < branches.value.length) currentPage.value
}

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value
}

// 👉 Computing pagination data
const paginationData = computed(() => {
  const firstIndex = branches.value.length ? (currentPage.value - 1) * rowPerPage.value + 1 : 0
  const lastIndex = firstIndex + (rowPerPage.value - 1) <= branches.value.length ? firstIndex + (rowPerPage.value - 1) : totalBranches.value

  return ` عرض من ${ConvertToArabicNumbers(firstIndex)} إلي ${ConvertToArabicNumbers(lastIndex)} من ${ConvertToArabicNumbers(totalBranches.value)} الإجمالي `
})

const changeStatus = data => {
  branchesListStore.changeStatus(data.id , data).then(response => {
    getBranches()
  })
}

const openDelete = branch => {
  isDeleteOpen.value = true
  selectedBranch.value = branch
}

const openEdit = branch => {
  isEditOpen.value = true
  selectedBranch.value = branch
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
          icon="solar:branch-broken"
          size="24"
          color="primary"
        />
        <span class="mx-1">{{ t('Branches') }}</span>
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
          v-can="'create-branch'"
          prepend-icon="tabler-plus"
          @click="isAddOpen = true"
        >
          اضافه فرع
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
              {{ t('forms.address') }}
            </th>
            <th
              scope="col"
              class="font-weight-semibold"
            >
              {{ t('forms.city') }}
            </th>
            <th
              scope="col"
              class="font-weight-semibold"
            >
              {{ t('forms.mobile') }}
            </th>
            <th
              scope="col"
              class="font-weight-semibold"
            >
              {{ t('forms.is_active') }} ( {{ t('forms.statuses.change') }} )
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
            v-for="(branch, i) in paginateBranches"
            :key="branch.id"
          >
            <td>
              #{{ (++i) }}
            </td>
            <td>
              {{ branch.name }}
            </td>
            <td>
              {{ branch.address }}
            </td>
            <td>
              {{ branch.city?.name_ar }}
            </td>
            <td>
              {{ branch.mobile }}
            </td>
            <td @click="changeStatus(branch)">
              <VIcon
                icon="ph:dot-bold"
                :color="branch.is_active == true ? '#008000' : '#f00000'"
                size="32"
              />
              <span>
                {{ branch.is_active == true ? t('forms.statuses.active') : t('forms.statuses.inactive') }}
              </span>
            </td>


            <td v-can="'create-branch' || 'update-branch' || 'delete-branch'">
              <VBtn
                v-can="'update-branch'"
                icon
                variant="plain"
                color="default"
                size="x-small"
                @click="openEdit(branch)"
              >
                <VIcon
                  :size="22"
                  icon="tabler-pencil"
                />
              </VBtn>
              <VBtn
                v-can="'delete-branch'"
                icon
                variant="plain"
                color="default"
                size="x-small"
                @click="openDelete(branch)"
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
        <tfoot v-show="!branches.length">
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
    <AddBranchDialog
      v-model:isAddOpen="isAddOpen"
      @refreshTable="getBranches"
    />
    <EditBranchDialog
      v-model:isEditOpen="isEditOpen"
      :branch="selectedBranch"
      @refreshTable="getBranches"
    />
    <DeleteBranchDialog
      v-model:isDeleteOpen="isDeleteOpen"
      :branch="selectedBranch"
      @refreshTable="getBranches"
    />
  </div>
</template>
