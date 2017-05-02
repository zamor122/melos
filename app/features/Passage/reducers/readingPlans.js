import Immutable from 'immutable'

import type from '../actions/constants'

export default function reducer(state = {}, action) {
	switch (action.type) {

		case type('readingplansPlansByReferenceRequest'):
			return { loading: true }

		case type('readingplansPlansByReferenceFailure'):
			return Immutable.fromJS(action).set('loading', false).toJS()

		case type('readingplansPlansByReferenceSuccess'):
			return (function readingplansPlansByReferenceSuccess() {
				if (action.response && 'reading_plans' in action.response) {
					let plans = action.response.reading_plans.map((plan) => {
						return Immutable.fromJS(plan).set('image_id', plan.id).set('type', 'reading_plan').toJS()
					})
					// for quicker load times, let's just show 6 plans
					plans = plans.slice(0, 6)
					return Immutable
					.fromJS(action.response)
					.merge({ items: plans, type: false })
					.delete('loading')
					.delete('plans')
					.toJS()
				} else {
					return state
				}
			}())
		default:
			return state
	}
}
