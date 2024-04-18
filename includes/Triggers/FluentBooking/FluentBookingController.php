<?php

namespace BitCode\FI\Triggers\FluentBooking;

use DateTime;
use BitCode\FI\Flow\Flow;
use MailPoet\Form\FormsRepository;
use MailPoet\DI\ContainerWrapper;
use FluentBooking\App\Models\CalendarSlot;
use FluentBooking\App\Services\BookingFieldService;



final class FluentBookingController
{
    public static function info()
    {
        $plugin_path = 'mailpoet/mailpoet.php';
        return [
            'name' => 'Fluent Booking',
            'title' => 'Fluent Booking',
            'slug' => $plugin_path,
            'pro' => 'fluent-booking-pro/fluent-booking-pro.php',
            'type' => 'form',
            'is_active' => is_plugin_active('fluent-booking-pro/fluent-booking-pro.php'),
            'activation_url' => wp_nonce_url(self_admin_url('plugins.php?action=activate&amp;plugin=' . $plugin_path . '&amp;plugin_status=all&amp;paged=1&amp;s'), 'activate-plugin_' . $plugin_path),
            'install_url' => wp_nonce_url(self_admin_url('update.php?action=install-plugin&plugin=' . $plugin_path), 'install-plugin_' . $plugin_path),
            'list' => [
                'action' => 'fluentBooking/get',
                'method' => 'get',
            ],
            'fields' => [
                'action' => 'fluentBooking/get/form',
                'method' => 'post',
                'data' => ['id']
            ],
        ];
    }

    public function getAll()
    {
        if (!is_plugin_active('fluent-booking-pro/fluent-booking-pro.php')) {
            wp_send_json_error(__('Fluent Booking is not installed or activated', 'bit-integrations'));
        }

        $events     = CalendarSlot::where('status', 'active')->get();
        $all_events = [];

        if ($events) {
            foreach ($events as $event) {
                $all_events[] = (object)[
                    'id'    => $event->id,
                    'title' => $event->title,
                ];
            }
        }

        wp_send_json_success($all_events);
    }

    public function get_a_form($data)
    {
        if (!is_plugin_active('fluent-booking-pro/fluent-booking-pro.php')) {
            wp_send_json_error(__('Fluent Booking is not installed or activated', 'bit-integrations'));
        }

        if (empty($data->id)) {
            wp_send_json_error(__('Event doesn\'t exists', 'bit-integrations'));
        }

        $fields = self::fields($data->id);

        if (empty($fields)) {
            wp_send_json_error(__('Event doesn\'t exists any field', 'bit-integrations'));
        }

        $responseData['fields'] = $fields;

        wp_send_json_success($responseData);
    }

    public static function fields($form_id)
    {
        $calendarSlot  = CalendarSlot::find($form_id);
        $bookingFields = BookingFieldService::getBookingFields($calendarSlot);
        $fields        = [];

        foreach ($bookingFields as $bookingField) {
            if ($bookingField['enabled']) {
                $fields[] = [
                    'name'  => $bookingField['name'],
                    'type'  => $bookingField['type'],
                    'label' => $bookingField['label'],
                ];
            }
        }

        error_log(print_r($fields, true));

        return $fields;
    }

    public static function handle_fluentBooking_submit($data, $segmentIds, $form)
    {
        $formData = [];

        foreach ($data as $key => $item) {
            $keySeparated = explode('_', $key);

            if ($keySeparated[0] === 'cf') {
                if (is_array($item)) {
                    $formData[$keySeparated[1]] = self::handleDateField($item);
                } else {
                    $formData[$keySeparated[1]] = $item;
                }
            } else {
                if (is_array($item)) {
                    $formData[$key] = self::handleDateField($item);
                } else {
                    $formData[$key] = $item;
                }
            }
        }

        $form_id = $form->getId();

        if (!empty($form_id) && $flows = Flow::exists('MailPoet', $form_id)) {
            Flow::execute('MailPoet', $form_id, $formData, $flows);
        }
    }

    public static function extractColumnData($array, &$result)
    {
        foreach ($array['body'] as $item) {
            if ($item['type'] === 'column' && isset($item['body'])) {
                foreach ($item['body'] as $nestedItem) {
                    if (isset($nestedItem['name']) && isset($nestedItem['id'])) {
                        $result[] = array(
                            'name'  => $nestedItem['id'],
                            'type'  => $item['type'],
                            'label' => $nestedItem['name'],
                        );
                    }
                    if (isset($nestedItem['type']) && $nestedItem['type'] === 'columns') {
                        self::extractColumnData($nestedItem, $result);
                    }
                }
            }
        }
    }

    public static function flattenArray($array)
    {
        $result = [];
        foreach ($array as $item) {
            if (array_key_exists(0, $item) && is_array($item[0])) {
                foreach ($item as $itm) {
                    $result[] = $itm;
                }
            } else {
                $result[] = $item;
            }
        }
        return $result;
    }

    public static function handleDateField($item)
    {
        if (
            array_key_exists('year', $item)
            && array_key_exists('month', $item)
            && array_key_exists('day', $item)
            && (!empty($item['year']) || !empty($item['month']) || !empty($item['day']))
        ) {
            $year  = (int) !empty($item['year']) ? $item['year'] : date('Y');
            $month = (int) !empty($item['month']) ? $item['month'] : 1;
            $day   = (int) !empty($item['day']) ? $item['day'] : 1;
        } elseif (
            array_key_exists('year', $item)
            && array_key_exists('month', $item)
            && (!empty($item['year']) || !empty($item['month']))
        ) {
            $year  = (int) !empty($item['year']) ? $item['year'] : date('Y');
            $month = (int) !empty($item['month']) ? $item['month'] : 1;
            $day   = 1;
        } elseif (array_key_exists('year', $item) && !empty($item['year'])) {
            $year  = $item['year'];
            $month = 1;
            $day   = 1;
        } elseif (array_key_exists('month', $item) && !empty($item['month'])) {
            $year  = date('Y');
            $month = $item['month'];
            $day   = 1;
        }

        if (isset($year, $month, $day)) {
            $date = new DateTime();
            $date->setDate($year, $month, $day);
            return $date->format('Y-m-d');
        }

        return null;
    }
}
