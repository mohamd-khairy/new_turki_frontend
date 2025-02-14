<script setup>
import { useNotificationsStore } from "@/store/Notifications"
import { useSettingsStore } from "@/store/Settings"
import { useI18n } from "vue-i18n"
import { VTextarea, VTextField } from "vuetify/lib/components/index.mjs"

const { t } = useI18n()
const notificationsListStore = useNotificationsStore()
const settingsListStore = useSettingsStore()

const isLoading = ref(false)
const refForm = ref(null)

// Variables
const notification = reactive({
  title: null,
  is_active: null,
  body: null,
  config: null,
  type: 'old_customers',
})

onMounted(() => {
  isLoading.value = true
  notificationsListStore.getOne({ type: notification.type }).then(response => {
    if (response?.data?.data) {
      notification.title = response?.data?.data?.title
      notification.body = response?.data?.data?.body
      notification.config = response?.data?.data?.config
      notification.is_active = response?.data?.data?.is_active
    }
    isLoading.value = false
  })
})

const onFormSubmit = async () => {
  isLoading.value = true

  const res = await refForm.value.validate()
  if (res.valid) {
    notificationsListStore.updateNotifications(notification).then(response => {
      isLoading.value = false

      settingsListStore.alertColor = "success"
      settingsListStore.alertMessage = "تم ارسال الاشعار بنجاح"
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
</script>

<template>
  <div>
    <VCard :loading="isLoading">
      <VCardItem>
        <VCardTitle class="text-h5 d-flex flex-column align-center gap-2 text-center mb-3">
          <VIcon
            icon="bxs:notification"
            size="24"
            color="primary"
          />
          <span class="mx-1 my-1">
            ارسال اشعار للعملائ القدامي
          </span>
        </VCardTitle>
      </VCardItem>

      <VCardText>
        <!-- 👉 Form -->
        <VForm
          ref="refForm"
          @submit.prevent.stop="onFormSubmit"
        >
          <VRow>
            <VCol
              cols="12"
              lg="12"
            >
              <VTextField
                v-model="notification.title"
                label="عنوان الاشعار"
                :rules="[requiredValidator]"
              />
            </VCol>

            <VCol
              cols="12"
              lg="12"
            >
              <VTextarea
                v-model="notification.body"
                label="نص الاشعار"
                :rules="[requiredValidator]"
              />
            </VCol>
            <VCol
              cols="6"
              lg="6"
            >
              <VTextField
                v-model="notification.config"
                label="مدة انشاء العميل من الان بالايام"
                :rules="[requiredValidator]"
                type="number"
              />
            </VCol>
            <VCol
              cols="6"
              lg="6"
            >
              <VSwitch
                v-model="notification.is_active"
                label="تفعيل"
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
                {{ t("buttons.save") }}
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
                {{ t("buttons.cancel") }}
              </VBtn>
            </VCol>
          </VRow>
        </VForm>
      </VCardText>
    </VCard>
  </div>
</template>
