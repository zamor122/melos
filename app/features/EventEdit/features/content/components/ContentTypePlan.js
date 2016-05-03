import React, { Component, PropTypes } from 'react'
import FormField from '../../../../../../app/components/FormField'
import Input from '../../../../../../app/components/Input'
import Image from '../../../../../../app/components/Image'
import ActionCreators from '../actions/creators'
import { FormattedMessage } from 'react-intl'

const SEARCH_TIMEOUT = 500

var PlanList = React.createClass({

	render: function() {
		const { items, handlePlanClick, intl } = this.props

		var createItem = function(item) {
			var className = (item.name.default=='No matching Plans') ? 'plan error' : 'plan'
			return item.name.default ? <li className={className} key={item.id} data-plan_id={item.id} name="plan_id" value={item.id} onClick={handlePlanClick}>
				<Image images={item.images} height={80} width={80} />
				<div className="title">{item.name.default}</div>
				<div className="length">{item.formatted_length.default}</div>
			</li> : null;
		};
		return <ul className="results">{items.map(createItem)}</ul>;
	}
});

var SelectedPlan = React.createClass({

	render: function() {
		const { item, handlePlanClick } = this.props

		return <div className="selected" key={item.plan_id} data-plan_id={item.plan_id} name="plan_id" value={item.plan_id}>
			<Image images={item.images} width={640} height={360} />
			<div className="replace" onClick={handlePlanClick}><FormattedMessage id="features.EventEdit.features.content.components.ContentTypePlan.replace" /></div>
			<div className="title">{item.title}</div>
			<div className="length">{item.formatted_length}</div>
		</div>;
	}
});

class ContentTypePlan extends Component {

	performPlanSearch(index, field, value) {
		const { dispatch } = this.props
		dispatch(ActionCreators.searchPlans({
			index,
			query: value,
			language_tag: 'en'
		}))
	}

	clearPlanSearch() {
		const { dispatch } = this.props
		dispatch(ActionCreators.clearPlanSearch())
	}

	handlePlanSearchChange(changeEvent) {
		const { contentIndex, handlePlanSearchChange, dispatch } = this.props
		const { name, field, value } = changeEvent.target

		dispatch(ActionCreators.setPlanField({
			index: contentIndex,
			field,
			value
		}))

		if (typeof this.cancelSearch === 'number') {
			clearTimeout(this.cancelSearch)
			this.cancelSearch = null
		}

		// Can't pass extra params in IE?
		this.cancelSearch = setTimeout(::this.performPlanSearch, SEARCH_TIMEOUT, contentIndex, field, value)

	}

	handlePlanSearchFocus(focusEvent) {
		const { contentIndex, dispatch } = this.props

		dispatch(ActionCreators.focusPlanSearch({
			index: contentIndex
		}))
	}

	handlePlanAdd(clickEvent) {
		const { contentIndex, dispatch, handleChange, plans } = this.props
		const plan_id = parseInt(clickEvent.currentTarget.dataset['plan_id'])

		// Find in plans[]
		// If we knew the index, we could just pass it directly
		var selectedPlan;
		selectedPlan = 0
		for( var i in plans.items ){
			if( plans.items[i].id == plan_id ) {
				selectedPlan = plans.items[i];
				break;
			}
		}

		dispatch(ActionCreators.selectPlan({
			index: contentIndex,
			selectedPlan: {
				plan_id: selectedPlan.id,
				title: selectedPlan.name.default,
				formatted_length: selectedPlan.formatted_length.default,
				images: selectedPlan.images,
				short_url: selectedPlan.short_url
			}
		}))

		handleChange({target: {name: 'plan_id', value: plan_id}})
	}

	handlePlanRemove(clickEvent) {
		const { contentIndex, handleChange, autoSave } = this.props
		handleChange({target: {name: 'plan_id', value: 0}}, false)
	}

	render() {
		const { contentIndex, contentData, plans, intl } = this.props
		var output;

		// Selected
		if (contentData.plan_id) {
			output = <div>
				<SelectedPlan item={contentData} handlePlanClick={::this.handlePlanRemove} />
			</div>

		// Focused plan search
		} else if (plans.focus_id == contentIndex) {
			output = <div className="plan-content">
				<FormField
					InputType={Input}
					placeholder={intl.formatMessage({id:"features.EventEdit.features.content.components.ContentTypePlan.search"})}
					name="query"
					onChange={::this.handlePlanSearchChange}
					onFocus={::this.handlePlanSearchFocus}
					value={plans.query}
					errors={contentData.errors} />

				<PlanList items={plans.items} handlePlanClick={::this.handlePlanAdd} />
			</div>

		// Out-of-focus plan search
		} else {
			output = <div className="plan-content">
				<FormField
					InputType={Input}
					placeholder={intl.formatMessage({id:"features.EventEdit.features.content.components.ContentTypePlan.search"})}
					name="query"
					onChange={::this.handlePlanSearchChange}
					onFocus={::this.handlePlanSearchFocus}
					value=''
					errors={contentData.errors} />
			</div>

		}

		return (
			<div>
				<div className="form-body-block white plan-content">
					{output}
				</div>
			</div>
		)
	}
}

ContentTypePlan.propTypes = {

}

export default ContentTypePlan
