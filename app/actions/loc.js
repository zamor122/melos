import { getClient } from '@youversion/js-api'
import { handleResponse } from './common'
import { getTimezone } from '../api/GoogleMaps'
import keyMirror from 'keymirror'
import moment from 'moment'
import { fetchEventView } from './eventView'

var EventsApi = getClient('events')

export const Actions = keyMirror({
	ADD: null,
	REMOVE_REQUEST: null,
	REMOVE_SUCCESS: null,
	REMOVE_FAILURE: null,
	EDIT: null,
	CANCEL_EDIT: null,
	SET_FIELD: null,
	SET_PLACE: null,
	TIMEZONE_SUCCESS: null,
	TIMEZONE_FAILURE: null,
	SET_TIME: null,
	ADD_TIME: null,
	SAVE: null,
	CREATE_REQUEST: null,
	CREATE_SUCCESS: null,
	CREATE_FAILURE: null
})

export const ActionCreators = {
	addLoc(loc) {
		return {
			type: Actions.ADD,
			loc
		}
	},

	cancelEdit() {
		return {
			type: Actions.CANCEL_EDIT
		}
	},

	setField(field, value) {
		return {
			type: Actions.SET_FIELD,
			field,
			value
		}
	},

	setPlace(place) {
		console.log("Your place was set")		
		return {
			type: Actions.SET_PLACE,
			place
		}
	},

	setTime(index, start_dt, end_dt) {
		return {
			type: Actions.SET_TIME,
			index, 
			start_dt,
			end_dt
		}
	},

	addTime() {
		return {
			type: Actions.ADD_TIME
		}
	},

	timezoneSuccess(timezone) {
		console.log("Your tz was +")		
		return {
			type: Actions.TIMEZONE_SUCCESS,
			timezone
		}
	},

	timezoneFailure(error) {
		return {
			type: Actions.TIMEZONE_FAILURE,
			error
		}
	},

	timezoneRequest(place) {
		return dispatch => {
			const { lat, lng } = place.geometry.location
			getTimezone(lat(), lng()).then(function(timezone) {
				dispatch(ActionCreators.timezoneSuccess(timezone))
			}, function(error) {
				dispatch(ActionCreators.timezoneFailure(error))
			})
		}
	},

	choosePlace(place) {
		//console.log("Your place was chosen")
		return dispatch => {
			dispatch(ActionCreators.timezoneRequest(place))
			dispatch(ActionCreators.setPlace(place))
		}		
	},

	addVirtual() {
		return dispatch => {
			var emptyLoc = { 
				type: 'virtual',
				times: [
					{ start_dt: moment(), end_dt: moment().add(1, 'h') }
				]
			}
			dispatch(ActionCreators.addLoc(emptyLoc))
		}
	},

	addPhysical() {
		return dispatch => {
			var start_dt = moment().startOf('hour')
			var end_dt = moment(start_dt.toDate().getTime()).add(1, 'h')
			var emptyLoc = {
				type: 'physical',
				times: [
					{ start_dt, end_dt }
				]
			}
			dispatch(ActionCreators.addLoc(emptyLoc))
		}
	},

	createRequest(loc) {
		return {
			type: Actions.CREATE_REQUEST,
			loc
		}
	},

	createSuccess(loc) {
		return {
			type: Actions.CREATE_SUCCESS,
			loc
		}
	},

	createFailure(error) {
		return {
			type: Actions.CREATE_FAILURE,
			error
		}
	},

	create(eventId, loc) {
		return dispatch => {
			var times = loc.times.map((t) => {
				return { 
					start_dt: t.start_dt.format('YYYY-MM-DDTHH:mm:ssZ'), 
					end_dt: t.end_dt.format('YYYY-MM-DDTHH:mm:ssZ')
				}
			})

			var newLocation = {
				id: eventId,
				name: loc.name,
				type: loc.type,
				timezone: loc.timezone,
				city: loc.city,
				country: loc.country,
				latitude: loc.latitude,
				longitude: loc.longitude,
				formatted_address: loc.formatted_address,
				google_place_id: loc.google_place_id,
				region: loc.region,
				postal_code: loc.postal_code,
				times: times 
			}

			dispatch(ActionCreators.createRequest(newLocation))

			return EventsApi
				.call("create_location")
				.setVersion("3.2")
				.setEnvironment("staging")
				.auth('ignacio', 'password')
				.params(newLocation)
				.post()
				.then(function(data) {
					handleResponse(data).then((data) => {
						dispatch(ActionCreators.createSuccess(data))
					}, (error) => {
						dispatch(ActionCreators.createFailure(error))
					})
				}, function(error) {
					dispatch(ActionCreators.createFailure(error))
				})
		}
	},

	removeRequest(eventId, locationId) {
		return {
			type: Actions.REMOVE_REQUEST,
			eventId,
			locationId
		}
	},

	removeSuccess(eventId, locationId) {
		return {
			type: Actions.REMOVE_SUCCESS,
			eventId,
			locationId
		}
	},

	removeFailure(error) {
		return {
			type: Actions.REMOVE_FAILURE,
			error
		}
	},

	remove(eventId, locationId) {
		return dispatch => {
			dispatch(ActionCreators.removeRequest(eventId, locationId))
			return EventsApi
				.call("remove_location")
				.setVersion("3.2")
				.setEnvironment("staging")
				.auth('ignacio', 'password')
				.params({id:eventId, location_id: locationId})
				.post()
				.then((data) => {
					handleResponse(data).then((data) => {
						dispatch(ActionCreators.removeSuccess(eventId, locationId))
						dispatch(fetchEventView(eventId))
					}, (error) => {
						dispatch(ActionCreators.removeFailure(error))
					})
				}, (error) => {
					dispatch(ActionCreators.removeFailure(error))
				})
		}
	},

	edit(loc) {
		return {
			type: Actions.EDIT,
			loc
		}
	}
}