<?php

namespace BitCode\FI\Actions\Fabman;

use BitCode\FI\Core\Util\Common;
use BitCode\FI\Core\Util\HttpHelper;
use BitCode\FI\Log\LogHandler;
use DateTime;
use WP_Error;

class RecordApiHelper
{
    private $integrationID;

    private $apiKey;

    private $workspaceId;

    private $accountId;

    private $memberId;

    private $apiEndpoint;

    private $lockVersion;

    public function __construct($apiKey, $workspaceId, $accountId, $integrationID = null, $memberId = null, $lockVersion = null)
    {
        $this->integrationID = $integrationID;
        $this->apiKey = $apiKey;
        $this->workspaceId = $workspaceId;
        $this->accountId = $accountId;
        $this->memberId = $memberId;
        $this->lockVersion = $lockVersion;
        $this->apiEndpoint = 'https://fabman.io/api/v1';
    }

    public function execute($actionName, $fieldValues, $integrationDetails)
    {
        $finalData = [];
        $finalData['account'] = $this->accountId;

        if ($this->workspaceId) {
            $finalData['space'] = $this->workspaceId;
        }

        if ($this->memberId) {
            $finalData['memberId'] = $this->memberId;
        }

        foreach ($integrationDetails->field_map ?? [] as $fieldMap) {
            if (empty($fieldMap->formField) || empty($fieldMap->fabmanFormField)) {
                continue;
            }

            $rawValue = $fieldMap->formField === 'custom'
                ? Common::replaceFieldWithValue($fieldMap->customValue, $fieldValues)
                : ($fieldValues[$fieldMap->formField] ?? null);

            $validatedValue = $this->validateAndSanitizeField($fieldMap->fabmanFormField, $rawValue);

            if ($validatedValue === false) {
                LogHandler::save(
                    $this->integrationID,
                    ['type' => 'validation', 'field' => $fieldMap->fabmanFormField, 'value' => $rawValue],
                    'error',
                    __('Field validation failed for: ' . $fieldMap->fabmanFormField, 'bit-integrations')
                );

                continue;
            }

            $finalData[$fieldMap->fabmanFormField] = $validatedValue;
        }

        switch ($actionName) {
            case 'create_member':
                $apiResponse = $this->createMember($finalData);

                break;
            case 'update_member':
                $apiResponse = $this->updateMember($finalData);

                break;
            case 'delete_member':
                $apiResponse = $this->deleteMember();

                break;
            case 'create_spaces':
                $apiResponse = $this->createSpace($finalData);

                break;
            case 'update_spaces':
                $apiResponse = $this->updateSpace($finalData);

                break;
            default:
                $apiResponse = new WP_Error(
                    'INVALID_ACTION',
                    __('Invalid action name', 'bit-integrations')
                );
        }

        if (is_wp_error($apiResponse) || (\is_object($apiResponse) && isset($apiResponse->error))) {
            $status = 'error';
        } else {
            $status = \in_array(HttpHelper::$responseCode, [200, 201, 204]) ? 'success' : 'error';
        }

        LogHandler::save($this->integrationID, ['type' => 'record', 'type_name' => $actionName], $status, $apiResponse);

        return $apiResponse;
    }

    private function createMember($data)
    {
        unset($data['memberId']);
        $apiEndpoint = $this->apiEndpoint . '/members';
        $header = $this->setHeaders();
        $apiResponse = HttpHelper::post($apiEndpoint, json_encode($data), $header);

        if (\is_wp_error($apiResponse)) {
            return $apiResponse;
        }

        if (HttpHelper::$responseCode === 201) {
            return $apiResponse;
        }

        return new WP_Error('API_ERROR', isset($apiResponse->error) ? $apiResponse->error : \__('Failed to create member', 'bit-integrations'));
    }

    private function updateMember($data)
    {
        $data['lockVersion'] = $this->lockVersion;

        if (empty($this->memberId)) {
            return new WP_Error('MISSING_MEMBER_ID', __('The email provided did not match any existing Fabman member.', 'bit-integrations'));
        }

        $response = \apply_filters('btcbi_fabman_update_member', false, json_encode($data), $this->setHeaders(), $this->apiEndpoint, $this->memberId);

        return $this->handleFilterResponse($response);
    }

    private function deleteMember()
    {
        if (empty($this->memberId)) {
            return new WP_Error('MISSING_MEMBER_ID', __('The email provided did not match any existing Fabman member.', 'bit-integrations'));
        }

        $response = \apply_filters('btcbi_fabman_delete_member', false, $this->setHeaders(), $this->apiEndpoint, $this->memberId);

        return $this->handleFilterResponse($response);
    }

    private function createSpace($data)
    {
        unset($data['space']);
        $response = \apply_filters('btcbi_fabman_create_space', false, json_encode($data), $this->setHeaders(), $this->apiEndpoint);

        return $this->handleFilterResponse($response);
    }

    private function updateSpace($data)
    {
        $data['lockVersion'] = $this->lockVersion;

        if (empty($this->workspaceId)) {
            return new WP_Error('MISSING_SPACE_ID', __('Please select a space to update.', 'bit-integrations'));
        }

        $response = \apply_filters('btcbi_fabman_update_space', false, json_encode($data), $this->setHeaders(), $this->apiEndpoint, $this->workspaceId);

        return $this->handleFilterResponse($response);
    }

