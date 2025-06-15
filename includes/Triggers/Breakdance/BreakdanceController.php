<?php

namespace BitCode\FI\Triggers\Breakdance;

use BitCode\FI\Triggers\TriggerController;

final class BreakdanceController
{
    public static $bAllForm = [];

    private $instance;

    public static function pluginActive($option = null)
    {
        if (is_plugin_active('breakdance/plugin.php')) {
            return $option === 'get_name' ? 'breakdance/plugin.php' : true;
        }

        return false;
    }

    public static function addAction()
    {
        if (class_exists(__NAMESPACE__ . '\BreakdanceAction')) {
            \Breakdance\Forms\Actions\registerAction(new BreakdanceAction());
        }
    }

    public function getTestData()
    {
        return TriggerController::getTestData('breakdance');
    }

    public function removeTestData($data)
    {
        return TriggerController::removeTestData($data, 'breakdance');
    }
}
