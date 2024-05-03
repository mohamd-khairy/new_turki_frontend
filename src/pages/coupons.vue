<script setup>
import { useCouponsStore } from "@/store/Coupons"
import moment from "moment"
import { useI18n } from "vue-i18n"

const { t } = useI18n()

const couponsListStore = useCouponsStore()
const searchQuery = ref('')
const rowPerPage = ref(5)
const currentPage = ref(1)
const totalPage = ref(1)
const totalCoupons = ref(0)
const coupons = ref([])
const dataFrom = ref(1)
const dataTo = ref(1)
const selectedRows = ref([])
const isAddOpen = ref(false)
const isDeleteOpen = ref(false)
const selectedCoupon = ref({})
const isEditOpen = ref(false)
const isLoading = ref(false)

const getCoupons = () => {
  isLoading.value = true

  couponsListStore.fetchCoupons({
    q: searchQuery.value,
    per_page: rowPerPage.value,
    page: currentPage.value,
  }).then(response => {
    coupons.value = response.data?.data?.data || []
    totalPage.value = response.data.data.last_page
    dataFrom.value = response.data.data.from
    dataTo.value = response.data.data.to
    totalCoupons.value = response.data.data.total
  }).catch(error => {
    console.log(error)
  })
    .finally(() => {
      isLoading.value = false
    })
}

watch(rowPerPage, () => {
  getCoupons()
})

watch(() => currentPage.value, () => {
  getCoupons()
})

const paginationData = computed(() => {
  return ` عرض من ${ConvertToArabicNumbers(dataFrom.value)} إلي ${ConvertToArabicNumbers(dataTo.value)} من ${ConvertToArabicNumbers(totalCoupons.value)} الإجمالي `
})

const openDelete = coupon => {
  isDeleteOpen.value = true
  selectedCoupon.value = coupon
}

const openEdit = coupon => {
  isEditOpen.value = true
  selectedCoupon.value = coupon
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
  getCoupons()
})
</script>

<template>
  <div>
    <VCard :loading="isLoading">
      <VCardTitle class="d-flex align-center mb-6 pt-4">
        <VIcon
          icon="bxs:coupon"
          size="24"
          color="primary"
        />
        <span class="mx-1">{{ t('Coupons') }}</span>
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
          prepend-icon="tabler-plus"
          :disabled="isLoading"
          @click="isAddOpen = true"
        >
          {{ t('Add_Coupon') }}
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
              {{ t('forms.code') }}
            </th>
            <th
              scope="col"
              class="font-weight-semibold"
            >
              {{ t('forms.discount_amount_percent') }}
            </th>
            <th
              scope="col"
              class="font-weight-semibold"
            >
              {{ t('forms.expire_at') }}
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
              foodics_integrate_id
            </th>
            <th
              scope="col"
              class="font-weight-semibold"
            >
              {{ t('forms.created_at') }}
            </th>
            <th
              v-can="'update-discount' || 'delete-discount'"
              scope="col"
              class="font-weight-semibold"
            >
              {{ t('forms.actions') }}
            </th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="(coupon, i) in coupons"
            :key="coupon.id"
          >
            <td>
              #{{ ConvertToArabicNumbers(++i) }}
            </td>
            <td>
              {{ coupon.name }}
            </td>
            <td>
              {{ coupon.code }}
            </td>
            <td>
              {{ ConvertToArabicNumbers(coupon.discount_amount_percent) }} %
            </td>
            <td>
              {{ ConvertToArabicNumbers(formatDateTime(coupon.expire_at).date) }}
              {{ ConvertToArabicNumbers(formatDateTime(coupon.expire_at).time).toString().toLowerCase().split(' ')[1] == "am" ? ConvertToArabicNumbers(formatDateTime(coupon.expire_at).time).toString().split(' ')[0] + " " + "صباحاً" : ConvertToArabicNumbers(formatDateTime(coupon.expire_at).time).toString().split(' ')[0] + " " + "مساءاً" }}
            </td>
            <td>
              <VIcon
                icon="ph:dot-bold"
                :color="coupon.is_active == true ? '#008000' : '#f00000'"
                size="32"
              />
              <span>
                {{ coupon.is_active == true ? t('forms.statuses.active') : t('forms.statuses.inactive') }}
              </span>
            </td>
            <td>
              {{ coupon.foodics_integrate_id ? coupon.foodics_integrate_id : '-' }}
            </td>
            <td>
              {{ ConvertToArabicNumbers(formatDateTime(coupon.created_at).date) }}
            </td>

            <td v-can="'update-discount' || 'delete-discount'">
              <VBtn
                v-can="'update-discount'"
                icon
                variant="plain"
                color="default"
                size="x-small"
                @click="openEdit(coupon)"
              >
                <VIcon
                  :size="22"
                  icon="tabler-pencil"
                />
              </VBtn>
              <VBtn
                v-can="'delete-discount'"
                icon
                variant="plain"
                color="default"
                size="x-small"
                @click="openDelete(coupon)"
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
        <tfoot v-show="!coupons.length">
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

    <AddCouponDialog
      v-model:isAddOpen="isAddOpen"
      @refreshTable="getCoupons"
    />
    <EditCouponDialog
      v-model:isEditOpen="isEditOpen"
      :coupon="selectedCoupon"
      @refreshTable="getCoupons"
    />
    <DeleteCouponsDialog
      v-model:isDeleteOpen="isDeleteOpen"
      :coupon="selectedCoupon"
      @refreshTable="getCoupons"
    />
  </div>
</template>
