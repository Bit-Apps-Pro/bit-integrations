<?php

namespace BitCode\FI\Core\Util;

/**
 * Class handling plugin deactivation.
 *
 * @since 1.0.0
 *
 * @access private
 *
 * @ignore
 */
final class Deactivation
{
    /**
     * Registers functionality through WordPress hooks.
     *
     * @since 1.0.0
     */
    public function register()
    {
        add_action('btcbi_deactivation', [$this, 'remove_capability_to_administrator']);
        add_action('btcbi_deactivation', [$this, 'deactive']);
    }

    public function remove_capability_to_administrator()
    {
        $role = get_role('administrator');
        $role->remove_cap('bit_integrations_manage_integrations');
        $role->remove_cap('bit_integrations_view_integrations');
        $role->remove_cap('bit_integrations_create_integrations');
        $role->remove_cap('bit_integrations_edit_integrations');
        $role->remove_cap('bit_integrations_delete_integrations');
    }

    public function deactive()
    {
        wp_clear_scheduled_hook('btcbi_delete_integ_log');
    }
}
