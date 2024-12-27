<script setup>
import { useProductsStore } from "@/store/Products"
import { useSettingsStore } from "@/store/Settings"
import moment from "moment"
import { onMounted } from "vue"
import { useI18n } from "vue-i18n"

const { t } = useI18n()

const productListStore = useProductsStore()
const settingsListStore = useSettingsStore()
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
const isLoading = ref(false)
const isFiltered = ref(false)
const products = ref([])
const _timerProductsId = ref(null)
const isLoadingProducts = ref(false)

const filters = reactive({
  product_id: null,
  search: null,

})

const searchProducts = e => {

  clearTimeout(_timerProductsId.value)
  _timerProductsId.value = setTimeout(() => {
    isLoadingProducts.value = true
    productListStore.fetchProducts({ search: e.target.value }).then(response => {
      products.value = response.data?.data?.data || []
    })
      .finally(() => {
        isLoadingProducts.value = false
      })
  }, 800)
}



onMounted(() => {
  productListStore.fetchProducts().then(response => {
    products.value = response.data.data.data
  })
})

const clearFilter = () => {
  filters.product_id = null,
  filters.search = null
}

const getItems = () => {
  isLoading.value = true

  settingsListStore.fetchProductSize({
    q: filters.search,
    product_id: filters.product_id,
  }).then(response => {
    items.value = response.data.data
    totalPage.value = items.value / rowPerPage
    totalItems.value = items.value.length
    currentPage.value = 1
  }).catch(error => {
    console.log(error)
  }).finally(() => {
    isLoading.value = false
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

const openDelete = item => {
  isDeleteOpen.value = true
  selectedItem.value = item
}

const openEdit = item => {
  isEditOpen.value = true
  item.stores = item?.stores?.map(store => {
    store.name = store.store.name
    store.name_ar = store.product.name_ar

    return store
  })
  selectedItem.value = item
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
  getItems()
})
</script>

<template>
  <div>
    <VCard class="mb-5 pa-5">
      <VForm @submit.stop>
        <VRow justify="space-between">
          <VCol
            cols="12"
            lg="8"
            md="8"
            sm="12"
          >
            <VRow>
              <VCol
                cols="12"
                lg="8"
                md="8"
                sm="8"
                class="d-flex align-center gap-3"
              >
                <div class="icon">
                  <VIcon
                    icon="clarity:users-line"
                    color="primary"
                  />
                </div>
                <VTextField
                  v-model="filters.search"
                  label="البحث بالاسم "
                  :disabled="isLoading"
                />
              </VCol>
              <VCol
                cols="12"
                lg="4"
                md="3"
                sm="6"
                class="d-flex align-center gap-3"
              >
                <VSelect
                  v-model="filters.product_id"
                  :items="products"
                  :label="t('forms.products')"
                  item-title="name_ar"
                  item-value="id"
                  :loading="isLoadingProducts"
                >
                  <template #prepend-item>
                    <VListItem>
                      <VListItemContent>
                        <VTextField
                          placeholder="البحث في المنتجات"
                          @input="searchProducts"
                        />
                      </VListItemContent>
                    </VListItem>
                    <VDivider class="mt-2" />
                  </template>
                </VSelect>
              </VCol>
            </VRow>
          </VCol>
          <VCol
            cols="12"
            lg="4"
            md="6"
            sm="6"
          >
            <VRow
              align="center"
              justify="end"
            >
              <VCol
                cols="12"
                lg="5"
                md="5"
                sm="6"
              >
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
        <VIcon
          icon="game-icons:weight-scale"
          size="24"
          color="primary"
        />
        <span class="mx-1">{{ t('Product_Size') }}</span>
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
          @click="isAddOpen = true"
        >
          {{ t('Add_Item') }}
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
              {{ t('forms.weight') }}
            </th>
            <th
              scope="col"
              class="font-weight-semibold"
            >
              كود المنتج
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
            v-for="(item, i) in paginateItems"
            :key="item.id"
          >
            <td>
              #{{ ConvertToArabicNumbers(++i) }}
            </td>
            <td>
              {{ item.name_ar }}
            </td>
            <td>
              {{ ConvertToArabicNumbers(Intl.NumberFormat().format(item.price)) }}
            </td>
            <td>
              {{ ConvertToArabicNumbers(Intl.NumberFormat().format(item.sale_price)) }}
            </td>
            <td>
              {{ ConvertToArabicNumbers(item.weight) }}
            </td>
            <td>
              {{ item.product_code ? item.product_code : '-' }}
            </td>
            <td>
              <VBtn
                icon
                variant="plain"
                color="default"
                size="x-small"
                @click="openEdit(item)"
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
                @click="openDelete(item)"
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
        <tfoot v-show="!items.length">
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

    <AddProductSizeDialog
      v-if="isAddOpen"
      v-model:isAddOpen="isAddOpen"
      @refreshTable="getItems"
    />
    <EditProductSizeDialog
      v-if="isEditOpen"
      v-model:isEditOpen="isEditOpen"
      :item="selectedItem"
      @refreshTable="getItems"
    />
    <DeleteProductSizeDialog
      v-if="isDeleteOpen"
      v-model:isDeleteOpen="isDeleteOpen"
      :item="selectedItem"
      @refreshTable="getItems"
    />
  </div>
</template>
