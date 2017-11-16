import React, { Component, PropTypes } from 'react'
import { FormattedMessage } from 'react-intl'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import subscribeToPlan from '@youversion/api-redux/lib/batchedActions/subscribeToPlan'
import Menu from '../../../components/Menu'
import CarouselArrow from '../../../components/Carousel/CarouselArrow'
import Modal from '../../../components/Modal'
import Routes from '../../../lib/routes'


class SubscribeUserDialog extends Component {
	constructor(props) {
		super(props)
		this.handleSubscribeUser = this.handleSubscribeUser.bind(this)
	}

	handleSubscribeUser(subscribeContext) {
		const { dispatch, id, isLoggedIn, subLinkBase, useRouter, serverLanguageTag } = this.props
		if (!isLoggedIn) {
			// redirect to sign up
			if (window) {
				window.location.href = Routes.signUp({
					query: {
						redirect: window.location.href
					}
				})
			}
		}

		switch (subscribeContext) {
			case 'together':
				dispatch(push(`${subLinkBase}/together/create`))
				break
			case 'public':
			case 'private':
				dispatch(subscribeToPlan({
					plan_id: id,
					privacy: subscribeContext,
					serverLanguageTag,
					auth: isLoggedIn,
					onComplete: (sub) => {
						const newSubId = sub && sub.id
						if (useRouter) {
							dispatch(push(`${subLinkBase}/subscription/${newSubId}/day/1`))
						} else {
							window.location.replace(`${subLinkBase}/subscription/${newSubId}/day/1`)
						}
					}
				}))
				break
			default:
				break
		}
	}

	render() {
		const { footer } = this.props
		const heading = (
			<h6><FormattedMessage id='start plan title' /></h6>
		)
		return (
			<div>
				<Menu
					customClass='subscribe-actions'
					heading={heading}
					footer={footer}
				>
					<ul>
						<a tabIndex={0} onClick={() => { this.modal.handleOpen() }}>
							<li className='vertical-center'>
								<div className='option'>
									<div className='action-title'><FormattedMessage id='by myself' /></div>
									<div className='action-description'><FormattedMessage id='by myself description' /></div>
								</div>
								<CarouselArrow dir='right' containerClass='arrow' fill='gray' width={14} height={14} />
							</li>
						</a>
						<a tabIndex={0} onClick={this.handleSubscribeUser.bind(this, 'together')}>
							<li className='vertical-center'>
								<div className='option'>
									<div className='action-title'><FormattedMessage id='with friends' /></div>
									<div className='action-description'><FormattedMessage id='with friends description' /></div>
								</div>
								<CarouselArrow dir='right' containerClass='arrow' fill='gray' width={14} height={14} />
							</li>
						</a>
					</ul>
				</Menu>
				<Modal ref={(m) => { this.modal = m }} customClass='subscribe-modal'>
					<div customClass='horizontal-center flex-wrap'>
						<div className='flex-wrap horizontal-center option' style={{ marginBottom: '20px' }}>
							<div className='action-title' style={{ width: '100%' }}><FormattedMessage id='level of privacy' /></div>
							<div className='action-description'><FormattedMessage id='plan privacy prompt' /></div>
						</div>
						<div className='button-actions stacked'>
							<a tabIndex={0} onClick={this.handleSubscribeUser.bind(this, 'public')}>
								<FormattedMessage id='visible to friends' />
							</a>
							<a tabIndex={0} onClick={this.handleSubscribeUser.bind(this, 'private')}>
								<FormattedMessage id='private' />
							</a>
						</div>
					</div>
				</Modal>
			</div>
		)
	}
}

SubscribeUserDialog.propTypes = {
	id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
	dispatch: PropTypes.func.isRequired,
	isLoggedIn: PropTypes.bool.isRequired,
	subLinkBase: PropTypes.string.isRequired,
	serverLanguageTag: PropTypes.string.isRequired,
	useRouter: PropTypes.bool,
	footer: PropTypes.node,
}

SubscribeUserDialog.defaultProps = {
	useRouter: true,
	footer: null,
}

function mapStateToProps(state) {
	return {
		isLoggedIn: state.auth.isLoggedIn,
		serverLanguageTag: state.serverLanguageTag,
	}
}

export default connect(mapStateToProps)(SubscribeUserDialog)
