<?php

namespace BitCode\FI\Core\Util;

// All Pro Action Features
final class AllProActionFeat
{
    public static $features = [

        'CF7' => [
            ['feat_name' => 'getAdvanceCustomHtmlFields', 'class' => '\BitApps\BTCBI_PRO\Triggers\CF7\CF7HelperPro', 'pro_init_v' => '2.1.6'],
        ],
        'Dokan' => [
            ['feat_name' => 'vendorCreateActions', 'class' => '\BitApps\BTCBI_PRO\Actions\Dokan\DokanRecordHelper', 'pro_init_v' => '2.1.5'],
        ],
        'FluentSupport' => [
            ['feat_name' => 'uploadTicketAttachments', 'class' => '\BitApps\BTCBI_PRO\Actions\FluentSupport\FluentSupportHelperPro', 'pro_init_v' => '2.1.7'],
        ],
        'FreshSales' => [
            ['feat_name' => 'upsertRecord', 'class' => '\BitApps\BTCBI_PRO\Actions\FreshSales\FreshSalesRecordApiHelper', 'pro_init_v' => '2.1.1']
        ],
        'Hubspot' => [
            ['feat_name' => 'updateEntity', 'class' => '\BitApps\BTCBI_PRO\Actions\Hubspot\HubspotHelperPro', 'pro_init_v' => '2.1.9'],
        ],
        'GetResponse' => [
            ['feat_name' => 'autoResponderDay', 'class' => '\BitApps\BTCBI_PRO\Actions\GetResponse\GetResponseHelperPro', 'pro_init_v' => '2.1.9'],
        ],
        'HighLevel' => [
            ['feat_name' => 'contactUtilities', 'class' => '\BitApps\BTCBI_PRO\Actions\HighLevel\HighLevelUtilitiesPro', 'pro_init_v' => '2.2.1'],
            ['feat_name' => 'opportunityUtilities', 'class' => '\BitApps\BTCBI_PRO\Actions\HighLevel\HighLevelUtilitiesPro', 'pro_init_v' => '2.2.1'],
        ],
        'JetEngine' => [
            ['feat_name' => 'createPostTypeActions', 'class' => '\BitApps\BTCBI_PRO\Actions\JetEngine\JetEngineRecordHelper', 'pro_init_v' => '2.1.9'],
            ['feat_name' => 'createContentTypeActions', 'class' => '\BitApps\BTCBI_PRO\Actions\JetEngine\JetEngineRecordHelper', 'pro_init_v' => '2.1.9'],
            ['feat_name' => 'createTaxonomyActions', 'class' => '\BitApps\BTCBI_PRO\Actions\JetEngine\JetEngineRecordHelper', 'pro_init_v' => '2.1.9'],
            ['feat_name' => 'createRelationActions', 'class' => '\BitApps\BTCBI_PRO\Actions\JetEngine\JetEngineRecordHelper', 'pro_init_v' => '2.1.9'],
        ],
        'MailChimp' => [
            ['feat_name' => 'addRemoveTag', 'class' => '\BitApps\BTCBI_PRO\Actions\MailChimp\MailChimpRecordHelper', 'pro_init_v' => '2.0.9']
        ],
        'SendPulse' => [
            ['feat_name' => 'refreshFields', 'class' => '\BitApps\BTCBI_PRO\Actions\SendPulse\SendPulseHelperPro', 'pro_init_v' => '2.2.0']
        ],
        'WC' => [
            ['feat_name' => 'getFlexibleCheckoutFields', 'class' => '\BitApps\BTCBI_PRO\Triggers\WC\WCHelperPro', 'pro_init_v' => '2.1.2'],
            ['feat_name' => 'getFlexibleCheckoutFieldsValue', 'class' => '\BitApps\BTCBI_PRO\Triggers\WC\WCHelperPro', 'pro_init_v' => '2.1.2']
        ],
        'WhatsApp' => [
            ['feat_name' => 'sendTextMessages', 'class' => '\BitApps\BTCBI_PRO\Actions\WhatsApp\WhatsAppHelperPro', 'pro_init_v' => '2.1.6'],
            ['feat_name' => 'sendMediaMessages', 'class' => '\BitApps\BTCBI_PRO\Actions\WhatsApp\WhatsAppHelperPro', 'pro_init_v' => '2.1.6'],
            ['feat_name' => 'sendContactMessages', 'class' => '\BitApps\BTCBI_PRO\Actions\WhatsApp\WhatsAppHelperPro', 'pro_init_v' => '2.1.6'],
        ],
    ];
}
