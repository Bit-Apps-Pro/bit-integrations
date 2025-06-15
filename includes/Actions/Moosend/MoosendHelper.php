<?php

/**
 * Moosend Record Api
 */

namespace BitCode\FI\Actions\Moosend;

/**
 * Provide functionality for Record Subscribe , Unsubscribe, Unsubscribe from list
 */
class MoosendHelper
{
    public static function formatPhoneNumber($field)
    {
        if (!preg_match('/^\+?[0-9\s\-\(\)]+$/', $field)) {
            return $field;
        }

        $leadingPlus = $field[0] === '+' ? '+' : '';
        $cleanedNumber = preg_replace('/[^\d]/', '', $field);
        $formattedDigits = trim(chunk_split($cleanedNumber, 3, ' '));

        return $leadingPlus . $formattedDigits;
    }
}
