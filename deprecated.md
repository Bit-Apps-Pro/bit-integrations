# Deprecated Elements - Bit Integrations v2.7.8

> ⚠️ **Quick Reference**: All `btcbi_*` prefixed elements are deprecated. Use `bit_integrations_*` or the `Config` class instead.

---

## Quick Migration Cheatsheet

| Type | Old (❌ Deprecated) | New (✅ Use This) |
|------|---------------------|-------------------|
| **Version** | `BTCBI_VERSION` | `Config::VERSION` |
| **DB Version** | `$btcbi_db_version` | `Config::DB_VERSION` |
| **Plugin File** | `BTCBI_PLUGIN_MAIN_FILE` | `BIT_INTEGRATIONS_PLUGIN_FILE` |
| **Base Dir** | `BTCBI_PLUGIN_BASEDIR` | `Config::get('BASEDIR')` |
| **Base Name** | `BTCBI_PLUGIN_BASENAME` | `Config::get('BASENAME')` |
| **Root URI** | `BTCBI_ROOT_URI` | `Config::get('ROOT_URI')` |
| **Asset URI** | `BTCBI_ASSET_URI` | `Config::get('ASSET_URI')` |
| **Filter** | `btcbi_localized_script` | `bit_integrations_localized_script` |
| **Option** | `btcbi_app_conf` | `bit_integrations_app_conf` |
| **Option** | `btcbi_changelog_version` | `bit_integrations_changelog_version` |
| **Option** | `btcbi_installed` | `bit_integrations_installed` |
| **Option** | `btcbi_version` | `bit_integrations_version` |
| **Option** | `btcbi_selected_trigger` | `bit_integrations_selected_trigger` |
| **Table** | `btcbi_log` | Use Model classes |
| **Table** | `btcbi_flow` | Use Model classes |
| **Table** | `btcbi_auth` | Use Model classes |

---

## 📦 Deprecated Constants

### PHP Constants

```php
// ❌ DEPRECATED - bitwpfi.php
define('BTCBI_VERSION', '2.7.8');
define('BTCBI_PLUGIN_MAIN_FILE', __FILE__);

// ❌ DEPRECATED - backend/loader.php
define('BTCBI_PLUGIN_BASENAME', plugin_basename(BIT_INTEGRATIONS_PLUGIN_FILE));
define('BTCBI_PLUGIN_BASEDIR', plugin_dir_path(BIT_INTEGRATIONS_PLUGIN_FILE));
define('BTCBI_ROOT_URI', set_url_scheme(plugins_url('', BIT_INTEGRATIONS_PLUGIN_FILE)));
define('BTCBI_PLUGIN_DIR_PATH', plugin_dir_path(BIT_INTEGRATIONS_PLUGIN_FILE));
define('BTCBI_ASSET_URI', BTCBI_ROOT_URI . '/assets');

// ✅ USE THIS INSTEAD
use BitApps\Integrations\Config;

Config::VERSION           // '2.7.8'
Config::DB_VERSION        // '1.1'
BIT_INTEGRATIONS_PLUGIN_FILE
Config::get('BASENAME')
Config::get('BASEDIR')
Config::get('ROOT_URI')
Config::get('ASSET_URI')
```

### Global Variable

```php
// ❌ DEPRECATED - bitwpfi.php
global $btcbi_db_version;

// ✅ USE THIS INSTEAD
use BitApps\Integrations\Config;
Config::DB_VERSION
```

### Pro Version Constant

```php
// ❌ DEPRECATED
defined('BTCBI_PRO_VERSION')

// ✅ USE THIS INSTEAD
// Check for pro version via Config or other means
```

**Source Files:** 
- `bitwpfi.php` (lines 25-40)
- `backend/loader.php` (lines 7-16)
- `backend/Config.php` (line 197)
- `views/view-root.php` (lines 6, 16)
- `backend/Core/Util/Activation.php` (line 52)

---

## 🛠 Deprecated Functions

