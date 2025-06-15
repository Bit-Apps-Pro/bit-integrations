<?php

namespace BitCode\FI\Triggers\JetForm;

use BitCode\FI\Triggers\Webhook\WebhookController;

final class JetFormController extends WebhookController
{
    public static function info()
    {
        return [
            'name' => 'JetForm Builder',
            'title' => 'Get callback data through an URL',
            'type' => 'webhook',
            'is_active' => true,
        ];
    }
}
