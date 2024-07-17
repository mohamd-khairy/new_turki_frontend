<script setup>
import { useCitiesStore } from "@/store/Cities";
import { useCountriesStore } from "@/store/Countries";
import {
  requiredValidator,
} from '@validators';

const props = defineProps({
  isAddOpen: {
    type: Boolean,
    required: true,
  },
})

const emit = defineEmits([
  'refreshTable',
  'update:isAddOpen',
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

const refForm = ref(null)

const location = reactive({
  lat: null,
  lng: null,
})

onMounted(() => {
  navigator.geolocation.getCurrentPosition(position => {
    location.lat = position.coords.latitude
    location.lng = position.coords.longitude
    // markers.push({ position: { lat: position.coords.latitude, lng: position.coords.longitude } })
  })
  countriesListStore.fetchCountries().then(response => {
    countries.value = response.data.data
  })
})

const getPathsData = data => {
  paths.push(data)
}

const paths = reactive([])
const places = reactive([])
const center = reactive({ lat: 30.0564503, lng: -74.1840919 })
const markers = reactive([])

const city = reactive({
  name_ar: null,
  name_en: null,
  country_id: null,
  is_available_for_delivery: 0,
  polygon: [],
  allow_cash: false,
  min_price: null,
})

// Functions
const resetForm = () => {
  city.name_ar = null,
    city.name_en = null,
    city.country_id = null,
    city.is_available_for_delivery = false,
    city.allow_cash = false,
    city.min_price = false,
    city.polygon = []
  emit('update:isAddOpen', false)
}

const onFormSubmit = async () => {
  isLoading.value = true

  const res = await refForm.value.validate()

  if (res.valid) {
    let cityDt = {
      name_ar: city.name_ar,
      name_en: city.name_en,
      country_id: city.country_id,
      is_available_for_delivery: city.is_available_for_delivery,
      polygon: [],
      allow_cash: city.allow_cash,
      min_price: city.min_price,
    }
    places.map((path, index) => {
      cityDt.polygon.push([path.lat, path.lng])
    })

    // cityDt.polygon = `[${cityDt.polygon}]`
    citiesListStore.storeCity(cityDt).then(response => {
      emit('update:isAddOpen', false)
      emit('refreshTable')
      resetForm()
      settingsListStore.alertColor = "success"
      settingsListStore.alertMessage = "تم إضافة المدينة بنجاح"
      settingsListStore.isAlertShow = true
      setTimeout(() => {
        settingsListStore.isAlertShow = false
        settingsListStore.alertMessage = ""
      }, 2000)
      resetForm()
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
  emit('update:isAddOpen', val)
}

const getSelectedLocation = loc => {
  markers.length = 0
  location.lat = loc.lat
  location.lng = loc.lng
  city.latitude = loc.lat
  city.longitude = loc.lng
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
  <VDialog :width="$vuetify.display.smAndDown ? 'auto' : 650" :model-value="props.isAddOpen"
    @update:model-value="dialogModelValueUpdate">
    <!-- Dialog close btn -->
    <DialogCloseBtn @click="dialogModelValueUpdate(false)" />

    <VCard class="pa-sm-9 pa-5">
      <!-- 👉 Title -->
      <VCardItem>
        <VCardTitle class="text-h5 d-flex flex-column align-center gap-2 text-center mb-3">
          <VIcon icon="solar:city-broken" size="24" color="primary"></VIcon>
          <span class="mx-1 my-1">
            {{ t('Add_City') }}
          </span>
        </VCardTitle>
      </VCardItem>

      <VCardText>
        <!-- 👉 Form -->
        <VForm ref="refForm" @submit.prevent="onFormSubmit">
          <VRow>
            <VCol cols="12" lg="12" sm="6">
              <VTextField v-model="city.name_en" :label="t('forms.name_en')" :rules="[requiredValidator]" />
            </VCol>
            <VCol cols="12" lg="12" sm="6">
              <VTextField v-model="city.name_ar" :label="t('forms.name_ar')" :rules="[requiredValidator]" />
            </VCol>
            <VCol cols="12" lg="12" sm="6">
              <VSelect v-model="city.country_id" :items="countries.value" :label="t('forms.countries')"
                item-title="name_ar" item-value="id" :rules="[requiredValidator]" />
            </VCol>
            <VCol cols="12" lg="12" sm="6">
              <VTextField v-model="city.min_price" :label="t('forms.min_price')" :rules="[requiredValidator]" />
            </VCol>
            <VCol cols="12" lg="12" sm="6">
              <VSwitch :label="t('forms.allow_cash')" v-model="city.allow_cash"></VSwitch>
            </VCol>
            <VCol cols="12" lg="12" sm="6">
              <VSwitch :label="t('available_for_delivery')" v-model="city.is_available_for_delivery"></VSwitch>
            </VCol>
            
            <VCol cols="12">
              <MapAutoComplete @select-location="getSelectedLocation"></MapAutoComplete>
              <!--              <AddCityMap :location="location" @getPaths="getPathsData"></AddCityMap>-->
              <GoogleMap api-key="AIzaSyCM2TngqydZtVlZ5hkKjY7x56ut59TTI88" style="width: 100%; height: 500px"
                :center="{ lat: location.lat, lng: location.lng }" :zoom="12" @click="addMarker">
                <Marker v-for="(marker, index) in markers" :key="index" :options="marker" @click="deleteMark(marker)" />
                <Polygon
                  :options="{ path: places, geodesic: true, strokeColor: '#FF0000', strokeOpacity: 1.0, strokeWeight: 2 }" />
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
