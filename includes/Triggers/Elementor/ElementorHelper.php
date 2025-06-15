<?php

namespace BitCode\FI\Triggers\Elementor;

class ElementorHelper
{
    public static function get_all_inner_forms($elements)
    {
        $block_is_on_page = array();
        if (!empty($elements)) {
            foreach ($elements as $element) {
                if ('widget' === $element->elType && ('form' === $element->widgetType || 'global' === $element->widgetType)) {
                    $block_is_on_page[] = $element;
                }
                if (!empty($element->elements)) {
                    $inner_block_is_on_page = self::get_all_inner_forms($element->elements);
                    if (!empty($inner_block_is_on_page)) {
                        $block_is_on_page = array_merge($block_is_on_page, $inner_block_is_on_page);
                    }
                }
            }
        }

        return $block_is_on_page;
    }

    public static function all_elementor_forms($label = null, $option_code = 'ELEMFORMS', $args = array())
    {
        $AllForms = [];
        global $wpdb;
        $post_metas = $wpdb->get_results(
            $wpdb->prepare(
                "SELECT pm.post_id, pm.meta_value, p.post_title
FROM $wpdb->postmeta pm
    LEFT JOIN $wpdb->posts p
        ON p.ID = pm.post_id
WHERE p.post_type IS NOT NULL
  AND p.post_type NOT LIKE %s
  AND p.post_status NOT IN('trash', 'inherit', 'auto-draft')
  AND pm.meta_key = %s
  AND pm.`meta_value` LIKE %s",
                'revision',
                '_elementor_data',
                '%%form_fields%%'
            )
        );

        if (!empty($post_metas)) {
            foreach ($post_metas as $post_meta) {
                $inner_forms = self::get_all_inner_forms(json_decode($post_meta->meta_value));
                if (!empty($inner_forms)) {
                    foreach ($inner_forms as $form) {
                        $AllForms[] = [
                            'id'            => $form->id,
                            'post_id'       => isset($form->templateID) ? $form->templateID : $post_meta->post_id,
                            'title'         => "{$form->settings->form_name} ({$post_meta->post_title})->{$post_meta->post_id}",
                            'form_fields'   => $form->settings->form_fields
                        ];
                    }
                }
            }
        }

        return $AllForms;
    } //end if

    public static function all_forms()
    {
        $formsDetails = self::all_elementor_forms();
        return $formsDetails;
    }
}
