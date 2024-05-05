import * as React from "react";
import "./style.scss"
// @ts-ignore
import StarRatings from "react-star-ratings";

function RatingStars({star, starColor, starSize}: { star: any, starColor: any, starSize: any }) {

    return <div className="d-inline">
        <StarRatings
            rating={parseFloat(star.toString())}
            starRatedColor={starColor.active}
            starEmptyColor={starColor.inactive}
            numberOfStars={5}
            name='rating'
            isAggregateRating
            starDimension={starSize.size + starSize.units}
            starSpacing="4px"
        />
    </div>;

}

export default RatingStars;
