'use strict';

/*
 * Created with @iobroker/create-adapter v1.25.0
 */

// The adapter-core module gives you access to the core ioBroker functions
// you need to create an adapter
const utils = require('@iobroker/adapter-core');

// Load your modules here, e.g.:
const axios = require('axios');
const JsonExplorer = require('iobroker-jsonexplorer');
const stateAttr = require(`${__dirname}/lib/stateAttr.js`); // Load attribute library
const isOnline = require('@esm2cjs/is-online').default;

//global variables
let dieselSelected = false;
let superSelected = false;
let gasSelected = false;
let useIDs = false;

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
        this.log.info('Started with JSON-Explorer version ' + JsonExplorer.version);
        dieselSelected = this.config.diesel;
        superSelected = this.config.super;
        gasSelected = this.config.gas;
        this.log.debug(`Diesel | Super | CNG for location Home selected : ${dieselSelected} | ${superSelected} | ${gasSelected}`);
        if (this.config.useIDs) useIDs = this.config.useIDs;

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
        if (await isOnline() == false) {
            this.log.error('No internet connection detected');
            this.terminate ? this.terminate(utils.EXIT_CODES.UNCAUGHT_EXCEPTION) : process.exit(0);
            return;
        }
        else {
            this.log.debug('Internet connection detected. Everything fine!');
        }
        this.latitude = Math.round(obj.common.latitude * 100000) / 100000;
        this.longitude = Math.round(obj.common.longitude * 100000) / 100000;
        this.log.debug('LATITUDE from config: ' + this.latitude);
        this.log.debug('LONGITUDE from config: ' + this.longitude);

        let result = await this.ExecuteRequest();

        if (result == 'error') {
            this.terminate ? this.terminate(utils.EXIT_CODES.UNCAUGHT_EXCEPTION) : process.exit(0);
        } else {
            this.terminate ? this.terminate(0) : process.exit(0);
        }
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
        let uri = `https://api.e-control.at/sprit/1.0/search/gas-stations/by-address?latitude=${latitude}&longitude=${longitude}&fuelType=${fuelType}&includeClosed=true`;
        this.log.debug(`API-Call ${uri}`);
        console.log(`API-Call ${uri}`);
        return new Promise((resolve, reject) => {
            // @ts-ignore
            axios.get(uri)
                .then((response) => {
                    if (!response || !response.data) {
                        throw new Error(`Respone empty for URL ${uri} with status code ${response.status}`);
                    } else {
                        this.log.debug(`Response in GetData(): [${response.status}] ${JSON.stringify(response.data)}`);
                        console.log(`Response in GetData(): [${response.status}] ${JSON.stringify(response.data)}`);
                        resolve(response.data);
                    }
                })
                .catch(error => {
                    console.error('Error in getData(): ' + error);
                    reject(error);
                })
        })
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
                this.log.debug(`JSON-Response for location Home Diesel: ${JSON.stringify(result)}`);
                await JsonExplorer.TraverseJson(result, '0_Home_Diesel', true, useIDs);
            } else {
                await JsonExplorer.deleteEverything('0_Home_Diesel');
            }
            if (superSelected) {
                result = await this.getData('SUP', this.latitude, this.longitude);
                this.log.debug(`JSON-Response for location Home Super: ${JSON.stringify(result)}`);
                await JsonExplorer.TraverseJson(result, '0_Home_Super95', true, useIDs);
            } else {
                await JsonExplorer.deleteEverything('0_Home_Super95');
            }
            if (gasSelected) {
                result = await this.getData('GAS', this.latitude, this.longitude);
                this.log.debug(`JSON-Response for location Home CNG: ${JSON.stringify(result)}`);
                await JsonExplorer.TraverseJson(result, '0_Home_CNG', true, useIDs);
            } else {
                await JsonExplorer.deleteEverything('0_Home_CNG');
            }

            //go trough all configured locations 
            for (const i in this.config.address) {
                // @ts-ignore
                let location = this.config.address[i].location;
                // @ts-ignore
                let latitude = parseFloat(this.config.address[i].latitude);
                // @ts-ignore
                let longitude = parseFloat(this.config.address[i].longitude);
                // @ts-ignore
                let fuelType = this.config.address[i].fuelType;

                if (!location) {
                    this.log.error(`Location name not set. Aborted!`);
                    return 'error';
                }
                if (!latitude || !longitude) {
                    this.log.error(`Latitude or longitude not set for ${location}. Aborted!`);
                    return 'error';
                }
                if (!fuelType) {
                    this.log.error(`FuelType not set for ${location}. Aborted!`);
                    return 'error';
                }
                location = location.replace(/[^a-zA-Z0-9]/g, '_');
                latitude = Math.round(latitude * 100000) / 100000;
                longitude = Math.round(longitude * 100000) / 100000;

                this.log.debug(`Location | Latitude | Longitude | Fueltype: ${location} | ${latitude} | ${longitude} | ${fuelType}`);

                //call API and create states
                result = await this.getData(fuelType, latitude, longitude);
                this.log.debug(`JSON-Response for ${location}: ${JSON.stringify(result)}`);
                console.log(`JSON-Response for ${location}: ${JSON.stringify(result)}`);
                switch (fuelType) {
                    case 'DIE': fuelType = 'Diesel'; break;
                    case 'SUP': fuelType = 'Super95'; break;
                    case 'GAS': fuelType = 'CNG'; break;
                }
                await JsonExplorer.TraverseJson(result, `${location}_${fuelType}`, true, useIDs);
            }

            await JsonExplorer.checkExpire('*');

            // check for outdated states to delete whole device
            let statesToDelete = await this.getStatesAsync('*.0.id');
            for (const idS in statesToDelete) {
                let state = await this.getStateAsync(idS);
                if (state != null && state.val == null) {
                    let statename = idS.split('.');
                    this.log.debug(`State "${statename[2]}" will be deleted`);
                    await JsonExplorer.deleteEverything(statename[2]);
                }
            }

        } catch (error) {
            let eMsg = `Error in ExecuteRequest(): ${error})`;
            this.log.error(eMsg);
            if (eMsg.includes('getaddrinfo EAI_AGAIN') == false) {
                console.error(eMsg);
                this.sendSentry(error);
            }
        }
    }

    /**
     * Handles sentry message
     * @param {any} errorObject Error message for sentry
     */
    sendSentry(errorObject) {
        if (errorObject.message && errorObject.message.includes('ETIMEDOUT')) return;
        try {
            if (this.supportsFeature && this.supportsFeature('PLUGINS')) {
                const sentryInstance = this.getPluginInstance('sentry');
                if (sentryInstance) {
                    sentryInstance.getSentryObject().captureException(errorObject);
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
