<script setup>
import AddProductQunatity from "@/pages/orders/[id]/AddProductQunatity.vue"
import {
requiredValidator,
} from '@validators'
import { useI18n } from "vue-i18n"

import { hasRole } from '@/helpers'
import { useAuthStore } from "@/store/Auth"
import { useCitiesStore } from "@/store/Cities"
import { useEmployeesStore } from "@/store/Employees"
import { useOrdersStore } from "@/store/Orders"
import { useProductsStore } from "@/store/Products"
import { useSettingsStore } from "@/store/Settings"
import moment from "moment"

const props = defineProps({
  isAddOpen: {
    type: Boolean,
    required: true,
  },
  countries: {
    type: Array,
    required: true,
  },
  deliveryPeriods: {
    type: Array,
    required: true,
  },
  coupons: {
    type: Array,
    required: true,
  },
})

const emit = defineEmits([
  'update:isAddOpen',
  'refreshTable',
])

const settingsListStore = useSettingsStore()
const ordersListStore = useOrdersStore()
const citiesListStore = useCitiesStore()
const customersListStore = useEmployeesStore()
const productsListStore = useProductsStore()
const authStore = useAuthStore()


const { t } = useI18n()

const isQuantityOpen = ref(false)
const selectedProduct = ref({})
const selectedCustomer = ref(null)
const delivery_date = ref(null)

const cities = ref([])
const selectedProducts = ref([])
const customers = ref([])
const products = ref([])
const searchTerm = ref('')

const itemData = reactive({
  customer_id: null,
  country_id: null,
  city_id: null,
  delivery_date: null,
  delivery_period_id: null,
  using_wallet: false,
  address_id: null,
  discount_code: null,
  notes: null,
  products: [],
  boxes_count: 0,
  dishes_count: 0,
})

const savedProduct = reactive({
  quantity: 1,
  cut_id: null,
  size_id: null,
  preparation_id: null,
})

const isLoading = ref(false)
const isAddCustomerOpen = ref(false)
const isAddCustomerAddressOpen = ref(false)
const addresses = ref([])

const updateProducts = (products) => {
  const selected = [];
  selectedProducts.value  = products.filter(product => {
    if(selected.includes(product.id)) {
      return false;
    }

    selected.push(product.id);
    return true;
  })
}

const resetForm = () => {
  emit('update:isAddOpen', false)
}

const changeDate = ev => {
  itemData.delivery_date = moment(delivery_date.value).format("YYYY-MM-DD")
}

watch(() => itemData.customer_id, (newVal, oldVal) => {
  if(itemData.customer_id !== null) {
    selectedCustomer.value = itemData.customer_id
    addresses.value = getAddresses()
  }
})

watch(() => itemData.country_id, (newVal, oldVal) => {
  citiesListStore.fetchCitiesByCountry(itemData.country_id).then(response => {
    cities.value = response.data.data
  })
})

const getAddresses = () => {
  let selected_customer = customers.value.filter(obj => obj.id === itemData.customer_id)
  
  return selected_customer[0].addresses
}

const refForm = ref(null)

const onFormSubmit = async () => {
  isLoading.value = true

  const res = await refForm.value.validate()
  if (res.valid) {
    ordersListStore.storeOrder(itemData).then(response => {
      emit('refreshTable')
      emit('update:isAddOpen', false)
      settingsListStore.alertColor = "success"
      settingsListStore.alertMessage = "تم إضافة العنصر بنجاح"
      settingsListStore.isAlertShow = true
      setTimeout(() => {
        settingsListStore.isAlertShow = false
        settingsListStore.alertMessage = ""
      }, 2000)
    }).catch(error => {
      if (error.response.data.errors) {
        const errs = Object.keys(error.response.data.errors)

        errs.forEach(err => {
          settingsListStore.alertMessage = t(`errors.${err}`)
        })
      } else {
        settingsListStore.alertMessage = "حدث خطأ ما !"
      }
      isLoading.value = false
      settingsListStore.alertColor = "error"
      settingsListStore.isAlertShow = true
      setTimeout(() => {
        settingsListStore.isAlertShow = false
        settingsListStore.alertMessage = ""
      }, 2000)
    })
  }
  else {
    isLoading.value = false
    settingsListStore.alertMessage = "يرجي تعبئة الحقول المطلوبة !"
    settingsListStore.alertColor = "error"
    settingsListStore.isAlertShow = true
    setTimeout(() => {
      settingsListStore.isAlertShow = false
      settingsListStore.alertMessage = ""
    }, 2000)
  }
}

