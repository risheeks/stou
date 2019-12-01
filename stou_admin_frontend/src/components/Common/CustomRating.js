import React, { Component } from 'react';
import Rating from 'react-rating';
import empty_rating from '../../constants/images/empty_rating.png';
import full_rating from '../../constants/images/full_rating.png';
import { Image } from 'react-bootstrap';

class CustomRating extends Component {
    render() {
        const { rating, readonly, bowlSize, changeRating } = this.props;

        return (
            <Rating
                className="custom-rating"
                initialRating={rating}
                readonly={readonly}
                emptySymbol={<Image style={{width: bowlSize}} src={empty_rating} />}
                fullSymbol={<Image style={{width: bowlSize}} src={full_rating} />}
                onChange={changeRating}
            />
        );
    }
}

export default CustomRating;