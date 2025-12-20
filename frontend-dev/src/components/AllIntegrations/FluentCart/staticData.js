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
  { key: 'note', label: 'Note', required: false }
]

export const OrderUpdateFields = [
  { key: 'order_id', label: 'Order ID', required: true },
  { key: 'status', label: 'Order Status', required: false },
  { key: 'payment_status', label: 'Payment Status', required: false },
  { key: 'shipping_status', label: 'Shipping Status', required: false },
  { key: 'note', label: 'Note', required: false }
]

export const OrderIdField = [{ key: 'order_id', label: 'Order ID', required: true }]

export const OrderStatusField = [
  { key: 'order_id', label: 'Order ID', required: true },
  { key: 'status', label: 'Status', required: true }
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
  { key: 'email', label: 'Email', required: true },
  { key: 'first_name', label: 'First Name', required: false },
  { key: 'last_name', label: 'Last Name', required: false },
  { key: 'phone', label: 'Phone', required: false },
  { key: 'status', label: 'Status', required: false }
]

export const CustomerUpdateFields = [
  { key: 'customer_id', label: 'Customer ID', required: true },
  { key: 'email', label: 'Email', required: false },
  { key: 'first_name', label: 'First Name', required: false },
  { key: 'last_name', label: 'Last Name', required: false },
  { key: 'phone', label: 'Phone', required: false },
  { key: 'status', label: 'Status', required: false }
]

export const CustomerIdField = [{ key: 'customer_id', label: 'Customer ID', required: true }]

export const ProductFields = [
  { key: 'title', label: 'Product Title', required: true },
  { key: 'description', label: 'Description', required: false },
  { key: 'price', label: 'Price', required: false },
  { key: 'status', label: 'Status', required: false },
  { key: 'type', label: 'Type', required: false }
]

export const ProductIdField = [{ key: 'product_id', label: 'Product ID', required: true }]

export const CouponFields = [
  { key: 'code', label: 'Coupon Code', required: true },
  { key: 'name', label: 'Coupon Name', required: false },
  { key: 'discount_type', label: 'Discount Type', required: false },
  { key: 'discount', label: 'Discount Amount', required: false },
  { key: 'status', label: 'Status', required: false }
]

export const CouponIdField = [{ key: 'coupon_id', label: 'Coupon ID', required: true }]
