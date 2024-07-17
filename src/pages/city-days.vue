<script setup>
import { useCitiesStore } from "@/store/Cities";
import { useCityDaysStore } from "@/store/CityDays";
import AddCityDayDialog from "@core/components/pages/AdditionDialogs/AddCityDayDialog.vue";
import DeleteCityDay from "@core/components/pages/DeleteDialogs/DeleteCityDay.vue";
import EditCityDayDialog from "@core/components/pages/EditDialogs/EditCityDayDialog.vue";


import moment from "moment";
import { useI18n } from "vue-i18n";

const { t } = useI18n()

const citiesListStore = useCitiesStore()
const CityDaysStore = useCityDaysStore()
const searchQuery = ref('')
const selectedStatus = ref()
const rowPerPage = ref(5)
const currentPage = ref(1)
const totalPage = ref(1)
const totalItems = ref(0)
const items = ref([])
const selectedRows = ref([])
const isAddOpen = ref(false)
const isDeleteOpen = ref(false)
const selectedItem = ref({})
const isEditOpen = ref(false)
const cities = ref([])

const days = [
  {
    'key': 'saturday',
    'value': "السبت",
  },
  {
    'key': 'sunday',
    'value': "الأحد",
  },
  {
    'key': 'monday',
    'value': "الاثنين",
  },
  {
    'key': 'tuesday',
    'value': "الثلاثاء",
  },
  {
    'key': 'wednesday',
    'value': "الاربعاء",
  },
  {
    'key': 'thursday',
    'value': "الخميس",
  },
  {
    'key': 'friday',
    'value': "الجمعة",
  }
]

const getDayValue = (key) => {
  let all = key.split(',');
  let days_name = ''
  for (let index = 0; index < all.length; index++) {
    const element = all[index];
    const day = days.find(day => day.key == element);
    days_name += day.value + ', ';
  }
  return days_name;
}

const getItems = () => {

  citiesListStore.fetchCities({ pageSize: -1 }).then(response => {
    cities.value = response.data.data
  })

  CityDaysStore.getAll({
    q: searchQuery.value,
  }).then(response => {
    items.value = response.data.data.data
    totalPage.value = items.value / rowPerPage
    totalItems.value = items.value.length
    currentPage.value = 1
  }).catch(error => {
    console.log(error)
  })
}

// 👉 Fetch Categories
watchEffect(() => {
  getItems()
})


// 👉 Fetch Countrys
watchEffect(() => {
  if (rowPerPage.value) {
    currentPage.value = 1
  }
})

const paginateItems = computed(() => {
  totalPage.value = Math.ceil(items.value.length / rowPerPage.value)

  return items.value.filter((row, index) => {
    let start = (currentPage.value - 1) * rowPerPage.value
    let end = currentPage.value * rowPerPage.value
    if (index >= start && index < end) return true
  })
})

const nextPage = () => {
  if ((currentPage.value * rowPerPage.value) < items.value.length) currentPage.value
}

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value
}

// 👉 Computing pagination data
const paginationData = computed(() => {
  const firstIndex = items.value.length ? (currentPage.value - 1) * rowPerPage.value + 1 : 0
  const lastIndex = firstIndex + (rowPerPage.value - 1) <= items.value.length ? firstIndex + (rowPerPage.value - 1) : totalItems.value

  return ` عرض من ${ConvertToArabicNumbers(firstIndex)} إلي ${ConvertToArabicNumbers(lastIndex)} من ${ConvertToArabicNumbers(totalItems.value)} الإجمالي `
})

const changeStatus = data => {
  // itemsListStore.changeCountryStatus(data).then(response => {
  //   getItems()
  // })
}

const openDelete = city => {
  isDeleteOpen.value = true
  selectedItem.value = city
}

const openEdit = city => {
  isEditOpen.value = true
  selectedItem.value = city
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
    <VCard>
      <VCardTitle class="d-flex align-center">
        <VIcon icon="fluent-mdl2:date-time" size="24" color="primary"></VIcon>
        <span class="mx-1">{{ t('City_days') }}</span>
      </VCardTitle>
      <VCardText class="d-flex align-center flex-wrap gap-2 py-4">
        <!-- 👉 Rows per page -->
        <div style="width: 5rem;">
          <VSelect v-model="rowPerPage" variant="outlined" :items="[5, 10, 20, 30, 50]" />
        </div>
        <!--         👉 Create product :to="{ name: 'apps-product-add' }"-->
        <VBtn prepend-icon="tabler-plus" @click="isAddOpen = true">
          {{ t('Add_Item') }}
        </VBtn>

        <VSpacer />


      </VCardText>

      <VDivider />

      <VTable class="text-no-wrap product-list-table">
        <thead>
          <tr>
            <th scope="col" class="font-weight-semibold">
              {{ t('forms.id') }}
            </th>
            <th scope="col" class="font-weight-semibold">
              {{ t('forms.day') }}
            </th>
            <th scope="col" class="font-weight-semibold">
              {{ t('forms.city') }}
            </th>
            <th scope="col" class="font-weight-semibold">
              {{ t('forms.actions') }}
            </th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="(item, i) in paginateItems" :key="item.id">
            <td>
              #{{ ConvertToArabicNumbers(++i) }}
            </td>
            <td>
              {{ getDayValue(item.day) }}
            </td>
            <td>
              {{ item.name_ar }}
            </td>
            <td>
              <VBtn icon variant="plain" color="default" size="x-small" @click="openEdit(item)">
                <VIcon :size="22" icon="tabler-pencil" />
              </VBtn>
              <VBtn icon variant="plain" color="default" size="x-small" @click="openDelete(item)">
                <VIcon :size="22" icon="tabler-trash" />
              </VBtn>
            </td>
          </tr>
        </tbody>

        <!-- 👉 table footer  -->
        <tfoot v-show="!items.length">
          <tr>
            <td colspan="8" class="text-center text-body-1">
              لا يوجد بيانات
            </td>
          </tr>
        </tfoot>
      </VTable>
      <!-- !SECTION -->

      <VDivider />

      <VCardText class="d-flex align-center flex-wrap justify-space-between gap-4 py-3">
        <span class="text-sm text-disabled">{{ paginationData }}</span>

        <VPagination v-model="currentPage" size="small" :total-visible="rowPerPage" :length="totalPage" @next="nextPage"
          @prev="prevPage" />
      </VCardText>
    </VCard>
    <AddCityDayDialog v-model:isAddOpen="isAddOpen" :cities="cities" @refreshTable="getItems" />
    <EditCityDayDialog v-model:isEditOpen="isEditOpen" :item="selectedItem" :cities="cities" @refreshTable="getItems" />
    <DeleteCityDay v-model:isDeleteOpen="isDeleteOpen" :item="selectedItem" @refreshTable="getItems" />
  </div>
</template>
