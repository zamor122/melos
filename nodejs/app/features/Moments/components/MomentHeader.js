import React, { PropTypes } from 'react'
import moment from 'moment'

function MomentHeader(props) {
	const {
		title,
		dt,
	} = props

	return (
		<div className='moment-header'>
			<div className='title'>
				{ title }
			</div>
			{
				dt &&
				<div className='dt'>
					{ moment(dt).fromNow() }
				</div>
			}
		</div>
	)
}

MomentHeader.propTypes = {

}

MomentHeader.defaultProps = {

}

export default MomentHeader