```php
// ❌ DEPRECATED - bitwpfi.php
btcbi_activate_plugin($network_wide);
btcbi_deactivate_plugin($network_wide);
btcbi_uninstall_plugin();

// ✅ USE THIS INSTEAD
bit_integrations_activate_plugin($network_wide);
bit_integrations_deactivate_plugin($network_wide);
bit_integrations_uninstall_plugin();
```

**Source File:** `bitwpfi.php` (lines 52-115)

---

## 🪝 Deprecated Hooks

### Filters

```php
// ❌ DEPRECATED FILTERS
'btcbi_localized_script'                          // Use: 'bit_integrations_localized_script'
'btcbi_mailpoet_update_subscriber'                // Use: 'bit_integrations_mailpoet_update_subscriber'
'btcbi_high_level_v2_create_contact'              // Use: 'bit_integrations_high_level_v2_create_contact'
'btcbi_high_level_v2_update_contact'              // Use: 'bit_integrations_high_level_v2_update_contact'
'btcbi_high_level_v2_create_task'                 // Use: 'bit_integrations_high_level_v2_create_task'
'btcbi_high_level_v2_update_task'                 // Use: 'bit_integrations_high_level_v2_update_task'
'btcbi_high_level_v2_create_opportunity'          // Use: 'bit_integrations_high_level_v2_create_opportunity'
'btcbi_high_level_v2_update_opportunity'          // Use: 'bit_integrations_high_level_v2_update_opportunity'
'btcbi_high_level_contact_utilities'              // Use: 'bit_integrations_high_level_contact_utilities'
'btcbi_high_level_opportunity_utilities'          // Use: 'bit_integrations_high_level_opportunity_utilities'
'btcbi_smartSuite_create_table'                   // Use: 'bit_integrations_smartsuite_create_table'
'btcbi_smartSuite_create_record'                  // Use: 'bit_integrations_smartsuite_create_record'
'btcbi_moosend_map_custom_fields'                 // Use: 'bit_integrations_moosend_map_custom_fields'
'btcbi_jet_engine_create_post_type_actions'       // Use: 'bit_integrations_jet_engine_create_post_type_actions'
'btcbi_jet_engine_create_content_type_actions'    // Use: 'bit_integrations_jet_engine_create_content_type_actions'
'btcbi_jet_engine_create_taxonomy_actions'        // Use: 'bit_integrations_jet_engine_create_taxonomy_actions'
'btcbi_jet_engine_create_relation_actions'        // Use: 'bit_integrations_jet_engine_create_relation_actions'
'btcbi_trello_get_all_custom_fields'              // Use: 'bit_integrations_trello_get_all_custom_fields'
'btcbi_freshsales_upsert_record'                  // Use: 'bit_integrations_freshsales_upsert_record'
'btcbi_dokan_vendor_crud_actions'                 // Use: 'bit_integrations_dokan_vendor_crud_actions'
'btcbi_lmfwc_update_licence'                      // Use: 'bit_integrations_lmfwc_update_licence'
'btcbi_lmfwc_update_generator'                    // Use: 'bit_integrations_lmfwc_update_generator'
'btcbi_lmfwc_create_generator'                    // Use: 'bit_integrations_lmfwc_create_generator'
'btcbi_lmfwc_activate_licence'                    // Use: 'bit_integrations_lmfwc_activate_licence'
'btcbi_lmfwc_deactivate_licence'                  // Use: 'bit_integrations_lmfwc_deactivate_licence'
'btcbi_lmfwc_reactivate_licence'                  // Use: 'bit_integrations_lmfwc_reactivate_licence'
'btcbi_lmfwc_delete_licence'                      // Use: 'bit_integrations_lmfwc_delete_licence'
'btcbi_salesforce_get_lead_utilities'             // Use: 'bit_integrations_salesforce_get_lead_utilities'
'btcbi_salesforce_update_record'                  // Use: 'bit_integrations_salesforce_update_record'
'btcbi_salesforce_add_lead_utilities'             // Use: 'bit_integrations_salesforce_add_lead_utilities'
'btcbi_klaviyo_custom_properties'                 // Use: 'bit_integrations_klaviyo_custom_properties'
'btcbi_klaviyo_update_profile'                    // Use: 'bit_integrations_klaviyo_update_profile'
'btcbi_zbigin_get_tags'                           // Use: 'bit_integrations_zbigin_get_tags'
'btcbi_zbigin_add_tags_to_records'                // Use: 'bit_integrations_zbigin_add_tags_to_records'
'btcbi_whatsapp_send_text_messages'               // Use: 'bit_integrations_whatsapp_send_text_messages'
'btcbi_whatsapp_send_media_messages'              // Use: 'bit_integrations_whatsapp_send_media_messages'
'btcbi_whatsapp_send_contact_messages'            // Use: 'bit_integrations_whatsapp_send_contact_messages'
'btcbi_mailerpress_delete_contact'                // Use: 'bit_integrations_mailerpress_delete_contact'
'btcbi_mailerpress_add_tags'                      // Use: 'bit_integrations_mailerpress_add_tags'
'btcbi_mailerpress_remove_tags'                   // Use: 'bit_integrations_mailerpress_remove_tags'
'btcbi_mailerpress_add_to_lists'                  // Use: 'bit_integrations_mailerpress_add_to_lists'
'btcbi_mailerpress_remove_from_lists'             // Use: 'bit_integrations_mailerpress_remove_from_lists'

// ✅ USE THIS INSTEAD
// Replace all 'btcbi_' prefix with 'bit_integrations_'
```

