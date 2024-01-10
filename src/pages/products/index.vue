<script setup>
import { useCategoriesStore } from "@/store/Categories"
import { useCitiesStore } from "@/store/Cities"
import { useProductsStore } from "@/store/Products"
import moment from "moment/moment"

const productListStore = useProductsStore()
const categoriesListStore = useCategoriesStore()
const citiesListStore = useCitiesStore()
const searchQuery = ref('')
const selectedStatus = ref()
const rowPerPage = ref(5)
const currentPage = ref(1)
const totalPage = ref(1)
const dataFrom = ref(1)
const dataTo = ref(1)
const totalProducts = ref(0)
const products = ref([])
const selectedRows = ref([])
const isAddOpen = ref(false)
const isDeleteOpen = ref(false)
const selectedProduct = ref({})
const isEditOpen = ref(false)
const isLoading = ref(false)
const isFiltered = ref(false)
const categories = ref([])
const sub_categories = ref([])
const cities = ref([])

const filters = reactive({
  category_id: null,
  sub_category_id: null,
  city_id: null,
})

const { t } = useI18n()
const router = useRouter()

// 👉 Fetch Categories
const getProducts = () => {
  isLoading.value = true
  // products.value = []
  productListStore.fetchProducts({
    q: searchQuery.value,
    per_page: rowPerPage.value,
    page: currentPage.value,
    category_id: filters.category_id,
    sub_category_id: filters.sub_category_id,
    city_id: filters.city_id,

  }).then(response => {
    products.value = response.data.data.data
    totalPage.value = response.data.data.last_page
    dataFrom.value = response.data.data.from
    dataTo.value = response.data.data.to
    totalProducts.value = response.data.data.total
    isLoading.value = false
  }).catch(error => {
    isLoading.value = false
    console.log(error)
  })
}

watchEffect(() => {
  if (rowPerPage.value) {
    currentPage.value = 1
  }
})

const paginateProducts = computed(() => {
  // totalPage.value = Math.ceil(totalPage.value / rowPerPage.value)

  return products.value.filter((row, index) => {
    let start = (currentPage.value - 1) * rowPerPage.value
    let end = currentPage.value * rowPerPage.value
    if (index >= start && index < end) return true
  })
})

const nextPage = () => {
  if ((currentPage.value * rowPerPage.value) < products.value.length) currentPage.value
}

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value
}

// 👉 Computing pagination data
const paginationData = computed(() => {
  // const firstIndex = products.value.length ? (currentPage.value - 1) * rowPerPage.value + 1 : 0
  // const lastIndex = firstIndex + (rowPerPage.value - 1) <= products.value.length ? firstIndex + (rowPerPage.value - 1) : totalProducts.value

  return ` عرض من ${ConvertToArabicNumbers(dataFrom.value)} إلي ${ConvertToArabicNumbers(dataTo.value)} من ${ConvertToArabicNumbers(totalProducts.value)} الإجمالي `
})

const openProductDetails = product => {
  router.push(`products/${product.id}`)
}

const openDelete = product => {
  isDeleteOpen.value = true
  selectedProduct.value = product
}

const openEdit = product => {
  isEditOpen.value = true
  selectedProduct.value = product
}

const filterProducts = () => {
  isFiltered.value = true
  getProducts()
}

const clearFilter = () => {
  filters.category_id = null,
  filters.sub_category_id = null,
  filters.city_id = null
  // getProducts()
}

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

watchEffect(() => {
  getProducts()
})

watch(() => filters.category_id, () => {
  if(filters.category_id !== null) {
    categoriesListStore.fetchSubCategoryByCategory(filters.category_id).then(response => {
      sub_categories.value = response?.data.data
    })
  }
})

onMounted(() => {
  categoriesListStore.fetchCategories({}).then(response => {
    categories.value = response?.data.data
  })
  citiesListStore.fetchCities({}).then(response => {
    cities.value = response?.data.data
  })
})
</script>

