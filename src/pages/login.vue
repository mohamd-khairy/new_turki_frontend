<script setup>
import { useAuthStore } from "@/store/Auth"
import { useSettingsStore } from "@/store/Settings"
import axiosIns from "@axios"
import { useGenerateImageVariant } from '@core/composable/useGenerateImageVariant'
import authV2LoginIllustrationBorderedDark from '@images/pages/auth-v2-login-illustration-bordered-dark.png'
import authV2LoginIllustrationBorderedLight from '@images/pages/auth-v2-login-illustration-bordered-light.png'
import authV2LoginIllustrationDark from '@images/pages/auth-v2-login-illustration-dark.png'
import authV2LoginIllustrationLight from '@images/pages/auth-v2-login-illustration-light.png'
import authV2MaskDark from '@images/pages/misc-mask-dark.png'
import authV2MaskLight from '@images/pages/misc-mask-light.png'
import { themeConfig } from '@themeConfig'
import {
emailValidator,
requiredValidator,
} from '@validators'

const authThemeImg = useGenerateImageVariant(authV2LoginIllustrationLight, authV2LoginIllustrationDark, authV2LoginIllustrationBorderedLight, authV2LoginIllustrationBorderedDark, true)
const authThemeMask = useGenerateImageVariant(authV2MaskLight, authV2MaskDark)
const isPasswordVisible = ref(false)
const settingsListStore = useSettingsStore()

const user = reactive({
  email: ref(''),
  password: ref(''),
})

const rememberMe = ref(false)

const auth = useAuthStore()
const router = useRouter()

const isLoading = ref(false)
const isError = ref(false)
const alertMessage = ref("")

const loginUser = () => {
  isLoading.value = true
  auth.login(user).then(res => {
    localStorage.setItem("najdUser", JSON.stringify(res.data.data))
    localStorage.setItem("najdToken", res.data.data.api_token)
    localStorage.setItem("najdPermissions", JSON.stringify(res.data.data.permissions))
    axiosIns.defaults.headers.Authorization = `Bearer ${res.data.data.api_token}`
    router.push({ name: 'index' })
    settingsListStore.alertColor = "success"
    settingsListStore.alertMessage = "تم تسجيل الدخول بنجاح"
    settingsListStore.isAlertShow = true
    setTimeout(() => {
      settingsListStore.isAlertShow = false
      settingsListStore.alertMessage = ""
    }, 3000)
  }).catch(error => {
    isLoading.value = false
    settingsListStore.alertColor = "error"
    settingsListStore.alertMessage = "حدث خطأ ما !"
    if(error.response.status == 400) {
      isError.value = true
      alertMessage.value = "بيانات تسجيل الدخول خاطئة"
    }
    settingsListStore.isAlertShow = true
    setTimeout(() => {
      settingsListStore.isAlertShow = false
      settingsListStore.alertMessage = ""
    }, 3000)
  })
}
</script>

<template>
  <VRow
    no-gutters
    class="auth-wrapper"
  >
    <VCol
      lg="8"
      class="d-none d-lg-flex"
    >
      <div class="position-relative auth-bg rounded-lg w-100 ma-8 me-0">
        <div class="app-logo d-flex align-center justify-center flex-column w-100 h-100">
<!--          <VIcon icon="iconoir:n-square" size="128" color="primary"></VIcon>-->
          <img src="@/assets/images/logo.png" alt="turki">
          <h1 class="font-weight-bold text-6xl mt-3">
            مرحباً بك في {{ themeConfig.app.title }}
          </h1>

        </div>

        <VImg
          :src="authThemeMask"
          class="auth-footer-mask"
        />
      </div>
    </VCol>

    <VCol
      cols="12"
      lg="4"
      class="d-flex align-center justify-center"
    >
      <VCard
        flat
        :max-width="600"
        class="app-logo mt-12 mt-sm-0 pa-4 w-100"
      >
        <VCardText>
<!--          <VNodeRenderer-->
<!--            :nodes="themeConfig.app.logo"-->
<!--            class="mb-6"-->
<!--          />-->
          <img src="@/assets/images/logo.png" alt="turki"  width="100">

          <h5 class="text-h5 font-weight-semibold mb-1">
            مرحباً بك في {{ themeConfig.app.title }}! 👋🏻
          </h5>
          <p class="mb-0">
            يرجي تسجيل الدخول
          </p>
        </VCardText>
        <VCardText>
          <VForm @submit.prevent="loginUser">
            <VRow>
              <VCol v-if="isError">
                <p class="mb-0 text-danger">
                  <VIcon icon="carbon:close-filled" color="danger"></VIcon>
                  <span class="mx-2">
                    {{ alertMessage}}
                  </span>
                </p>
              </VCol>
              <!-- email -->
              <VCol cols="12">
                <VTextField
                  v-model="user.email"
                  label="البريد الإلكتروني"
                  type="email"
                  :rules="[requiredValidator, emailValidator]"
                />
              </VCol>

              <VCol cols="12">
                <VTextField
                  v-model="user.password"
                  label="كلمة المرور"
                  :rules="[requiredValidator]"
                  :type="isPasswordVisible ? 'text' : 'password'"
                  :append-inner-icon="isPasswordVisible ? 'tabler-eye-off' : 'tabler-eye'"
                  @click:append-inner="isPasswordVisible = !isPasswordVisible"
                />

                <div class="d-flex align-center flex-wrap justify-space-between mt-2 mb-4">
                  <VCheckbox
                    v-model="rememberMe"
                    label="تذكرني"
                  />
                  <a
                    class="text-primary ms-2 mb-1"
                    href="#"
                  >
                    نسيت كلمة المرور؟
                  </a>
                </div>

                <VBtn
                  v-if="!isLoading"
                  block
                  type="submit"
                  size="large"
                >
                  تسجيل الدخول
                </VBtn>
                <VBtn
                  v-else
                  type="submit"
                  size="large"
                  class="w-100 position-relative me-3"
                >
                  <VIcon icon="mingcute:loading-line" class="fixed loading" size="32"></VIcon>
                </VBtn>
              </VCol>

              <VCol
                cols="12"
                class="text-center"
              >
                <span></span>
                <a
                  class="text-primary ms-2"
                  href="#"
                >

                </a>
              </VCol>
              <VCol
                cols="12"
                class="d-flex align-center"
              >
              </VCol>
            </VRow>
          </VForm>
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</template>

<style lang="scss">
@use "@core/scss/template/pages/page-auth.scss";
.text-danger {
  color: red;
}
</style>

<route lang="yaml">
meta:
  layout: blank
  action: read
  subject: Auth
  redirectIfLoggedIn: true
</route>