### Actions

```php
// ❌ DEPRECATED ACTIONS
'btcbi_pipedrive_store_related_list'              // Use: 'bit_integrations_pipedrive_store_related_list'
'btcbi_trello_store_custom_fields'                // Use: 'bit_integrations_trello_store_custom_fields'
'btcbi_fluent_support_upload_ticket_attachments'  // Use: 'bit_integrations_fluent_support_upload_ticket_attachments'
'btcbi_deactivation'                              // Use: 'bit_integrations_deactivation'

// ✅ USE THIS INSTEAD
// Replace all 'btcbi_' prefix with 'bit_integrations_'
```

### WC Subscription Hooks (Deprecated - Use WC Subscriptions Trigger)

```php
// ❌ DEPRECATED - backend/Triggers/WC/Hooks.php
woocommerce_subscription_payment_complete
woocommerce_subscription_status_cancelled
woocommerce_subscription_status_expired
woocommerce_subscription_status_updated
woocommerce_scheduled_subscription_trial_end

// ✅ USE: WC Subscriptions trigger instead
```

### WC Booking Hooks (Deprecated - Use WC Bookings Trigger)

```php
// ❌ DEPRECATED - backend/Triggers/WC/Hooks.php
woocommerce_new_booking

// ✅ USE: WC Bookings trigger instead
```

**Source Files:** 
- `backend/Config.php` (line 205)
- `backend/Core/Util/Helper.php` (line 212)
- `backend/Triggers/WC/Hooks.php` (lines 28-36)
- Multiple action integration files

---

## 💾 Deprecated Options

```php
// ❌ DEPRECATED OPTIONS
'btcbi_app_conf'              → 'bit_integrations_app_conf'
'btcbi_changelog_version'     → 'bit_integrations_changelog_version'
'btcbi_installed'             → 'bit_integrations_installed'
'btcbi_version'               → 'bit_integrations_version'
'btcbi_selected_trigger'      → 'bit_integrations_selected_trigger'
'btcbi_db_version'            → 'bit_integrations_db_version'

// ✅ USE THIS INSTEAD
use BitApps\Integrations\Config;

Config::getOption('app_conf');
Config::getOption('changelog_version');
Config::getOption('installed');
Config::getOption('version');
Config::getOption('selected_trigger');

// Or via WP functions
get_option('bit_integrations_app_conf');
get_option('bit_integrations_changelog_version');
```

**Source Files:** 
- `backend/Config.php` (line 214)
- `backend/Admin/AdminAjax.php` (line 32)
- `backend/Core/Hooks/HookService.php` (line 84)
- `backend/Core/Util/UnInstallation.php` (lines 29, 38-42)
- `backend/Core/Util/Activation.php` (lines 64, 67, 107-109)

