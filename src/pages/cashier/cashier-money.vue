<template>
  <VCard :loading="cashierStore.isLoading">
    <div>
      <VCard class="mb-5 pa-5">
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
              v-model="filters.start_date"
              type="date"
              :label="t('forms.from')"
            />

            <div class="icon">
              <VIcon
                icon="fluent-mdl2:date-time"
                color="primary"
              />
            </div>
            <VTextField
              v-model="filters.end_date"
              type="date"
              :label="t('forms.to')"
            />

            <VBtn
              prepend-icon="healthicons:x"
              @click.stop="clearFilter"
            >
              {{ t('Clear_Filter') }}
            </VBtn>
          </VCol>
        </VRow>
      </VCard>
    </div>

    <VCardTitle class="d-flex align-center">
      <VIcon
        icon="solar:delivery-broken"
        size="24"
        color="primary"
      />
      <span class="mx-1">العهدة</span>
    </VCardTitle>
    <VCardText class="d-flex align-center flex-wrap gap-2 py-4">
      <div style="width: 5rem;">
        <VSelect
          v-model="rowPerPage"
          variant="outlined"
          :items="[5, 10, 20, 30, 50, 100]"
        />
      </div>
      <VBtn
        prepend-icon="tabler-plus"
        :disabled="isLoading"
        @click="isAddOpen = true"
      >
        إضافة عهدة
      </VBtn>
      <VSpacer />
    </VCardText>

    <VDivider />
    <VTable
      height="600px"
      fixed-header
      class="text-no-wrap product-list-table "
    >
      <thead>
        <tr>
          <th
            scope="col"
            class="font-weight-semibold"
          >
            التاريخ
          </th>
          <th
            scope="col"
            class="font-weight-semibold"
          >
            اسم الموظف
          </th>
          <th
            scope="col"
            class="font-weight-semibold"
          >
            اسم الفرع
          </th>
          <th
            scope="col"
            class="font-weight-semibold"
          >
            مبلع الاستلام
          </th>
          <th
            scope="col"
            class="font-weight-semibold"
          >
            مبلع التسليم
          </th>
          <th
            scope="col"
            class="font-weight-semibold"
          >
            {{ t('forms.actions') }}
          </th>
        </tr>
      </thead>
      <tbody v-if="cashierStore.isLoading">
        <tr
          v-for="tableRow in 4"
          :key="tableRow"
        >
          <td
            v-for="tableTD in 4"
            :key="tableTD"
          >
            <div>
              <VSkeletonLoader
                type="text"
                :height="40"
                :width="100"
              />
            </div>
          </td>
        </tr>
      </tbody>
      <tbody v-else>
        <template
          v-for="money in cashierStore.cashierMoneyList"
          :key="money.id"
        >
          <tr>
            <td>{{ money.date }}</td>
            <td>{{ money.user.username }}</td>
            <td>{{ money.user.branch.name }}</td>
            <td>{{ money.start_money }}</td>
            <td>{{ money.end_money }}</td>
            <td>
              <VBtn
                icon
                variant="plain"
                color="default"
                size="x-small"
                @click="openEdit(money)"
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
                @click="openDelete(money)"
              >
                <VIcon
                  :size="22"
                  icon="tabler-trash"
                />
              </VBtn>
            </td>
          </tr>
        </template>
      </tbody>
      <tfoot v-show="!cashierStore.isLoading && cashierStore.cashierMoneyList.length == 0">
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
    <VDivider />

    <VCardText class="d-flex align-center flex-wrap justify-space-between gap-4 py-3">
      <span class="text-sm text-disabled">{{ paginationData }}</span>

      <VPagination
        v-model="currentPage"
        size="small"
        :total-visible="10"
        :length="cashierStore.cashierMoneyListPaginated?.total"
      />
    </VCardText>
    <VDivider />

    <AddMoneyDialog
      v-if="isAddOpen"
      v-model:is-add-open="isAddOpen"
      @refreshTable="getCashierMoneys"
    />
    <EditMoneyDialog
      v-if="isEditOpen"
      v-model:is-edit-open="isEditOpen"
      :item="selectedMoney"
      @refreshTable="getCashierMoneys"
    />
    <DeleteMoneyDialog
      v-if="isDeleteOpen"
      v-model:is-delete-open="isDeleteOpen"
      :item="selectedMoney"
      @refreshTable="getCashierMoneys"
    />
  </VCard>
</template>

<script setup>
import { useCashierStore } from '@/store/Cashier'
import { useI18n } from 'vue-i18n'

const cashierStore = useCashierStore()
const { t, locale } = useI18n()

const filters = reactive({
  start_date: null,
  end_date: null,
})

const isLoading = ref(false)
const isAddOpen = ref(false)
const isDeleteOpen = ref(false)
const isEditOpen = ref(false)
const selectedMoney = ref({})
const rowPerPage = ref(10)

const today = new Date()
const threeWeeksFromToday = new Date(today)

threeWeeksFromToday.setDate(today.getDate() + 21)

const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0)
const formattedToday = today.toISOString().split('T')[0]
const yesterday = new Date(today)

yesterday.setDate(today.getDate() - 1)

const formattedYesterday = yesterday.toISOString().split('T')[0]
const formattedThreeWeeksFromToday = threeWeeksFromToday.toISOString().split('T')[0]
const formattedLastDay = lastDayOfMonth.toISOString().split('T')[0]


const paginationData = computed(() => {
})

const clearFilter = () => {
  filters.start_date = null,
  filters.end_date = null
}

const openDelete = money => {
  isDeleteOpen.value = true
  selectedMoney.value = money
}

const openEdit = money => {
  isEditOpen.value = true
  selectedMoney.value = money
}


const getCashierMoneys = () => {
  isLoading.value = true
  cashierStore.getCashierMoneys({
    start_date: filters.start_date,
    end_date: filters.end_date,
  })
  isLoading.value = false
}

watchEffect(() => {
  getCashierMoneys()
})
</script>
