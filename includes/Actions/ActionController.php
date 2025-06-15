<?php

namespace BitCode\FI\Actions;

use FilesystemIterator;
use WP_Error;
use WP_REST_Request;

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
        $parsed_url = parse_url(get_site_url());
        $site_url = $parsed_url['scheme'] . "://" . $parsed_url['host'];
        $site_url .= empty($parsed_url['port']) ? null : ':' . $parsed_url['port'];
        if (strpos($state, $site_url) === false) {
            return new WP_Error('404');
        }
        $params = $request->get_params();
        unset($params['rest_route'], $params['state']);
        if (wp_redirect($state . '&' . http_build_query($params), 302)) {
            exit;
        }
    }
}