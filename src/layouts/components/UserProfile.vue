<script setup>
import { useSettingsStore } from "@/store/Settings"
import avatar1 from '@images/avatars/avatar-1.png'

const user = JSON.parse(localStorage.getItem('najdUser'))
const settingsListStore = useSettingsStore()
const isLoading = ref(false)

const logout = () => {
  isLoading.value = true
  localStorage.removeItem('najdToken')
  localStorage.removeItem('najdUser')
  localStorage.removeItem('najdPermissions')
  location.reload()
  settingsListStore.alertColor = "error"
  settingsListStore.alertMessage = "تم تسجيل الخروج"
  settingsListStore.isAlertShow = true
  setTimeout(() => {
    settingsListStore.isAlertShow = false
    settingsListStore.alertMessage = ""
  }, 3000)
}
</script>

<template>
  <VBadge
    dot
    location="bottom right"
    offset-x="3"
    offset-y="3"
    bordered
    color="success"
  >
    <VAvatar
      class="cursor-pointer"
      color="primary"
      variant="tonal"
    >
      <VImg :src="user.avatar ?? avatar1" v-if="user.avatar"/>
      <VIcon icon="iconoir:n-square" size="32" v-else></VIcon>

      <!-- SECTION Menu -->
      <VMenu
        activator="parent"
        width="230"
        location="bottom end"
        offset="14px"
      >
        <VList>
          <!-- 👉 User Avatar & Name -->
          <VListItem>
            <template #prepend>
              <VListItemAction start>
                <VBadge
                  dot
                  location="bottom right"
                  offset-x="3"
                  offset-y="3"
                  color="success"
                >
                  <VAvatar
                    color="primary"
                    variant="tonal"
                  >
                    <VImg :src="user.avatar ?? avatar1" v-if="user.avatar"/>
                    <VIcon icon="iconoir:n-square" size="32" v-else></VIcon>
                  </VAvatar>
                </VBadge>
              </VListItemAction>
            </template>

            <VListItemTitle class="font-weight-semibold">
              {{ user.username ?? "مستخدم" }}
            </VListItemTitle>
            <VListItemSubtitle>
              <VIcon icon="octicon:dot-fill-24" :color="user.is_active == true || user.is_active == 1 ? '#008000' : '#f00000'" size="16"
              ></VIcon>
              <span class="mx-1">
                {{ user.roles.length ? user.roles[0] : (user.is_active == true || user.is_active == 1 ? 'نشط' : 'غير نشط') }}
              </span>
            </VListItemSubtitle>
          </VListItem>

          <VDivider class="my-2"/>

          <VListItem @click="logout">
            <template #prepend>
              <VIcon
                class="me-2"
                icon="tabler-logout"
                size="22"
              />
            </template>

            <VListItemTitle>
              <span v-if="!isLoading">تسجيل الخروج</span>
              <VIcon icon="mingcute:loading-line" class="fixed loading" size="32" v-else></VIcon>
            </VListItemTitle>
          </VListItem>
        </VList>
      </VMenu>
      <!-- !SECTION -->
    </VAvatar>
  </VBadge>
</template>