---

## 🗄️ Deprecated Database Tables

```php
// ❌ DEPRECATED TABLE NAMES (Use Model classes instead)
$wpdb->prefix . 'btcbi_log'    → Use LogModel class
$wpdb->prefix . 'btcbi_flow'   → Use FlowModel class
$wpdb->prefix . 'btcbi_auth'   → Use AuthModel class

// ✅ USE THIS INSTEAD
use BitApps\Integrations\Core\Database\LogModel;
use BitApps\Integrations\Core\Database\FlowModel;
use BitApps\Integrations\Core\Database\AuthModel;

LogModel::all();
FlowModel::find($id);
AuthModel::create($data);
```

**Source Files:** 
- `backend/Core/Database/DB.php` (lines 39-98)
- `backend/Core/Database/LogModel.php` (line 14)
- `backend/Core/Database/FlowModel.php` (line 14)
- `backend/Core/Database/AuthModel.php` (line 14)
- `backend/Core/Util/UnInstallation.php` (lines 53-54)

---

## 🎯 Deprecated Trigger Events (WooCommerce)

### WC Subscriptions Constants (Moved to WC Subscriptions Trigger)

```php
// ❌ DEPRECATED - backend/Triggers/WC/WCController.php
WCController::USER_SUBSCRIBE_PRODUCT             // 12
WCController::USER_CANCELLED_SUBSCRIPTION_PRODUCT // 13
WCController::PRODUCT_SUBSCRIPTION_EXPIRED       // 14
WCController::SUBSCRIPTION_PRODUCT_STATUS_CHANGED // 15
WCController::END_SUBSCRIPTION_TRIAL_PERIOD      // 16

// ✅ USE: WC Subscriptions trigger instead
```

### WC Bookings Constants (Moved to WC Bookings Trigger)

```php
// ❌ DEPRECATED - backend/Triggers/WC/WCController.php
WCController::BOOKING_CREATED                    // 18

// ✅ USE: WC Bookings trigger instead
```

**Source File:** `backend/Triggers/WC/WCController.php` (lines 71-84, 120-128)

---

## 🔧 Code Migration Examples

### Example 1: Plugin URL in Scripts

```php
// ❌ BEFORE
wp_enqueue_script(
    'my-script',
    BTCBI_ASSET_URI . '/js/app.js',
    [],
    BTCBI_VERSION
);

// ✅ AFTER
use BitApps\Integrations\Config;

wp_enqueue_script(
    'my-script',
    Config::get('ASSET_URI') . '/js/app.js',
    [],
    Config::VERSION
);
```

### Example 2: Plugin Path

```php
// ❌ BEFORE
require_once BTCBI_PLUGIN_BASEDIR . 'includes/helper.php';

// ✅ AFTER
use BitApps\Integrations\Config;

require_once Config::get('BASEDIR') . 'includes/helper.php';
```

### Example 3: Custom Filter

```php
// ❌ BEFORE
add_filter('btcbi_localized_script', function($config) {
    $config['api_url'] = rest_url('my-api/v1');
    return $config;
});

// ✅ AFTER
add_filter('bit_integrations_localized_script', function($config) {
    $config['api_url'] = rest_url('my-api/v1');
    return $config;
});
```

### Example 4: Store/Retrieve Options

```php
// ❌ BEFORE
update_option('btcbi_app_conf', ['key' => 'value']);
$conf = get_option('btcbi_app_conf', []);

// ✅ AFTER
use BitApps\Integrations\Config;

Config::updateOption('app_conf', ['key' => 'value']);
$conf = Config::getOption('app_conf', []);
```

### Example 5: Database Queries

```php
// ❌ BEFORE
global $wpdb;
$results = $wpdb->get_results(
    "SELECT * FROM {$wpdb->prefix}btcbi_log WHERE flow_id = $id"
);

// ✅ AFTER
use BitApps\Integrations\Core\Database\LogModel;

$results = LogModel::where('flow_id', $id)->get();
```

### Example 6: Integration-Specific Filters

