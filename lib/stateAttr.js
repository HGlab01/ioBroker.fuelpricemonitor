/**
 * ************************************************************
 * *************** state attribute template  ******************
 * *** state attribute template by HGlab01 & DutchmanNL ***
 * ************************************************************
 * Object definitions can contain these elements to be called by stateSetCreate function, if not set default values are used
 'Cancel current printing': {			// id of state (name) submitted by stateSetCreate function
		root: '_Info',						// {default: NotUsed} Upper channel root
		rootName: 'Device Info channel,		// {default: NotUsed} Upper channel name
		name: 'Name of state',				// {default: same as id} Name definition for object
		type: >typeof (value)<,				// {default: typeof (value)} type of value automatically detected
		read: true,							// {default: true} Name defition for object
		write: true,						// {default: false} Name defition for object
		role: 'indicator.info',				// {default: state} Role as defined by https://github.com/ioBroker/ioBroker/blob/main/doc/STATE_ROLES.md
		modify: ''							// {default: ''} see below
	},
 */

/**
 * Defines supported methods for element modify which can be used in stateAttr.js
 * In addition: 'cumstom: YOUR CALCULATION' allows any calculation, where 'value' is the input parameter.
 * Example:
 * modify: 'custom: value + 1' --> add 1 to the json-input
 *
 *  * supported methods (as string):
 *  - round(count_digits as {number})  //integer only
 * 	- multiply(factor as {number})
 *  - divide(factor as {number})
 *  - add(number {number})
 *  - substract(number {number})
 *  - upperCase
 *  - lowerCase
 *  - ucFirst
 *
 * Examples for usage of embeded methods:
 * modify: ['multiply(3.6)', 'round(2)'] --> defined as array --> multiplied by 3.6 and then the result is rounded by 2 digits
 * modify: 'upperCase' --> no array needed as there is only one action; this uppercases the string
 *
 */

/**
 * state attribute definitions
 */

const stateAttrb = {
    'total_duration': {
        name: 'total_duration',
        type: 'date',
        read: true,
        write: false,
        role: 'value.time'
    },
    'id': {
        name: 'id',
        type: 'number',
        read: true,
        write: false,
        role: 'info'
    },
    'name': {
        name: 'Name',
        type: 'string',
        read: true,
        write: false,
        role: 'info.name'
    },
    'distance': {
        name: 'Distance',
        type: 'number',
        read: true,
        write: false,
        role: 'value',
        modify: 'round(3)'
    },
    'openingHours': {
        name: 'Opening Hours',
        type: 'array',
        read: true,
        write: false,
        role: 'list'
    },
    'address': {
        name: 'Address',
        type: 'string',
        read: true,
        write: false,
        role: 'info'
    },
    'postalCode': {
        name: 'Postal Code',
        type: 'string',
        read: true,
        write: false,
        role: 'info'
    },
    'city': {
        name: 'City',
        type: 'string',
        read: true,
        write: false,
        role: 'info',
        modify: 'upperCase'
    },
    'latitude': {
        name: 'Latitude',
        type: 'number',
        read: true,
        write: false,
        role: 'value.gps.latitude',
        modify: 'round(5)'
    },
    'longitude': {
        name: 'Longitude',
        type: 'number',
        read: true,
        write: false,
        role: 'value.gps.longitude',
        modify: 'round(5)'
    },
    'telephone': {
        name: 'Telephone',
        type: 'string',
        read: true,
        write: false,
        role: 'info'
    },
    'fax': {
        name: 'Fax',
        type: 'string',
        read: true,
        write: false,
        role: 'info'
    },
    'mail': {
        name: 'E-Mail',
        type: 'string',
        read: true,
        write: false,
        role: 'info'
    },
    'website': {
        name: 'Website',
        type: 'string',
        read: true,
        write: false,
        role: 'indicator'
    },
    'service': {
        name: 'Service',
        type: 'boolean',
        read: true,
        write: false,
        role: 'indicator'
    },
    'selfService': {
        name: 'Self Service',
        type: 'boolean',
        read: true,
        write: false,
        role: 'indicator'
    },
    'unattended': {
        name: 'Unattended',
        type: 'boolean',
        read: true,
        write: false,
        role: 'indicator'
    },
    'cash': {
        name: 'Cash',
        type: 'boolean',
        read: true,
        write: false,
        role: 'indicator'
    },
    'debitCard': {
        name: 'Debit Card',
        type: 'boolean',
        read: true,
        write: false,
        role: 'indicator'
    },
    'creditCard': {
        name: 'Credit Card',
        type: 'boolean',
        read: true,
        write: false,
        role: 'indicator'
    },
    'others': {
        name: 'Others',
        type: 'string',
        read: true,
        write: false,
        role: 'info'
    },
    'cooperative': {
        name: 'Cooperative',
        type: 'boolean',
        read: true,
        write: false,
        role: 'indicator'
    },
    'clubCard': {
        name: 'Club Card',
        type: 'boolean',
        read: true,
        write: false,
        role: 'indicator'
    },
    'position': {
        name: 'Ranking',
        type: 'number',
        read: true,
        write: false,
        role: 'info'
    },
    'open': {
        name: 'Open',
        type: 'boolean',
        read: true,
        write: false,
        role: 'indicator'
    },
    'fuelType': {
        name: 'Fuel Type',
        type: 'string',
        read: true,
        write: false,
        role: 'info'
    },
    'amount': {
        name: 'Amount per litre',
        type: 'number',
        read: true,
        write: false,
        role: 'value'
    },
    'label': {
        name: 'Label',
        type: 'string',
        read: true,
        write: false,
        role: 'info'
    },
    'otherServiceOffers': {
        name: 'Other Service Offers',
        type: 'string',
        read: true,
        write: false,
        role: 'info'
    },
    'prices': {
        name: 'Prices',
        type: 'array',
        read: true,
        write: false,
        role: 'list'
    },
    'online': {
        name: 'online',
        type: 'boolean',
        read: true,
        write: false,
        role: 'indicator'
    },
    'clubCardText': {
        name: 'Club Card Text',
        type: 'string',
        read: true,
        write: false,
        role: 'info'
    },
    'accessMod': {
        name: 'Access Mode',
        type: 'string',
        read: true,
        write: false,
        role: 'info'
    },
    'day': {
        name: 'Day',
        type: 'string',
        read: true,
        write: false,
        role: 'info'
    },
    'order': {
        name: 'order',
        type: 'number',
        read: true,
        write: false,
        role: 'info'
    },
    'from': {
        name: 'From',
        type: 'string',
        read: true,
        write: false,
        role: 'info'
    },
    'to': {
        name: 'To',
        type: 'string',
        read: true,
        write: false,
        role: 'info'
    },
    'uuid': {
        name: 'uuid',
        type: 'string',
        read: true,
        write: false,
        role: 'info'
    }
};

module.exports = stateAttrb;