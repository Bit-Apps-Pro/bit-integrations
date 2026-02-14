<?php
/**
 * Email Template: Integration Failure Notification
 *
 * Variables available from parent scope:
 *
 * @var int    $flowId        Integration flow ID
 * @var string $actionName    Integration action name
 * @var string $triggerName   Integration trigger name
 * @var string $recordType    Record type
 * @var string $errorMessage  Error message from failed integration
 * @var string $siteName      Site name
 * @var string $adminUrl      URL to edit integration
 * @var string $logUrl        URL to view integration logs
 * @var string $timestamp     Current timestamp
 */
if (! defined('ABSPATH')) {
    exit;
}

// Prepare translated strings.
$title = esc_html__('Integration Failure Alert', 'bit-integrations');
$greeting = sprintf(
    esc_html__('Hello, an integration on your site %s has failed to execute.', 'bit-integrations'),
    '<strong>' . esc_html($siteName) . '</strong>'
);
$details_title = esc_html__('Failure Details', 'bit-integrations');
$flow_label = esc_html__('Integration ID:', 'bit-integrations');
$action_name_label = esc_html__('Action Name:', 'bit-integrations');
$trigger_name_label = esc_html__('Trigger Name:', 'bit-integrations');
$record_type_label = esc_html__('Record Type:', 'bit-integrations');
$time_label = esc_html__('Time:', 'bit-integrations');
$error_label = esc_html__('Error Message:', 'bit-integrations');
$resolve_text = esc_html__('To resolve this issue, please check the integration settings and logs:', 'bit-integrations');
$view_integration = esc_html__('View Integration', 'bit-integrations');
$view_logs = esc_html__('View Logs', 'bit-integrations');
$footer_text = sprintf(
    esc_html__('You are receiving this email because failure notifications are enabled in %s. You can disable these notifications in the plugin settings.', 'bit-integrations'),
    '<strong>Bit Integrations</strong>'
);
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo esc_html($title); ?></title>
</head>
<body style="margin: 0; padding: 0; background-color: #f5f5f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f5f5f5; padding: 20px 0;">
        <tr>
            <td align="center">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width: 600px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); overflow: hidden;">
                    <!-- Header -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
                            <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 600; letter-spacing: -0.5px;">
                                ⚠️ <?php echo esc_html($title); ?>
                            </h1>
                        </td>
                    </tr>
                    
                    <!-- Body Content -->
                    <tr>
                        <td style="padding: 30px;">
                            <p style="margin: 0 0 24px; color: #374151; font-size: 16px; line-height: 1.6;">
                                <?php echo wp_kses_post($greeting); ?>
                            </p>
                            
                            <!-- Failure Details Card -->
                            <div style="background-color: #fef2f2; border-left: 4px solid #ef4444; border-radius: 6px; padding: 20px; margin: 24px 0;">
                                <h2 style="margin: 0 0 16px; color: #dc2626; font-size: 18px; font-weight: 600;">
                                    <?php echo esc_html($details_title); ?>
                                </h2>
                                
                                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                    <tr>
                                        <td style="padding: 8px 0; color: #6b7280; font-size: 14px; font-weight: 500;">
                                            <?php echo esc_html($flow_label); ?>
                                        </td>
                                        <td style="padding: 8px 0; color: #111827; font-size: 14px; font-weight: 600; text-align: right;">
                                            #<?php echo absint($flowId); ?>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 8px 0; color: #6b7280; font-size: 14px; font-weight: 500;">
                                            <?php echo esc_html($action_name_label); ?>
                                        </td>
                                        <td style="padding: 8px 0; color: #111827; font-size: 14px; font-weight: 600; text-align: right;">
                                            <?php echo esc_html($actionName); ?>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 8px 0; color: #6b7280; font-size: 14px; font-weight: 500;">
                                            <?php echo esc_html($trigger_name_label); ?>
                                        </td>
                                        <td style="padding: 8px 0; color: #111827; font-size: 14px; font-weight: 600; text-align: right;">
                                            <?php echo esc_html($triggerName); ?>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 8px 0; color: #6b7280; font-size: 14px; font-weight: 500;">
                                            <?php echo esc_html($record_type_label); ?>
                                        </td>
                                        <td style="padding: 8px 0; color: #111827; font-size: 14px; font-weight: 600; text-align: right;">
                                            <?php echo esc_html($recordType); ?>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 8px 0; color: #6b7280; font-size: 14px; font-weight: 500;">
                                            <?php echo esc_html($time_label); ?>
                                        </td>
                                        <td style="padding: 8px 0; color: #111827; font-size: 14px; font-weight: 600; text-align: right;">
                                            <?php echo esc_html($timestamp); ?>
                                        </td>
                                    </tr>
                                </table>
                                
                                <div style="margin-top: 16px; padding-top: 16px; border-top: 1px solid #fecaca;">
                                    <p style="margin: 0 0 8px; color: #6b7280; font-size: 14px; font-weight: 500;">
                                        <?php echo esc_html($error_label); ?>
                                    </p>
                                    <div style="background-color: #fef3c7; border-radius: 4px; padding: 12px; font-family: 'Courier New', Courier, monospace; font-size: 13px; color: #92400e; line-height: 1.5; word-break: break-word;">
                                        <?php echo esc_html($errorMessage); ?>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Action Section -->
                            <div style="margin: 32px 0;">
                                <p style="margin: 0 0 16px; color: #374151; font-size: 15px;">
                                    <?php echo esc_html($resolve_text); ?>
                                </p>
                                <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                                    <tr>
                                        <td style="padding-right: 12px;">
                                            <a href="<?php echo esc_url($adminUrl); ?>" style="display: inline-block; background-color: #6366f1; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 500; font-size: 14px; transition: background-color 0.2s;">
                                                <?php echo esc_html($view_integration); ?>
                                            </a>
                                        </td>
                                        <td>
                                            <a href="<?php echo esc_url($logUrl); ?>" style="display: inline-block; background-color: #10b981; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 500; font-size: 14px; transition: background-color 0.2s;">
                                                <?php echo esc_html($view_logs); ?>
                                            </a>
                                        </td>
                                    </tr>
                                </table>
                            </div>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #f9fafb; padding: 20px 30px; border-top: 1px solid #e5e7eb;">
                            <p style="margin: 0; color: #6b7280; font-size: 12px; line-height: 1.5;">
                                <?php echo wp_kses_post($footer_text); ?>
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
