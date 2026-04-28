# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Frontend
```bash
pnpm dev          # Vite dev server (HMR; writes port to .port file)
pnpm build        # Production build to assets/
pnpm lint         # ESLint on frontend/src (zero warnings allowed)
pnpm pretty:fix   # Prettier format + write
pnpm i18n         # Full i18n pipeline
```

### PHP
```bash
composer run version-checker   # PHPCompatibility check (PHP 7.4+)
php php-cs-fixer.phar fix      # PSR-2 code style fix
```

No PHP unit tests exist. No JS test runner is wired up.

### CI
- `plugin-check.yml` — runs on push/PR to `main`; WordPress Plugin Check (PHPCS, i18n, security)
- `deploy.yml` — runs on push to `release`; deploys to WordPress.org SVN

## Architecture

### Boot Sequence
`bitwpfi.php` → `backend/loader.php` → `backend/Plugin.php` (singleton, `plugins_loaded`) → `backend/Core/Hooks/HookService.php`

`HookService` auto-discovers integrations by scanning the filesystem:
- Includes `backend/Triggers/*/Routes.php` and `backend/Actions/*/Routes.php` for all integrations (admin/ajax only)
- Includes `backend/Triggers/*/Hooks.php` only for active triggers (those with flows configured)
- Includes `backend/Actions/*/Hooks.php` for all actions

### AJAX Routing
`backend/Core/Util/Route.php` — lazy matcher. `Route::post('my_action', [...])` hooks only if the current request's `action` matches `bit_integrations_my_action`. Modifiers: `Route::no_auth()`, `Route::no_sanitize()`, `Route::sanitize_post_content()`, `Route::ignore_token()`.

POST body: JSON from `php://input` or form-data with `data` key. Nonce verified automatically.

### Execution Flow
Trigger fires → `Flow::execute($trigger, $id, $data, $flows)` → for each flow, resolves `BitApps\Integrations\Actions\{Name}\{Name}Controller` (free) or Pro namespace → calls `->execute($flowData, $triggerData)`.

Switch-case in `Flow::execute()` handles display name → class name mismatches (e.g. `'Monday.Com'` → `'MondayCom'`).

### Adding a New Action (`backend/Actions/{Name}/`)

Three files:

**`{Name}Controller.php`** (namespace `BitApps\Integrations\Actions\{Name}`)
- Static auth/setup AJAX handlers
- `execute($integrationData, $fieldValues)` — called by Flow engine; creates a `RecordApiHelper`, delegates to it

**`RecordApiHelper.php`**
- Does the actual external API call
- Calls `LogHandler::save(...)` for success/error
- Uses `Common::replaceFieldWithValue()` to resolve `${fieldName}` tokens from trigger data

**`Routes.php`** (no namespace — plain include)
```php
use BitApps\Integrations\Core\Util\Route;
use BitApps\Integrations\Actions\{Name}\{Name}Controller;

Route::post('{name}_auth', [{Name}Controller::class, 'checkAuthorization']);
```

### Adding a New Trigger (`backend/Triggers/{Name}/`)

**`{Name}Controller.php`**
- `public static function info(): array` — metadata for the trigger list UI (name, type, docs URL, endpoints, isPro flag)
- `public static function fields($id): array` — field list for a form/entity
- WP hook handler calls `Flow::exists('{Name}', $id)` then `Flow::execute('{Name}', $id, $data, $flows)`

**`Routes.php`** — AJAX endpoints for fetching forms/fields

**`Hooks.php`** — WP `add_action`/`add_filter` calls; only loaded when trigger is active

### Database
Tables (prefix `btcbi_`):
- `btcbi_flow` — flows: `triggered_entity`, `triggered_entity_id`, `flow_details` (JSON), `status`
- `btcbi_log` — execution logs per flow
- `btcbi_auth` — stored OAuth/API credentials (`action_name`, `tokenDetails` JSON)

Base ORM: `backend/Core/Database/Model.php`

### Frontend (React SPA)
Stack: **React 18 + Vite 7 + Recoil + React Router 7 + SWR**

Entry: `frontend/src/main.jsx` → mounts into `<div id="btcd-app">` (HashRouter + RecoilRoot)

**Backend connection:**
- PHP localizes data as `window.bit_integrations_` (nonce, ajaxURL, assetsURL, translations, etc.)
- JS reads it as `APP_CONFIG` via `frontend/src/config/app.js`
- All calls go through `bitsFetch(data, action)` → POST to `admin-ajax.php` with `action=bit_integrations_{action}`
- Responses: `wp_send_json_success()` / `wp_send_json_error()`

**Dev mode:** `.port` file existence triggers PHP to enqueue from Vite dev server instead of `assets/`.

**State:** Recoil atoms — key ones: `$appConfigState`, `$newFlow`, `$actionConf`, `$formFields`, `$flowStep`

### Adding a New Action (Frontend: `frontend/src/components/AllIntegrations/{Name}/`)

| File | Role |
|---|---|
| `{Name}.jsx` | Step wizard (auth → config → field map + save) |
| `{Name}Authorization.jsx` | Step 1 — credential collection, calls backend auth endpoint |
| `{Name}IntegLayout.jsx` | Step 2 — integration-specific config UI |
| `Edit{Name}.jsx` | Edit mode |
| `{Name}CommonFunc.js` | Shared helpers |

Save/update calls use `saveActionConf()` from `IntegrationHelpers.js` → `bitsFetch()` with action `flow/save` or `flow/update`.

## Key Conventions

**PHP:**
- Namespace root: `BitApps\Integrations\` → `backend/` (PSR-4)
- Class name must match directory name exactly (used for dynamic class resolution at runtime)
- `Routes.php` and `Hooks.php` have **no namespace** — they are plain includes
- DB/option prefix: `btcbi_` / `bit_integrations_`
- WP hook prefix: `bit_integrations_`
- Nonce key: `bit_integrations_nonce`
- Third-party libs prefixed to `BitApps\Integrations\Deps\` (via imposter-plugin)

**Pro plugin:**
- Free plugin detects Pro via `class_exists('BitApps\\IntegrationsPro\\...')`
- `Flow::isActionExists()` checks free namespace first, then two Pro namespaces
- `backend/Triggers/AllTriggersName.php` lists Pro triggers with `isPro: true` for upsell UI

**i18n:**
- JS uses `__()` from `frontend/src/Utils/i18nwrap.js` (checks `APP_CONFIG.translations` first, falls back to `@wordpress/i18n`)
