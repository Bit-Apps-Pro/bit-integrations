<?php

namespace BitApps\BTCBI_FI\Triggers\BitAssist;

use BitApps\BTCBI_FI\Triggers\Webhook\WebhookController;

final class BitAssistController extends WebhookController
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
