<?php
/**
 * @license MIT
 *
 * Modified on 15-February-2024 using Strauss.
 * @see https://github.com/BrianHenryIE/strauss
 */
namespace BTCBI\Deps\BitApps\WPValidator\Rules;

use BTCBI\Deps\BitApps\WPValidator\Rule;

class SizeRule extends Rule
{
    private $message = "The :attribute field must be :size characters";

    protected $requireParameters = ['size'];

    public function validate($value)
    {
        $this->checkRequiredParameter($this->requireParameters);

        $size = $this->getParameter('size');

        if (is_string($value)) {
            return strlen($value) == $size;
        } elseif (is_int($value)) {
            return $value === $size;
        } else if (is_array($value)) {
            return count($value) === $size;
        } else {
            return false;
        }
    }

    public function getParamKeys()
    {
        return $this->requireParameters;
    }

    public function message()
    {
        return $this->message;
    }
}
