import React, { PropTypes, Component } from 'react'
import { connect } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import { Link } from 'react-router'
import moment from 'moment'
import readingPlansAction from '@youversion/api-redux/lib/endpoints/readingPlans/action'
import plansAPI from '@youversion/api-redux/lib/endpoints/plans'
import participantsView from '@youversion/api-redux/lib/batchedActions/participantsUsersView'
import getSubscriptionsModel from '@youversion/api-redux/lib/models/subscriptions'
import getPlansModel from '@youversion/api-redux/lib/models/readingPlans'
import getTogetherModel from '@youversion/api-redux/lib/models/together'
import { getTogetherInvitations } from '@youversion/api-redux/lib/models'
import { selectImageFromList } from '../lib/imageUtil'
import Routes from '../lib/routes'
import List from '../components/List'
import ParticipantsAvatarList from '../widgets/ParticipantsAvatarList'
import TogetherInvitationActions from '../widgets/TogetherInvitationActions'
import ProgressBar from '../components/ProgressBar'
import PlanStartString from '../features/PlanDiscovery/components/PlanStartString'
import PlanListItem from '../features/PlanDiscovery/components/PlanListItem'


function loadPlanItems({ plan_id, together_id, auth, dispatch }) {
	dispatch(readingPlansAction({
		method: 'view',
		params: {
			id: plan_id,
		},
	}))
	if (together_id) {
		dispatch(participantsView({
			together_id,
			auth,
		}))
	}
}


class PlanListView extends Component {

	componentDidMount() {
		const { dispatch, auth } = this.props
		this.username = (auth && auth.userData && auth.userData.username) ? auth.userData.username : null
		// get any invites we have
		this.getInvitations()
		// get actual subscriptions
		this.getSubs()
	}

	getInvitations = () => {
		const { dispatch, auth } = this.props
		dispatch(plansAPI.actions.togethers.get({ status: 'invited' }, { auth: true })).then((subs) => {
			if (subs && subs.data) {
				const ids = Object.keys(subs.data)
				if (ids.length > 0) {
					ids.forEach((id) => {
						const sub = subs.data[id]
						loadPlanItems({ plan_id: sub.plan_id, together_id: id, auth: auth.isLoggedIn, dispatch })
					})
				}
			}
		})
	}

	getSubs = () => {
		const { dispatch, auth } = this.props
		dispatch(plansAPI.actions.subscriptions.get({}, { auth: auth.isLoggedIn })).then((subs) => {
			if (subs && subs.data) {
				const ids = Object.keys(subs.data)
				if (ids.length > 0) {
					ids.forEach((id) => {
						const sub = subs.data[id]
						loadPlanItems({ plan_id: sub.plan_id, together_id: sub.together_id, auth: auth.isLoggedIn, dispatch })
					})
				}
			}
		})
	}

	handleLoadMore = () => {
		const { subscriptions: { nextPage }, loadMore } = this.props
		if (nextPage !== null && typeof loadMore === 'function') {
			loadMore(nextPage)
		}
	}

	renderListItem = ({ plan_id, together_id, start_dt, subscription_id = null }) => {
		const {
			serverLanguageTag,
			readingPlans,
			invitations,
			params,
			auth,
			route: {
				view
			},
			localizedLink
		} = this.props
		const language_tag = serverLanguageTag || params.lang || auth.userData.language_tag || 'en'
		const plan = (plan_id && plan_id in readingPlans.byId) ? readingPlans.byId[plan_id] : null

		let link, src, subContent, dayString
		if (start_dt && plan && 'id' in plan) {
			src = plan.images ? selectImageFromList({ images: plan.images, width: 160, height: 160 }).url : null
			// plans together have different day strings
			if (together_id) {
				if (invitations.indexOf(together_id) > -1) {
					dayString = <PlanStartString start_dt={start_dt} />
				}
			} else {
				let day = moment().diff(moment(start_dt, 'YYYY-MM-DD'), 'days') + 1
				if (day > plan.total_days) {
					day = plan.total_days
				}
				dayString = <FormattedMessage id="plans.which day in plan" values={{ day, total: plan.total_days }} />
			}

			link = localizedLink(Routes.plans({}))
			// if this is a subscription, link to it
			if (subscription_id) {
				link = localizedLink(
					Routes.subscription({
						username: this.username,
						plan_id: plan.id,
						slug: plan.slug,
						subscription_id,
					}))
			// otherwise it's an invitation where we want more info
			} else {
				link = localizedLink(
					Routes.plan({
						plan_id: plan.id,
						slug: plan.slug
					}))
			}

			subContent = (
				<div>
					<ParticipantsAvatarList together_id={together_id} showMoreLink={''} />
					<ProgressBar percentComplete={0} />
					{ dayString }
				</div>
			)
		}

		return (
			<PlanListItem
				key={`${plan_id}.${subscription_id}`}
				src={src}
				name={(plan && 'name' in plan) ? (plan.name[language_tag] || plan.name.default) : null}
				link={link}
				subContent={subContent}
			/>
		)
	}