```php
// ❌ BEFORE
apply_filters('btcbi_high_level_v2_create_contact', $data, $params);
apply_filters('btcbi_salesforce_update_record', $response, $endpoint);

// ✅ AFTER
apply_filters('bit_integrations_high_level_v2_create_contact', $data, $params);
apply_filters('bit_integrations_salesforce_update_record', $response, $endpoint);
```

---

## 🚀 Database Migration Script

Run once to migrate existing options:

```php
function bit_integrations_migrate_deprecated_options() {
    $option_migrations = [
        'btcbi_app_conf'              => 'bit_integrations_app_conf',
        'btcbi_changelog_version'     => 'bit_integrations_changelog_version',
        'btcbi_installed'             => 'bit_integrations_installed',
        'btcbi_version'               => 'bit_integrations_version',
        'btcbi_selected_trigger'      => 'bit_integrations_selected_trigger',
        'btcbi_db_version'            => 'bit_integrations_db_version',
    ];

    foreach ($option_migrations as $old => $new) {
        $value = get_option($old, false);
        if ($value !== false) {
            update_option($new, $value);
            delete_option($old);
        }
    }
}

// Migrate scheduled hooks
function bit_integrations_migrate_scheduled_hooks() {
    $timestamp = wp_next_scheduled('btcbi_delete_integ_log');
    if ($timestamp) {
        wp_unschedule_event($timestamp, 'btcbi_delete_integ_log');
        wp_schedule_event(time(), 'daily', 'bit_integrations_delete_integ_log');
    }
}
```

---

## 📋 Find & Replace

### Search patterns in your codebase:

```bash
# Find deprecated constants
grep -r "BTCBI_" . --include="*.php"
grep -r "btcbi_" . --include="*.php"

# Find deprecated hooks
grep -r "btcbi_" . --include="*.php" | grep -E "(apply_filters|do_action)"

# Find deprecated options
grep -r "btcbi_" . --include="*.php" | grep -E "(get_option|update_option|delete_option)"
```

### IDE Find/Replace (All Files):

| Find | Replace |
|------|---------|
| `BTCBI_VERSION` | `Config::VERSION` |
| `BTCBI_ASSET_URI` | `Config::get('ASSET_URI')` |
| `BTCBI_PLUGIN_BASEDIR` | `Config::get('BASEDIR')` |
| `BTCBI_ROOT_URI` | `Config::get('ROOT_URI')` |
| `BTCBI_PLUGIN_BASENAME` | `Config::get('BASENAME')` |
| `btcbi_localized_script` | `bit_integrations_localized_script` |
| `btcbi_app_conf` | `bit_integrations_app_conf` |
| `btcbi_changelog_version` | `bit_integrations_changelog_version` |
| `btcbi_activate_plugin` | `bit_integrations_activate_plugin` |
| `btcbi_deactivate_plugin` | `bit_integrations_deactivate_plugin` |
| `btcbi_uninstall_plugin` | `bit_integrations_uninstall_plugin` |
| `btcbi_installed` | `bit_integrations_installed` |
| `btcbi_version` | `bit_integrations_version` |
| `btcbi_selected_trigger` | `bit_integrations_selected_trigger` |
| `btcbi_db_version` | `bit_integrations_db_version` |
| `btcbi_delete_integ_log` | `bit_integrations_delete_integ_log` |

### Integration Filters (Bulk Replace):

```bash
# All btcbi_ filters/actions should become bit_integrations_
s/btcbi_/bit_integrations_/g
```

---

## 📂 Files with Deprecated Code

| File | Deprecated Elements Count |
|------|---------------------------|
| `bitwpfi.php` | 6 (constants, functions, variable) |
| `backend/loader.php` | 5 (constants) |
| `backend/Config.php` | 2 (filters, options) |
| `backend/Core/Util/Helper.php` | 1 (filter) |
| `backend/Core/Util/Activation.php` | 4 (options, hooks) |
| `backend/Core/Util/Deactivation.php` | 2 (hooks) |
| `backend/Core/Util/UnInstallation.php` | 7 (options, tables) |
| `backend/Core/Database/DB.php` | 10 (tables, options) |
| `backend/Core/Hooks/HookService.php` | 1 (option) |
| `backend/Admin/AdminAjax.php` | 1 (option) |
| `backend/Triggers/WC/WCController.php` | 6 (constants) |
| `backend/Triggers/WC/Hooks.php` | 6 (WP hooks) |
| `views/view-root.php` | 1 (constant) |
| Integration files | 40+ (filters/actions) |

