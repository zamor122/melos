import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import moment from 'moment'
import { FormattedMessage } from 'react-intl'
import getMomentsModel from '@youversion/api-redux/lib/models/moments'
import withImages from '@youversion/api-redux/lib/endpoints/images/hocs/withImages'
import withVotd from '@youversion/api-redux/lib/endpoints/moments/hocs/withVotd'
import getBibleModel from '@youversion/api-redux/lib/models/bible'
import getReferencesTitle from '@youversion/utils/lib/bible/getReferencesTitle'
import getBibleVersionFromStorage from '@youversion/utils/lib/bible/getBibleVersionFromStorage'
import Routes from '@youversion/utils/lib/routes/routes'
import expandUsfm from '@youversion/utils/lib/bible/expandUsfm'
import { SQUARE } from '@youversion/utils/lib/images/readingPlanDefault'
import Heading3 from '@youversion/melos/dist/components/typography/Heading3'
import LazyImage from '@youversion/melos/dist/components/images/LazyImage'
import shareAction from '../../../../widgets/ShareSheet/action'
import Moment from '../Moment'
import MomentHeader from '../MomentHeader'
import MomentFooter from '../MomentFooter'
import ShareIcon from '../../../../components/icons/ShareIcon'
import { Item } from '../../../../components/OverflowMenu'
import OverflowMenu from '../../../../widgets/OverflowMenu'
import VerseImagesSlider from '../../../../widgets/VerseImagesSlider'


class VotdImage extends Component {
	handleShare = (title) => {
		const { dispatch, onShare } = this.props
		if (onShare && typeof onShare === 'function') {
			onShare({ refTitle: title })
		} else {
			dispatch(shareAction({
				isOpen: true,
				text: title,
				url: window.location.href,
			}))
		}
	}

	render() {
		const {
			dayOfYear,
			momentsModel,
			className,
			serverLanguageTag,
			bibleModel,
			usfm,
			hasNoImages,
			version_id,
			image_id,
			images,
		} = this.props

		const day = parseInt((dayOfYear || moment().dayOfYear()), 10)
		const versionId = version_id || getBibleVersionFromStorage(serverLanguageTag)
		const usfmForImgs = usfm
			|| (
				momentsModel.pullVotd(day)
				&& momentsModel.pullVotd(day).usfm
			)
		const version = bibleModel
			.pullVersion(versionId)
		const referenceStrings = version
			&& version.books
			&& getReferencesTitle({
				bookList: version.books,
				usfmList: usfmForImgs,
			})
		const title = referenceStrings && referenceStrings.title

		let content = null
		if (image_id) {
			let img = images.filter((im) => {
				return parseInt(im.id, 10) === parseInt(image_id, 10)
			})[0]
			if (!(img && img.id)) img = images[0]
			const src = img
				&& img.renditions
				&& img.renditions[img.renditions.length - 1].url
			content = (
				<div style={{ marginBottom: '10px', paddingRight: '20px' }}>
					<LazyImage
						src={src}
						lazy={false}
						placeholder={<img alt='' height='auto' width='100%' src={SQUARE} />}
					/>
				</div>
			)
		} else {
			content = (
				<VerseImagesSlider
					usfm={expandUsfm(usfm, false)}
					category='prerendered'
					linkBuilder={({ id }) => {
						return Routes.votdImage({
							usfm: referenceStrings && referenceStrings.usfm,
							id,
							serverLanguageTag,
							query: {
								version: versionId
							}
						})
					}}
					version_id={versionId}
				/>
			)
		}

		return (
			!hasNoImages
				&& (
					<div className={`yv-votd-image ${className}`}>
						<Moment
							header={
								<MomentHeader
									title={(
										<Heading3>
											{ title }
										</Heading3>
									)}
								/>
							}
							footer={
								<MomentFooter
									right={[
										<a
											key='share'
											title='Share'
											tabIndex={0}
											className='vertical-center'
											onClick={this.handleShare.bind(this, title)}
										>
											<ShareIcon fill='gray' />
										</a>,
										<OverflowMenu
											key='overflow'
											usfm={usfmForImgs}
											version_id={versionId}
										>
											<Item link={Routes.notificationsEdit({ serverLanguageTag })}>
												<FormattedMessage id='notification settings' />
											</Item>
										</OverflowMenu>
									]}
								/>
							}
						>
							{ content }
						</Moment>
					</div>
				)
		)
	}

}

VotdImage.propTypes = {
	images: PropTypes.array.isRequired,
	version_id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
	dayOfYear: PropTypes.number,
	usfm: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
	className: PropTypes.string,
	momentsModel: PropTypes.object.isRequired,
	bibleModel: PropTypes.object.isRequired,
	serverLanguageTag: PropTypes.string.isRequired,
	hasNoImages: PropTypes.bool,
	image_id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
	dispatch: PropTypes.func.isRequired,
	onShare: PropTypes.func,
}

VotdImage.defaultProps = {
	version_id: null,
	dayOfYear: null,
	usfm: null,
	hasNoImages: false,
	className: '',
	image_id: null,
	onShare: null,
}

function mapStateToProps(state) {
	return {
		momentsModel: getMomentsModel(state),
		bibleModel: getBibleModel(state),
		serverLanguageTag: state.serverLanguageTag,
	}
}

export default connect(mapStateToProps, null)(withVotd(withImages(VotdImage)))
