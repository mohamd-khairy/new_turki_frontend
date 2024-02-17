<script setup>
import { useSuppliersStore } from "@/store/Suppliers"
import moment from "moment"

const route = useRoute()
const router = useRouter()
const suppliersStore = useSuppliersStore()

const suppliersItems = ref([])
const isLoading = ref(true)

const ConvertToArabicNumbers = num => {
  const arabicNumbers = "\u0660\u0661\u0662\u0663\u0664\u0665\u0666\u0667\u0668\u0669"

  return String(num).replace(/[0123456789]/g, d => {
    return arabicNumbers[d]
  })
}

const formatDateTime = data => {
  let date = moment(data).format("DD-MM-YYYY")
  let time = moment(data).format("hh:mm:ss A")

  return { date, time }
}

const printOrder = () => {
  window.print()
}

// const orderCurrency = computed(() => {
//   if(order.value.order?.selected_address?.country_id == 4) {
//     return 'درهم';
//   }

//   return 'ريال';
// });

// const isUAEOrder = computed(() => order.value.order?.selected_address?.country_id == 4);

const getSuppliers = routeQuery => {
  isLoading.value = true
  suppliersStore.getAll({
    ...routeQuery,
    per_page: 100,
  }).then(response => {
    suppliersItems.value = response.data?.data?.data

    setTimeout(() => {
      printOrder()
    }, 500)
  }).catch(error => {
    console.log(error)
  }).finally(() => {
    isLoading.value = false
    setTimeout(() => {
      window.close()
    }, 1500)
  })
}

const totalPrice = computed(() =>
  suppliersItems.value.reduce((sum, item) => (parseFloat(sum) + parseFloat(item.balance)), 0),
)


const getTodayDate = () => {
  const today = new Date()
  const year = today.getFullYear()
  const month = today.getMonth() + 1 // Months are zero-indexed, so add 1
  const day = today.getDate()
  
  return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`
}

onMounted(() => {
  const routeQuery = route.query

  console.log({ routeQuery })

  getSuppliers(routeQuery)
})
</script>

<template>
  <div>
    <div
      v-if="isLoading"
      class="loader_wrap"
    >
      <img
        src="@/assets/images/logo.png"
        alt="turki"
      >
      <p class="text-2xl">
        جاري جلب البيانات ...
      </p>
    </div>
    <div
      v-else
      id="invoice"
      class="card-wrapper invoice-container"
    >
      <VRow
        justify="space-between"
        class="mb-2 pa-0"
      >
        <VCol
          cols="12"
          class="py-0"
        >
          <div class="d-flex justify-space-between align-center">
            <div>
              <h4 class="d-flex align-center gap-3 mb-3 text-base">
                <span>بيانات الموردين</span>
              </h4>
            </div>
            <img
              src="/src/assets/images/logo.png"
              alt="تركي للذبائح"
              width="200"
              class="turki_logo"
            >
          </div>
        </VCol>
      </VRow>
      <VRow>
        <VCol>
          <VTable class="mb-4">
            <thead>
              <tr>
                <th class="text-base">
                  #
                </th>
                <th class="text-base">
                  الاسم
                </th>
                <th class="text-base">
                  الهاتف
                </th>
                <th class="text-base">
                  المنطقة
                </th>
                <th class="text-base">
                  الرصيد
                </th>
              
                <!-- <th class="text-base">تاريخ الإنشاء</th> -->
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(supplier, index) in suppliersItems"
                :key="index"
              >
                <td>
                  <small>{{ (index + 1) }}</small>
                </td>
                <td>
                  <small>{{ supplier.name }}</small>
                </td>
                <td>
                  <small>{{ supplier.mobile }}</small>
                </td>
                <td>
                  <small>{{ supplier.city?.name_ar }}</small>
                </td>
                <td>
                  <small>{{ supplier.balance }}</small>
                </td>
               
                <!--
                  <td>
                  <small>{{ ConvertToArabicNumbers(formatDateTime(supplier.created_at).date) }}</small>
                  </td>
                -->
              </tr>
              <tr>
                <td
                  colspan="3"
                  class="text-center"
                >
                  <small>المجموع</small>  
                </td>
              
                <td
                  colspan="2"
                  class="text-center"
                >
                  <small>{{ totalPrice }}</small>
                </td>
              </tr>
            </tbody>
          </VTable>
        </VCol>
      </VRow>
    </div>
  </div>
</template>

<style scoped lang="scss">
.invoice-container {
  margin-block-start: -100px;

  .text-base {
    font-size: 1.2rem !important;
    font-weight: 600;
  }
}

.loader_wrap {
  text-align: center;

  img {
    inline-size: 300px;
    margin-block: 0;
    margin-inline: auto;
  }

  p {
    margin-block-start: 0;
  }
}

table thead th {
  border-block-start: 1px solid;
  font-size: 1.2rem;
  font-weight: 600;

  small {
    font-size: 1.2rem;
    font-weight: 600;
  }
}

table tbody td {
  border-block-end: 1px solid;
  border-block-start: 1px solid;
  font-size: 1.2rem;

  small {
    font-size: 1.2rem;
    font-weight: 600;
  }
}

table th {
  border-inline-end: 1px solid;
  border-inline-start: 1px solid;
}

table td {
  border-inline-end: 1px solid;
  border-inline-start: 1px solid;
}
</style>
