import { __ } from '../../../Utils/i18nwrap'

export const modules = [
  { name: 'create_order', label: __('Create Order', 'bit-integrations'), is_pro: true },
  { name: 'delete_order', label: __('Delete Order', 'bit-integrations'), is_pro: true },
  { name: 'update_order_status', label: __('Update Order Status', 'bit-integrations'), is_pro: true },
  {
    name: 'update_payment_status',
    label: __('Update Payment Status', 'bit-integrations'),
    is_pro: true
  },
  {
    name: 'update_shipping_status',
    label: __('Update Shipping Status', 'bit-integrations'),
    is_pro: true
  },
  { name: 'create_customer', label: __('Create Customer', 'bit-integrations'), is_pro: true },
  { name: 'update_customer', label: __('Update Customer', 'bit-integrations'), is_pro: true },
  { name: 'delete_customer', label: __('Delete Customer', 'bit-integrations'), is_pro: true },
  { name: 'create_product', label: __('Create Product', 'bit-integrations'), is_pro: true },
  { name: 'delete_product', label: __('Delete Product', 'bit-integrations'), is_pro: true },
  { name: 'create_coupon', label: __('Create Coupon', 'bit-integrations'), is_pro: true },
  { name: 'delete_coupon', label: __('Delete Coupon', 'bit-integrations'), is_pro: true }
]

export const OrderFields = [
  { key: 'type', label: __('Order Type', 'bit-integrations'), required: false },
  { key: 'mode', label: __('Order Mode', 'bit-integrations'), required: false },
  { key: 'payment_method', label: __('Payment Method', 'bit-integrations'), required: false },
  {
    key: 'payment_method_title',
    label: __('Payment Method Title', 'bit-integrations'),
    required: false
  },
  { key: 'currency', label: __('Currency Code', 'bit-integrations'), required: false },
  { key: 'subtotal', label: __('Subtotal', 'bit-integrations'), required: false },
  { key: 'discount_tax', label: __('Discount Tax', 'bit-integrations'), required: false },
  {
    key: 'manual_discount_total',
    label: __('Manual Discount Total', 'bit-integrations'),
    required: false
  },
  {
    key: 'coupon_discount_total',
    label: __('Coupon Discount Total', 'bit-integrations'),
    required: false
  },
  { key: 'shipping_tax', label: __('Shipping Tax', 'bit-integrations'), required: false },
  { key: 'shipping_total', label: __('Shipping Total', 'bit-integrations'), required: false },
  { key: 'tax_total', label: __('Tax Total', 'bit-integrations'), required: false },
  { key: 'total_amount', label: __('Total Amount', 'bit-integrations'), required: false },
  { key: 'rate', label: __('Exchange Rate', 'bit-integrations'), required: false },
  { key: 'tax_behavior', label: __('Tax Behavior', 'bit-integrations'), required: false },
  { key: 'note', label: __('Order Note', 'bit-integrations'), required: false }
]

export const OrderIdField = [
  { key: 'order_id', label: __('Order ID', 'bit-integrations'), required: true }
]

export const OrderStatusField = [
  { key: 'order_id', label: __('Order ID', 'bit-integrations'), required: true },
  { key: 'status', label: __('Order Status', 'bit-integrations'), required: true }
]

export const PaymentStatusField = [
  { key: 'order_id', label: __('Order ID', 'bit-integrations'), required: true },
  { key: 'payment_status', label: __('Payment Status', 'bit-integrations'), required: true }
]

export const ShippingStatusField = [
  { key: 'order_id', label: __('Order ID', 'bit-integrations'), required: true },
  { key: 'shipping_status', label: __('Shipping Status', 'bit-integrations'), required: true }
]

export const CustomerFields = [
  { key: 'email', label: __('Email Address', 'bit-integrations'), required: true },
  { key: 'first_name', label: __('First Name', 'bit-integrations'), required: false },
  { key: 'last_name', label: __('Last Name', 'bit-integrations'), required: false },
  { key: 'country', label: __('Country', 'bit-integrations'), required: false },
  { key: 'city', label: __('City', 'bit-integrations'), required: false },
  { key: 'state', label: __('State', 'bit-integrations'), required: false },
  { key: 'postcode', label: __('Postcode', 'bit-integrations'), required: false },
  { key: 'notes', label: __('Notes', 'bit-integrations'), required: false }
]

export const CustomerUpdateFields = [
  { key: 'email', label: __('Customer Email', 'bit-integrations'), required: true },
  { key: 'new_email', label: __('New Email Address', 'bit-integrations'), required: false },
  { key: 'first_name', label: __('First Name', 'bit-integrations'), required: false },
  { key: 'last_name', label: __('Last Name', 'bit-integrations'), required: false },
  { key: 'country', label: __('Country', 'bit-integrations'), required: false },
  { key: 'city', label: __('City', 'bit-integrations'), required: false },
  { key: 'state', label: __('State', 'bit-integrations'), required: false },
  { key: 'postcode', label: __('Postcode', 'bit-integrations'), required: false },
  { key: 'notes', label: __('Notes', 'bit-integrations'), required: false }
]

export const CustomerIdField = [
  { key: 'email', label: __('Customer Email', 'bit-integrations'), required: true }
]

export const ProductFields = [
  { key: 'post_title', label: __('Product Title', 'bit-integrations'), required: true },
  { key: 'post_name', label: __('Product Slug', 'bit-integrations'), required: false },
  { key: 'post_excerpt', label: __('Short Description', 'bit-integrations'), required: false },
  { key: 'post_content', label: __('Long Description', 'bit-integrations'), required: false },
  { key: 'product_status', label: __('Product Status', 'bit-integrations'), required: false },
  { key: 'product_price', label: __('Product Price', 'bit-integrations'), required: false },
  { key: 'stock_quantity', label: __('Stock Quantity', 'bit-integrations'), required: false },
  { key: 'compare_price', label: __('Compare Price', 'bit-integrations'), required: false },
  { key: 'stock_status', label: __('Stock Status', 'bit-integrations'), required: false },
  {
    key: 'manage_downloadable',
    label: __('Enable Downloadable Management', 'bit-integrations'),
    required: false
  },
  { key: 'featured_media_id', label: __('Featured Media ID', 'bit-integrations'), required: false },
  {
    key: 'gallery_image_ids',
    label: __('Gallery Image IDs (JSON array)', 'bit-integrations'),
    required: false
  }
]

export const ProductSlugField = [
  { key: 'product_slug', label: __('Product Slug', 'bit-integrations'), required: true }
]

export const CouponFields = [
  { key: 'code', label: __('Coupon Code', 'bit-integrations'), required: true },
  { key: 'title', label: __('Coupon Title', 'bit-integrations'), required: true },
  { key: 'amount', label: __('Discount Amount', 'bit-integrations'), required: true }
]

export const CouponIdField = [
  { key: 'code', label: __('Coupon Code', 'bit-integrations'), required: true }
]
