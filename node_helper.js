/* MMM-soccer
 * Node Helper
 *
 * By fewieden https://github.com/fewieden/MMM-soccer
 *
 * MIT Licensed.
 */

/* eslint-env node */
/* eslint-disable no-console */

const request = require('request');
const NodeHelper = require('node_helper');

module.exports = NodeHelper.create({

    start() {
        console.log(`Starting module: ${this.name}`);
    },

    socketNotificationReceived(notification, payload) {
        if (notification === 'GET_DATA') {
            const options = {
                // url: `http://api.football-data.org/v1/competitions/${payload.league}/leagueTable`
                url: `http://api.football-data.org/v2/competitions/${payload.league}/standings`
            };
            if (payload.api_key) {
                options.headers = { 'X-Auth-Token': payload.api_key };
            }
            this.getData(options);
        }
    },

    /**
    * getData
    * Request data from the supplied URL and broadcast it to the MagicMirror module if it's received.
    */
    getData(options) {
        console.log(`Get league table for url ${options.url}`);
        request(options, (error, response, body) => {
            if (response.statusCode === 200) {
                    this.sendSocketNotification('DATA', JSON.parse(body));                    
            } else {
                this.sendSocketNotification('DATA');
                console.log(`Error getting league table ${response.statusCode}`);
            }
        });
    }
});
