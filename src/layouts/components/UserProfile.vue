<script setup>
import avatar1 from '@/assets/images/icon_small.png'
import { useSettingsStore } from "@/store/Settings"

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
    <!-- <VAvatar
      class="cursor-pointer"
      color="primary"
      variant="tonal"
    > -->
    <div class="avatar-container cursor-pointer">
      <img v-if="user.avatar" :src="user.avatar" class="avatar-img">
      <img v-else :src="avatar1" class="avatar-img">
      <!-- <VImg :src="user.avatar" v-if="user.avatar"/>
      <VImg else :src="avatar1" /> -->
      <!-- <VIcon icon="iconoir:n-square" size="32" v-else></VIcon> -->
      
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
                <div class="avatar-container cursor-pointer">
                  <img v-if="user.avatar" :src="user.avatar" class="avatar-img">
                  <img v-else :src="avatar1" class="avatar-img">
                </div>
                <!-- <VBadge
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
                    <VImg v-if="user.avatar" :src="user.avatar ?? avatar1" />
                    <VImg v-else :src="avatar1" />
                  </VAvatar>
                </VBadge> -->
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
    </div>
    <!-- </VAvatar> -->
  </VBadge>
</template>

<style>
.avatar-container {
  position: relative;
  width: 35px;
  height: 35px;
  border-radius: 50%;
  border: 1px solid #f8f7fa;
}

.avatar-img {
  display: inline-block;
  width: 100%;
  height: 100%;
  object-fit: contain;
}
</style>
