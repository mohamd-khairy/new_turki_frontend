<script setup>
import { useCitiesStore } from "@/store/Cities";
import { useCountriesStore } from "@/store/Countries";

const props = defineProps({
  isEditOpen: {
    type: Boolean,
    required: true,
  },
  city: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits([
  'refreshTable',
  'update:isEditOpen',
])

import { useSettingsStore } from "@/store/Settings";
import { useI18n } from "vue-i18n";
import { GoogleMap, Marker, Polygon } from "vue3-google-map";

const { t } = useI18n()
const citiesListStore = useCitiesStore()
const countriesListStore = useCountriesStore()
const settingsListStore = useSettingsStore()
const countries = reactive([])
const isLoading = ref(false)

onMounted(() => {
  places.slice(0, places.length - 1)
  markers.slice(0, markers.length - 1)
  countriesListStore.fetchCountries({}).then(response => {
    countries.value = response.data.data
  })
})

// Variables
const cityData = reactive({
  id: null,
  name_ar: null,
  name_en: null,
  country_id: null,
  is_available_for_delivery: null,
  polygon: "",
  allow_cash: false,
  min_price: null,
})

const getPathes = computed(() => {
  return places
})

const center = reactive({ lat: null, lng: null })

const places = reactive([])

const flightPath = ref({
  path: places,
  geodesic: true,
  strokeColor: "#FF0000",
  strokeOpacity: 1.0,
  strokeWeight: 2,
})

onUpdated(() => {
  places.slice(0, places.length - 1)
  markers.slice(0, markers.length - 1)
  places.length = 0
  markers.length = 0

  cityData.id = props.city.id,
    cityData.name_ar = props.city.name_ar,
    cityData.name_en = props.city.name_en,
    cityData.country_id = props.city.country,
    cityData.is_available_for_delivery = props.city.is_available_for_delivery,
    cityData.polygon = props.city.polygon,
    cityData.allow_cash = props.city.allow_cash,
    cityData.min_price = props.city.min_price
  if (props.city.polygon) {
    props.city.polygon.map((poly, i) => {
      let lat = poly.toString().split(" ")[0]
      let lng = poly.toString().split(" ")[1]
      if (i === 0) {
        center.lat = lat
        center.lng = lng
      }

      let position = {
        lat: Number(lat),
        lng: Number(lng),
      }
      let options = {
        label: 'Marker',
      }
      markers.push({ position, ...options })
      places.push(position)
    })
  }
})

// Functions
const resetForm = () => {
  emit('update:isEditOpen', false)
}

const refForm = ref(null)
const markers = reactive([])

const onFormSubmit = async () => {
  isLoading.value = true
  let cityDt = {
    id: cityData.id,
    name_ar: cityData.name_ar,
    name_en: cityData.name_en,
    country_id: cityData.country_id.id,
    is_available_for_delivery: cityData.is_available_for_delivery,
    polygon: [],
    allow_cash: cityData.allow_cash,
    min_price: cityData.min_price
  }

  places.map((path, index) => {
    cityDt.polygon.push([path.lat, path.lng])
  })


  const res = await refForm.value.validate()
  if (res.valid) {
    citiesListStore.editCity(cityDt).then(response => {
      emit('update:isEditOpen', false)
      emit('refreshTable')
      settingsListStore.alertColor = "success"
      settingsListStore.alertMessage = "تم تعديل المدينة بنجاح"
      settingsListStore.isAlertShow = true
      setTimeout(() => {
        settingsListStore.isAlertShow = false
        settingsListStore.alertMessage = ""
        isLoading.value = false
      }, 1000)
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
  } else {
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

const dialogModelValueUpdate = val => {
  emit('update:isEditOpen', val)
}

const getSelectedLocation = loc => {
  markers.length = 0
  location.lat = loc.lat
  location.lng = loc.lng
  center.lat = loc.lat
  center.lng = loc.lng

  // markers.push({ position: { lat: loc.lat, lng: loc.lng } })
}

const addMarker = event => {
  if (event.latLng) {
    const position = {
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    }

    const options = {
      // draggable: true,
      label: 'Marker',
    }

    markers.push({ position, ...options })
    places.push(position)

  }
}

const deleteMark = marker => {
  const index = markers.findIndex(item => item.position.lat === marker.position.lat && item.position.lng == marker.position.lng)

  markers.splice(index, 1)
  places.splice(index, 1)
}
</script>

<template>
  <VDialog :width="$vuetify.display.smAndDown ? 'auto' : 650" :model-value="props.isEditOpen"
    @update:model-value="dialogModelValueUpdate">
    <!-- Dialog close btn -->
    <DialogCloseBtn @click="dialogModelValueUpdate(false)" />

    <VCard class="pa-sm-9 pa-5">
      <!-- 👉 Title -->
      <VCardItem>
        <VCardTitle class="text-h5 d-flex flex-column align-center gap-2 text-center mb-3">
          <VIcon icon="solar:city-broken" size="24" color="primary"></VIcon>
          <span class="mx-1 my-1">
            {{ t('Edit_City') }}
          </span>
        </VCardTitle>
      </VCardItem>

      <VCardText>
        <!-- 👉 Form -->
        <VForm ref="refForm" @submit.prevent="onFormSubmit">
          <VRow>
            <VCol cols="12" lg="12" sm="6">
              <VTextField v-model="cityData.name_en" :label="t('forms.name_en')" />
            </VCol>
            <VCol cols="12" lg="12" sm="6">
              <VTextField v-model="cityData.name_ar" :label="t('forms.name_ar')" />
            </VCol>
            <VCol cols="12" lg="12" sm="6">
              <VSelect v-model="cityData.country_id" :items="countries.value" :label="t('forms.countries')"
                item-title="name_ar" item-value="id" />
            </VCol>
            <VCol cols="12" lg="12" sm="6">
              <VTextField v-model="cityData.min_price" :label="t('forms.min_price')" :rules="[requiredValidator]" />
            </VCol>
            <VCol cols="12" lg="12" sm="6">
              <VSwitch :label="t('forms.allow_cash')" v-model="cityData.allow_cash"></VSwitch>
            </VCol>
            <VCol cols="12" lg="12" sm="6">
              <VSwitch :label="t('available_for_delivery')" v-model="cityData.is_available_for_delivery"></VSwitch>
            </VCol>
            <VCol cols="12">
              <MapAutoComplete @select-location="getSelectedLocation"></MapAutoComplete>
              <!--              <AddCityMap :location="location" @getPaths="getPathsData"></AddCityMap>-->
              <GoogleMap api-key="AIzaSyCM2TngqydZtVlZ5hkKjY7x56ut59TTI88" style="width: 100%; height: 500px"
                :center="{ lat: Number(center.lat), lng: Number(center.lng) }" :zoom="10" @click="addMarker">
                <Marker v-for="(marker, index) in markers" :key="index" :options="marker" @click="deleteMark(marker)" />
                <Polygon :options="flightPath" />
              </GoogleMap>
            </VCol>
            <VCol cols="12" class="text-center">
              <VBtn v-if="!isLoading" type="submit" class="me-3">
                {{ t("buttons.save") }}
              </VBtn>
              <VBtn v-else type="submit" class="position-relative me-3">
                <VIcon icon="mingcute:loading-line" class="loading" size="32"></VIcon>
              </VBtn>

              <VBtn variant="tonal" color="secondary" @click="resetForm">
                {{ t("buttons.cancel") }}
              </VBtn>
            </VCol>
          </VRow>
        </VForm>
      </VCardText>
    </VCard>
  </VDialog>
</template>
