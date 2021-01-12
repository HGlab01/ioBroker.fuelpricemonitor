/**
 * Defines supported methods for element modify which can be used in stateAttr.js
 * In addition: 'cumstom: YOUR CALCULATION' allows any calculation, where 'value' is the input parameter.
 * Example: 
 * modify: 'custom: value + 1' --> add 1 to the json-input
 * 
 * Examples for usage of existing methods:
 * modify: [method.msinkmh, method.roundOneDigit] --> defined as array --> converts from m/s to km/h first, than it is rounded by 2 digits
 * modify: method.upperCase --> no array needed as there is only one action; this uppercases the value
 */
const method = {};
method.roundOneDigit = 'roundOneDigit';
method.roundTwoDigit = 'roundTwoDigit';
method.roundThreeDigit = 'roundThreeDigit';
method.upperCase = 'upperCase';
method.lowerCase = 'lowerCase';
method.ucFirst = 'ucFirst';
method.msinkmh = 'm/s in km/h';
method.kmhinms = 'km/h in m/s';
/************************************************************************/

// Classification of all state attributes possible
const stateAttrb = {
	// State object
	'total_duration': {
		name: 'total_duration',
		type: 'date',
		read: true,
		write: false,
		role: 'value.time'
	},
	'id': {
		name: 'id',
		type: 'string',
		read: true,
		write: false,
		role: 'info'
	},
	'name': {
		name: 'Name',
		type: 'string',
		read: true,
		write: false,
		role: 'info.name',
		modify: 'ucFirst'
	},
	'distance': {
		name: 'Distance',
		type: 'number',
		read: true,
		write: false,
		role: 'value',
		modify: 'custom: Math.round(value*1000*100)/100'
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
		type: 'string',
		read: true,
		write: false,
		role: 'value.gps.latitude'
	},
	'longitude': {
		name: 'Longitude',
		type: 'string',
		read: true,
		write: false,
		role: 'value.gps.longitude'
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
		type: 'boolean',
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
		role: 'value',
		modify: ['multiply(3.6)', 'round(2)']
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
	}
};

module.exports = stateAttrb;