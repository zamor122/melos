import exploreApi from '@youversion/api-redux/lib/endpoints/explore'
import chapterifyUsfm from '@youversion/utils/lib/bible/chapterifyUsfm'
import getBibleVersionFromStorage from '@youversion/utils/lib/bible/getBibleVersionFromStorage'
import bibleActions from '@youversion/api-redux/lib/endpoints/bible/action'
import searchAction from '@youversion/api-redux/lib/endpoints/search/action'
import momentsAction from '@youversion/api-redux/lib/endpoints/moments/action'

import { PAGE_NUM } from '../../features/Explore/components/Topic'

/**
 * Loads a data.
 *
 * @param      {object}   params         The parameters
 * @param      {object}   startingState  The starting state
 * @param      {object}   sessionData    The session data
 * @param      {object}   store          The store
 * @param      {object}   Locale         The locale
 * @return     {Promise}  { description_of_the_return_value }
 */
export default function loadData(params, startingState, sessionData, store, Locale) {
	return new Promise((resolve) => {
		if (typeof store !== 'undefined' && params.url && params.languageTag) {
			const { dispatch } = store
			const serverLanguageTag = params.languageTag
			const version_id = params.version_id || getBibleVersionFromStorage(serverLanguageTag)

			const isTopic = new RegExp('^\/explore/[0-9a-zA-Z-]+')
			const isExplore = new RegExp('^\/explore')

			if (isTopic.test(params.url)) {
				const topic = params.topic

				const proms = [
					dispatch(bibleActions({
						method: 'version',
						params: {
							id: version_id,
						}
					})),
					new Promise((resolve2) => {
						dispatch(exploreApi.actions.topic.get({ topic: params.topic })).then((data) => {
							const promises = []
							const usfmsForTopic = data && data[params.topic]
							if (usfmsForTopic && usfmsForTopic.length > 0) {
								usfmsForTopic.forEach((usfm, i) => {
									if (i < PAGE_NUM) {
										promises.push(
											dispatch(bibleActions({
												method: 'chapter',
												params: {
													id: version_id,
													reference: chapterifyUsfm(usfm),
												}
											}))
										)
									}
								})
							}
							Promise.all(promises)
								.then(() => { resolve2() })
								.catch(() => { resolve2() })
						}).catch(() => { resolve2() })
					}),
					dispatch(exploreApi.actions.topics.get()),
					dispatch(searchAction({
						method: 'reading_plans',
						params: {
							query: topic,
							language_tag: serverLanguageTag,
						}
					}))
				]

				Promise.all(proms)
					.then(() => { resolve() })
					.catch(() => { resolve() })
			} else if (isExplore.test(params.url)) {
				const proms = [
					dispatch(exploreApi.actions.topics.get()),
					dispatch(momentsAction({
						method: 'configuration'
					})),
					dispatch(bibleActions({
						method: 'version',
						params: {
							id: version_id,
						}
					})).then((versionData) => {
						if (versionData) {
							dispatch(momentsAction({
								method: 'votd',
								params: {
									language_tag: versionData
										&& versionData.language
										&& versionData.language.iso_639_1,
								}
							}))
						}
					}),
				]
				Promise.all(proms)
					.then(() => { resolve() })
					.catch(() => { resolve() })
			}
		} else {
			resolve()
		}
	})
}
