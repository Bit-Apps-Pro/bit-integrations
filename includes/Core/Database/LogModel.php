<?php

/**
 * Provides Base Model Class
 */

namespace BitCode\FI\Core\Database;

/**
 * Undocumented class
 */
class LogModel extends Model
{
    protected static $table = 'btcbi_log';

    public function autoLogDelete($intervalDays)
    {
        global $wpdb;
        if (
            !\is_null($intervalDays)
        ) {
            $tableName = $wpdb->prefix . static::$table;
            $intervalDays = absint($intervalDays);

            $result = $this->app_db->get_results(
                $wpdb->prepare(
                    "DELETE FROM {$tableName} WHERE DATE_ADD(date(created_at), INTERVAL %d DAY) < CURRENT_DATE",
                    $intervalDays
                ),
                OBJECT_K
            );

            return $result;
        }
    }
}
