<?php
namespace BitCode\FI\Triggers\GF;

use BitCode\FI\Core\Util\Common;
use BitCode\FI\Flow\Flow;

final class GFController
{
    public function __construct()
    {
        //
    }
    
    public static function info()
    {
        $plugin_path = 'gravityforms/gravityforms.php';
        return [
            'name' => 'Gravity Forms',
            'title' => 'Easily create web forms and manage form entries within the WordPress admin.',
            'slug' => $plugin_path,
            'type' => 'form',
            'is_active' => class_exists('GFAPI'),
            'activation_url' => wp_nonce_url(self_admin_url('plugins.php?action=activate&amp;plugin=' . $plugin_path . '&amp;plugin_status=all&amp;paged=1&amp;s'), 'activate-plugin_' . $plugin_path),
            'install_url' => wp_nonce_url(self_admin_url('update.php?action=install-plugin&plugin=' . $plugin_path), 'install-plugin_' . $plugin_path),
            'list' => [
                'action' => 'gf/get',
                'method' => 'get',
            ],
            'fields' => [
                'action' => 'gf/get/form',
                'method' => 'post',
                'data' => ['id']
            ],
        ];
    }

    public function getAll()
    {
        if (!(class_exists('GFFormsModel') && is_callable('GFFormsModel::get_forms'))) {
            wp_send_json_error(__('Gravity Forms is not installed or activated', 'bit-integrations'));
        }
        $all_forms = [];
        $forms = \GFFormsModel::get_forms(1);//param is_active = 1
        if ($forms) {
            foreach ($forms as $form) {
                $all_forms[] = (object)[
                    'id' => $form->id,
                    'title' => $form->title
                ];
            }
        }
        wp_send_json_success($all_forms);
    }

    public function get_a_form($data)
    {
        if (empty($data->id) || ! class_exists('GFAPI')) {
            wp_send_json_error(__('Gravity Forms is not installed or activated', 'bit-integrations'));
        }
        $fields = self::fields($data->id);
        if (!$fields) {
            wp_send_json_error(__('Form doesn\'t exists any field', 'bit-integrations'));
        }

        $responseData['fields'] = $fields;
        wp_send_json_success($responseData);
    }

    public static function fields($form_id)
    {
        $form = \GFAPI::get_form($form_id);
        $fieldDetails = $form['fields'];
        if (empty($fieldDetails)) {
            return false;
        }
        $fields = [];
        $inputTypes = ['color','date','datetime-local','email','fileupload', 'file','hidden','image','month','number','password','radio','range','tel','text','time','url','week'];
        foreach ($fieldDetails as  $id => $field) {
      
            if (isset($field->inputs) && is_array($field->inputs)) {
               
                $labelPrefix =  !empty($field->adminLabel) ? $field->adminLabel : (!empty($field->label) ? $field->label : $field->id);
                if($field->type === 'checkbox'){
                    $fields[] = [
                        'name' => $field->id,
                        'type' => 'checkbox',
                        'label' => !empty($field->adminLabel) ? $field->adminLabel : (!empty($field->label) ? $field->label : $field->id),
                    ];
                 }
                foreach ($field->inputs as $input) {
                    if (!isset($input['isHidden']) && $field->type !=='checkbox') {
                        $fields[] = [
                            'name' => $input['id'],
                            'type' => isset($input['inputType']) &&  in_array($input['inputType'], $inputTypes) ? $input['inputType'] : 'text',
                            'label' => "$labelPrefix - ". $input['label'],
                        ];
                    }
                }
            } else {
                $fields[] = [
                        'name' => $field->id,
                        'type' => in_array($field->type, $inputTypes) ? ($field->type === 'fileupload' ? 'file' : $field->type) : 'text',
                        'separator' => in_array($field->type,['multiselect']) ? "str_array" : '',
                        'label' => !empty($field->adminLabel) ? $field->adminLabel : (!empty($field->label) ? $field->label : $field->id),
                    ];
            }
        }
        $someAdditionalFields = [
            
                [
                    'name' => 'id',
                    'type' => 'text',
                    'label' => 'Entry ID',
                ],
                [
                    'name' => 'form_id',
                    'type' => 'text',
                    'label' => 'Form ID',
                ],
                [
                    'name' => 'title',
                    'type' => 'text',
                    'label' => 'Title',
                ],
                [
                    'name' => 'date_created',
                    'type' => 'text',
                    'label' => 'Date Created',
                ]
            ];  
    
        return array_merge($fields, $someAdditionalFields);
    }

    public static function gform_after_submission($entry, $form)
    {
        $form_id = $form['id'];
        if (!empty($form_id) && $flows = Flow::exists('GF', $form_id)) {
            $upDir = wp_upload_dir();
            foreach ($form['fields'] as $key => $value) {
                if ($value->type === 'fileupload' && isset($entry[$value->id])) {
                    if($value->multipleFiles === false ){
                        $entry[$value->id] = Common::filePath($entry[$value->id]);
                    }else{
                        $entry[$value->id] = Common::filePath(json_decode($entry[$value->id], true));
                     }
                }
                if($value->type === 'checkbox' && is_array($value->inputs)){
                    foreach($value->inputs as $input){
                        if(isset($entry[$input['id']])){
                            $entry[$value->id][] = $entry[$input['id']];
                         }
                     }
                 }
            }
            $finalData = $entry + ['title'=> $form['title']];
            Flow::execute('GF', $form_id, $finalData, $flows);
        }
    }
}