const getProductData = (ev) => {
  console.log({ev});
  isQuantityOpen.value = true
  selectedProduct.value = ev

  let targetId = ev.id
  let indexToRemove = -1

  itemData.products.some((obj, index) => {
    console.log({obj});
    if (obj.product_id === targetId) {
      indexToRemove = index
      savedProduct.quantity = obj.quantity
      savedProduct.cut_id = obj.cut_id
      savedProduct.size_id = obj.size_id
      savedProduct.preparation_id = obj.preparation_id

      return true // Found the object, exit the loop
    }
    else {
      savedProduct.quantity = null
      savedProduct.cut_id = null
      savedProduct.size_id = null
      savedProduct.preparation_id = null
    }

    return false // Continue searching
  })
}

const dialogModelValueUpdate = val => {
  emit('update:isAddOpen', val)
}

const closeModel = () => {
  emit('update:isAddOpen', false)
  itemData.customer_id = null
}

const resetItem = () => {
  savedProduct.quantity = 1
  savedProduct.cut_id = null
  savedProduct.size_id = null
  savedProduct.preparation_id = null
}

const AddQuantity = data => {
  savedProduct.quantity = data.quantity ?? 1
  savedProduct.cut_id = data.cut_id
  savedProduct.size_id = data.size_id
  savedProduct.preparation_id = data.preparation_id

  let targetId = data.id

  let indexToRemove = -1 // Initialize to -1, indicating no match found

  itemData.products.some((obj, index) => {
    if (obj.product_id === targetId) {
      indexToRemove = index

      return true // Found the object, exit the loop
    }

    return false // Continue searching
  })
  if (indexToRemove !== -1) {
    // Remove the object with the matching ID
    itemData.products.splice(indexToRemove, 1)
  }

  itemData.products.push({
    product_id: selectedProduct.value.id,
    quantity: data.quantity ?? 0,
    cut_id: data.cut_id ?? null,
    size_id: data.size_id ?? null,
    preparation_id: data.preparation_id ?? null,
  })
}

const _timerId = ref(null)
const isLoadingCustomers = ref(false)
const searchCustomer = (e) => {
  clearTimeout(_timerId.value)
  _timerId.value = setTimeout(() => {
    isLoadingCustomers.value = true
    customersListStore.fetchCustomers({ search: e.target.value, wallet: "all" })
    .then(response => {
      customers.value = response.data?.data?.data || [];
    })
    .finally(() => {
      isLoadingCustomers.value = false
    })
  }, 800);
}

const _timerProductsId = ref(null)
const isLoadingProducts = ref(false)
const searchProduct = (e) => {
  clearTimeout(_timerProductsId.value)
  _timerProductsId.value = setTimeout(() => {
    isLoadingProducts.value = true
    productsListStore.fetchProducts({ search: e.target.value}).then(response => {
      products.value = response.data?.data?.data || [];
    })
    .finally(() => {
      isLoadingProducts.value = false
    });
  }, 800);
}

</script>