<template>
  <div>
    <VCard class="mb-5 pa-5">
      <VForm @submit.stop>
        <VRow justify="space-between">
          <VCol cols="12" lg="8" md="6" sm="12">
            <VRow>
              <VCol cols="12" lg="4" md="4" sm="6" class="d-flex align-center gap-3">
                <div class="icon">
                  <VIcon icon="carbon:categories" color="primary"></VIcon>
                </div>
                <VSelect
                  v-model="filters.category_id"
                  :items="categories"
                  :label="t('forms.categories')"
                  item-title="type_ar"
                  item-value="id"
                />
              </VCol>
              <VCol cols="12" lg="4" md="3" sm="6" class="d-flex align-center gap-3">
                <div class="icon">
                  <VIcon icon="carbon:category-new-each" color="primary"></VIcon>
                </div>
                <VSelect
                  v-model="filters.sub_category_id"
                  :items="sub_categories"
                  :label="t('forms.sub_categories')"
                  item-title="type_ar"
                  item-value="id"
                />
              </VCol>
              <VCol cols="12" lg="4" md="3" sm="6" class="d-flex align-center gap-3">
                <div class="icon">
                  <VIcon icon="solar:city-broken" color="primary"></VIcon>
                </div>
                <VSelect
                  v-model="filters.city_id"
                  :items="cities"
                  :label="t('forms.cities')"
                  item-title="name_ar"
                  item-value="id"
                />
              </VCol>
            </VRow>
          </VCol>
          <VCol cols="12" lg="4" md="6" sm="6">
            <VRow align="center" justify="end">
              <VCol cols="12" lg="5" md="5" sm="6">
                <VBtn
                  class="w-100"
                  prepend-icon="healthicons:x"
                  :disabled="isLoading"
                  @click.stop="clearFilter"
                >
                  {{ t('Clear_Filter') }}
                </VBtn>
              </VCol>
            </VRow>
          </VCol>
        </VRow>
      </VForm>
    </VCard>
    <VCard :loading="isLoading">
      <VCardTitle class="d-flex align-center">
        <VIcon icon="streamline:shopping-bag-hand-bag-1-shopping-bag-purse-goods-item-products" size="24"
               color="primary"
        ></VIcon>
        <span class="mx-1">المنتجات</span>
      </VCardTitle>
      <VCardText class="d-flex align-center flex-wrap gap-2 py-4">
        <!-- 👉 Rows per page -->
        <div style="width: 5rem;">
          <VSelect
            v-model="rowPerPage"
            variant="outlined"
            :items="[5, 10, 20, 30, 50, 100]"
          />
        </div>
        <!--         👉 Create product :to="{ name: 'apps-product-add' }"-->
        <VBtn
          prepend-icon="tabler-plus"
          @click="isAddOpen = true"
          :disabled="isLoading"
        >
          إضافة منتج
        </VBtn>

        <VSpacer/>


      </VCardText>

      <VDivider/>

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
            {{ t('forms.description') }}
          </th>
          <th
            scope="col"
            class="font-weight-semibold"
          >
            {{ t('forms.status') }}
          </th>
          <!--          <th-->
          <!--            scope="col"-->
          <!--            class="font-weight-semibold"-->
          <!--          >-->
          <!--            {{ t('forms.delivered') }}-->
          <!--          </th>-->
          <!--          <th-->
          <!--            scope="col"-->
          <!--            class="font-weight-semibold"-->
          <!--          >-->
          <!--            {{ t('forms.picked_up') }}-->
          <!--          </th>-->
          <th
            scope="col"
            class="font-weight-semibold"
          >
            {{ t('forms.price') }}
          </th>
          <th
            scope="col"
            class="font-weight-semibold"
          >
            {{ t('forms.sale_price') }}
          </th>
          <th
            scope="col"
            class="font-weight-semibold"
          >
            {{ t('forms.category') }}
          </th>
          <th
            scope="col"
            class="font-weight-semibold"
          >
            {{ t('forms.sub_category') }}
          </th>
          <th
            scope="col"
            class="font-weight-semibold"
          >
            {{ t('forms.created_at') }}
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
          v-for="(product, i) in products"
          :key="product.id"
        >
          <td>
            #{{ ++i }}
          </td>
          <td>
            {{ product.name_ar }}
          </td>
          <td>
            {{
              product.description_ar ? product.description_ar.toString().length > 20 ? product.description_ar.toString().slice(0, 20) + '...' : product.description_ar : "-"
            }}
          </td>
          <td>
            <VIcon icon="ph:dot-bold" :color="product.is_active == true ? '#008000' : '#f00000'" size="32"></VIcon>
            <span>
                {{ product.is_active == true ? t('forms.statuses.active') : t('forms.statuses.inactive') }}
              </span>
          </td>
          <!--          <td>-->
          <!--            <VIcon-->
          <!--              :icon="product.is_delivered == true ? 'material-symbols-light:done-all' : 'material-symbols-light:close'"-->
          <!--              :color="product.is_delivered == true ? '#008000' : '#f00000'" size="24" color="primary"-->
          <!--            ></VIcon>-->
          <!--          </td>-->
          <!--          <td>-->
          <!--            <VIcon-->
          <!--              :icon="product.is_picked_up == true ? 'material-symbols-light:done-all' : 'material-symbols-light:close'"-->
          <!--              :color="product.is_picked_up == true ? '#008000' : '#f00000'" size="24" color="primary"-->
          <!--            ></VIcon>-->
          <!--          </td>-->
          <td>
            {{ ConvertToArabicNumbers(Intl.NumberFormat().format(product.price)) }} {{ t('riyal') }}
          </td>
          <td>
            {{ ConvertToArabicNumbers(Intl.NumberFormat().format(product['sale_price'] ?? 0)) }} {{ t('riyal') }}
          </td>
          <td>
            {{ product.category ? product.category.type_ar : "-" }}
          </td>
          <td>
            {{ product.sub_category ? product.sub_category.type_ar : "-" }}
          </td>
          <td>
            {{ ConvertToArabicNumbers(formatDateTime(product.created_at).date) }}
          </td>
          <td>
            <VBtn
              icon
              variant="plain"
              color="default"
              size="x-small"
              @click="openProductDetails(product)"
            >
              <VIcon
                :size="22"
                icon="tabler-eye"
              />
            </VBtn>
            <VBtn
              icon
              variant="plain"
              color="default"
              size="x-small"
              @click="openEdit(product)"
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
              @click="openDelete(product)"
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
        <tfoot v-show="!products.length">
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

      <VDivider/>

      <!-- SECTION Pagination -->
      <VCardText class="d-flex align-center flex-wrap justify-space-between gap-4 py-3">
        <!-- 👉 Pagination meta -->
        <span class="text-sm text-disabled">{{ paginationData }}</span>

        <!-- 👉 Pagination -->
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

    <AddProductDialog v-if="isAddOpen" v-model:is-add-open="isAddOpen" @refreshTable="getProducts"/>
    <EditProductDialog v-if="isEditOpen" v-model:is-edit-open="isEditOpen" :item="selectedProduct" @refreshTable="getProducts"/>
    <DeleteProductsDialog v-if="isDeleteOpen" v-model:is-delete-open="isDeleteOpen" :item="selectedProduct" @refreshTable="getProducts"/>
  </div>
</template>
