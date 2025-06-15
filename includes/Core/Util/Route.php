<?php

namespace BitCode\FI\Core\Util;

use ReflectionMethod;

final class Route
{
    private static $_prefix = 'btcbi_';

    private static $_invokeable;

    private static $_no_auth = false;

    private static $_ignore_token = false;

    public static function get($hook, $invokeable)
    {
        return static::request('GET', $hook, $invokeable);
    }

    public static function post($hook, $invokeable)
    {
        return static::request('POST', $hook, $invokeable);
    }

    public static function request($method, $hook, $invokeable)
    {
        if ((isset($_SERVER['REQUEST_METHOD']) && sanitize_text_field($_SERVER['REQUEST_METHOD']) != $method) || !isset($_REQUEST['action']) || (isset($_REQUEST['action']) && strpos(sanitize_text_field($_REQUEST['action']), $hook) === false)) {
            if (static::$_no_auth) {
                static::$_no_auth = false;
            }
            if (static::$_ignore_token) {
                static::$_ignore_token = false;
            }

            return;
        }
        if (static::$_ignore_token) {
            static::$_ignore_token = false;
            static::$_invokeable[static::$_prefix . $hook][$method . '_ignore_token'] = true;
        }
        static::$_invokeable[static::$_prefix . $hook][$method] = $invokeable;
        Hooks::add('wp_ajax_' . static::$_prefix . $hook, [__CLASS__, 'action']);
        if (static::$_no_auth) {
            static::$_no_auth = false;
            Hooks::add('wp_ajax_nopriv_' . static::$_prefix . $hook, [__CLASS__, 'action']);
        }
    }

    public static function action()
    {
        $action = sanitize_text_field($_REQUEST['action']);
        $sanitizedMethod = sanitize_text_field($_SERVER['REQUEST_METHOD']);
        $requestMethod = \in_array($sanitizedMethod, ['GET', 'POST']) ? $sanitizedMethod : 'POST';
        if (
            isset(static::$_invokeable[$action][$requestMethod . '_ignore_token'])
            || isset($_REQUEST['_ajax_nonce']) && wp_verify_nonce(sanitize_text_field($_REQUEST['_ajax_nonce']), 'btcbi_nonce')
        ) {
            $invokeable = static::$_invokeable[$action][$requestMethod];
            unset($_POST['_ajax_nonce'], $_POST['action'], $_GET['_ajax_nonce'], $_GET['action']);

            if (method_exists($invokeable[0], $invokeable[1])) {
                if ($requestMethod == 'POST') {
                    if (isset($_SERVER['CONTENT_TYPE']) && strpos(sanitize_text_field($_SERVER['CONTENT_TYPE']), 'form-data') === false && strpos(sanitize_text_field($_SERVER['CONTENT_TYPE']), 'x-www-form-urlencoded') === false) {
                        $inputJSON = file_get_contents('php://input');
                        $data = \is_string($inputJSON) ? json_decode($inputJSON) : $inputJSON;
                    } elseif ($_POST['data']) {
                        $data = \is_string($_POST['data']) ? json_decode(wp_unslash($_POST['data'])) : $_POST['data'];
                    } else {
                        $data = (object) $_POST;
                    }
                } else {
                    $data = (object) $_GET;
                }

                $reflectionMethod = new ReflectionMethod($invokeable[0], $invokeable[1]);
                $response = $reflectionMethod->invoke($reflectionMethod->isStatic() ? null : new $invokeable[0](), $data);

                if (is_wp_error($response)) {
                    wp_send_json_error($response);
                } else {
                    wp_send_json_success($response);
                }
            } else {
                wp_send_json_error('Method doesn\'t exists');
            }
        } else {
            wp_send_json_error(
                __(
                    'Token expired or invalid. Please refresh the page and try again.',
                    'bit-integrations'
                ),
                401
            );
        }
    }

    public static function no_auth()
    {
        self::$_no_auth = true;

        return new static();
    }

    public static function ignore_token()
    {
        self::$_ignore_token = true;

        return new static();
    }
}
