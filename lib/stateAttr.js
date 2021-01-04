// Classification of all state attributes possible
const stateAttrb = {
	// State object
	'mA': {
		name: 'Current LED power usage in milliamps as determined by the ABL. 0 if ABL is disabled',
		type: 'number',
		read: true,
		write: false,
		role: 'value.current',
		unit: 'mA'
	},
	'total_duration': {
		name: 'total_duration',
		type: 'date',
		read: true,
		write: false,
		role: 'value.time',
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
		role: 'info.name'
	},
	'distance': {
		name: 'Distance',
		type: 'number',
		read: true,
		write: false,
		role: 'value'
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
		role: 'info'
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
	}
};

module.exports = stateAttrb;