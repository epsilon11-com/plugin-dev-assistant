<?php

// Plugin Developer Assistant for WordPress
// Copyright (C) 2017 Eric Adolfson
//
// This program is free software; you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation; either version 2 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License along
// with this program; if not, write to the Free Software Foundation, Inc.,
// 51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.

class PluginDevAssistant
{
  private static $initialized = false;
  private static $initializedAdmin = false;

  /**
   * Plugin initialization.
   * @static
   */
  public static function init() {
    // Ensure function is called only once.

    if (self::$initialized) {
      return;
    }

    self::$initialized = true;
  }

  public static function admin_init() {
    // Ensure function is called only once.

    if (self::$initializedAdmin) {
      return;
    }

    self::$initializedAdmin = true;

    // Load stylesheet for plugin.

    wp_register_style('plugin-dev-assistant.css',
      plugin_dir_url(__FILE__) . 'css/plugin-dev-assistant.css',
      array(),
      PLUGIN_DEV_ASSISTANT_VERSION);

    wp_enqueue_style('plugin-dev-assistant.css');
  }

  public static function add_header_monitor() {
    // [TODO] Allow monitor endpoint to be configured by user.
    // [TODO] Create/use capability to determine if this gets sent.  And
    //        if the endpoint is accessible.

    if (current_user_can('administrator')) {
      header('X-Plugin-Dev-Monitor-URL: ' . get_site_url(null, '/plugin-dev-monitor-endpoint'));
    }
  }

  public static function monitor() {
    if (!current_user_can('administrator') ||
          (parse_url($_SERVER['REQUEST_URI'],
              PHP_URL_PATH) != '/plugin-dev-monitor-endpoint')) {

      return;
    }

    // [TODO] Communicate with web browser extension

    echo 'here';
    exit(0);
  }
}

add_action('send_headers', array('PluginDevAssistant', 'add_header_monitor'));
add_action('init', array('PluginDevAssistant', 'monitor'));
