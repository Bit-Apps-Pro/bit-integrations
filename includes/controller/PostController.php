<?php

namespace BitCode\FI\controller;

final class PostController
{
    public function __construct()
    {
        //
    }

    public function getPostTypes()
    {
        $cptArguments = array(
            'public'   => true,
            'capability_type' => 'post',
        );
    
        $types = get_post_types( $cptArguments, 'object' );

        $lists = [];

        foreach ($types as $key => $type) {
                $lists[$key]['id'] = $type->name;
                $lists[$key]['title'] = $type->label;
        }
        wp_send_json_success(array_values($lists));
    }

    public static function getAcfFields($postType)
    {
        $acfFields = [];
        $acfFiles = [];
        $filterFile = ['file', 'image', 'gallery'];
        if (class_exists('ACF')) {
            $groups = acf_get_field_groups(array('post_type' => $postType));
            foreach ($groups as $group) {
                foreach (acf_get_fields($group['key']) as $acfField) {
                    if (in_array($acfField['type'], $filterFile)) {
                        array_push($acfFiles, [
                            'key' => $acfField['key'],
                            'name' => $acfField['label'],
                            'required' => $acfField['required'] == 1 ? true : false,
                        ]);
                    } else {
                        array_push($acfFields, [
                            'key' => $acfField['key'],
                            'name' => $acfField['label'],
                            'required' => $acfField['required'] == 1 ? true : false,
                        ]);
                    }
                }
            }
        }
        return ['fields' => $acfFields, 'files' => $acfFiles];

    }

    public static function getMetaboxFields($postType)
    {
        $metaboxFields = [];
        $metaboxFile = [];
        $fileTypes = [
            "image",
            "image_upload",
            "file_advanced",
            "file_upload",
            "single_image",
            "file",
            "image_advanced",
            "video",
        ];

        if (function_exists('rwmb_meta')) {
            $fields = rwmb_get_object_fields($postType);
            foreach ($fields as $index => $field) {

                if (!in_array($field['type'], $fileTypes)) {
                    // if (!in_array($field['type'], $filterTypes)) {
                    //     $metaboxFields[$index]['name'] = $field['name'];
                    // }
                    $metaboxFields[$index]['name'] = $field['name'];
                    $metaboxFields[$index]['key'] = $field['id'];
                    $metaboxFields[$index]['required'] = $field['required'] == 1 ? true : false;
                } else {
                    $metaboxFile[$index]['name'] = $field['name'];
                    $metaboxFile[$index]['key'] = $field['id'];
                    $metaboxFile[$index]['required'] = $field['required'] == 1 ? true : false;
                }
            }
        }
        return ['fields' => array_values($metaboxFields), 'files' => $metaboxFile];
    }

    public function getCustomFields($data)
    {
        $acf = self::getAcfFields($data->post_type);

        $metabox = self::getMetaboxFields($data->post_type);
        $fields = [
            'acf_fields' => $acf['fields'],
            'acf_files' => $acf['files'],
            'mb_fields' => $metabox['fields'],
            'mb_files' => $metabox['files'],
        ];

        wp_send_json_success($fields, 200);

    }

    public function getPages()
    {
        $pages = get_pages(array('post_status' => 'publish', 'sort_column' => 'post_date', 'sort_order' => 'desc'));
        $allPages = array();
        foreach ($pages as $pageKey => $pageDetails) {
            $allPages[$pageKey]['title'] = $pageDetails->post_title;
            $allPages[$pageKey]['url'] = get_page_link($pageDetails->ID);
        }
        return $allPages;
    }

    public function getPodsPostType()
    {
        $users = get_users(array('fields' => array('ID', 'display_name')));
        $pods = [];
        $podsAdminExists = is_plugin_active('pods/init.php');

        if ($podsAdminExists) {
            $allPods = pods_api()->load_pods();
            foreach (array_values($allPods) as $index => $pod) {
                $pods[$index]['name'] = $pod['name'];
                $pods[$index]['label'] = $pod['label'];
            }
        }
        $data = ['users' => $users, 'post_types' => $pods];
        wp_send_json_success($data, 200);
    }

    public function getPodsField($data)
    {
        $podsAdminExists = is_plugin_active('pods/init.php');
        $podField = [];
        $podFile = [];
        if ($podsAdminExists) {
            $pods = pods($data->post_type);
            $i = 0;
            foreach (array_values($pods->fields) as $field) {
                $i++;
                if($field['type'] === 'file'){
                    $podFile[$i]['key'] = $field['name'];
                    $podFile[$i]['name'] = $field['label'];
                    $podFile[$i]['required'] = $field['options']['required'] == 1 ? true : false;
                 }else{
                    $podField[$i]['key'] = $field['name'];
                    $podField[$i]['name'] = $field['label'];
                    $podField[$i]['required'] = $field['options']['required'] == 1 ? true : false;
                  }
               
            }
        }
        // echo json_encode(array_values($pods->fields) );
        wp_send_json_success(['podFields'=>$podField, 'podFiles'=>$podFile], 200);
    }
}
