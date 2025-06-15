<?php
namespace BitCode\FI\Triggers\EDD;

class EDDHelper
{
    public static function fields($id)
    {
        if (empty($id)) {
            wp_send_json_error(
                __(
                    'Requested parameter is empty',
                    'bit-integrations'
                ),
                400
            );
        }

        $userFields = [
            'First Name' => (object) [
                'fieldKey' => 'first_name',
                'fieldName' => 'First Name'
            ],
            'Last Name' => (object) [
                'fieldKey' => 'last_name',
                'fieldName' => 'Last Name'
            ],
            'Nick Name' => (object) [
                'fieldKey' => 'nickname',
                'fieldName' => 'Nick Name'
            ],
            'Avatar URL' => (object) [
                'fieldKey' => 'avatar_url',
                'fieldName' => 'Avatar URL'
            ],
            'Email' => (object) [
                'fieldKey' => 'user_email',
                'fieldName' => 'Email',
            ],
        ];

        if ($id == 1 || $id == 2) {
            $fields = [
                'User Id' => (object) [
                    'fieldKey' => 'user_id',
                    'fieldName' => 'User Id'
                ],
                'First Name' => (object) [
                    'fieldKey' => 'first_name',
                    'fieldName' => 'First Name'
                ],
                'Last Name' => (object) [
                    'fieldKey' => 'last_name',
                    'fieldName' => 'Last Name'
                ],
                'Email' => (object) [
                    'fieldKey' => 'user_email',
                    'fieldName' => 'Email',
                ],
                'Product Id' => (object) [
                    'fieldKey' => 'product_id',
                    'fieldName' => 'Product Id'
                ],
                'Product Name' => (object) [
                    'fieldKey' => 'product_name',
                    'fieldName' => 'Product Name'
                ],
                'Order Item Id' => (object) [
                    'fieldKey' => 'order_item_id',
                    'fieldName' => 'Order Item Id'
                ],
                'discount_codes' => (object) [
                    'fieldKey' => 'discount_codes',
                    'fieldName' => 'Discount Codes'
                ],
                'order_discounts' => (object) [
                    'fieldKey' => 'order_discounts',
                    'fieldName' => 'Order Discounts'
                ],
                'order_subtotal' => (object) [
                    'fieldKey' => 'order_subtotal',
                    'fieldName' => 'Order Subtotal'
                ],
                'order_total' => (object) [
                    'fieldKey' => 'order_total',
                    'fieldName' => 'Order Total'
                ],
                'order_tax' => (object) [
                    'fieldKey' => 'order_tax',
                    'fieldName' => 'Order Tax'
                ],
                'payment_method' => (object) [
                    'fieldKey' => 'payment_method',
                    'fieldName' => 'Payment Method'
                ],
                'Status' => (object) [
                    'fieldKey' => 'status',
                    'fieldName' => 'Status'
                ],
            ];
        } elseif ($id == 3){
            $refundField = [
                'Refund Id' => (object) [
                    'fieldKey' => 'refund_id',
                    'fieldName' => 'Refund Id'
                ],
                'Discount Codes' => (object) [
                    'fieldKey' => 'discount_codes',
                    'fieldName' => 'Discount Codes'
                ],
                'Order Discounts' => (object) [
                    'fieldKey' => 'order_discounts',
                    'fieldName' => 'Order Discounts'
                ],
                'Order Subtotal' => (object) [
                    'fieldKey' => 'order_subtotal',
                    'fieldName' => 'Order Subtotal'
                ],
                'Order Total' => (object) [
                    'fieldKey' => 'order_total',
                    'fieldName' => 'Order Total'
                ],
                'Order Tax' => (object) [
                    'fieldKey' => 'order_tax',
                    'fieldName' => 'Order Tax'
                ],
                'Payment Method' => (object) [
                    'fieldKey' => 'payment_method',
                    'fieldName' => 'Payment Method'
                ],
            ];

            $fields = array_merge($userFields, $refundField);
        }

        foreach ($fields as $field) {
            $fieldsNew[] = [
                'name' => $field->fieldKey,
                'type' => 'text',
                'label' => $field->fieldName,
            ];
        }
        return $fieldsNew;
    }

    public static function allProducts()
    {
        $args = [
            'post_type' => 'download',
            'post_status' => 'publish',
            'posts_per_page' => -1,
        ];

        $products = get_posts($args);
        $productsArray[] = [
            'id' => 'any',
            'title' => 'Any Product',
        ];
        foreach ($products as $product) {
            $productsArray[] = (object) [
                'id' => $product->ID,
                'title' => $product->post_title,
            ];
        }
        return $productsArray;
    }

    public static function allDiscount(){
        $allDiscountCode[] = [
            'id' => 'any',
            'title' => 'Any Discount Code',
        ];
        $discountCodes = edd_get_discounts();
        foreach ($discountCodes as $discount) {
            $allDiscountCode[] = (object) [
                'id' => $discount->code,
                'title' => $discount->name,
            ];
        }
        return $allDiscountCode;
    }

    public static function getUserInfo($user_id)
    {
        $userInfo = get_userdata($user_id);
        $user = [];
        if ($userInfo) {
            $userData = $userInfo->data;
            $user_meta = get_user_meta($user_id);
            $user = [
                'first_name' => $user_meta['first_name'][0],
                'last_name' => $user_meta['last_name'][0],
                'user_email' => $userData->user_email,
                'nickname' => $userData->user_nicename,
                'avatar_url' => get_avatar_url($user_id),
            ];
        }
        return $user;
    }
}
