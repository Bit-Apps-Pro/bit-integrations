<?php

namespace BitApps\Integrations\Core\Util;

/**
 * Validates PHP code syntax without using exec/shell_exec.
 * Uses token_get_all() which is safe and WordPress-compliant.
 */
class PhpSyntaxChecker
{
    /**
     * Validates PHP code for syntax errors.
     *
     * @param string $code The PHP code to validate.
     *
     * @return array{is_valid: bool, message: string}
     */
    public static function validate($code)
    {
        if (empty($code)) {
            return [
                'is_valid' => false,
                'message'  => __('Empty code provided.', 'bit-integrations'),
            ];
        }

        try {
            if (\defined('TOKEN_PARSE')) {
                token_get_all($code, TOKEN_PARSE);
            } else {
                token_get_all($code);
            }

            return [
                'is_valid' => true,
                'message'  => __('No syntax errors detected in your function.', 'bit-integrations'),
            ];
        } catch (\ParseError $e) {
            return [
                'is_valid' => false,
                'message'  => $e->getMessage(),
            ];
        }
    }

    
}
