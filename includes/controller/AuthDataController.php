<?php

namespace BitCode\FI\controller;

use BitCode\FI\Core\Database\AuthModel;

final class AuthDataController
{
    public function saveAuthData($requestParams)
    {
        if (empty($requestParams->actionName) || empty($requestParams->tokenDetails) || empty($requestParams->userInfo)) {
            wp_send_json_error(['error' => 'Requested Parameters are empty']);
        }

        $tokenDetails = wp_json_encode($requestParams->tokenDetails);
        $userInfo = wp_json_encode($requestParams->userInfo);

        $sanitizedActionName = sanitize_text_field($requestParams->actionName);
        $sanitizedUserEmailAddress = sanitize_text_field($requestParams->userInfo->user->emailAddress);
        $sanitizedTokenDetails = sanitize_text_field($tokenDetails);
        $sanitizedUserInfo = sanitize_text_field($userInfo);

        if (empty($sanitizedActionName) || empty($sanitizedTokenDetails) || empty($sanitizedUserInfo) || empty($sanitizedUserEmailAddress)) {
            wp_send_json_error(['error' => 'Requested Parameters are empty']);
        }

        $emailExists = $this->checkAuthDataExist($sanitizedActionName, $sanitizedUserEmailAddress);

        if (!$emailExists) {
            $authModel = new AuthModel();
            $authModel->insert(
                [
                    'action_name'  => $sanitizedActionName,
                    'tokenDetails' => $sanitizedTokenDetails,
                    'userInfo'     => $sanitizedUserInfo,
                    'created_at'   => current_time('mysql')
                ]
            );

            return $this->getAuthData($sanitizedActionName);
        }
        wp_send_json_success(['error' => 'Email address exists.']);
    }

    public function getAuthData($request)
    {
        $actionName = sanitize_text_field($request->actionName ? $request->actionName : $request);
        if (empty($actionName)) {
            wp_send_json_error('Action name is not available');
            exit;
        }

        $authModel = new AuthModel();
        $result = $authModel->get(
            [
                'id',
                'action_name',
                'tokenDetails',
                'userInfo',
            ],
            ['action_name' => $actionName]
        );

        if (is_wp_error($result)) {
            wp_send_json_success(['data' => []]);
            exit;
        }

        foreach ($result as $item) {
            $item->tokenDetails = json_decode($item->tokenDetails, true);
            $item->userInfo = json_decode($item->userInfo, true);
        }

        wp_send_json_success(['data' => $result]);
        exit;
    }

    public function getAuthDataById($request)
    {
        $id = absint($request->id);
        if (empty($id)) {
            wp_send_json_error('Action name is not available');
            exit;
        }

        $authModel = new AuthModel();
        $result = $authModel->get(
            [
                'id',
                'action_name',
                'tokenDetails',
                'userInfo',
            ],
            ['id' => $id]
        );

        if (is_wp_error($result)) {
            wp_send_json_error(['data' => []]);
            exit;
        }

        foreach ($result as $item) {
            $item->tokenDetails = json_decode($item->tokenDetails, true);
            $item->userInfo = json_decode($item->userInfo, true);
        }

        wp_send_json_success(['data' => $result]);
        exit;
    }

    public function deleteAuthData($id)
    {
        $condition = null;
        $id = absint($id);
        if (!empty($id)) {
            $condition = [
                'id' => $id
            ];
        }
        $authModel = new AuthModel();

        return $authModel->delete($condition);
    }

    public function checkAuthDataExist($actionName, $emailAddress)
    {
        $authModel = new AuthModel();
        $result = $authModel->get(
            [
                'id',
                'action_name',
                'userInfo',
            ],
            ['action_name' => $actionName]
        );

        if (is_wp_error($result)) {
            return false;
        }

        foreach ($result as $item) {
            $item->userInfo = json_decode($item->userInfo, true);

            if (!empty($item->userInfo['user']['emailAddress']) && $item->userInfo['user']['emailAddress'] === $emailAddress) {
                return $emailExists = true;
            }
        }

        return false;
    }
}
