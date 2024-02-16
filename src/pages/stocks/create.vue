<script setup>
import { useEmployeesStore } from "@/store/Employees";
import { useProductsStore } from "@/store/Products";
import { useSettingsStore } from "@/store/Settings";
import { useStocksStore } from "@/store/Stocks";
import { useStoresStore } from "@/store/Stores";
import { useSuppliersStore } from "@/store/Suppliers";
import { requiredValidator } from '@validators';

const settingsListStore = useSettingsStore()
const stocksStore = useStocksStore()
const storesStore = useStoresStore()
const productListStore = useProductsStore()
const employeesStore = useEmployeesStore()
const suppliersStore = useSuppliersStore()
const router = useRouter()

const isSubmitting = ref(false)
const stores = ref([])
const products = ref([])
const employees = ref([])
const suppliers = ref([])

const itemData = ref({
  product_id: null,
  store_id: null,
  supplier_id: null,
  user_id: null,
  product_name: null,
  quantity: 1,
  price: null,
  tax: null,
  invoice: [], // file
  invoice_price: null,
  notes: null,
})

const { t } = useI18n()
const refForm = ref(null)

const onFormSubmit = async () => {
  isSubmitting.value = true

  const res = await refForm.value.validate()
  if (res.valid) {
    const formData = new FormData()
    formData.append('product_id', itemData.value.product_id);
    formData.append('invoice', itemData.value.invoice[0]);
    formData.append('store_id', itemData.value.store_id);
    formData.append('supplier_id', itemData.value.supplier_id);
    formData.append('user_id', itemData.value.user_id);
    formData.append('product_name', itemData.value.product_name);
    formData.append('quantity', itemData.value.quantity);
    formData.append('price', itemData.value.price);
    formData.append('tax', itemData.value.tax);
    formData.append('invoice_price', itemData.value.invoice_price);
    formData.append('notes', itemData.value.notes);

    stocksStore.store(formData).then(response => {
      settingsListStore.alertColor = "success"
      settingsListStore.alertMessage = "تم تعديل حالة الطلب بنجاح"
      settingsListStore.isAlertShow = true
      setTimeout(() => {
        settingsListStore.isAlertShow = false
        settingsListStore.alertMessage = ""
      }, 1000)
      
      router.push({ name: 'stocks' });
    }).catch(error => {
      if (error.response.data.errors) {
        const errs = Object.keys(error.response.data.errors)

        errs.forEach(err => {
          settingsListStore.alertMessage = t(`errors.${err}`)
        })
      } else {
        settingsListStore.alertMessage = "حدث خطأ ما !"
      }
      settingsListStore.alertColor = "error"
      settingsListStore.isAlertShow = true
      setTimeout(() => {
        settingsListStore.isAlertShow = false
        settingsListStore.alertMessage = ""
      }, 2000)
    }).finally(() => {
      isSubmitting.value = false
    })
  }
  else {
    isSubmitting.value = false
    settingsListStore.alertMessage = "يرجي تعبئة الحقول المطلوبة !"
    settingsListStore.alertColor = "error"
    settingsListStore.isAlertShow = true
    setTimeout(() => {
      settingsListStore.isAlertShow = false
      settingsListStore.alertMessage = ""
    }, 2000)
  }
}

const _timerProductsId = ref(null)
const isLoadingProducts = ref(false)