<template>
  <div>
    <VDialog
      :width="$vuetify.display.smAndDown ? 'auto' : 650 "
      :model-value="props.isAddOpen"
      @update:model-value="dialogModelValueUpdate"
    >
      <!-- Dialog close btn -->
      <DialogCloseBtn @click="dialogModelValueUpdate(false)" />

      <VCard
        class="pa-sm-9 pa-5"
      >
        <VCardItem>
          <VCardTitle class="text-h5 d-flex flex-column align-center gap-2 text-center mb-3">
            <VIcon
              icon="solar:tag-broken"
              size="24"
              color="primary"
            />
            <span class="mx-1 my-1">
              {{ t('Add_Item') }}
            </span>
          </VCardTitle>
        </VCardItem>

        <VCardText>
          <!-- 👉 Form -->
          <VForm
            ref="refForm"
            @submit.prevent="onFormSubmit"
          >
            <VRow>
              <VCol
                cols="12"
              >
                <VRow align="center">
                  <VCol
                    cols="12"
                    lg="10"
                    sm="12"
                  >
                    <VSelect
                      v-model="itemData.customer_id"
                      :items="customers"
                      :label="t('Customers')"
                      item-title="name_mobile"
                      item-value="id"
                      :rules="[requiredValidator]"
                      :loading="isLoadingCustomers"
                    >
                      <template #prepend-item>
                        <VListItem>
                          <VListItemContent>
                            <VTextField
                              v-model="searchTerm"
                              placeholder="Search"
                              @input="searchCustomer"
                            />
                          </VListItemContent>
                        </VListItem>
                        <VDivider class="mt-2" />
                      </template>
                    </VSelect>
                  </VCol>
                  <VCol
                    cols="12"
                    lg="2"
                    sm="12"
                  >
                    <VBtn
                      type="button"
                      size="small"
                      class="position-relative me-3"
                      @click="isAddCustomerOpen = true"
                    >
                      <VIcon
                        icon="material-symbols-light:add"
                        size="24"
                      />
                    </VBtn>
                  </VCol>
                </VRow>
              </VCol>
              <VCol
                v-if="itemData.customer_id !== null"
                cols="12"
              >
                <VRow align="center">
                  <VCol
                    cols="12"
                    lg="10"
                    sm="12"
                  >
                    <VSelect
                      v-model="itemData.address_id"
                      :items="addresses"
                      :label="t('forms.customer_addresses')"
                      item-title="address"
                      item-value="id"
                      :rules="[requiredValidator]"
                    />
                  </VCol>
                  <VCol
                    cols="12"
                    lg="2"
                    sm="12"
                  >
                    <VBtn
                      type="button"
                      size="small"
                      class="position-relative me-3"
                      @click="isAddCustomerAddressOpen = true"
                    >
                      <VIcon
                        icon="material-symbols-light:add"
                        size="24"
                      />
                    </VBtn>
                  </VCol>
                </VRow>
              </VCol>
              <VCol
                cols="12"
              >
                <VSelect
                  v-model="itemData.country_id"
                  :items="props.countries"
                  :label="t('Countries')"
                  item-title="name_ar"
                  item-value="id"
                  :rules="[requiredValidator]"
                />
              </VCol>
              <VCol
                cols="12"
              >
                <VSelect
                  v-model="itemData.city_id"
                  :items="cities"
                  :label="t('Cities')"
                  item-title="name_ar"
                  item-value="id"
                  :rules="[requiredValidator]"
                />
              </VCol>
              <VCol
                cols="12"
              >
                <VTextField
                  v-model="delivery_date"
                  type="date"
                  :label="t('forms.delivery_date')"
                  :rules="[requiredValidator]"
                  @input="changeDate($event.target.value)"
                />
              </VCol>
              <VCol
                cols="12"
              >
                <VSelect
                  v-model="itemData.delivery_period_id"
                  :items="props.deliveryPeriods"
                  :label="t('Delivery_Periods')"
                  item-title="name_ar"
                  item-value="id"
                  :rules="[requiredValidator]"
                />
              </VCol>

              <VCol
                cols="12"
              >
                <VSelect
                  v-model="itemData.discount_code"
                  :items="props.coupons"
                  :label="t('Coupons')"
                  item-title="name"
                  item-value="name"
                />
              </VCol>
              <VCol
                cols="12"
              >
                <VSelect
                  :items="products"
                  :label="t('Products')"
                  item-title="name_ar"
                  item-value="id"
                  return-object
                  multiple
                  hide-selected
                  :loading="isLoadingProducts"
                  :rules="[requiredValidator]"
                  @update:modelValue="updateProducts"
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
                <span class="text-sm mt-1 font-weight-bold">* إضغط علي المنتج لإستكمال البيانات (مطلوب)</span>
                <div class="mt-2">
                  <VChip
                    v-for="pd in selectedProducts"
                    :key="pd.id"
                    class="mx-2"
                    label
                    @click.stop="getProductData(pd)"
                  >
                    <span>{{ pd.name_ar }}</span>
                  </VChip>
                </div>
              </VCol>
              <VCol
                cols="12"
                v-if="hasRole(['production_manager'])"
              >
                <VTextField
                  v-model="itemData.boxes_count"
                  type="number"
                  min="0"
                  label="عدد الكراتين"
                />
              </VCol>
              <VCol
                cols="12"
                v-if="hasRole(['production_manager'])"
              >
                <VTextField
                  v-model="itemData.dishes_count"
                  type="number"
                  min="0"
                  label="عدد الأطباق"
                />
              </VCol>
              <VCol
                cols="12"
              >
                <VTextarea
                  v-model="itemData.notes"
                  :label="t('forms.notes')"
                  rows="3"
                />
              </VCol>
              <VCol
                cols="12"
              >
                <VSwitch
                  v-model="itemData.using_wallet"
                  :label="t('forms.using_wallet')"
                />
              </VCol>
              <VCol
                cols="12"
                class="text-center"
              >
                <VBtn
                  v-if="!isLoading"
                  type="submit"
                  class="me-3"
                >
                  {{ t('buttons.save') }}
                </VBtn>
                <VBtn
                  v-else
                  type="submit"
                  class="position-relative me-3"
                >
                  <VIcon
                    icon="mingcute:loading-line"
                    class="loading"
                    size="32"
                  />
                </VBtn>

                <VBtn
                  variant="tonal"
                  color="secondary"
                  @click="resetForm"
                >
                  {{ t('buttons.cancel') }}
                </VBtn>
              </VCol>
            </VRow>
          </VForm>
        </VCardText>
      </VCard>
    </VDialog>

    <AddProductQunatity
      v-model:is-add-open="isQuantityOpen"
      :item-saved="savedProduct"
      :item="selectedProduct"
      @addProductQuantity="AddQuantity"
    />
    <AddCustomerDialog
      v-model:is-add-open="isAddCustomerOpen"
    />
    <AddCustomerAddressDialog
      v-model:is-add-open="isAddCustomerAddressOpen"
      :customer="selectedCustomer"
      @refreshTable="closeModel"
    />
  </div>
</template>
