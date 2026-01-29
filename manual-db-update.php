<?php

/**
 * Manual Database Update Helper
 *
 * If automatic migration doesn't work, you can trigger it manually by:
 * 1. Temporarily add this file to the plugin root
 * 2. Visit: yoursite.com/wp-admin/admin.php?page=bit-integrations&btcbi_manual_update=1
 * 3. Delete this file after update completes
 */
if (!defined('ABSPATH')) {
    exit;
}

// Only run if manual update parameter is present and user is admin
if (isset($_GET['btcbi_manual_update']) && current_user_can('manage_options')) {
    require_once __DIR__ . '/includes/Core/Database/DB.php';

    echo '<div style="padding: 20px; background: #fff; margin: 20px;">';
    echo '<h2>Bit Integrations - Manual Database Update</h2>';

    try {
        \BitCode\FI\Core\Database\DB::addFieldDataColumn();
        echo '<p style="color: green;">✓ Successfully added field_data column to btcbi_log table</p>';

        // Update version
        global $btcbi_db_version;
        $btcbi_db_version = '1.2';
        update_option('btcbi_db_version', $btcbi_db_version);
        echo '<p style="color: green;">✓ Updated database version to 1.2</p>';

        echo '<p><strong>Database update completed successfully!</strong></p>';
        echo '<p>You can now delete this file (manual-db-update.php) and use the reexecution feature.</p>';
    } catch (Exception $e) {
        echo '<p style="color: red;">✗ Error: ' . $e->getMessage() . '</p>';
    }

    echo '</div>';
    exit();
}