const searchProduct = e => {
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

const _timerStoresId = ref(null)
const isLoadingStores = ref(false)

const searchStore = e => {
  clearTimeout(_timerStoresId.value)
  _timerStoresId.value = setTimeout(() => {
    isLoadingStores.value = true
    storesStore.getAll({ search: e.target.value }).then(response => {
      stores.value = response.data?.data?.data || []
    })
      .finally(() => {
        isLoadingStores.value = false
      })
  }, 800)
}

onMounted(() => {
  employeesStore.fetchEmployees({ pageSize: -1 }).then(response => {
    employees.value = response.data?.data?.data || []
  })

  suppliersStore.getAll({ pageSize: -1 }).then(response => {
    suppliers.value = response.data?.data?.data || []
  })
  
})
</script>

<template>
  <div>
    <VCard class="mb-5 pa-5">
      <VCardTitle class="d-flex align-center gap-2">
        <VIcon
          icon="material-symbols:production-quantity-limits-sharp"
          size="24"
          color="primary"
        />
        <span class="mx-1">إضافة مخزون</span>
      </VCardTitle>
      <VCardText class="d-flex align-center flex-wrap gap-2 py-4">
        <VForm
          ref="refForm"
          @submit.prevent="onFormSubmit"
        >
          <VRow>
            <VCol
              cols="12"
              md="6"
            >
              <VSelect
                v-model="itemData.product_id"
                :items="products"
                label="المنتج"
                item-title="name_ar"
                item-value="id"
                :rules="[requiredValidator]"
                :loading="isLoadingProducts"
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
              md="6"
            >
              <VSelect
                v-model="itemData.store_id"
                :items="stores"
                label="المخزن"
                item-title="name"
                item-value="id"
                :rules="[requiredValidator]"
                :loading="isLoadingStores"
              >
                <template #prepend-item>
                  <VListItem>
                    <VListItemContent>
                      <VTextField
                        placeholder="البحث في المخازن"
                        @input="searchStore"
                      />
                    </VListItemContent>
                  </VListItem>
                  <VDivider class="mt-2" />
                </template>
              </VSelect>
            </VCol>
            <VCol
              cols="12"
              md="6"
            >
              <VSelect
                v-model="itemData.supplier_id"
                :items="suppliers"
                label="المورد"
                item-title="name"
                item-value="id"
                :rules="[requiredValidator]"
              />
            </VCol>
            <VCol
              cols="12"
              md="6"
            >
              <VSelect
                v-model="itemData.user_id"
                :items="employees"
                label="الموظف المسئول"
                item-title="username"
                item-value="id"
                :rules="[requiredValidator]"
              />
            </VCol>
            <VCol
              cols="12"
              md="6"
            >
              <VTextField
                v-model="itemData.product_name"
                label="اسم المخزون"
                :rules="[requiredValidator]"
              />
            </VCol>
            <VCol
              cols="12"
              md="6"
            >
              <VTextField
                v-model="itemData.quantity"
                label="الكمية"
                type="number"
                min="0"
                :rules="[requiredValidator]"
              />
            </VCol>
            <VCol
              cols="12"
              md="6"
            >
              <VTextField
                v-model="itemData.price"
                label="السعر"
                type="number"
                min="0"
                :rules="[requiredValidator]"
              />
            </VCol>
            <VCol
              cols="12"
              md="6"
            >
              <VTextField
                v-model="itemData.tax"
                label="الضريبة"
                type="number"
                min="0"
                :rules="[requiredValidator]"
              />
            </VCol>
            <VCol
              cols="12"
              md="6"
            >
              <VFileInput
                v-model="itemData.invoice"
                label="الفاتورة"
                accept="image/*"
                prepend-icon=""
                prepend-inner-icon="mdi-image"
                :rules="[requiredValidator]"
              />
            </VCol>
            <VCol
              cols="12"
              md="6"
            >
              <VTextField
                v-model="itemData.invoice_price"
                label="سعر الفاتورة"
                type="number"
                min="0"
                :rules="[requiredValidator]"
              />
            </VCol>
            <!--
              <VCol
              cols="12"
              md="6"
              v-if="canEditAllFields"
              >
              <VSelect
              v-model="itemData.paid"
              :label="t('forms.payment_status')"
              :items="[
              {
              id: 1,
              name: 'مدفوع',
              }, {
              id: 0,
              name: 'غير مدفوع',
              },
              ]"
              item-title="name"
              item-value="id"
              />
              </VCol> 
            -->
             
            <VCol cols="12">
              <VTextarea
                v-model="itemData.notes"
                :label="t('forms.notes')"
                rows="6"
              />
            </VCol>
            <VCol
              cols="12"
            >
              <VBtn
                v-if="isSubmitting"
                type="button"
                class="position-relative d-flex px-14"
              >
                <VIcon
                  icon="mingcute:loading-line"
                  class="loading"
                  size="32"
                />
              </VBtn>
              <VBtn
                v-else
                color="primary"
                class="px-4 d-flex"
                type="submit"
              >
                <VIcon
                  :size="22"
                  icon="material-symbols-light:save-outline"
                />
                <span>حفظ البيانات</span>
              </VBtn>
            </VCol>
          </VRow>
        </VForm>
      </VCardText>
    </VCard>
  </div>
</template>
