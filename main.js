'use strict';

/*
 * Created with @iobroker/create-adapter v1.25.0
 */

// The adapter-core module gives you access to the core ioBroker functions
// you need to create an adapter
const utils = require('@iobroker/adapter-core');

// Load your modules here, e.g.:
const request = require('request');
const JsonExplorer = require('iobroker-jsonexplorer');
const stateAttr = require(`${__dirname}/lib/stateAttr.js`); // Load attribute library

//global variables
let dieselSelected = false;
let superSelected = false;
let gasSelected = false;

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
        this.latitude = 0;
        this.longitude = 0;
        JsonExplorer.init(this, stateAttr);
    }

    /**
     * Is called when databases are connected and adapter received configuration.
     */
    async onReady() {
        // Initialize adapter
        //get adapter configuration
        dieselSelected = this.config.diesel;
        this.log.debug(`Diesel selected : ${dieselSelected}`);
        superSelected = this.config.super;
        this.log.debug(`Super selected : ${superSelected}`);
        gasSelected = this.config.gas;
        this.log.debug(`Gas selected : ${gasSelected}`);

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

        await this.ExecuteRequest();
        this.terminate ? this.terminate(0) : process.exit(0);
    }

    /**
     * Is called when adapter shuts down - callback has to be called under any circumstances!
     * @param {() => void} callback
     */
    onUnload(callback) {
        try {
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
                        this.log.debug(`Response in GetData(): ${response.body}`);
                        if (!response || !response.body) {
                            throw `Response or response.body empty in getData()`;
                        } else {
                            let result = JSON.parse(response.body);
                            resolve(result);
                        }
                    } catch (error) {
                        error = 'Error in getData(): ' + error;
                        this.log.error(error);
                        this.sendSentry(error);
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
            await JsonExplorer.setLastStartTime();
            let result = null;
            if (dieselSelected) {
                result = await this.getData('DIE');
                this.log.debug(`JSON-Response DIE: ${JSON.stringify(result)}`);
                console.log(`JSON-Response DIE: ${JSON.stringify(result)}`);
                await JsonExplorer.TraverseJson(result, 'DIE', true, false);
            } else {
                let states = await this.getStatesAsync('*DIE.*');
                for (const idS in states) {
                    this.delObjectAsync(idS);
                }
            }
            if (superSelected) {
                result = await this.getData('SUP');
                this.log.debug(`JSON-Response SUP: ${JSON.stringify(result)}`);
                console.log(`JSON-Response SUP: ${JSON.stringify(result)}`);
                await JsonExplorer.TraverseJson(result, 'SUP', true, false);
            } else {
                let states = await this.getStatesAsync('*SUP.*');
                for (const idS in states) {
                    this.delObjectAsync(idS);
                }
            }
            if (gasSelected) {
                result = await this.getData('GAS');
                this.log.debug(`JSON-Response GAS: ${JSON.stringify(result)}`);
                console.log(`JSON-Response GAS: ${JSON.stringify(result)}`);
                await JsonExplorer.TraverseJson(result, 'GAS', true, false);
            } else {
                let states = await this.getStatesAsync('*GAS.*');
                for (const idS in states) {
                    this.delObjectAsync(idS);
                }
            }

            await JsonExplorer.checkExpire('*');

        } catch (error) {
            error = `Error in ExecuteRequest(): ${error}`;
            this.log.error(error);
            this.sendSentry(error);
        }
    }

    sendSentry(error) {
        try {
            if (this.supportsFeature && this.supportsFeature('PLUGINS')) {
                const sentryInstance = this.getPluginInstance('sentry');
                if (sentryInstance) {
                    sentryInstance.getSentryObject().captureException(error);
                }
            }
        } catch (error) {
            this.log.error(`Error in function sendSentry(): ${error}`);
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
