<template>
  <VCard :loading="cashierStore.isLoading">
    <div>
      <VCard class="mb-5 pa-5">
        <VRow>
          <VCol
            cols="12"
            class="d-flex align-center gap-3"
          >
            <div class="icon">
              <VIcon
                icon="fluent-mdl2:date-time"
                color="primary"
              />
            </div>
            <VTextField
              v-model="filters.start_date"
              type="date"
              :label="t('forms.from')"
            />

            <div class="icon">
              <VIcon
                icon="fluent-mdl2:date-time"
                color="primary"
              />
            </div>
            <VTextField
              v-model="filters.end_date"
              type="date"
              :label="t('forms.to')"
            />

            <VBtn
              prepend-icon="healthicons:x"
              @click.stop="clearFilter"
            >
              {{ t('Clear_Filter') }}
            </VBtn>
          </VCol>
        </VRow>
      </VCard>
    </div>

    <VCardTitle class="d-flex align-center">
      <VIcon
        icon="solar:delivery-broken"
        size="24"
        color="primary"
      />
      <span class="mx-1">التسويات</span>
      <VSpacer />
      <VBtn
        v-if="!cashierStore.isLoading && cashierStore.usersSales.length > 0"
        prepend-icon="mdi-download"
        @click.stop="downloadPDF"
      >
        طبــاعة
      </VBtn>
    </VCardTitle>
    <VTable
      id="table-to-pdf"
      height="600px"
      fixed-header
      class="text-no-wrap product-list-table text-center"
    >
      <thead>
        <tr>
          <th
            scope="col"
            class="font-weight-semibold"
          >
            التاريخ
          </th>

          <th
            scope="col"
            class="font-weight-semibold"
          >
            اسم الموظف
          </th>
          <th
            scope="col"
            class="font-weight-semibold"
          >
            اسم الفرع
          </th>
          <th
            scope="col"
            class="font-weight-semibold"
          >
            عدد الطلبات
          </th>
          <th
            v-for="paymentType in cashierStore.paymentTypes"
            :key="paymentType.id"
            scope="col"
            class="font-weight-semibold"
          >
            {{ locale == 'en' ? paymentType.name_en : paymentType.name_ar }}
          </th>
          <!--
            <th
            scope="col"
            class="font-weight-semibold"
            >
            المرتجع
            </th>
          -->
          <th
            scope="col"
            class="font-weight-semibold"
          >
            المجموع
          </th>
        </tr>
      </thead>
      <tbody v-if="cashierStore.isLoading">
        <tr
          v-for="tableRow in 4"
          :key="tableRow"
        >
          <td
            v-for="tableTD in 4"
            :key="tableTD"
          >
            <div>
              <VSkeletonLoader
                type="text"
                :height="40"
                :width="100"
              />
            </div>
          </td>
        </tr>
      </tbody>
      <tbody v-else>
        <template
          v-for="user in cashierStore.usersSales"
          :key="user.user_id"
        >
          <tr>
            <td>{{ user.date }}</td>
            <td>{{ user.user_name }}</td>
            <td>{{ user.branch_name }}</td>
            <td class="font-weight-semibold">
              {{ user.order_count }}
            </td>
            <td
              v-for="paymentType in cashierStore.paymentTypes"
              :key="paymentType.id"
              scope="col"
              class="font-weight-semibold"
            >
              {{ user[paymentType.name_en] }}
            </td>
            <!-- <td>{{ ConvertToArabicNumbers(user.refund) }}</td> -->
            <td class="font-weight-semibold">
              {{ user.total }}
            </td>
          </tr>
        </template>
      </tbody>
      <tfoot v-show="!cashierStore.isLoading && cashierStore.usersSales.length == 0">
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
  </VCard>
</template>

<script setup>
import { useCashierStore } from '@/store/Cashier'
import html2pdf from 'html2pdf.js'
import { useI18n } from 'vue-i18n'

const downloadPDF = () => {
  const element = document.getElementById('table-to-pdf') // Target the table container

  // Temporarily scale the content to fit within the PDF
  element.style.width = '160%'
  element.style.overflow = 'visible'
  element.style.whiteSpace = 'nowrap'

  // Temporarily apply styles to remove padding and spacing
  const table = element.querySelector('table')

  table.style.borderCollapse = 'collapse'
  table.style.width = '100%'

  // Remove padding and spacing for all cells
  const cells = table.querySelectorAll('th, td')

  cells.forEach(cell => {
    cell.style.padding = '0'  // Remove padding
    cell.style.margin = '0'
    cell.style.borderSpacing = '0'
    cell.style.borderCollapse = 'collapse'
  })

  // Options for html2pdf
  const options = {
    margin: [10, 5, 10, 5], // [top, left, bottom, right] margins
    filename: 'cashier_sales_report.pdf', // Output file name
    image: { type: 'jpeg', quality: 0.98 }, // Image quality settings
    html2canvas: {
      scale: 2,   // Increase resolution for better clarity
      scrollY: 0, // Prevent Y-axis scrolling
      scrollX: 0, // Prevent X-axis scrolling
      useCORS: true, // Handle external styles
    },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' }, // A4 in landscape mode
  }

  // Generate PDF
  html2pdf()
    .set(options)
    .from(element)
    .toPdf()
    .get('pdf')
    .then(function (pdf) {
      const totalPages = pdf.internal.getNumberOfPages()
      for (let i = 1; i <= totalPages; i++) {
        pdf.setPage(i)
        pdf.setFontSize(10)
        pdf.text(`Page ${i} of ${totalPages}`, pdf.internal.pageSize.width - 20, pdf.internal.pageSize.height - 10)
      }
    })

  // .save()
  // .then(() => {
  //   // Restore styles after PDF generation
  //   element.style.width = ''
  //   element.style.overflow = ''
  //   element.style.whiteSpace = ''
  //   cells.forEach(cell => {
  //     cell.style.padding = ''  // Restore padding
  //   })
  // })

    .output('blob') // Generate the PDF as a Blob object
    .then(pdfBlob => {

      // Restore styles after PDF generation
      element.style.width = ''
      element.style.overflow = ''
      element.style.whiteSpace = ''
      cells.forEach(cell => {
        cell.style.padding = ''  // Restore padding
      })

      // Create a Blob URL for the PDF
      const pdfBlobUrl = URL.createObjectURL(pdfBlob)
      const printIframe = document.createElement('iframe')

      printIframe.style.position = 'absolute'
      printIframe.style.top = '-1000px'
      printIframe.style.left = '-1000px'
      printIframe.src = pdfBlobUrl
      document.body.appendChild(printIframe)

      printIframe.onload = () => {
        printIframe.contentWindow.print()

        setTimeout(() => {
          // document.body.removeChild(printIframe)
          URL.revokeObjectURL(pdfBlobUrl)
        }, 500) // Clean up
      }

    })

}

const cashierStore = useCashierStore()
const { t, locale } = useI18n()

const filters = reactive({
  start_date: null,
  end_date: null,
})

const isLoading = ref(false)
const isFiltered = ref(false)

const clearFilter = () => {
  filters.start_date = null,
  filters.end_date = null
}

const ConvertToArabicNumbers = num => {

  const arabicNumbers = "\u0660\u0661\u0662\u0663\u0664\u0665\u0666\u0667\u0668\u0669"

  return String(num).replace(/[0123456789]/g, d => arabicNumbers[d])
}

const getItems = () => {
  cashierStore.userSalesList({
    start_date: filters.start_date,
    end_date: filters.end_date,
  })
}

onMounted(async () => {
  // await getItems()
})



watchEffect(() => {
  getItems()
})
</script>
