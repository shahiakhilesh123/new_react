import * as React from "react";
import "./style.css";
// @ts-ignore
import StarRatings from "react-star-ratings";

function RatingStars({star}: { star: string }) {

    return <div className="d-inline">
        <StarRatings
            rating={parseInt(star)}
            starRatedColor="orange"
            numberOfStars={5}
            name='rating'
            starDimension="20px"
            starSpacing="5px"
        />
    </div>;

}

export default RatingStars;