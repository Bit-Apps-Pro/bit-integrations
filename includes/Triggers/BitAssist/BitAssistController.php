<?php

namespace BitCode\FI\Triggers\BitAssist;

use BitCode\FI\Actions\WebHooks\WebHooksController;

final class BitAssistController extends WebHooksController
{
    public static function info()
    {
        return [
            'name'      => 'Bit Assist',
            'title'     => __('Get callback data through an URL', 'bit-integrations'),
            'type'      => 'webhook',
            'is_active' => true,
            'isPro'     => false
        ];
    }
}
