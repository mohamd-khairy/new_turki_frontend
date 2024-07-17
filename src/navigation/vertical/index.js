export default [
  {
    title: 'Home',
    to: { name: 'index' },
    icon: { icon: 'tabler-smart-home' },
    permission: "read-dashboard",
  },
  {
    title: 'Banners',
    to: { name: 'banners' },
    icon: { icon: 'game-icons:vertical-banner' },
    permission: "read-banner",
  },
  {
    title: 'Orders',
    to: { name: 'orders' },
    icon: { icon: 'solar:delivery-broken' },
    permission: "read-order",
  },
  {
    title: 'Categories',
    to: { name: 'categories' },
    icon: { icon: 'carbon:categories' },
    permission: "read-category",
  },
  {
    title: 'Sub_Category',
    to: { name: 'sub-category' },
    icon: { icon: 'carbon:category-new-each' },
    permission: "read-sub-category",
  },
  {
    title: 'Products',
    to: { name: 'products' },
    icon: { icon: 'streamline:shopping-bag-hand-bag-1-shopping-bag-purse-goods-item-products' },
    permission: "read-product",
  },
  {
    title: 'المخزن',
    icon: { icon: 'carbon:store' },
    permission: "read-store",
    children: [
      {
        title: 'الفواتير',
        to: { name: 'invoices' },

        // icon: { icon: 'uil:invoice' },
        // permission: "read-product",
      },
      {
        title: 'المخزون',
        to: { name: 'stocks' },

        // icon: { icon: 'material-symbols:production-quantity-limits-sharp' },
        // permission: "read-stock",
      },
      {
        title: 'المخزن',
        to: { name: 'stores' },

        // icon: { icon: 'carbon:store' },
        // permission: "read-store",
      },
      {
        title: 'الموردون',
        to: { name: 'suppliers' },

        // icon: { icon: 'heroicons:truck' },
        // permission: "read-supplier",
      },
      {
        title: 'الخزن',
        to: { name: 'safes' },

        // icon: { icon: 'teenyicons-safe-outline' },
        // permission: "read-money-safe",
      },
      {
        title: 'البنوك',
        to: { name: 'banks' },

        // icon: { icon: 'mdi-bank-outline' },
        // permission: "read-bank",
      },
    ],
  },
  {
    title: 'Coupons',
    to: { name: 'coupons' },
    icon: { icon: 'bxs:coupon' },
    permission: "read-discount",
  },
  {
    title: 'Countries',
    to: { name: 'countries' },
    icon: { icon: 'material-symbols:globe' },
    permission: "read-country",
  },
  {
    title: 'Cities',
    to: { name: 'cities' },
    icon: { icon: 'solar:city-broken' },
    permission: "read-city",
  },
  {
    title: 'Customers',
    to: { name: 'customers' },
    icon: { icon: 'clarity:users-line' },
    permission: "read-customer",
  },
  {
    title: 'Employees',
    to: { name: 'employees' },
    icon: { icon: 'ph:users-four' },
    permission: "read-user",
  },
  {
    title: 'Roles',
    to: { name: 'roles' },
    icon: { icon: 'zondicons:shield' },
    permission: "read-role",
  },
  {
    title: 'Permissions',
    to: { name: 'permissions' },
    icon: { icon: 'zondicons:shield' },
    permission: "read-permission",
  },
  {
    title: 'Settings',
    icon: { icon: 'uil:setting' },
    children: [
      // { title: 'Product_Tags', to: 'product-tags' },
      { title: 'Product_Cut', to: 'product-cut' },
      { title: 'Product_Preparation', to: 'product-preparation' },
      { title: 'Product_Size', to: 'product-size' },
      { title: 'Product_Shalwata', to: 'product-shalwata' },

      // { title: 'Payment_Types', to: 'payment-types' },
      { title: 'Delivery_Periods', to: 'delivery-periods' },
      { title: 'Not_Delivery_Periods', to: 'not-delivery-periods' },
      { title: 'City_days', to: 'city-days' },
      { title: 'City_delivery_periods', to: 'city-delivery-periods' },

    ],
    permission: "read-product",
  },
  {
    title: 'Activities',
    to: { name: 'activities' },
    icon: { icon: 'octicon:log-24' },
    permission: "read-dashboard",
  },
]
