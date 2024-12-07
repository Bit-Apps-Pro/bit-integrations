<?php
if (!defined('ABSPATH')) {
    exit;
}

if (!defined('BTCBI_ASSET_URI')) {
    exit;
}

?>
<noscript>You need to enable JavaScript to run this app.</noscript>
<div id="btcd-app">
  <div
    style="display: flex;flex-direction: column;justify-content: center;align-items: center;height: 90vh;font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
    <img alt="" class="bit-logo" width="600px"
      src="<?php echo esc_url(BTCBI_ASSET_URI); ?>/welcome.webp">
    <!-- <h1>Welcome to Bit Integrations.</h1> -->
    <p></p>
  </div>
</div>