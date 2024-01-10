<script setup>
import { useBannersStore } from '@/store/Banners'
import { useI18n } from "vue-i18n"

const { t } = useI18n()

const backend = 'https://turki.almaraacompany.com/admin'
const bannersListStore = useBannersStore()
const searchQuery = ref('')
const selectedStatus = ref()
const rowPerPage = ref(5)
const currentPage = ref(1)
const totalPage = ref(1)
const totalBanners = ref(0)
const banners = ref([])
const selectedBanner = ref({})
const selectedRows = ref([])
const isAddOpen = ref(false)
const isLoading = ref(false)
const isEditOpen = ref(false)
const isDeleteOpen = ref(false)

// Functions
const getBanners = () => {
  bannersListStore.fetchBanners({
    q: searchQuery.value,
  }).then(response => {
    banners.value = response.data.data
    totalBanners.value = response.data.data.length
    currentPage.value = 1
  }).catch(error => {
    console.log(error)
  })
}

// 👉 Fetch Banners
onMounted(() => {
  getBanners()
})

// 👉 Fetch Banners
watchEffect(() => {
  if (rowPerPage.value) {
    currentPage.value = 1
  }
})

const paginateBanners = computed(() => {
  totalPage.value = Math.ceil(banners.value.length / rowPerPage.value)

  return banners.value.filter((row, index) => {
    let start = (currentPage.value - 1) * rowPerPage.value
    let end = currentPage.value * rowPerPage.value
    if (index >= start && index < end) return true
  })
})

const nextPage = () => {
  if ((currentPage.value * rowPerPage.value) < banners.value.length) currentPage.value
}

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value
}

// 👉 Computing pagination data
const paginationData = computed(() => {
  const firstIndex = banners.value.length ? (currentPage.value - 1) * rowPerPage.value + 1 : 0
  const lastIndex = firstIndex + (rowPerPage.value - 1) <= banners.value.length ? firstIndex + (rowPerPage.value - 1) : totalBanners.value

  return ` عرض من ${firstIndex} إلي ${lastIndex} من ${totalBanners.value} الإجمالي `
})

const openDelete = banner => {
  isDeleteOpen.value = true
  selectedBanner.value = banner
}

const openEdit = banner => {
  isEditOpen.value = true
  selectedBanner.value = banner
}
</script>

<template>
  <div>
    <VCard>
      <VCardTitle class="d-flex align-center">
        <VIcon
          icon="game-icons:vertical-banner"
          size="24"
          color="primary"
        />
        <span class="mx-1"> {{ t('Banners') }} </span>
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
        <!-- 👉 Create banner :to="{ name: 'apps-banner-add' }" -->
        <VBtn
          v-can="'create-banner'"
          prepend-icon="tabler-plus"
          @click="isAddOpen = true"
        >
          {{ t('Add_Banner') }}
        </VBtn>

        <VSpacer />
      </VCardText>

      <VDivider />

      <!--      {{ paginateBanners }} -->

      <VDivider />

      <!-- SECTION Table -->
      <VTable class="text-no-wrap banner-list-table">
        <!-- 👉 Table head -->
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
              {{ t('forms.title') }}
            </th>
            <th
              scope="col"
              class="font-weight-semibold"
            >
              {{ t('forms.status') }}
            </th>
            <th
              scope="col"
              class="font-weight-semibold"
            >
              {{ t('forms.type') }}
            </th>
            <th
              scope="col"
              class="font-weight-semibold"
            >
              {{ t('forms.image') }}
            </th>
            <!--
              <th
              scope="col"
              class="font-weight-semibold"
              >
              {{ t('forms.category_type') }}
              </th> 
            -->
            <!--            <th -->
            <!--              scope="col" -->
            <!--              class="font-weight-semibold" -->
            <!--            > -->
            <!--              {{ t('forms.category_desc') }} -->
            <!--            </th> -->
            <th
              v-can="'read-banner' || 'update-banner' || 'delete-banner'"
              scope="col"
              class="font-weight-semibold"
            >
              <span class="ms-2">{{ t('forms.actions') }}</span>
            </th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="(banner, i) in paginateBanners"
            :key="banner.id"
          >
            <td>
              #{{ ++i }}
            </td>
            <td>
              {{ banner.title }}
            </td>
            <td>
              <VIcon
                icon="ph:dot-bold"
                :color="banner.is_active == true ? '#008000' : '#f00000'"
                size="32"
              />
              <span>
                {{ banner.is_active == true ? t('forms.statuses.active') : t('forms.statuses.inactive') }}
              </span>
            </td>
            <td>
              <span
                v-if=" banner.type == 0"
                class="mx-1"
              >
                <VIcon icon="material-symbols-light:link" />
                <span>
                  عادي
                </span>
              </span>
              <span
                v-if=" banner.type == 1"
                class="mx-1"
              >
                <VIcon icon="gg:external" />
                <span>
                  خارجي
                </span>
              </span>
              <span
                v-if=" banner.type == 2"
                class="mx-1"
              >
                <VIcon icon="gg:internal" />
                <span>
                  داخلي
                </span>
              </span>
            </td>
            <td>
              <img
                v-if="banner.image"
                :src="banner.url ?? backend + '/storage/' + banner.image"
                alt="بنر"
                width="50"
              >
              <VIcon
                v-else
                icon="iconoir:n-square"
                size="32"
              />
            </td>
            <!--
              <td>
              {{ banner.category ? banner.category.type_ar : "لا يوجد" }}
              </td> 
            -->

            <td
              v-can="'update-banner' || 'delete-banner'"
              style="width: 7.5rem;"
            >
              <VBtn
                v-can="'update-banner'"
                icon
                variant="plain"
                color="default"
                size="x-small"
                @click="openEdit(banner)"
              >
                <VIcon
                  :size="22"
                  icon="tabler-pencil"
                />
              </VBtn>
              <VBtn
                v-can="'delete-banner'"
                icon
                variant="plain"
                color="default"
                size="x-small"
                @click="openDelete(banner)"
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
        <tfoot v-show="!banners.length">
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

      <VDivider />

      <VCardText class="d-flex align-center flex-wrap justify-space-between gap-4 py-3">
        <span class="text-sm text-disabled">{{ paginationData }}</span>

        <VPagination
          v-model="currentPage"
          size="small"
          :total-visible="5"
          :length="totalPage"
          @next="selectedRows = []"
          @prev="selectedRows = []"
        />
        <!--        <button @click="prevPage">Previous</button> -->
        <!--        <button @click="nextPage">Next</button> -->
      </VCardText>
    </VCard>

    <!--  Dialogs  -->
    <AddBannerDialog
      v-model:isAddOpen="isAddOpen"
      @refreshTable="getBanners"
    />
    <EditBannerDialog
      v-model:isEditOpen="isEditOpen"
      :banner="selectedBanner"
      @refreshTable="getBanners"
    />
    <DeleteBannerDialog
      v-model:isDeleteOpen="isDeleteOpen"
      :banner="selectedBanner"
      @refreshTable="getBanners"
    />
  </div>
</template>
