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


const { Panel } = require("dev/panel");
const { Tool } = require("dev/toolbox");
const { Class } = require("sdk/core/heritage");
const self = require("sdk/self");

// [TODO] Removable?
//const tabs = require("sdk/tabs");

// [TODO] Turn to const?
let { Cc, Ci } = require("chrome");

const PlugDevPanel = Class({
    extends: Panel,
    label: "WP Plugin Dev",
    tooltip: "WP Plugin Developer Tools",
    icon: self.data.url("wp-plugin-dev.png"),
    url: self.data.url("wp-plugin-dev.html"),

    setup: function(options) {
        this.debuggee = options.debuggee;
    },

    dispose: function() {
        this.unregister();

        this.debuggee = null;
    },

    observe: function(subject, topic, data) {
        this.postMessage('hello', [this.debuggee]);

        let channel = subject.QueryInterface(Ci.nsIHttpChannel);

        let url = '';

        try {
            url = channel.getResponseHeader('X-Plugin-Dev-Monitor-URL');
        } catch (err) {
            // Leave here if header not found
            return;
        }

        console.log('URL: ' + url);


        this.postMessage(url, [this.debuggee]);
    },

    register: function() {
        let observerService =
            Cc["@mozilla.org/observer-service;1"]
                .getService(Ci.nsIObserverService);

        observerService.addObserver(this, "http-on-examine-response", false);
    },

    unregister: function() {
        let observerService =
            Cc["@mozilla.org/observer-service;1"]
                .getService(Ci.nsIObserverService);

        observerService.removeObserver(this, "http-on-examine-response");
    },


    onReady: function() {
        this.debuggee.start();

        this.register();

        //tabs.activeTab.on('pageshow', this.handlePageChange.bind(this));

    },

    onError: function(error) {
        this.postMessage("An error: " + error, [this.debuggee]);
    },

    // handlePageChange: function() {
    //     this.postMessage('Changed URL to ' + tabs.activeTab.url, [this.debuggee]);
    // },
});

// Export the constructor

exports.PlugDevPanel = PlugDevPanel;

// Create a new tool, initialized with the new constructor

const plugDevTool = new Tool({
    panels: { plugDevPanel: PlugDevPanel }
});