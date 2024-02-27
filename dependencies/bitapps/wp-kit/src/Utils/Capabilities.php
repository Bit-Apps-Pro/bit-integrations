<?php
/**
 * @license GPL-2.0-or-later
 *
 * Modified on 27-February-2024 using Strauss.
 * @see https://github.com/BrianHenryIE/strauss
 */

namespace BTCBI\Deps\BitApps\WPKit\Utils;

use BTCBI\Deps\BitApps\WPKit\Hooks\Hooks;

final class Capabilities
{
    public static function check($cap, ...$args)
    {
        return current_user_can($cap, ...$args);
    }

    public static function filter($cap, $default = 'manage_options')
    {
        return static::check($cap) || static::check(Hooks::applyFilter($cap, $default));
    }
}