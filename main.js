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
            this.terminate ? this.terminate(utils.EXIT_CODES.INVALID_CONFIG_OBJECT) : process.exit(0);
            return;
        }
        this.latitude = parseFloat(obj.common.latitude);
        this.longitude = parseFloat(obj.common.longitude);
        if (!this.latitude || !this.longitude) {
            this.log.error('Latitude or Longitude not set in main configuration!');
            this.terminate ? this.terminate(utils.EXIT_CODES.INVALID_CONFIG_OBJECT) : process.exit(0);
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
     * @param {string} fuelType can be DIE or SUP or GAS
     * @param {number} latitude
     * @param {number} longitude
     */
    async getData(fuelType, latitude, longitude) {
        return new Promise((resolve, reject) => {
            var options = {
                'method': 'GET',
                'url': `https://api.e-control.at/sprit/1.0/search/gas-stations/by-address?latitude=${latitude}&longitude=${longitude}&fuelType=${fuelType}&includeClosed=true`
            };
            this.log.debug(options.url);
            request(options, (error, response) => {
                if (error) {
                    reject(`Error in function getData: ${error}`);
                } else {
                    try {
                        this.log.debug(`Response in GetData(): ${response.body}`);
                        if (!response || !response.body) {
                            throw new Error(`Response or response.body empty in getData()`);
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
                result = await this.getData('DIE', this.latitude, this.longitude);
                this.log.debug(`JSON-Response DIE: ${JSON.stringify(result)}`);
                console.log(`JSON-Response DIE: ${JSON.stringify(result)}`);
                await JsonExplorer.TraverseJson(result, '0_Home_Diesel', true, false);
            } else {
                await JsonExplorer.deleteEverything('0_Home_Diesel');
            }
            if (superSelected) {
                result = await this.getData('SUP', this.latitude, this.longitude);
                this.log.debug(`JSON-Response SUP: ${JSON.stringify(result)}`);
                console.log(`JSON-Response SUP: ${JSON.stringify(result)}`);
                await JsonExplorer.TraverseJson(result, '0_Home_Super95', true, false);
            } else {
                await JsonExplorer.deleteEverything('0_Home_Super');
            }
            if (gasSelected) {
                result = await this.getData('GAS', this.latitude, this.longitude);
                this.log.debug(`JSON-Response GAS: ${JSON.stringify(result)}`);
                console.log(`JSON-Response GAS: ${JSON.stringify(result)}`);
                await JsonExplorer.TraverseJson(result, '0_Home_CNG', true, false);
            } else {
                await JsonExplorer.deleteEverything('0_Home_CNG');
            }

            //go trough all configured locations 
            for (const i in this.config.address) {
                // @ts-ignore
                let location = this.config.address[i].location;
                location = location.replace(/[^a-zA-Z0-9]/g, '_');
                if(!location) throw new Error(`Location name not set. Aborted!`);
                // @ts-ignore
                let latitude = parseFloat(this.config.address[i].latitude);
                latitude = Math.round(latitude * 100000) / 100000;
                if(!latitude) throw new Error(`Latitude not set. Aborted!`);
                // @ts-ignore
                let longitude = parseFloat(this.config.address[i].longitude);
                if(!longitude) throw new Error(`Longitude not set. Aborted!`);
                longitude = Math.round(longitude * 100000) / 100000;
                // @ts-ignore
                let fuelType = this.config.address[i].fuelType;
                if(!fuelType) throw new Error(`FuelType not set. Aborted!`);
                this.log.debug(`City | Latitude | Longitude | Fueltype: ${location} | ${latitude} | ${longitude} ${fuelType}`);

                //call API and create states
                result = await this.getData(fuelType, latitude, longitude);
                this.log.debug(`JSON-Response GAS: ${JSON.stringify(result)}`);
                console.log(`JSON-Response GAS: ${JSON.stringify(result)}`);
                switch (fuelType) {
                    case 'DIE': fuelType = 'Diesel'; break;
                    case 'SUP': fuelType = 'Super95'; break;
                    case 'GAS': fuelType = 'CNG'; break;
                }
                await JsonExplorer.TraverseJson(result, `${location}_${fuelType}`, true, false);
            }

            await JsonExplorer.checkExpire('*');

            // check for outdated states to delete whole device
            let statesToDelete = await this.getStatesAsync('*0.id');
            for (const idS in statesToDelete) {
                let state = await this.getStateAsync(idS);
                if (state != null && state.val == null) {
                    let statename = idS.split('.');
                    this.log.debug(`State "${statename[2]}" will be deleted`);
                    await JsonExplorer.deleteEverything(statename[2]);
                }
            }

        } catch (error) {
            error = `Error in ExecuteRequest(): ${error}`;
            this.log.error(error);
            this.sendSentry(error);
        }
    }

    /**
     * Handles sentry message
     * @param {any} error Error message for sentry
     */
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
