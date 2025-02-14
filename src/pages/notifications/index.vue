<script setup>
import DeleteNotificationDialog from "@/@core/components/pages/DeleteDialogs/DeleteNotificationDialog.vue"
import { useEmployeesStore } from "@/store/Employees"
import { useNotificationsStore } from "@/store/Notifications"

import moment from "moment"
import { useI18n } from "vue-i18n"

const { t , locale } = useI18n()

const notificationsListStore = useNotificationsStore()
const employeesStore = useEmployeesStore()

const searchQuery = ref('')
const rowPerPage = ref(10)
const currentPage = ref(1)
const totalPage = ref(1)
const totalNotifications = ref(0)
const notifications = ref([])
const dataFrom = ref(1)
const dataTo = ref(1)
const selectedRows = ref([])
const isAddOpen = ref(false)
const isDeleteOpen = ref(false)
const selectedNotification = ref({})
const isEditOpen = ref(false)
const isLoading = ref(false)
const customers = ref([])

const getNotifications = () => {
  isLoading.value = true

  notificationsListStore.getAll({
    q: searchQuery.value,
    per_page: rowPerPage.value,
    page: currentPage.value,
    start_date: filters.start_date,
    end_date: filters.end_date,
    customer_id: filters.customer_id,
  }).then(response => {
    notifications.value = response.data?.data?.data || []
    totalPage.value = response.data.data.last_page
    dataFrom.value = response.data.data.from
    dataTo.value = response.data.data.to
    totalNotifications.value = response.data.data.total
  }).catch(error => {
    console.log(error)
  })
    .finally(() => {
      isLoading.value = false
    })
}

const paginationData = computed(() => {
  return ` عرض من ${(dataFrom.value)} إلي ${(dataTo.value)} من ${(totalNotifications.value)} الإجمالي `
})

const openDelete = coupon => {
  isDeleteOpen.value = true
  selectedNotification.value = coupon
}

const filters = reactive({
  start_date: null,
  end_date: null,
  customer_id: null,
})

const clearFilter = () => {
  filters.start_date = null,
  filters.end_date = null
  filters.customer_id = null
}


const formatDateTime = data => {
  let date = moment(data).format("DD-MM-YYYY")
  let time = moment(data).format("hh:mm:ss A")

  return { date, time }
}

watchEffect(() => {
  getNotifications()
})

const _timerId = ref(null)
const isLoadingCustomers = ref(false)
const isCustomersMenuOpen = ref(false)

const updateCutomersMenu = status => {
  isCustomersMenuOpen.value = status
}

const searchCustomer = e => {
  clearTimeout(_timerId.value)

  _timerId.value = setTimeout(() => {
    if (!isCustomersMenuOpen.value) return

    isLoadingCustomers.value = true
    customers.value = []
    employeesStore.fetchCustomers({ search: e, wallet: "all" })
      .then(response => {
        customers.value = response.data?.data?.data || []
      })
      .finally(() => {
        isLoadingCustomers.value = false
      })
  }, 800)
}
</script>

<template>
  <div>
    <VCard :loading="isLoading">
      <div>
        <VCard class="mb-5 pa-5">
          <VRow>
            <VCol
              cols="12"
              sm="12"
              lg="12"
              class="d-flex align-center gap-3"
            >
              <div class="icon">
                <VIcon
                  icon="clarity:users-line"
                  color="primary"
                />
              </div>

              <VAutocomplete
                v-model="filters.customer_id"
                :items="customers"
                label="البحث باسم أو رقم جوال العميل"
                item-title="name_mobile"
                item-value="id"
                clearable
                :loading="isLoadingCustomers"
                @update:search="searchCustomer"
                @update:menu="updateCutomersMenu"
              />
            </VCol>
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

      <VCardTitle class="d-flex align-center mb-6 pt-4">
        <VIcon
          icon="bxs:coupon"
          size="24"
          color="primary"
        />
        <span class="mx-1">الاشعارات</span>
        <VCardText class="d-flex align-center flex-wrap gap-2 py-4">
          <div style="width: 10rem;">
            <VSelect
              v-model="rowPerPage"
              variant="outlined"
              :items="[5, 10, 20, 30, 50]"
            />
          </div>
        </VCardText>
      </VCardTitle>


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
              عنوان الاشعار
            </th>
            <th
              scope="col"
              class="font-weight-semibold"
            >
              نص الاشعار
            </th>
            <th
              scope="col"
              class="font-weight-semibold"
            >
              العميل
            </th>
            <th
              scope="col"
              class="font-weight-semibold"
            >
              وقت الارسال
            </th>
            <th
              scope="col"
              class="font-weight-semibold"
            >
              وقت الاستلام
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
            v-for="(notification, i) in notifications"
            :key="notification.id"
          >
            <td>
              #{{ notification.id }}
            </td>
            <td>
              {{ notification.title }}
            </td>
            <td>
              {{ notification.body }}
            </td>
            <td>
              {{ notification.customer?.name }} <br>
              {{ notification.customer?.mobile }}
            </td>
            <td>
              {{ formatDateTime(notification.scheduled_at).date }} <br>
              {{ formatDateTime(notification.scheduled_at).time }}
            </td>
            <td>
              {{ formatDateTime(notification.sent_at).date }} <br>
              {{ formatDateTime(notification.sent_at).time }}
            </td>
            <td>
              {{ formatDateTime(notification.created_at).date }}
            </td>

            <td v-can="'update-discount' || 'delete-discount'">
              <VBtn
                v-can="'delete-discount'"
                icon
                variant="plain"
                color="default"
                size="x-small"
                @click="openDelete(notification)"
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
        <tfoot v-show="!notifications.length">
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
    <DeleteNotificationDialog
      v-model:isDeleteOpen="isDeleteOpen"
      :notification="selectedNotification"
      @refreshTable="getNotifications"
    />
  </div>
</template>
