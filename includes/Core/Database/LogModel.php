<?php
/**
 * Provides Base Model Class
 */

namespace BitApps\BTCBI_PRO\Core\Database;

/**
 * Undocumented class
 */
use BitApps\BTCBI_PRO\Core\Database\Model;

class LogModel extends Model
{
    protected static $table = 'btcbi_log';

    public function autoLogDelete($condition)
    {
        global $wpdb;
        if (
            !\is_null($condition)
        ) {
            $tableName = $wpdb->prefix.static::$table;

            $result = $this->app_db->get_results("DELETE FROM $tableName WHERE $condition", OBJECT_K);

            return $result;
        }
    }
}
