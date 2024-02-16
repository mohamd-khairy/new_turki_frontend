<script setup>
import { useEmployeesStore } from "@/store/Employees";
import { useInvoicesStore } from "@/store/Invoices";
import { useSettingsStore } from "@/store/Settings";
import { useStoresStore } from "@/store/Stores";
import { useSuppliersStore } from "@/store/Suppliers";
import {
requiredValidator,
} from '@validators';
import { useI18n } from "vue-i18n";

const props = defineProps({
  isEditOpen: {
    type: Boolean,
    required: true,
  },
  item: {
    type: Object,
    default: () => ({}),
    required: true,
  },
})

const emit = defineEmits([
  'update:isEditOpen',
  'refreshTable',
])

const settingsListStore = useSettingsStore()
const employeesStore = useEmployeesStore()
const storesStore = useStoresStore()
const suppliersStore = useSuppliersStore()
const invoicesStore = useInvoicesStore()

const employees = ref([])
const suppliers = ref([])
const stores = ref([])
const refForm = ref(null)
const { t } = useI18n()

const itemData = reactive({
  store_id: props.item.store_id,
  supplier_id: props.item.supplier_id,
  user_id: props.item.user_id,
  tax: props.item.tax ? 1 : 0,
  date: props.item.date,
  // invoice: [],
  invoice_price: props.item.invoice_price,
  notes: props.item.notes,
})

const storesItems = ref(props.item.stocks)

const isLoading = ref(false)
const resetForm = () => {
  emit('update:isEditOpen', false)
}

const dialogModelValueUpdate = val => {
  emit('update:isEditOpen', val)
}

const addProductStore = () => {
  storesItems.value.push({
    product_name: null,
    quantity: 1,
    price: null,
  })
}

const removeProductStore = (index) => {
  storesItems.value = storesItems.value.filter((store, i) => i != index);
}

const onFormSubmit = async () => {
  isLoading.value = true

  const res = await refForm.value.validate()
  if (res.valid) {
    const formData = {
      ...itemData,
      id: props.item.id,
      stocks: storesItems.value
    }

    invoicesStore.update(formData).then(response => {
      emit('refreshTable')
      emit('update:isEditOpen', false)
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
      
      settingsListStore.alertColor = "error"
      settingsListStore.isAlertShow = true
      setTimeout(() => {
        settingsListStore.isAlertShow = false
        settingsListStore.alertMessage = ""
      }, 2000)
    }).finally(() => {
        isLoading.value = false
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

const getAllData = async () => {
  storesStore.getAll({ pageSize: -1 }).then(response => {
    stores.value = response.data.data?.data;
  })

  employeesStore.fetchEmployees({ pageSize: -1 }).then(response => {
    employees.value = response.data.data?.data;
  })

  suppliersStore.getAll({ pageSize: -1 }).then(response => {
    suppliers.value = response.data?.data?.data || []
  })
}

onMounted(() => {
  getAllData();
})
</script>

<template>
  <VDialog
    :width="$vuetify.display.smAndDown ? 'auto' : 650 "
    :model-value="props.isEditOpen"
    @update:model-value="dialogModelValueUpdate"
  >
    <!-- Dialog close btn -->
    <DialogCloseBtn @click="dialogModelValueUpdate(false)" />

    <VCard class="pa-sm-9 pa-5">
      <VCardItem>
        <VCardTitle class="text-h5 d-flex flex-column align-center gap-2 text-center mb-3">
          <VIcon
            icon="uil:invoice"
            size="24"
            color="primary"
          />
          <span class="mx-1 my-1">
            تعديل فاتورة
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
            <!-- <VCol
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
            </VCol> -->
            <VCol
              cols="12"
              md="6"
            >
              <VTextField
                v-model="itemData.date"
                label="تاريخ الفاتورة"
                type="date"
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
            >
              <VSwitch label="الضريبة" 
              v-model="itemData.tax"
              :true-value="1"
              :false-value="0"
              ></VSwitch>
            </VCol>
            <VCol cols="12">
              <div class="d-flex justify-space-between align-center mb-6">
                <h3 class="">المنتجات</h3>

                <VBtn @click="addProductStore" class="position-relative" icon size="small">
                  <VIcon icon="ei:plus" size="30"></VIcon>
                </VBtn>
              </div>
              <VRow v-for="(store, index) in storesItems" :key="index"
              style="background-color: #fafafa;border-radius: 10px;" class="mb-6 py-3">
              <VCol
                cols="12"
                md="6"
              >
                <VSelect
                  v-model="store.store_id"
                  :items="stores"
                  label="المخزن"
                  item-title="name"
                  item-value="id"
                  :rules="[requiredValidator]"
                  style="background-color: #fff;"
                />
              </VCol>
                <VCol
                  cols="12"
                  md="6"
                >
                  <VTextField
                    v-model="store.product_name"
                    label="اسم المنتج"
                    :rules="[requiredValidator]"
                    style="background-color: #fff;"
                  />
                </VCol>
                <VCol
                  cols="10"
                  md="6"
                >
                  <VTextField
                    v-model="store.quantity"
                    type="number"
                    min="1"
                    label="الكمية"
                    :rules="[requiredValidator]"
                    style="background-color: #fff;"
                  />
                </VCol>
                <VCol
                  cols="10"
                  md="6"
                >
                  <VTextField
                    v-model="store.price"
                    label="السعر"
                    type="number"
                    min="1"
                    :rules="[requiredValidator]"
                    style="background-color: #fff;"
                  />
                </VCol>
                <VCol
                  cols="12"
                  class="d-flex justify-end py-0"
                  v-if="index > 0 || storesItems.length > 1"
                >
                  <VBtn @click="removeProductStore(index)" icon size="small"
                  style="top: 5px;left: 5px;">
                    <VIcon icon="simple-line-icons:minus" size="20"></VIcon>
                  </VBtn>
                </VCol>
              </VRow> 
            </VCol>
            <VCol cols="12">
              <VTextarea
                v-model="itemData.notes"
                :label="t('forms.notes')"
                rows="6"
              />
            </VCol>
            <VCol
              cols="12"
              class="pt-4 text-center"
            >
              <VBtn
                v-if="!isLoading"
                type="submit"
                class="me-3 px-8"
              >
                {{ t('buttons.save') }}
              </VBtn>
              <VBtn
                v-else
                type="submit"
                class="position-relative me-3 px-8"
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
                class="px-8"
              >
                {{ t('buttons.cancel') }}
              </VBtn>
            </VCol>
          </VRow>
        </VForm>
      </VCardText>
    </VCard>
  </VDialog>
</template>
