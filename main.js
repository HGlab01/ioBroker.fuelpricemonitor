'use strict';

/*
 * Created with @iobroker/create-adapter v1.25.0
 */

// The adapter-core module gives you access to the core ioBroker functions
// you need to create an adapter
const utils = require('@iobroker/adapter-core');

// Load your modules here, e.g.:
const request = require('request');
const JsonHelper = require('iobroker-jsonexplorer');
const stateAttr = require(`${__dirname}/lib/stateAttr.js`); // Load attribute library

//global variables
let polling = null;

class FuelPriceMonitor extends utils.Adapter {

    /**
     * @param {Partial<utils.AdapterOptions>} [options={}]
     */
    constructor(options) {
        super({
            ...options,
            name: 'fuelpricemonitor',
        });
        this.on('ready', this.onReady.bind(this));
        //this.on('objectChange', this.onObjectChange.bind(this));
        //this.on('stateChange', this.onStateChange.bind(this));
        //this.on('message', this.onMessage.bind(this));
        this.on('unload', this.onUnload.bind(this));
        this.executioninterval = 0;
        this.latitude = 0;
        this.longitude = 0;
        JsonHelper.init(this, stateAttr);
    }

    /**
     * Is called when databases are connected and adapter received configuration.
     */
    async onReady() {
        //this.log.info(`DIRNAME ${__dirname}`);
        // Initialize adapter
        //get adapter configuration
        this.executioninterval = parseInt(this.config.executioninterval) * 60;
        if (isNaN(this.executioninterval)) { this.executioninterval = 20 * 60 }
        this.log.info('DataRequest will be done every ' + this.executioninterval / 60 + ' minutes');

        //subscribe relevant states changes
        //this.subscribeStates('STATENAME');

        //get Geodata from configuration
        let obj = await this.getForeignObjectAsync('system.config');
        if (!obj) {
            this.log.error('Adapter was not able to read iobroker configuration');
            return;
        }
        this.latitude = Math.round(obj.common.latitude * 100000) / 100000;
        this.longitude = Math.round(obj.common.longitude * 100000) / 100000;
        this.log.debug('LATITUDE from config: ' + this.latitude);
        this.log.debug('LONGITUDE from config: ' + this.longitude);

        this.ExecuteRequest();
    }

    /**
     * Is called when adapter shuts down - callback has to be called under any circumstances!
     * @param {() => void} callback
     */
    onUnload(callback) {
        try {
            if (polling) {
                clearTimeout(polling);
                polling = null;
            }
            this.log.info('cleaned everything up...');
            callback();
        } catch (e) {
            callback();
        }
    }

    /*
    /**
     * Is called if a subscribed state changes
     * @param {string} id
     * @param {ioBroker.State | null | undefined} state
     */
    /*
    onStateChange(id, state) {
        if (state) {
            // The state was changed
            this.log.debug(`state ${id} changed: ${state.val} (ack = ${state.ack})`);
        } else {
            // The state was deleted
            this.log.debug(`state ${id} deleted`);
        }
    }*/

    /**
     * Retrieves fuel data from REST-API
     * @param {string} fuelType
     */
    async getData(fuelType) {
        return new Promise((resolve, reject) => {
            //var request = require('request');
            var options = {
                'method': 'GET',
                'url': `https://api.e-control.at/sprit/1.0/search/gas-stations/by-address?latitude=${this.latitude}&longitude=${this.longitude}&fuelType=${fuelType}&includeClosed=true`
            };
            this.log.debug(options.url);
            request(options, (error, response) => {
                if (error) {
                    reject(`Error in function getData: ${error}`);
                } else {
                    try {
                        resolve(JSON.parse(response.body));
                    } catch (error) {
                        this.log.error('Error in function getData: ' + error);
                    }
                }
            });
        });
    }

    /**
     * Handles json-object and creates states
     */
    async ExecuteRequest() {
        try {
            //await JsonHelper.create_state(this, 'online', 'online', true);

            JsonHelper.setLastStartTime(this);

            let result = await this.getData('DIE');
            this.log.debug(`JSON-Response DIE: ${JSON.stringify(result)}`);
            await JsonHelper.TraverseJson(this, result, 'DIE', true, false);
            result = await this.getData('SUP');
            this.log.debug(`JSON-Response SUP: ${JSON.stringify(result)}`);
            await JsonHelper.TraverseJson(this, result, 'SUP', true, false);
            result = await this.getData('GAS');
            this.log.debug(`JSON-Response GAS: ${JSON.stringify(result)}`);
            await JsonHelper.TraverseJson(this, result, 'GAS', true, false);

            JsonHelper.checkExpire(this, '*');

            //Timmer
            (function () { if (polling) { clearTimeout(polling); polling = null; } })();
            polling = setTimeout(() => {
                this.log.debug(`New calculation triggered by polling (every ${this.executioninterval / 60} minutes)`);
                this.ExecuteRequest();
            }, this.executioninterval * 1000);
        } catch (error) {
            this.log.error(`Error in function ExecuteRequest: ${error}`);
        }
    }
}

// @ts-ignore parent is a valid property on module
if (module.parent) {
    // Export the constructor in compact mode
    /**
     * @param {Partial<utils.AdapterOptions>} [options={}]
     */
    module.exports = (options) => new FuelPriceMonitor(options);
} else {
    // otherwise start the instance directly
    new FuelPriceMonitor();
}
