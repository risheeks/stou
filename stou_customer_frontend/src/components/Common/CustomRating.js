import React, { Component } from 'react';
import Rating from 'react-rating';
import empty_rating from '../../constants/images/empty_rating.png';
import full_rating from '../../constants/images/full_rating.png';
import { Image } from 'react-bootstrap';

class CustomRating extends Component {
    render() {
        const { rating, readonly } = this.props;

        return (
            <Rating
                initialRating={rating}
                readonly={readonly}
                emptySymbol={<Image style={{width: '30px'}} src={empty_rating} />}
                fullSymbol={<Image style={{width: '30px'}} src={full_rating} />}
            />
        );
    }
}

export default CustomRating;