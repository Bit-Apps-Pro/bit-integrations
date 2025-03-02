<?php

namespace BitCode\FI\Actions;

use WP_Error;
use WP_REST_Request;
use FilesystemIterator;

final class ActionController
{
    /**
     * Lists available actions
     *
     * @return JSON|WP_Error
     */
    // public function list()
    // {
    //     $actions = [];
    //     $dirs = new FilesystemIterator(__DIR__);
    //     foreach ($dirs as $dirInfo) {
    //         if ($dirInfo->isDir()) {
    //             $action = basename($dirInfo);
    //             if (
    //                 file_exists(__DIR__ . '/' . $action)
    //                 && file_exists(__DIR__ . '/' . $action . '/' . $action . 'Controller.php')
    //             ) {
    //                 $action_controller = __NAMESPACE__ . "\\{$action}\\{$action}Controller";
    //                 if (method_exists($action_controller, 'info')) {
    //                     $actions[$action] = $action_controller::info();
    //                 }
    //             }
    //         }
    //     }
    //     return $actions;
    // }

    public function handleRedirect(WP_REST_Request $request)
    {
        $state = $request->get_param('state');

        $state_parsed_url = wp_parse_url($state);
        $parsed_url = wp_parse_url(get_site_url());

        $state_host = $state_parsed_url['host'];
        $site_host = $parsed_url['host'];

        $state_host .= (empty($state_parsed_url['port']) ? null : (':' . $state_parsed_url['port']));
        $site_host .= (empty($parsed_url['port']) ? null : (':' . $parsed_url['port']));

        if ($state_host !== $site_host) {
            return new WP_Error('404');
        }

        $params = $request->get_params();
        unset($params['rest_route'], $params['state']);

        if (wp_redirect($state . '&' . http_build_query($params), 302)) {
            exit;
        }
    }
}
