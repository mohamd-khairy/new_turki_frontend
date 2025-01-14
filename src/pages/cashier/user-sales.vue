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
      <span class="mx-1">التسويات</span>
    </VCardTitle>
    <VTable
      height="600px"
      fixed-header
      class="text-no-wrap product-list-table text-center"
    >
      <thead>
        <tr>
          <th
            scope="col"
            class="font-weight-semibold"
          >
            التاريخ
          </th>
          <!--
            <th
            scope="col"
            class="font-weight-semibold"
            >
            {{ $t("forms.id") }}
            </th>
          -->

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
            v-for="paymentType in cashierStore.paymentTypes"
            :key="paymentType.id"
            scope="col"
            class="font-weight-semibold"
          >
            {{ locale == 'en' ? paymentType.name_en : paymentType.name_ar }}
          </th>
          <th
            scope="col"
            class="font-weight-semibold"
          >
            المرتجع
          </th>
          <th
            scope="col"
            class="font-weight-semibold"
          >
            المجموع
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
          v-for="user in cashierStore.usersSales"
          :key="user.user_id"
        >
          <tr>
            <td>{{ user.date }}</td>
            <!-- <td>{{ user.user_id }}</td> -->
            <td>{{ user.user_name }}</td>
            <td>{{ user.branch_name }}</td>
            <td
              v-for="paymentType in cashierStore.paymentTypes"
              :key="paymentType.id"
              scope="col"
              class="font-weight-semibold"
            >
              {{ ConvertToArabicNumbers(user[paymentType.name_en]) }}
            </td>
            <td>{{ ConvertToArabicNumbers(user.refund) }}</td>
            <td>{{ ConvertToArabicNumbers(user.total) }}</td>
          </tr>
        </template>
      </tbody>
      <tfoot v-show="!cashierStore.isLoading && cashierStore.usersSales.length == 0">
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
const isFiltered = ref(false)


const clearFilter = () => {
  filters.start_date = null,
  filters.end_date = null
}

const ConvertToArabicNumbers = num => {

  const arabicNumbers = "\u0660\u0661\u0662\u0663\u0664\u0665\u0666\u0667\u0668\u0669"

  return String(num).replace(/[0123456789]/g, d => arabicNumbers[d])
}

const getItems = () => {
  cashierStore.userSalesList({
    start_date: filters.start_date,
    end_date: filters.end_date,
  })
}

onMounted(async () => {
  await getItems()
})



watchEffect(() => {
  getItems()
})
</script>