---

## ⚠️ Backward Compatibility

| Status | Details |
|--------|---------|
| **Current** | ✅ Still functional in v2.7.8 |
| **Support** | ⚠️ Limited support for deprecated elements |
| **Removal** | 🔴 Expected in v3.0.0 |
| **Recommendation** | Migrate ASAP |

---

## 📚 References

### Core Files
- **Config Class:** `backend/Config.php`
- **Main File:** `bitwpfi.php`
- **Loader:** `backend/loader.php`
- **Models:** `backend/Core/Database/*.php`

### Trigger Files
- **WC Controller:** `backend/Triggers/WC/WCController.php`
- **WC Hooks:** `backend/Triggers/WC/Hooks.php`

### Utility Files
- **Activation:** `backend/Core/Util/Activation.php`
- **Deactivation:** `backend/Core/Util/Deactivation.php`
- **UnInstallation:** `backend/Core/Util/UnInstallation.php`
- **Helper:** `backend/Core/Util/Helper.php`

### Admin Files
- **AdminAjax:** `backend/Admin/AdminAjax.php`
- **HookService:** `backend/Core/Hooks/HookService.php`

---

## 📝 Complete Deprecated Elements List

### Constants (8)
1. `BTCBI_VERSION`
2. `BTCBI_PLUGIN_MAIN_FILE`
3. `BTCBI_PLUGIN_BASENAME`
4. `BTCBI_PLUGIN_BASEDIR`
5. `BTCBI_ROOT_URI`
6. `BTCBI_PLUGIN_DIR_PATH`
7. `BTCBI_ASSET_URI`
8. `$btcbi_db_version` (global)

### Functions (3)
1. `btcbi_activate_plugin()`
2. `btcbi_deactivate_plugin()`
3. `btcbi_uninstall_plugin()`

### Options (6)
1. `btcbi_app_conf`
2. `btcbi_changelog_version`
3. `btcbi_installed`
4. `btcbi_version`
5. `btcbi_selected_trigger`
6. `btcbi_db_version`

### Database Tables (3)
1. `btcbi_log`
2. `btcbi_flow`
3. `btcbi_auth`

### WC Trigger Constants (6)
1. `USER_SUBSCRIBE_PRODUCT`
2. `USER_CANCELLED_SUBSCRIPTION_PRODUCT`
3. `PRODUCT_SUBSCRIPTION_EXPIRED`
4. `SUBSCRIPTION_PRODUCT_STATUS_CHANGED`
5. `END_SUBSCRIPTION_TRIAL_PERIOD`
6. `BOOKING_CREATED`

### WordPress Hooks (6)
1. `woocommerce_subscription_payment_complete`
2. `woocommerce_subscription_status_cancelled`
3. `woocommerce_subscription_status_expired`
4. `woocommerce_subscription_status_updated`
5. `woocommerce_scheduled_subscription_trial_end`
6. `woocommerce_new_booking`

### Plugin Filters/Actions (40+)
All `btcbi_*` prefixed hooks including:
- `btcbi_localized_script`
- `btcbi_mailpoet_update_subscriber`
- `btcbi_high_level_*` (6 hooks)
- `btcbi_smartSuite_*` (2 hooks)
- `btcbi_jet_engine_*` (8 hooks)
- `btcbi_salesforce_*` (4 hooks)
- `btcbi_lmfwc_*` (7 hooks)
- `btcbi_whatsapp_*` (3 hooks)
- `btcbi_mailerpress_*` (5 hooks)
- And more...

---

**Version:** 2.7.8 | **Updated:** 2026-02-18 | **Total Deprecated Elements:** 70+
