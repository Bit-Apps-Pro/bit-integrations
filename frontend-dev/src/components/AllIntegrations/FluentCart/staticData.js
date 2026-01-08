export const modules = [
  { name: 'create_order', label: 'Create Order', is_pro: true },
  { name: 'delete_order', label: 'Delete Order', is_pro: true },
  { name: 'update_order_status', label: 'Update Order Status', is_pro: true },
  { name: 'update_payment_status', label: 'Update Payment Status', is_pro: true },
  { name: 'update_shipping_status', label: 'Update Shipping Status', is_pro: true },
  { name: 'create_customer', label: 'Create Customer', is_pro: true },
  { name: 'update_customer', label: 'Update Customer', is_pro: true },
  { name: 'delete_customer', label: 'Delete Customer', is_pro: true },
  { name: 'create_product', label: 'Create Product', is_pro: true },
  { name: 'delete_product', label: 'Delete Product', is_pro: true },
  { name: 'create_coupon', label: 'Create Coupon', is_pro: true },
  { name: 'delete_coupon', label: 'Delete Coupon', is_pro: true }
]

export const OrderFields = [
  { key: 'type', label: 'Order Type', required: false },
  { key: 'mode', label: 'Order Mode', required: false },
  { key: 'payment_method', label: 'Payment Method', required: false },
  { key: 'payment_method_title', label: 'Payment Method Title', required: false },
  { key: 'currency', label: 'Currency Code', required: false },
  { key: 'subtotal', label: 'Subtotal', required: false },
  { key: 'discount_tax', label: 'Discount Tax', required: false },
  { key: 'manual_discount_total', label: 'Manual Discount Total', required: false },
  { key: 'coupon_discount_total', label: 'Coupon Discount Total', required: false },
  { key: 'shipping_tax', label: 'Shipping Tax', required: false },
  { key: 'shipping_total', label: 'Shipping Total', required: false },
  { key: 'tax_total', label: 'Tax Total', required: false },
  { key: 'total_amount', label: 'Total Amount', required: false },
  { key: 'rate', label: 'Exchange Rate', required: false },
  { key: 'tax_behavior', label: 'Tax Behavior', required: false },
  { key: 'note', label: 'Order Note', required: false }
]

export const OrderIdField = [{ key: 'order_id', label: 'Order ID', required: true }]

export const OrderStatusField = [
  { key: 'order_id', label: 'Order ID', required: true },
  { key: 'status', label: 'Order Status', required: true }
]

export const PaymentStatusField = [
  { key: 'order_id', label: 'Order ID', required: true },
  { key: 'payment_status', label: 'Payment Status', required: true }
]

export const ShippingStatusField = [
  { key: 'order_id', label: 'Order ID', required: true },
  { key: 'shipping_status', label: 'Shipping Status', required: true }
]

export const CustomerFields = [
  { key: 'email', label: 'Email Address', required: true },
  { key: 'first_name', label: 'First Name', required: false },
  { key: 'last_name', label: 'Last Name', required: false },
  { key: 'country', label: 'Country', required: false },
  { key: 'city', label: 'City', required: false },
  { key: 'state', label: 'State', required: false },
  { key: 'postcode', label: 'Postcode', required: false },
  { key: 'notes', label: 'Notes', required: false }
]

export const CustomerUpdateFields = [
  { key: 'email', label: 'Customer Email', required: true },
  { key: 'new_email', label: 'New Email Address', required: false },
  { key: 'first_name', label: 'First Name', required: false },
  { key: 'last_name', label: 'Last Name', required: false },
  { key: 'country', label: 'Country', required: false },
  { key: 'city', label: 'City', required: false },
  { key: 'state', label: 'State', required: false },
  { key: 'postcode', label: 'Postcode', required: false },
  { key: 'notes', label: 'Notes', required: false }
]

export const CustomerIdField = [{ key: 'email', label: 'Customer Email', required: true }]

export const ProductFields = [
  { key: 'post_title', label: 'Product Title', required: true },
  { key: 'post_name', label: 'Product Slug', required: false },
  { key: 'post_excerpt', label: 'Short Description', required: false },
  { key: 'post_content', label: 'Long Description', required: false },
  { key: 'product_status', label: 'Product Status', required: false },
  { key: 'product_price', label: 'Product Price', required: false },
  { key: 'stock_quantity', label: 'Stock Quantity', required: false },
  { key: 'compare_price', label: 'Compare Price', required: false },
  { key: 'stock_status', label: 'Stock Status', required: false },
  { key: 'manage_downloadable', label: 'Enable Downloadable Management', required: false },
  { key: 'featured_media_id', label: 'Featured Media ID', required: false },
  { key: 'gallery_image_ids', label: 'Gallery Image IDs (JSON array)', required: false }
]

export const ProductSlugField = [{ key: 'product_slug', label: 'Product Slug', required: true }]

export const CouponFields = [
  { key: 'code', label: 'Coupon Code', required: true },
  { key: 'title', label: 'Coupon Title', required: true },
  { key: 'amount', label: 'Discount Amount', required: true }
]

export const CouponIdField = [{ key: 'code', label: 'Coupon Code', required: true }]
