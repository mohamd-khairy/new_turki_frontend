<script setup>
import moment from "moment"
import { useI18n } from "vue-i18n"
import { useActivitiesStore } from "@/store/Activities"

const { t } = useI18n()

const activitesListStore = useActivitiesStore()
const searchQuery = ref('')
const selectedStatus = ref()
const rowPerPage = ref(10)
const currentPage = ref(1)
const totalPage = ref(1)
const totalActivites = ref(0)
const dataFrom = ref(0)
const dataTo = ref(0)
const activites = ref([])
const selectedRows = ref([])
const opened = ref([])
const isAddOpen = ref(false)
const isDeleteOpen = ref(false)
const selectedOrder = ref({})
const isEditOpen = ref(false)
const isFiltered = ref(false)
const expandedRow = ref(null)

const getActivites = () => {
  activitesListStore.fetchActivities({
    q: searchQuery.value,
    per_page: rowPerPage.value,
    page: currentPage.value,
  }).then(response => {
    activites.value = response.data.data.data
    totalPage.value = response.data.data.last_page
    dataFrom.value = response.data.data.from
    dataTo.value = response.data.data.to
    totalActivites.value = response.data.data.total
  }).catch(error => {
    console.log(error)
  })
}

watch(() => searchQuery.value, () => {
  isFiltered.value = true
})

// 👉 Fetch Categories
// watchEffect(() => {
//   getActivites()
// })

onMounted(() => {
  getActivites()
})

// 👉 Fetch Countrys
watchEffect(() => {
  if (rowPerPage.value) {
    currentPage.value = 1
  }
})

const paginateActivites = computed(() => {
  totalPage.value = Math.ceil(activites.value.length / rowPerPage.value)

  return activites.value.filter((row, index) => {
    let start = (currentPage.value - 1) * rowPerPage.value
    let end = currentPage.value * rowPerPage.value
    if (index >= start && index < end) return true
  })
})

const nextPage = () => {
  if ((currentPage.value * rowPerPage.value) < activites.value.length) currentPage.value
}

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value
}

// 👉 Computing pagination data
const paginationData = computed(() => {
  // const firstIndex = products.value.length ? (currentPage.value - 1) * rowPerPage.value + 1 : 0
  // const lastIndex = firstIndex + (rowPerPage.value - 1) <= products.value.length ? firstIndex + (rowPerPage.value - 1) : totalProducts.value

  return ` عرض من ${ConvertToArabicNumbers(dataFrom.value)} إلي ${ConvertToArabicNumbers(dataTo.value)} من ${ConvertToArabicNumbers(totalActivites.value)} الإجمالي `
})

// Functions
const ConvertToArabicNumbers = num => {
  const arabicNumbers = "\u0660\u0661\u0662\u0663\u0664\u0665\u0666\u0667\u0668\u0669"

  return String(num).replace(/[0123456789]/g, d => {
    return arabicNumbers[d]
  })
}

const filterActivitys = () => {
  isFiltered.value = true

  getActivites()
}

const clearFilter = () => {
  searchQuery.value = ''

  isFiltered.value = false
  getActivites()
}

const formatDateTime = data => {
  let date = moment(data).format("DD-MM-YYYY")
  let time = moment(data).format("hh:mm:ss A")

  return { date, time }
}

const toggleRow = id => {

  const index = opened.value.indexOf(id)
  if (index > -1) {
    opened.value.splice(index, 1)
  } else {
    opened.value.push(id)
  }

}
</script>

<template>
  <div>
    <VCard>
      <VCardTitle class="d-flex align-center">
        <VIcon
          icon="octicon:log-24"
          size="24"
          color="primary"
        />
        <span class="mx-1">{{ t('Activites') }}</span>
      </VCardTitle>

      <VCardText class="d-flex align-center flex-wrap gap-2 py-4">
        <!-- 👉 Rows per page -->

        <VRow>
          <VCol
            cols="12"
            class="d-flex align-center gap-3"
          >
            <div style="width: 10rem;">
              <VSelect
                v-model="rowPerPage"
                variant="outlined"
                :items="[5, 10, 20, 30, 50 , 100 , 200]"
              />
            </div>
            <div class="icon">
              <VIcon
                icon="solar:delivery-broken"
                color="primary"
              />
            </div>
            <VTextField
              v-model="searchQuery"
              label="البحث برقم الموضوع "
            />
            <VBtn
              prepend-icon="solar:filter-bold-duotone"
              :disabled="!isFiltered"
              @click.stop="filterActivitys"
            >
              {{ t('Filter') }}
            </VBtn>
            <VBtn
              prepend-icon="healthicons:x"
              :disabled="!isFiltered"
              @click.stop="clearFilter"
            >
              {{ t('Clear_Filter') }}
            </VBtn>
          </VCol>
        </VRow>

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
              اضغط لتري التغييرات
            </th>
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
              حالة الموضوع
            </th>
            <th
              scope="col"
              class="font-weight-semibold"
            >
              رقم الموضوع
            </th>
            <th
              scope="col"
              class="font-weight-semibold"
            >
              نوع الموضوع
            </th>
            <th
              scope="col"
              class="font-weight-semibold"
            >
              الذي قام بالتغيير
            </th>
            <th
              scope="col"
              class="font-weight-semibold"
            >
              نوع الذي قم بالتغير
            </th>
            <th
              scope="col"
              class="font-weight-semibold"
            >
              {{ t('forms.created_at') }}
            </th>
          </tr>
        </thead>

        <tbody>
          <template
            v-for="(order, i) in activites"
            :key="order.id"
          >
            <tr>
              <td
                style="cursor: pointer;"
                @click="toggleRow(order.id)"
              >
                (<VIcon>{{ opened.includes(order.id) ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</VIcon>
                Click to {{ opened.includes(order.id) ? 'Close' : 'Open' }})
              </td>
              <td>
                # {{ order.id }}
              </td>
              <td>
                {{ order.description ? order.description : '-' }}
              </td>
              <td>
                {{ order.subject_id }}
              </td>
              <td>
                {{ order.subject_type }}
              </td>
              <td>
                {{ order.causer ? order.causer.email ? order.causer.email + (order.causer.name ? ' (' +
                  order.causer.name + ')' : '') : '-' : '-' }}
              </td>
              <td>
                {{ order.causer_type ? order.causer_type + ' (' + order.causer_id + ')' : '-' }}
              </td>
              <td>
                {{ order.created_at }}
              </td>
            </tr>
            <tr v-if="opened.includes(order.id)">
              <td colspan="8">
                <tr
                  v-for="(prop, k) in Object.fromEntries(Object.entries(order.properties).reverse())"
                  :key="prop"
                >
                  {{ k == 'attributes' ? 'new' : k }}: {{ prop }}
                </tr>
              </td>
            </tr>
          </template>
        </tbody>

        <!-- 👉 table footer  -->
        <tfoot v-show="!activites.length">
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
          @next="selectedRows = []"
          @prev="selectedRows = []"
        />
      </VCardText>
    </VCard>
  </div>
</template>
