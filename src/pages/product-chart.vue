<script setup>
import { useCategoriesStore } from "@/store/Categories"
import { useCountriesStore } from "@/store/Countries"
import { useDashboardStore } from "@/store/Dashboard"
import { useProductsStore } from "@/store/Products"
import { useI18n } from "vue-i18n"

const props = defineProps({})

const dashboardList = useDashboardStore()
const countriesListStore = useCountriesStore()
const productsListStore = useProductsStore()
const categoriesListStore = useCategoriesStore()

const categories = ref([])
const countries = ref([])
const products = ref([])
const carts = reactive([])
const searchQuery = ref('')
const rowPerPage = ref(10)
const currentPage = ref(1)
const totalPage = ref(1)
const totalOrders = ref(0)
const dataFrom = ref(1)
const dataTo = ref(1)
const isLoading = ref(false)
const isFiltered = ref(true)
const length = ref(0)

const filters = reactive({
  country_id: 1,
  date_from: null,
  date_to: null,
  product_id: null,
  category_id: null,
})

const { t } = useI18n()

const ConvertToArabicNumbers = num => {
  const arabicNumbers = "\u0660\u0661\u0662\u0663\u0664\u0665\u0666\u0667\u0668\u0669"

  return String(num).replace(/[0123456789]/g, d => {
    return arabicNumbers[d]
  })
}

const paginationData = computed(() => {
  return ` عرض من ${ConvertToArabicNumbers(dataFrom.value)} إلي ${ConvertToArabicNumbers(dataTo.value)} من ${ConvertToArabicNumbers(totalOrders.value)} الإجمالي `
})


const filterCarts = () => {
  isFiltered.value = true
  getOrders()
}

const clearFilter = () => {
  searchQuery.value = null
  filters.country_id = 1
  filters.date_from = null
  filters.date_to = null
  filters.product_id = null
  filters.category_id = null
  isFiltered.value = false
  getOrders()
}

const getOrders = () => {
  isLoading.value = true
  dashboardList.fetchProductsDashboard({
    ...filters,
    per_page: rowPerPage.value,
    page: currentPage.value,
  }).then(response => {
    carts.value = response.data.data.data
    length.value = carts.value.length

    totalPage.value = response.data.data.last_page
    dataFrom.value = response.data.data.from
    dataTo.value = response.data.data.to
    totalOrders.value = response.data.data.total
    isLoading.value = false
  })
}

// 👉 Fetch Banners
onMounted(() => {
  getOrders()

  countriesListStore.fetchCountries().then(response => {
    countries.value = response.data.data
  })

  categoriesListStore.fetchCategories({}).then(response => {
    categories.value = response?.data.data
  })
})

watch(rowPerPage, () => {
  getOrders()
})

watch(() => currentPage.value, () => {
  getOrders()
})

// 👉 Fetch Banners
watchEffect(() => {
  if (rowPerPage.value) {
    currentPage.value = 1
  }
})


const searchProduct = e => {
  productsListStore.fetchProducts({ search: e.target.value }).then(response => {
    products.value = response.data?.data?.data || []
  })
}
</script>

<template>
  <div>
    <VCard :loading="isLoading">
      <VCardTitle class="d-flex align-center">
        <VIcon
          icon="game-icons:vertical-banner"
          size="24"
          color="primary"
        />
        <span class="mx-1"> {{ t('product-chart') }} </span>
      </VCardTitle>

      <VCol
        cols="12"
        lg="12"
        class="d-flex align-center gap-3 mt-3"
      >
        <div style="width: 10rem;">
          <VSelect
            v-model="rowPerPage"
            variant="outlined"
            :items="[5, 10, 20, 30, 50]"
          />
        </div>

        <div class="icon">
          <VIcon
            icon="material-symbols:globe"
            color="primary"
          />
        </div>
        <VSelect
          v-model="filters.country_id"
          :items="countries"
          :label="t('forms.countries')"
          item-title="name_ar"
          item-value="id"
          :disabled="isLoading"
        />
        <div class="icon">
          <VIcon
            icon="carbon:categories"
            color="primary"
          />
        </div>
        <VSelect
          v-model="filters.category_id"
          :items="categories"
          :label="t('forms.categories')"
          item-title="type_ar"
          item-value="id"
        />
        <div class="icon">
          <VIcon
            icon="material-symbols:globe"
            color="primary"
          />
        </div>
        <VSelect
          v-model="filters.product_id"
          :items="products"
          :label="t('Products')"
          item-title="name_ar"
          item-value="id"
          :disabled="isLoading"
        >
          <template #prepend-item>
            <VListItem>
              <VListItemContent>
                <VTextField
                  placeholder="البحث في المنتجات"
                  @input="searchProduct"
                />
              </VListItemContent>
            </VListItem>
            <VDivider class="mt-2" />
          </template>
        </VSelect>
      </VCol>
      <VCol
        cols="12"
        lg="12"
        class="d-flex align-center gap-3 mt-3"
      >
        <div class="icon">
          <VIcon
            icon="fluent-mdl2:date-time"
            color="primary"
          />
        </div>
        <VTextField
          v-model="filters.date_from"
          type="date"
          :label="t('forms.from')"
          :disabled="isLoading"
        />
        <div class="icon">
          <VIcon
            icon="fluent-mdl2:date-time"
            color="primary"
          />
        </div>
        <VTextField
          v-model="filters.date_to"
          type="date"
          :label="t('forms.from')"
          :disabled="isLoading"
        />
        <VBtn
          prepend-icon="solar:filter-bold-duotone"
          :disabled="isLoading"
          @click.stop="filterCarts"
        >
          {{ t('Filter') }}
        </VBtn>
        <VBtn
          prepend-icon="healthicons:x"
          :disabled="isLoading || !isFiltered"
          @click.stop="clearFilter"
        >
          {{ t('Clear_Filter') }}
        </VBtn>
      </VCol>

      <VDivider />

      <VTable class="text-no-wrap order-list-table">
        <thead>
          <tr>
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
              {{ t('forms.quantity') }}
            </th>
            <th
              scope="col"
              class="font-weight-semibold"
            >
              {{ t('forms.price') }}
            </th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="(cart, i) in carts.value"
            :key="i"
          >
            <td style="white-space: normal;word-wrap: break-word;">
              {{ cart.name }}
            </td>
            <td style="white-space: normal;word-wrap: break-word;">
              {{ cart.total_quantity }}
            </td>
            <td style="white-space: normal;word-wrap: break-word;">
              {{ cart.total_price }} ريال
            </td>
          </tr>
        </tbody>

        <tfoot v-if="length < 1">
          <tr>
            <td
              colspan="8"
              class="text-center text-body-1"
            >
              لا يوجد بيانات
            </td>
          </tr>
        </tfoot>
        <tfoot v-else />
      </VTable>
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

      <VDivider />
    </VCard>
  </div>
</template>
