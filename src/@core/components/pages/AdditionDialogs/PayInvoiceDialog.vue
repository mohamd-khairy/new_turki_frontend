<script setup>
import { useBanksStore } from "@/store/Banks";
import { useInvoicesStore } from "@/store/Invoices";
import { useSafesStore } from "@/store/Safes";
import { useSettingsStore } from "@/store/Settings";
import {
requiredValidator,
} from '@validators';
import { useI18n } from "vue-i18n";

const props = defineProps({
  isPayOpen: {
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
  'update:isPayOpen',
  'refreshTable',
])

const settingsListStore = useSettingsStore()
const safesStore = useSafesStore()
const banksStore = useBanksStore()
const invoicesStore = useInvoicesStore()

const safes = ref([])
const banks = ref([])
const refForm = ref(null)
const { t } = useI18n()

const itemData = reactive({
  invoice_id: props.item.id,
  bank_id: null,
  money_safe_id: null,
})

const paymentType = ref(1)
const isLoading = ref(false)
const resetForm = () => {
  emit('update:isPayOpen', false)
}

const dialogModelValueUpdate = val => {
  emit('update:isPayOpen', val)
}

const onFormSubmit = async () => {
  isLoading.value = true

  const res = await refForm.value.validate()
  if (res.valid) {
    invoicesStore.pay(itemData).then(response => {
      emit('refreshTable')
      emit('update:isPayOpen', false)
      settingsListStore.alertColor = "success"
      settingsListStore.alertMessage = "تم دفع الفاتورة بنجاح"
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
  safesStore.getAll({ pageSize: -1 }).then(response => {
    safes.value = response.data.data?.data;
  })

  banksStore.getAll({ pageSize: -1 }).then(response => {
    banks.value = response.data.data?.data;
  })
}

onMounted(() => {
  getAllData();
})
</script>

<template>
  <VDialog
    :width="$vuetify.display.smAndDown ? 'auto' : 650 "
    :model-value="props.isPayOpen"
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
            دفع الفاتورة
          </span>
        </VCardTitle>
      </VCardItem>

      <VCardText>
        <!-- 👉 Form -->
        <VForm
          ref="refForm"
          @submit.prevent="onFormSubmit"
        >
        <div class="d-flex align-center gap-6 mb-8">
          <h4>الدفع عن طريق:</h4>
          <div class="d-flex justify-center align-center gap-4">
            <span>البنك</span>
            <v-switch v-model="paymentType" label="" 
            :true-value="1" :false-value="0" inline
            prepend-icon="mdi-bank-outline" append-icon="teenyicons-safe-outline"></v-switch>
            <span>الخزنة</span>
          </div>
        </div>
          <VRow>
            <VCol
              cols="12"
              class="d-flex justify-space-between align-center gap-4"
            >
              <div class="d-flex align-center gap-4">
                <h4>سعر الفاتورة</h4>
                <VChip>
                <h4>{{ item.invoice_price }}</h4>
                </VChip>
              </div>
              <h4>{{ item.date }}</h4>
            </VCol>
            <VCol
              cols="12"
            >
              <VSelect v-if="paymentType == 1"
                v-model="itemData.bank_id"
                :items="banks"
                label="البنك"
                item-title="name"
                item-value="id"
                :rules="[requiredValidator]"
              />
              <VSelect v-else
                v-model="itemData.money_safe_id"
                :items="safes"
                label="الخزنة"
                item-title="name"
                item-value="id"
                :rules="[requiredValidator]"
              />
            </VCol>
           
            <VCol
              cols="12"
              class="pt-6 text-center"
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