	render() {
		const { subscriptions, together, invitations, auth, route: { view }, localizedLink } = this.props

		let backButton = null
		const plansList = []
		switch (view) {
			case 'subscribed': {
				// build list of invitations
				if (invitations && together && together.allIds.length > 0) {
					invitations.forEach((id) => {
						const resource = together.byId[id]
						if (resource && resource.plan_id) {
							plansList.push(
								<div key={`${id}.${resource.plan_id}`}>
									{
										this.renderListItem({
											plan_id: resource.plan_id,
											together_id: id,
											start_dt: resource.start_dt,
										})
									}
									<TogetherInvitationActions
										together_id={id}
										handleActionComplete={() => {
											this.getInvitations()
											this.getSubs()
										}}
									/>
								</div>
							)
						}
					})
				}
				// build list of subscriptions
				if (subscriptions && subscriptions.allIds.length > 0) {
					subscriptions.allIds.forEach((id) => {
						const sub = subscriptions.byId[id]
						if (sub && sub.plan_id) {
							plansList.push(this.renderListItem({
								plan_id: sub.plan_id,
								together_id: sub.together_id,
								start_dt: sub.start_dt,
								subscription_id: id,
							}))
						}
						return null
					})
				}
				break
			}
			case 'saved': {
				backButton = (
					<Link to={localizedLink(Routes.subscriptions({ username: this.username }))}>
						&larr;
						<FormattedMessage id="plans.back" />
					</Link>
				)

				break
			}
			case 'completed': {
				backButton = (
					<Link to={localizedLink(Routes.subscriptions({ username: this.username }))}>
						&larr;
						<FormattedMessage id="plans.back" />
					</Link>
				)

				break
			}

			default: return null
		}


		return (
			<div>
				<div className='row collapse'>
					<div className='columns large-8 medium-8 medium-centered'>
						<div className='row collapse plan-title-row'>
							<div className='columns small-2'>
								{ backButton }
							</div>
							<div className='column small-8 end text-center'>
								<div className='plan-saved-title'>{}</div>
							</div>
						</div>
					</div>
				</div>
				<div className='row collapse'>
					<div className='columns large-8 medium-8 medium-centered subscription-list'>
						<List>
							{ plansList }
						</List>
					</div>
				</div>
				<div className='row collapse'>
					<div className='columns large-8 medium-8 medium-centered subscription-actions'>
						<div className='left'>
							<Link to={this.username ? localizedLink(Routes.subscriptionsSaved({ username: this.username })) : null}>
								<FormattedMessage id='plans.saved plans' />
							</Link>
						</div>
						<div className='right'>
							<Link to={this.username ? localizedLink(Routes.subscriptionsCompleted({ username: this.username })) : null}>
								<FormattedMessage id='plans.completed plans' />
							</Link>
						</div>
					</div>
				</div>
			</div>
		)
	}
}

function mapStateToProps(state) {
	return {
		subscriptions: getSubscriptionsModel(state),
		readingPlans: getPlansModel(state),
		together: getTogetherModel(state),
		invitations: getTogetherInvitations(state),
	}
}

PlanListView.propTypes = {
	subscriptions: PropTypes.object.isRequired,
	readingPlans: PropTypes.object.isRequired,
	together: PropTypes.object.isRequired,
	invitations: PropTypes.array,
	auth: PropTypes.object.isRequired,
	params: PropTypes.object.isRequired,
	serverLanguageTag: PropTypes.string.isRequired,
	dispatch: PropTypes.func.isRequired,
}

PlanListView.defaultProps = {
	invitations: null,
}

export default connect(mapStateToProps, null)(PlanListView)