    private function handleFilterResponse($response)
    {
        if (empty($response)) {
            return (object) ['error' => \wp_sprintf(\__('%s plugin is not installed or activated', 'bit-integrations'), 'Bit Integration Pro')];
        }

        return $response;
    }

    /**
     * Validates and sanitizes field values based on Fabman API field requirements
     *
     * @param string $fieldName The Fabman field name
     * @param mixed  $value     The raw value to validate
     *
     * @return mixed|false The sanitized value or false if validation fails
     */
    private function validateAndSanitizeField($fieldName, $value)
    {
        // Handle null/empty values consistently
        if ($value === null || $value === '') {
            return $this->isFieldRequired($fieldName) ? false : null;
        }

        // Ensure value is string for initial processing
        $value = (string) $value;
        $value = trim($value);

        // If still empty after trim, handle as null
        if ($value === '') {
            return $this->isFieldRequired($fieldName) ? false : null;
        }

        switch ($fieldName) {
            case 'emailAddress':
                return $this->validateEmail($value);

            case 'firstName':
            case 'lastName':
            case 'displayName':
                return $this->validateName($value);

            case 'phone':
                return $this->validatePhone($value);

            case 'notes':
                return $this->validateNotes($value);

            case 'lockVersion':
                return $this->validateLockVersion($value);

            case 'privileges':
                return $this->validatePrivileges($value);

            case 'memberNumber':
                return $this->validateMemberNumber($value);

            case 'birthday':
                return $this->validateDate($value);

            case 'space':
            case 'account':
            case 'memberId':
                return $this->validateId($value);

            default:
                // For unknown fields, apply basic string sanitization
                return $this->sanitizeString($value, 255);
        }
    }

    private function isFieldRequired($fieldName)
    {
        $requiredFields = ['emailAddress', 'firstName', 'lastName'];

        return \in_array($fieldName, $requiredFields);
    }

    private function validateEmail($value)
    {
        $email = sanitize_email($value);

        return is_email($email) ? $email : false;
    }

    private function validateName($value)
    {
        return $this->sanitizeString($value, 100);
    }

    private function validatePhone($value)
    {
        // Remove non-digit characters except + and spaces
        $phone = preg_replace('/[^\d\s\+\-\(\)]/', '', $value);
        $phone = trim($phone);

        // Basic phone validation (allow various formats)
        if (\strlen($phone) < 7 || \strlen($phone) > 20) {
            return false;
        }

        return $phone;
    }

    private function validateNotes($value)
    {
        return $this->sanitizeString($value, 1000);
    }

    private function validateLockVersion($value)
    {
        if (!is_numeric($value)) {
            return false;
        }

        $version = (int) $value;

        return $version >= 0 ? $version : false;
    }

    private function validatePrivileges($value)
    {
        $validPrivileges = ['member', 'admin', 'owner'];

        if (\is_array($value)) {
            // Sanitize all array elements
            $sanitizedArray = array_map('sanitize_text_field', $value);

            // Validate each element is in allowed privileges
            foreach ($sanitizedArray as $privilege) {
                if (!\in_array($privilege, $validPrivileges, true)) {
                    return false;
                }
            }

            return $sanitizedArray;
        }

        // Handle scalar value
        $sanitizedValue = sanitize_text_field($value);

        // Return sanitized value only if it's in allowed privileges
        return \in_array($sanitizedValue, $validPrivileges, true) ? $sanitizedValue : false;
    }

    private function validateMemberNumber($value)
    {
        // Member number should be alphanumeric
        $memberNumber = preg_replace('/[^a-zA-Z0-9\-_]/', '', $value);

        return \strlen($memberNumber) <= 50 ? $memberNumber : false;
    }

    private function validateDate($value)
    {
        // Try common date formats explicitly
        $formats = ['Y-m-d', 'd/m/Y', 'm/d/Y', 'Y-m-d H:i:s'];
        $dateObj = false;

        foreach ($formats as $format) {
            $dateObj = DateTime::createFromFormat($format, $value);
            if ($dateObj !== false) {
                break;
            }
        }

        if ($dateObj === false) {
            return false;
        }

        // Return in ISO 8601 format
        return $dateObj->format('c');
    }

    private function validateId($value)
    {
        if (!is_numeric($value)) {
            return false;
        }

        $id = (int) $value;

        return $id > 0 ? $id : false;
    }

    private function sanitizeString($value, $maxLength = 255)
    {
        // Strip tags but don't double-encode entities - json_encode() will handle escaping
        $sanitized = wp_strip_all_tags($value);

        // Use multibyte-safe length checks and truncation
        if (mb_strlen($sanitized) > $maxLength) {
            $sanitized = mb_substr($sanitized, 0, $maxLength);
        }

        return $sanitized;
    }

    private function setHeaders(): array
    {
        return [
            'Authorization' => 'Bearer ' . $this->apiKey,
            'Content-Type'  => 'application/json'
        ];
    }
}
