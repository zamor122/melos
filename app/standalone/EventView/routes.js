import React from 'react'
import { Route, IndexRoute } from 'react-router'
import EventView from '../../containers/EventView'

export default function(requireAuth, requireEvent) {
	return (
		<Route path="/events/:id" component={EventView} onEnter={requireEvent} />
	)
}
