<script setup>
import { useOrdersStore } from "@/store/Orders"
import moment from "moment"

const ordersListStore = useOrdersStore()
const route = useRoute()

const order = ref({})
const isLoading = ref(true)
const isEditOpen = ref(false)

const { t } = useI18n()

const i18n = useI18n()

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

const getOrderDetails = id => {
  ordersListStore.fetchOrder(id).then(response => {
    order.value = response?.data.data
    isLoading.value = false
  }).catch(error => {
    isLoading.value = false
  })
}

onMounted(() => {
  const id = route.params.id

  getOrderDetails(id)
})
</script>

<template>
  <div>
    <div class="loader_wrap" v-if="isLoading">
      <img src="@/assets/images/logo.png" alt="turki"/>
      <p class="text-2xl">جاري جلب البيانات ...</p>
    </div>
    <div class="card-wrapper" v-else>
      <div class="row pad-top-botm ">
        <div class="col-lg-6 col-md-6 col-sm-6 ">
          <!--          <img src="assets/img/logo.jpg" style="padding-bottom:20px;">-->
        </div>
        <div class="col-lg-6 col-md-6 col-sm-6">

          <strong>Brian Bossier Design</strong>
          <br>
          <i>Address :</i> Barrington, IL
          <br>
          89th street , Suite 69,
          <br>
          United States.

        </div>
      </div>
      <div class="row text-center contact-info">
        <div class="col-lg-12 col-md-12 col-sm-12">
          <hr>
          <span>
                 <strong>Email : </strong>  brian@brianbossierdesign.com
             </span>
          <span>
                 <strong>Call : </strong>  +1-623-777-9044
             </span>
          <span>
                 <strong>Fax : </strong>  +012340-908- 890
             </span>
          <hr>
        </div>
      </div>
      <div class="row pad-top-botm client-info">
        <div class="col-lg-6 col-md-6 col-sm-6">
          <h4><strong>Client Information</strong></h4>
          <strong> Classy Client</strong>
          <br>
          <b>Address :</b> 111 , their street name,
          <br>
          United States.
          <br>
          <b>Call :</b> +1-908-567-0987
          <br>
          <b>E-mail :</b> info@clientdomain.com
        </div>
        <div class="col-lg-6 col-md-6 col-sm-6">

          <h4><strong>Payment Details </strong></h4>
          <b>Bill Amount : 990 USD </b>
          <br>
          Bill Date : 01th August 2014
          <br>
          <b>Payment Status : Paid </b>
          <br>
          Delivery Date : 10th August 2014
          <br>
          Purchase Date : 30th July 2014
        </div>
      </div>
      <div class="row">
        <div class="col-lg-12 col-md-12 col-sm-12">
          <div class="table-responsive">
            <table class="table table-striped table-bordered table-hover">
              <thead>
              <tr>
                <th>STYLE</th>
                <th>COLOR</th>
                <th>Quantity.</th>
                <th>Unit Price</th>
                <th>Sub Total</th>
              </tr>
              </thead>
              <tbody>
              <tr>
                <td>SHOE DESIGN 2</td>
                <td>BLACK</td>
                <td>3</td>
                <td>$435 USD</td>
                <td>$1,305 USD</td>
              </tr>
              <tr>
                <td>SHOE DESIGN 1</td>
                <td>Website Design</td>
                <td>3</td>
                <td>$435 USD</td>
                <td>$1,305 USD</td>
              </tr>
              <tr>
                <td>3</td>
                <td>Hosting Domains</td>
                <td>2</td>
                <td>100 USD</td>
                <td>200 USD</td>
              </tr>
              </tbody>
            </table>
          </div>
          <hr>
          <div class="ttl-amts">
            <h5> Total Amount : 900 USD </h5>
          </div>
          <hr>
          <div class="ttl-amts">
            <h5> Tax : 90 USD ( by 10 % on bill ) </h5>
          </div>
          <hr>
          <div class="ttl-amts">
            <h4><strong>Bill Amount : 990 USD</strong></h4>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-lg-12 col-md-12 col-sm-12">
          <strong> Important: </strong>
          <ol>
            <li>
              This is an electronic generated invoice so doesn't require any signature.

            </li>
            <li>
              Please read all terms and polices on www.yourdomaon.com for returns, replacement and other issues.

            </li>
          </ol>
        </div>
      </div>
      <div class="row pad-top-botm">
        <div class="col-lg-12 col-md-12 col-sm-12">
          <hr>
          <a href="#" class="btn btn-primary btn-lg">Print Invoice</a>
          &nbsp;&nbsp;&nbsp;
          <a href="#" class="btn btn-success btn-lg">Download In Pdf</a>

        </div>
      </div>
    </div>
    <EditOrderDeatilsDialog v-model:isEditOpen="isEditOpen" :item="order" @refrshTable="getOrderDetails"
    ></EditOrderDeatilsDialog>
  </div>
</template>

<style scoped lang="scss">
.loader_wrap {
  text-align: center;

  img {
    width: 300px;
    margin: 0 auto;
  }

  p {
    margin-top: 0;
  }
}

img {
  width: 100%;
  display: block;
}

.img-display {
  overflow: hidden;
  max-width: 500px;
}

.img-showcase {
  display: flex;
  width: 100%;
  transition: all 0.5s ease;
}

.img-showcase img {
  min-width: 100%;
}

.img-select {
  display: flex;
}

.img-item {
  margin: 0.3rem;
}

.img-item:nth-child(1),
.img-item:nth-child(2),
.img-item:nth-child(3) {
  margin-right: 0;
}

.img-item:hover {
  opacity: 0.8;
}

.order-content {
  padding: 2rem 1rem;
}

.order-title {
  width: fit-content;
  font-size: 3rem;
  text-transform: capitalize;
  font-weight: 700;
  position: relative;
  //color: #12263a;
  margin: 1rem 0;
}

.order-title::after {
  content: "";
  position: absolute;
  right: 0;
  bottom: 0;
  height: 4px;
  width: 50%;
  background: rgb(var(--v-global-theme-primary));
}

.order-detail h2 {
  position: relative;
  width: fit-content;
  margin-bottom: 20px;
}

.order-detail h2::after {
  content: "";
  position: absolute;
  right: 0;
  bottom: 0;
  height: 4px;
  width: 100%;
  background: rgb(var(--v-global-theme-primary));
}

.order-link {
  text-decoration: none;
  text-transform: uppercase;
  font-weight: 400;
  font-size: 0.9rem;
  display: inline-block;
  margin-bottom: 0.5rem;
  background: #256eff;
  color: #fff;
  padding: 0 0.3rem;
  transition: all 0.5s ease;
}


@media screen and (min-width: 992px) {
  .card {
    display: grid;
    grid-template-columns: 2fr 1fr;
    grid-gap: 1rem;
  }
  .card-wrapper {
    //height: 100vh;
    //display: flex;
    justify-content: center;
    align-items: center;
  }
  .order-imgs {
    max-width: 500px;
  }
  .order-content {
    padding-top: 0;
  }
}
</style>
