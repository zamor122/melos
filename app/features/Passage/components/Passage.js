import React, { Component, PropTypes } from 'react'
import VerseCard from '../../Bible/components/verseAction/bookmark/VerseCard'
import ReaderArrows from '../../Bible/components/content/ReaderArrows'
import Helmet from 'react-helmet'
import CarouselSlideImage from '../../../components/Carousel/CarouselSlideImage'
import CarouselArrow from '../../../components/Carousel/CarouselArrow'
import Image from '../../../components/Carousel/Image'
import { injectIntl, FormattedMessage } from 'react-intl'

// const MAIN_VERSION =

class Passage extends Component {

	render() {
		const { auth, passage, isRtl, localizedLink, intl } = this.props

		let mainVerse, versesCarousel, plansCarousel, metaContent, metaTitle, chapterLink = null

		// main verse and verse cards
		let verses = []
		if (passage && passage.verses && passage.verses.verses) {
			Object.keys(passage.verses.verses).forEach((key, index) => {
				let verse = passage.verses.verses[key]
				// should the main verse be a specific version?
				if (index == 0) {
					mainVerse = (
						<div key={key} className='verse'>
							<h2>
								<div className='heading'>{ verse.versionInfo.local_abbreviation }</div>
								<div className='name'>{ verse.versionInfo.local_title }</div>
							</h2>
							<a
								href={`/bible/${verse.versionInfo.id}/${verse.usfm}`}
								title={`${intl.formatMessage({ id: "read reference" }, { reference: `${verse.human}` })} ${verse.versionInfo.local_abbreviation}`}
								className='verse-content'
								dangerouslySetInnerHTML={{ __html: verse.content }}
							/>
						</div>
					)
					metaTitle = `${passage.verses.title}: ${verse.text}`
					metaContent = `${verse.text}`
					chapterLink = `bible/${verse.versionInfo.id}/${(verse.usfm[0]).split('.').slice(0, 2).join('.')}`
				} else {
					let heading = (
						<h2>
							<div className='heading'>{ verse.versionInfo.local_abbreviation }</div>
							<div className='name'>{ verse.versionInfo.local_title }</div>
						</h2>
					)
					verses.push(
						<li className='verse-container' key={key}>
							<VerseCard verseContent={{ [key]: passage.verses.verses[key] }} verseHeading={heading} />
						</li>
					)
				}
			})
		}

		// reading plans
		let items = []
		if (passage && passage.readingPlans && passage.readingPlans.items) {
			passage.readingPlans.items.forEach((item) => {
					let slide = null

					if (item.type == 'reading_plan') {
						let slideLink = localizedLink(`/reading-plans/${item.id}-${item.slug}`)
						if (item.image_id) {
							slide = (
								<div className='radius-5' >
									<CarouselSlideImage title={item.title}>
										<Image width={720} height={405} thumbnail={false} imageId={item.image_id} type={item.type} config={passage.configuration.images} />
									</CarouselSlideImage>
								</div>
							)
						} else {
							slide = (
								<div className='radius-5' >
									<CarouselSlideImage title={item.title}>
										<Image width={720} height={405} thumbnail={false} imageId='default' type={item.type} config={passage.configuration.images} />
									</CarouselSlideImage>
								</div>
							)
						}
						items.push (
							<li className="collection-item" key={`item-${item.id}`}>
								<a
									href={slideLink}
									title={`${intl.formatMessage({ id: "plans.about this plan" })}: ${item.title }`}
								>
									{slide}
								</a>
							</li>
						)
					}
				})
		}

		let plansDiv = null
		if (items.length > 0) {
			plansDiv = (
				<div className='related-plans collections-view'>
					<h2 id='related-plans' className='heading'><FormattedMessage id='plans related to reference' values={{ reference: passage.verses.title }} /></h2>
					<div className='row horizontal-center collection-items'>
						<ul className='list'>
							{ items }
						</ul>
					</div>
				</div>
			)
		}


		return (
			<div className='passage'>
				<Helmet
					title={`${metaTitle}`}
					meta={[ { name: 'description', content: `${metaContent}` } ]}
				/>
				<div className='row main-content'>
					<div className='title-heading'>
						<a
							href={`/passage/${passage.verses.previous_verse}`}
							title={``}
						>
							<CarouselArrow width={23} height={23} dir='left' fill='gray'/>
						</a>
						<h1 className='title'>
							{ passage.verses.title }
						</h1>
						<a
							href={`/passage/${passage.verses.next_verse}`}
							title={``}
						>
							<CarouselArrow width={23} height={23} dir='right' fill='gray'/>
						</a>
					</div>
					<div className='single-verse'>
						{ mainVerse }
					</div>
					<a href={chapterLink} className='chapter-button solid-button'><FormattedMessage id='read chapter' /></a>
					<a href='#related-plans' className='chapter-button solid-button'><FormattedMessage id='related plans' /></a>
				</div>
				<div className='row verses'>
					<ul className='list'>
						{ verses }
					</ul>
				</div>
				{ plansDiv }
			</div>
		)
	}
}


/**
 *
 */
Passage.propTypes = {

}

export default injectIntl(Passage)