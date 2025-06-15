<?php

namespace BitCode\FI\Admin;

use BitCode\FI\Core\Util\Route;
class AdminAjax
{
    public function register()
    {
        Route::post('app/config', [$this, 'updatedAppConfig']);
        Route::get('get/config', [$this, 'getAppConfig']);
       
    }

    public function updatedAppConfig($data)
    {
        if (!property_exists($data, 'data')) {
            wp_send_json_error(__('Data can\'t be empty', 'bit-integrations'));
        }
       
        update_option('btcbi_app_conf', $data->data);
        wp_send_json_success(__('save successfully done', 'bit-integrations'));
    }

    public function getAppConfig(){
        $data = get_option('btcbi_app_conf');
        wp_send_json_success($data);
     }

}
