<?php

namespace BitCode\FI\Core\Util;

/**
 * Email Notification Handler for Integration Failures
 */
final class EmailNotification
{
    /**
     * Send email notification to admin when integration fails
     *
     * @param int    $flowId       The integration flow ID
     * @param string $actionName   Name of the integration
     * @param string $errorMessage Error message from the failed integration
     * @param mixed  $actionName
     * @param mixed  $triggerName
     * @param mixed  $recordType
     *
     * @return bool Whether the email was sent successfully
     */
    public static function sendFailureNotification($flowId, $actionName, $triggerName, $recordType, $errorMessage)
    {
        $adminEmail = get_option('admin_email');
        if (empty($adminEmail)) {
            return false;
        }

        $siteName = get_bloginfo('name');
        $subject = \sprintf(
            __('[%s] Integration Failure Alert - Flow #%d', 'bit-integrations'),
            $siteName,
            $flowId
        );

        $message = self::buildEmailMessage($flowId, $actionName, $triggerName, $recordType, $errorMessage, $siteName);
        $headers = [
            'Content-Type: text/html; charset=UTF-8',
            'From: ' . $siteName . ' <' . $adminEmail . '>'
        ];

        return wp_mail($adminEmail, $subject, $message, $headers);
    }

    /**
     * Build HTML email message
     *
     * @param int    $flowId       Integration flow ID
     * @param string $actionName   Integration name
     * @param string $errorMessage Error message
     * @param string $siteName     Site name
     * @param mixed  $actionName
     * @param mixed  $triggerName
     * @param mixed  $recordType
     *
     * @return string HTML formatted email message
     */
    private static function buildEmailMessage($flowId, $actionName, $triggerName, $recordType, $errorMessage, $siteName)
    {
        $adminUrl = admin_url('admin.php?page=bit-integrations#/flow/action/edit/' . $flowId);
        $logUrl = admin_url('admin.php?page=bit-integrations#/flow/action/log/' . $flowId . '/' . $actionName);
        $timestamp = current_time('mysql');

        $title = esc_html__('Integration Failure Alert', 'bit-integrations');
        $greeting = \sprintf(
            esc_html__('Hello, an integration on your site %s has failed to execute.', 'bit-integrations'),
            '<strong>' . esc_html($siteName) . '</strong>'
        );
        $detailsTitle = esc_html__('Failure Details', 'bit-integrations');
        $flowLabel = esc_html__('Integration ID:', 'bit-integrations');
        $actionNameLabel = esc_html__('Action Name:', 'bit-integrations');
        $triggerNameLabel = esc_html__('Trigger Name:', 'bit-integrations');
        $recordTypeLabel = esc_html__('Record Type:', 'bit-integrations');
        $timeLabel = esc_html__('Time:', 'bit-integrations');
        $errorLabel = esc_html__('Error Message:', 'bit-integrations');
        $resolveText = esc_html__('To resolve this issue, please check the integration settings and logs:', 'bit-integrations');
        $viewIntegration = esc_html__('View Integration', 'bit-integrations');
        $viewLogs = esc_html__('View Logs', 'bit-integrations');
        $footerText = \sprintf(
            esc_html__('You are receiving this email because failure notifications are enabled in %s. You can disable these notifications in the plugin settings.', 'bit-integrations'),
            '<strong>Bit Integrations</strong>'
        );

        // Modern email template with improved structure and design
        return <<<HTML
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{$title}</title>
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
                                ⚠️ {$title}
                            </h1>
                        </td>
                    </tr>
                    
                    <!-- Body Content -->
                    <tr>
                        <td style="padding: 30px;">
                            <p style="margin: 0 0 24px; color: #374151; font-size: 16px; line-height: 1.6;">
                                {$greeting}
                            </p>
                            
                            <!-- Failure Details Card -->
                            <div style="background-color: #fef2f2; border-left: 4px solid #ef4444; border-radius: 6px; padding: 20px; margin: 24px 0;">
                                <h2 style="margin: 0 0 16px; color: #dc2626; font-size: 18px; font-weight: 600;">
                                    {$detailsTitle}
                                </h2>
                                
                                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                    <tr>
                                        <td style="padding: 8px 0; color: #6b7280; font-size: 14px; font-weight: 500;">
                                            {$flowLabel}
                                        </td>
                                        <td style="padding: 8px 0; color: #111827; font-size: 14px; font-weight: 600; text-align: right;">
                                            #{$flowId}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 8px 0; color: #6b7280; font-size: 14px; font-weight: 500;">
                                            {$actionNameLabel}
                                        </td>
                                        <td style="padding: 8px 0; color: #111827; font-size: 14px; font-weight: 600; text-align: right;">
                                            {$actionName}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 8px 0; color: #6b7280; font-size: 14px; font-weight: 500;">
                                            {$triggerNameLabel}
                                        </td>
                                        <td style="padding: 8px 0; color: #111827; font-size: 14px; font-weight: 600; text-align: right;">
                                            {$triggerName}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 8px 0; color: #6b7280; font-size: 14px; font-weight: 500;">
                                            {$recordTypeLabel}
                                        </td>
                                        <td style="padding: 8px 0; color: #111827; font-size: 14px; font-weight: 600; text-align: right;">
                                            {$recordType}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 8px 0; color: #6b7280; font-size: 14px; font-weight: 500;">
                                            {$timeLabel}
                                        </td>
                                        <td style="padding: 8px 0; color: #111827; font-size: 14px; font-weight: 600; text-align: right;">
                                            {$timestamp}
                                        </td>
                                    </tr>
                                </table>
                                
                                <div style="margin-top: 16px; padding-top: 16px; border-top: 1px solid #fecaca;">
                                    <p style="margin: 0 0 8px; color: #6b7280; font-size: 14px; font-weight: 500;">
                                        {$errorLabel}
                                    </p>
                                    <div style="background-color: #fef3c7; border-radius: 4px; padding: 12px; font-family: 'Courier New', Courier, monospace; font-size: 13px; color: #92400e; line-height: 1.5; word-break: break-word;">
                                        {$errorMessage}
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Action Section -->
                            <div style="margin: 32px 0;">
                                <p style="margin: 0 0 16px; color: #374151; font-size: 15px;">
                                    {$resolveText}
                                </p>
                                <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                                    <tr>
                                        <td style="padding-right: 12px;">
                                            <a href="{$adminUrl}" style="display: inline-block; background-color: #6366f1; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 500; font-size: 14px; transition: background-color 0.2s;">
                                                {$viewIntegration}
                                            </a>
                                        </td>
                                        <td>
                                            <a href="{$logUrl}" style="display: inline-block; background-color: #10b981; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 500; font-size: 14px; transition: background-color 0.2s;">
                                                {$viewLogs}
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
                                {$footerText}
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
HTML;
    }
}
