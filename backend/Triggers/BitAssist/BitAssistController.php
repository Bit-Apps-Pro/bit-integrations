<?php

namespace BitApps\Integrations\Triggers\BitAssist;

use BitApps\Integrations\Triggers\Webhook\WebhookController;

final class BitAssistController extends WebhookController
{
    public static function info()
    {
        return [
            'name'              => 'Bit Assist',
            'title'             => __('Get callback data through an URL', 'bit-integrations'),
            'type'              => 'webhook',
            'documentation_url' => 'https://bit-integrations.com/wp-docs/trigger/incoming-webhooks-integrations/',
            'tutorial_url'      => 'https://youtube.com/playlist?list=PL7c6CDwwm-AJWC69yZL8YjdLVzQxAgvWC&si=J4ZtMva3ooI3SVk4',
            'is_active'         => true,
            'isPro'             => false
        ];
    }
}
