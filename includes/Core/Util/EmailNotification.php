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
        // Prepare data for template
        $adminUrl = admin_url('admin.php?page=bit-integrations#/flow/action/edit/' . $flowId);
        $logUrl = admin_url('admin.php?page=bit-integrations#/flow/action/log/' . $flowId . '/' . $actionName);
        $timestamp = current_time('mysql');

        // Load email template
        $templatePath = \dirname(BTCBI_PLUGIN_BASEDIR) . '/views/emails/integration-failure-notification.php';

        ob_start();
        include $templatePath;

        return ob_get_clean();
    }
}
