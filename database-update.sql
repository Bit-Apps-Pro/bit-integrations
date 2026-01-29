-- Manual Database Update for Bit Integrations Reexecution Feature
-- Run this SQL if the automatic migration doesn't work

-- Add field_data column to btcbi_log table
ALTER TABLE `wp_btcbi_log` 
ADD COLUMN IF NOT EXISTS `field_data` LONGTEXT DEFAULT NULL 
AFTER `response_obj`;

-- Note: Replace 'wp_' with your actual WordPress table prefix if different
-- You can find your prefix in wp-config.php ($table_prefix variable)

-- Example for custom prefix:
-- ALTER TABLE `custom_prefix_btcbi_log` 
-- ADD COLUMN IF NOT EXISTS `field_data` LONGTEXT DEFAULT NULL 
-- AFTER `response_obj`;

-- Verify the column was added:
-- SHOW COLUMNS FROM `wp_btcbi_log` LIKE 'field_data';
