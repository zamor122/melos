import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { addLocaleData, IntlProvider } from 'react-intl'
import createLogger from 'redux-logger'
import ga from 'react-ga'
import YearInReview from '../../features/YearInReview/components/YearInReview'
import configureStore from './store'
import defaultState from './defaultState'

let initialState = defaultState

if (typeof window !== 'undefined' && typeof window.YearInReview.__INITIAL_STATE__ !== 'undefined') {
	initialState = window.YearInReview.__INITIAL_STATE__
}

let logger = null
if (typeof window !== 'undefined' && typeof window.__ENV__ !== 'undefined' && window.__ENV__ !== 'production') {
	logger = createLogger()
}

if (typeof window !== 'undefined') {
	ga.initialize('UA-3571547-76', { language: window.__LOCALE__.locale });
}

const store = configureStore(initialState, null, logger)

addLocaleData(window.__LOCALE__.data)

render(
	<IntlProvider locale={window.__LOCALE__.locale} messages={window.__LOCALE__.messages}>
		<Provider store={store}>
			<YearInReview />
		</Provider>
	</IntlProvider>,
  document.getElementById('react-app-YearInReview')
)
