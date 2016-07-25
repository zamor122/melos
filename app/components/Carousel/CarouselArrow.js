import React, { Component } from 'react'


class CarouselArrow extends Component {
    render() {
    		const width = this.props.width || 40
    		const height = this.props.height || 40
    		const fill = this.props.fill || 'white'
    		const dir = this.props.dir || 'right'
    		const backColor = this.props.backColor
    		const rotation = dir == 'right' ? 0 : 180

    		var style = null
    		// if background color was passed, set it, else no background (standard carousel)
    		backColor != null ? style = {"display": 'flex', "backgroundImage": `linear-gradient(${rotation + 90}deg, rgba(0,0,0,0.00) 0%, ${backColor} 100%)`} : style = {"display": 'flex'}

    		var classes = `vertical-center slick-arrow-${dir}-container`

        return (
        	<div {...this.props} className={classes} style={style} onmouseover="">
	        	<svg className={`slick-arrow-${dir}`} width={width} height={height} viewBox="12 863 25 36" version="1.1" xmlns="http://www.w3.org/2000/svg" xlink="http://www.w3.org/1999/xlink">
					    <g stroke="none" strokeWidth="1" fill="none" fill-rule="evenodd" transform={`translate(24.000000, 883.500000) rotate(${rotation}) translate(-24.000000, -883.500000) translate(17.000000, 871.000000)`}>
					      <polygon fill={fill} points="0.0194872683 1.30359212 1.26844401 0 13.6363636 12.5 1.25309041 25 0 23.6927097 11.0108971 12.5"></polygon>
					    </g>
						</svg>
          </div>
        );
    }
}

export default CarouselArrow
