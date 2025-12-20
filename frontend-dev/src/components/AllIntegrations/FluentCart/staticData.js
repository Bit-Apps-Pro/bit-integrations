export const modules = [
  { name: 'create_order', label: 'Create Order', is_pro: true },
  { name: 'update_order', label: 'Update Order', is_pro: true },
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
  { key: 'customer_id', label: 'Customer ID', required: true },
  { key: 'status', label: 'Order Status', required: false },
  { key: 'payment_status', label: 'Payment Status', required: false },
  { key: 'shipping_status', label: 'Shipping Status', required: false },
  { key: 'currency', label: 'Currency', required: false },
  { key: 'payment_method', label: 'Payment Method', required: false },
  { key: 'payment_method_title', label: 'Payment Method Title', required: false },
  { key: 'note', label: 'Note', required: false }
]

export const OrderUpdateFields = [
  { key: 'invoice_no', label: 'Order Invoice Number', required: true },
  { key: 'status', label: 'Order Status', required: false },
  { key: 'payment_status', label: 'Payment Status', required: false },
  { key: 'shipping_status', label: 'Shipping Status', required: false },
  { key: 'payment_method', label: 'Payment Method', required: false },
  { key: 'payment_method_title', label: 'Payment Method Title', required: false },
  { key: 'note', label: 'Note', required: false }
]

export const OrderIdField = [{ key: 'invoice_no', label: 'Order Invoice Number', required: true }]

export const OrderStatusField = [
  { key: 'invoice_no', label: 'Order Invoice Number', required: true },
  { key: 'status', label: 'Order Status', required: true }
]

export const PaymentStatusField = [
  { key: 'invoice_no', label: 'Order Invoice Number', required: true },
  { key: 'payment_status', label: 'Payment Status', required: true }
]

export const ShippingStatusField = [
  { key: 'invoice_no', label: 'Order Invoice Number', required: true },
  { key: 'shipping_status', label: 'Shipping Status', required: true }
]

export const CustomerFields = [
  { key: 'email', label: 'Email Address', required: true },
  { key: 'first_name', label: 'First Name', required: false },
  { key: 'last_name', label: 'Last Name', required: false },
  { key: 'status', label: 'Status', required: false },
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
  { key: 'status', label: 'Status', required: false },
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
  { key: 'product_price', label: 'Product Price', required: false },
  { key: 'stock_quantity', label: 'Stock Quantity', required: false },
  { key: 'compare_price', label: 'Compare Price', required: false },
  { key: 'stock_status', label: 'Stock Status', required: false }
]

export const ProductIdField = [{ key: 'post_title', label: 'Product Title', required: true }]

export const CouponFields = [
  { key: 'code', label: 'Coupon Code', required: true },
  { key: 'title', label: 'Coupon Title', required: true },
  { key: 'type', label: 'Discount Type', required: true },
  { key: 'amount', label: 'Discount Amount', required: true }
]

export const CouponIdField = [{ key: 'code', label: 'Coupon Code', required: true }]
