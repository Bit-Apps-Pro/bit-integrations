<?php
/**
 * @license MIT
 *
 * Modified on 27-February-2024 using Strauss.
 * @see https://github.com/BrianHenryIE/strauss
 */
namespace BTCBI\Deps\BitApps\WPValidator\Rules;

use BTCBI\Deps\BitApps\WPValidator\Rule;

class MacAddressRule extends Rule
{
    private $message = "The :attribute field must be a valid MAC address";

    public function validate($value)
    {
        return filter_var($value, FILTER_VALIDATE_MAC) !== false;
    }

    public function message()
    {
        return $this->message;
    }
}