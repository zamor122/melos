import React, { Component, PropTypes } from 'react'
import ActionCreators from '../actions/creators'
import CarouselStandard from '../../../components/Carousel/CarouselStandard'
import Image from '../../../components/Carousel/Image'
import { Link } from 'react-router'
import PlanActionButtons from './PlanActionButtons'
import { FormattedMessage } from 'react-intl'
import AvatarList from '../../../components/AvatarList'
import ShareWidget from './ShareWidget'
import Helmet from 'react-helmet'
import { injectIntl } from 'react-intl'
import imageUtil from '../../../lib/imageUtil'

class AboutPlan extends Component {

	constructor(props) {
		super(props)
		this.state = { dialogOpen: false }
	}

	handleClick() {
		this.setState({ dialogOpen: !this.state.dialogOpen })
	}

	render() {
		const { readingPlan, imageConfig, auth, localizedLink, isRtl, params } = this.props

		if (!(readingPlan && readingPlan.stats && readingPlan.related)) {
			return (
				<div></div>
			)
		}

		var friendsReading, friendsCompleted, completions, readingList, completedList = null
		var publisherLink = (readingPlan.publisher_url) ? <a className='publisher' href={readingPlan.publisher_url}><FormattedMessage id='plans.about publisher'/></a> : null
		var language_tag = params.lang || auth.userData.language_tag || 'en'



		if ( (readingPlan.stats.friends != null) && (readingList = readingPlan.stats.friends.subscribed) ) {
			var readingText = (readingList.length == 1) ? <FormattedMessage id='plans.stats.friends reading.one' values={{ count: readingPlan.stats.friends.subscribed.length }} /> : <FormattedMessage id='plans.stats.friends reading.other' values={{ count: readingPlan.stats.friends.subscribed.length }} />
			friendsReading = (
				<div>
					<p className='friends_completed'>{ readingText }</p>
					<AvatarList avatarList={readingList} />
				</div>
			)
		}

		if ( (readingPlan.stats.friends != null) && (completedList = readingPlan.stats.friends.completed) ) {
			var completedText = (completedList.length == 1) ? <FormattedMessage id='plans.stats.friends completed.one' values={{ count: readingPlan.stats.friends.completed.length }} /> : <FormattedMessage id='plans.stats.friends completed.other' values={{ count: readingPlan.stats.friends.completed.length }} />
			friendsCompleted = (
				<div>
					<p className='friends_completed'>{ completedText }</p>
					<AvatarList avatarList={completedList} />
				</div>
			)
		}

		const milestones = [0, 1000, 2500, 5000, 7500, 10000, 25000, 50000, 75000, 100000, 250000, 500000, 750000]
		let completedMilestone = 0

		milestones.forEach((milestone) => {
			if (readingPlan.stats.total_completed > milestone &&  milestone > completedMilestone) {
				completedMilestone = milestone
			}
		})


		const readingPlansStats = (completedMilestone !== 0) ?
			<p className='friends_completed'><FormattedMessage id='plans.stats.total completions' values={{count: completedMilestone}} /></p> :
			null

		let selectedImage = {}
		if (readingPlan.images) {
			selectedImage = imageUtil(360, 640, false, 'about_plan', readingPlan, false)
		} else {
			selectedImage = {
				url: "https://s3.amazonaws.com/yvplans-staging/default/720x405.jpg",
				width: 720,
				height: 405
			}
		}

		const url = `https://www.bible.com/reading-plans/${readingPlan.id}-${readingPlan.slug}`

		return (
			<div className='row collapse about-plan horizontal-center'>
				<Helmet
					title={`${readingPlan.name[language_tag] || readingPlan.name.default} - ${readingPlan.about.text[language_tag] || readingPlan.about.text.default}`}
					meta={[
						{ name: 'description', content: readingPlan.about.text[language_tag] || readingPlan.about.text.default },
						{ name: 'og:image', content: `https:${selectedImage.url}` },
						{ name: 'og:title', content: `${readingPlan.name[language_tag] || readingPlan.name.default}` },
						{ name: 'og:url', content: url },
						{ name: 'og:description', content: `${readingPlan.about.text[language_tag] || readingPlan.about.text.default}` },
						{ name: 'twitter:image', content: `https:${selectedImage.url}` },
						{ name: 'twitter:card', content: 'summary' },
						{ name: 'twitter:url', content: url },
						{ name: 'twitter:title', content: `${readingPlan.name[language_tag] || readingPlan.name.default}` },
						{ name: 'twitter:description', content: `${readingPlan.about.text[language_tag] || readingPlan.about.text.default}` },
						{ name: 'twitter:site', content: '@YouVersion' },
						{ name: 'og:image:width', content: selectedImage.width },
						{ name: 'og:image:height', content: selectedImage.height }
					]}
				/>
				<div className='columns large-8 medium-8'>
					<div className='reading_plan_index_header'>
						<Link className='plans' to={localizedLink(`/reading-plans`)}>&larr;<FormattedMessage id='plans.plans'/></Link>
						<div className='right'>
							<ShareWidget/>
						</div>
					</div>
					<article className='reading_plan_index'>
						<div className='plan-image'>
							<Image className="rp-hero-img" width={720} height={400} thumbnail={false} imageId="false" type="about_plan" config={readingPlan} />
						</div>
						<div className='row collapse'>
							<div className='columns large-8 medium-8'>
								<h1>{ readingPlan.name[language_tag] || readingPlan.name.default }</h1>
								<p className='plan_length'>{ readingPlan.formatted_length[language_tag] || readingPlan.formatted_length.default}</p>
								<p className='plan_about'>{ readingPlan.about.text[language_tag] || readingPlan.about.text.default }</p>
								<h3 className='publisher'><FormattedMessage id='plans.publisher'/></h3>
								<p className='publisher'>{ readingPlan.copyright.text[language_tag] || readingPlan.copyright.text.default }</p>
								{ publisherLink }
							</div>
							<div className='columns large-4 medium-4'>
								<div className='side-col'>
									<PlanActionButtons {...this.props} />
									<hr></hr>
									<div className='widget'>
										{ friendsReading }
										{ friendsCompleted }
										{ readingPlansStats }
									</div>
								</div>
							</div>
						</div>
						<hr></hr>
						<div className='row collapse'>
							<CarouselStandard carouselContent={readingPlan.related} context="recommended" imageConfig={imageConfig} localizedLink={localizedLink} isRtl={isRtl} />
						</div>
					</article>
				</div>
			</div>
		)
	}
}

export default injectIntl(AboutPlan)