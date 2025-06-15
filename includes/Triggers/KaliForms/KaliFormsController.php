<?php

namespace BitCode\FI\Triggers\KaliForms;

use BitCode\FI\Triggers\Webhook\WebhookController;

final class KaliFormsController extends WebhookController
{
    public static function info()
    {
        return [
            'name' => 'Kali Forms',
            'title' => 'Get callback data through an URL',
            'type' => 'webhook',
            'is_active' => true,
        ];
    }
}
