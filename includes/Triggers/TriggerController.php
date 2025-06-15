<?php

namespace BitCode\FI\Triggers;

use BitCode\FI\Plugin;
use FilesystemIterator;

final class TriggerController
{
    /**
     * Lists available triggers
     *
     * @return JSON|WP_Error
     */
    public static function triggerList()
    {
        // if(!Plugin::instance()->isLicenseActive()) {
        //     return wp_send_json_error(['message' => 'License is not active']);
        // }

        $triggers = [];
        $dirs = new FilesystemIterator(__DIR__);
        foreach ($dirs as $dirInfo) {
            if ($dirInfo->isDir()) {
                $trigger = basename($dirInfo);
                if (file_exists(__DIR__.'/'.$trigger)
                    && file_exists(__DIR__.'/'.$trigger.'/'.$trigger.'Controller.php')
                ) {
                    $trigger_controller = __NAMESPACE__. "\\{$trigger}\\{$trigger}Controller";
                    if (method_exists($trigger_controller, 'info')) {
                        $triggers[$trigger] = $trigger_controller::info();
                    }
                }
            }
        }
        return $triggers;
    }

    public static function getTriggerField($triggerName, $data)
    {
        $triggers = [];
        $trigger = basename($triggerName);
        if (file_exists(__DIR__.'/'.$trigger)
                && file_exists(__DIR__.'/'.$trigger.'/'.$trigger.'Controller.php')
        ) {
            $trigger_controller = __NAMESPACE__. "\\{$trigger}\\{$trigger}Controller";
            if (method_exists($trigger_controller, 'get_a_form')) {
                $trigger = new $trigger_controller();
                return $trigger::fields($data->id);
            }
        }
        return $triggers;
    }
}
