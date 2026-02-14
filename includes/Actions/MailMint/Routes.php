<?php

if (!defined('ABSPATH')) {
    exit;
}

use BitApps\BTCBI_FI\Actions\MailMint\MailMintController;
use BitApps\BTCBI_FI\Core\Util\Route;

Route::post('mailmint_authorize', [MailMintController::class, 'authorizeMailMint']);
Route::post('fetch_all_mail_mint_list', [MailMintController::class, 'getAllList']);
Route::post('fetch_all_mail_mint_tags', [MailMintController::class, 'getAllTags']);
Route::post('fetch_all_mail_mint_custom_fields', [MailMintController::class, 'allCustomFields']);
