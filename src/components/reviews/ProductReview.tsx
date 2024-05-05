import useMediaQuery from '@material-ui/core/useMediaQuery';
import React, {useCallback, useEffect, useState} from "react";
import StarRateIcon from '@material-ui/icons/StarRate';
import useIsMounted from "ismounted";
import Select from '@material-ui/core/Select';
import CloseIcon from '@material-ui/icons/Close'
import dayjs from "dayjs";
// @ts-ignore
import Masonry, {ResponsiveMasonry} from "react-responsive-masonry"
import Pagination from "@material-ui/lab/Pagination";
import css from "./styles.module.css"
import Dialog from "@material-ui/core/Dialog";
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import {FieldArray, Formik} from "formik";
import * as yup from "yup";
import {DropzoneArea} from "material-ui-dropzone";
import {makeStyles, Theme, useTheme} from '@material-ui/core/styles';
import {createStyles, withStyles, WithStyles} from "@material-ui/styles";
import Typography from '@material-ui/core/Typography/Typography';
import IconButton from '@material-ui/core/IconButton/IconButton';
import Container from '@material-ui/core/Container/Container';
import Box from '@material-ui/core/Box/Box';
import Grid from '@material-ui/core/Grid/Grid';
import Button from '@material-ui/core/Button';
import {FormControl, LinearProgressProps} from "@material-ui/core";
import InputLabel from '@material-ui/core/InputLabel/InputLabel';
import MenuItem from '@material-ui/core/MenuItem/MenuItem';
import DialogContent from '@material-ui/core/DialogContent/DialogContent';
import Grow from '@material-ui/core/Grow/Grow';
import DialogActions from '@material-ui/core/DialogActions/DialogActions';
import TextField from "@material-ui/core/TextField";
import RatingStars from './components/Rating/RatingStars';
import LinearProgress from "@material-ui/core/LinearProgress";

import LocalizedFormat from "dayjs/plugin/localizedFormat";
import ReviewApis, {ReviewBasicListResponse, ReviewStats} from "../../apis/review.apis";
import {iListingQuery} from "../../types/api";
import EmailDashboardAPIs from "../../apis/Email/email.dashboard.apis";
import {PaginationItem} from "@material-ui/lab";
import {alpha} from "@material-ui/core/styles/colorManipulator";

dayjs.extend(LocalizedFormat)
export const useSummaryStyles = makeStyles((theme: Theme) =>
        createStyles({
            review_root_main: (settings: iReviewSettings) => {
                return {
                    backgroundColor: settings.primary_background_color,
                    textAlign: "left",
                    marginBottom: theme.spacing(2)
                }
            },
            review_root: (settings: iReviewSettings) => {
                return {
                    flexGrow: 1,
                    width: "100%"
                }
            },

            review_formControl: {
                margin: theme.spacing(1),
                minWidth: 120,
            },
            addReviewButton: (settings: iReviewSettings) => {
                return {
                    border: "1px solid " + settings.primary_text_color,
                    width: "100%",
                }
            },
            dialog_button: (settings: iReviewSettings) => {
                return {
                    backgroundColor: settings.secondary_background_color,
                    color: settings.secondary_text_color,
                    "&:disabled": {
                        backgroundColor: settings.secondary_background_color,
                        color: settings.secondary_text_color,
                        opacity: 0.6
                    },
                    "&:focus": {
                        backgroundColor: settings.secondary_background_color,
                        color: settings.secondary_text_color,
                    },
                    "&:hover": {
                        backgroundColor: settings.secondary_background_color,
                        color: settings.secondary_text_color,
                    }
                }
            },
            dropZone: (settings: iReviewSettings) => {
                return {
                    padding: "20px",
                    backgroundColor: settings.primary_background_color,
                    color: settings.primary_text_color,
                }
            },
            dropZoneImage: (settings: iReviewSettings) => {
                return {
                    width: "20px",
                    backgroundColor: settings.primary_background_color,
                    color: settings.primary_text_color,
                }
            },
            add_dialog_wrapper: (settings: iReviewSettings) => {
                return {
                    backgroundColor: settings.primary_background_color,
                    color: settings.primary_text_color,
                }
            },
            review_button: (settings: iReviewSettings) => {
                let box_shadow = alpha(settings.secondary_background_color, 0.12);
                return {
                    padding: "14px 28px",
                    letterSpacing: "0.2em",
                    fontSize: "13px",
                    cursor: "pointer",
                    backgroundColor: settings.secondary_background_color,
                    color: settings.secondary_text_color,
                    boxShadow: "0px 3px 1px -2px " + box_shadow + ", 0px 2px 2px 0px " + box_shadow +
                        ", 0px 1px 5px 0px " + box_shadow,
                    borderRadius: "0",
                    textTransform: "uppercase",
                    "&:hover": {

                        boxShadow: "0px 2px 4px -1px " + alpha(settings.secondary_background_color, 0.20) + ", 0px 4px 5px 0px " + alpha(settings.secondary_background_color, 0.14) +
                            ", 0px 1px 10px 0px " + alpha(settings.secondary_background_color, 0.12),
                        backgroundColor: settings.secondary_background_color,
                        color: settings.secondary_text_color,
                    }
                }
            },
            review_state_wrapper: (settings: iReviewSettings) => {
                return {
                    borderBottom: "1px solid " + settings.separator_color
                }
            },
            review_state_average_score_box: (settings: iReviewSettings) => {
                return {
                    backgroundColor: settings.secondary_background_color,
                    color: settings.secondary_text_color,
                }
            },
            review_state_average_score_box_text: (settings: iReviewSettings) => {
                return {
                    color: settings.secondary_text_color,
                }
            },
            review_state_rating_text: (settings: iReviewSettings) => {
                return {
                    color: settings.primary_text_color,
                }
            },
            review_state_rating_wrapper: (settings: iReviewSettings) => {
                return {
                    borderLeft: "1px solid " + settings.separator_color,
                }
            },
            primary_text_color: (settings: iReviewSettings) => {
                return {
                    color: settings.primary_text_color,
                }
            },
            bold_text: (settings: iReviewSettings) => {
                return {
                    fontWeight: "bold"
                }
            },
            name_text: (settings: iReviewSettings) => {
                return {
                    fontWeight: "bold"
                }
            },
            date_text: (settings: iReviewSettings) => {
                return {
                    fontSize: "11px"
                }
            },
            active_star_color: (settings: iReviewSettings) => {
                return {
                    color: settings.active_star_color,
                }
            },
            inactive_star_color: (settings: iReviewSettings) => {
                return {
                    color: settings.inactive_star_color,
                }
            },
            inactive_star_color_as_bg: (settings: iReviewSettings) => {
                return {
                    backgroundColor: settings.inactive_star_color,
                }
            },
            active_star_color_as_bg: (settings: iReviewSettings) => {
                return {
                    backgroundColor: settings.active_star_color,
                }
            },

            dialog_textField: (settings: iReviewSettings) => {
                return {
                    color: settings.secondary_text_color,
                    backgroundColor: settings.primary_background_color,
                    "& .Mui-focused": {
                        color: settings.primary_text_color,
                    },
                }
            },
            pagination_ui: (settings: iReviewSettings) => {
                return {
                    '& .Mui-selected': {
                        backgroundColor: 'transparent',
                    },
                }
            },
            pagination_ui_selected: (settings: iReviewSettings) => {
                return {
                    color: settings.primary_text_color,
                }
            },
            primary_text_color_as_bg: (settings: iReviewSettings) => {
                return {
                    backgroundColor: settings.primary_text_color,
                }
            },
            review_item_wrapper: (settings: iReviewSettings) => {
                return {
                    border: "1px solid " + settings.separator_color
                }
            },
            primary_font_family: (settings: iReviewSettings) => {
                return {
                    fontFamily: settings.font_family
                }
            },
            secondary_font_family: (settings: iReviewSettings) => {
                return {
                    fontFamily: settings.secondary_font_family
                }
            }

        }),
    {classNamePrefix: "summary", index: 1}
);
const styles = (theme: Theme) =>
    createStyles({
        root: {
            margin: 0,
            padding: theme.spacing(2),
        },
        closeButton: {
            position: 'absolute',
            right: theme.spacing(1),
            top: theme.spacing(1),
            color: theme.palette.grey[500],
        },
    });


export interface DialogTitleProps extends WithStyles<typeof styles> {
    id: string;
    children: React.ReactNode;
    onClose: () => void;
}

const DialogTitle = withStyles(styles)((props: DialogTitleProps) => {
    const {children, classes, onClose, ...other} = props;
    return (
        <MuiDialogTitle disableTypography className={classes.root}
                        {...other}>
            <Typography variant="h6">{children}</Typography>
            {onClose ? (
                <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
                    <CloseIcon/>
                </IconButton>
            ) : null}
        </MuiDialogTitle>
    );
});

export interface iReviewSettings {
    primary_background_color: string
    primary_text_color: string
    secondary_background_color: string
    secondary_text_color: string
    active_star_color: string
    inactive_star_color: string
    separator_color: string
    font_family: string
    secondary_font_family: string
    star_size: number
    star_size_units: string
}

export default function ProductReview({ui_testing, settings}: { ui_testing: boolean, settings: iReviewSettings }) {
    const {meta_data}: any = {};
    const [reviewStats, setReviewStats] = useState<ReviewStats | undefined>(ui_testing ? {
        average_score: 4.5,
        stars_1: 10,
        stars_2: 20,
        stars_3: 60,
        stars_4: 70,
        stars_5: 90,
        total_reviews: 100,
        statusCode: 200
    } : undefined);
    const summaryClasses = useSummaryStyles(settings);

    const starColors = {active: settings.active_star_color, inactive: settings.inactive_star_color};
    const starSize = {
        size: settings.star_size,
        units: settings.star_size_units,
        sizeSmall: settings.star_size * .75
    };

    const isMounted = useIsMounted();
    const [query, setQuery] = useState<iListingQuery>({page: 1, per_page: 10, filter_stars: "0"});
    const [reviewsResponse, setReviewsResponse] = useState<ReviewBasicListResponse | undefined>(
        ui_testing ? {
            "items": {
                "current_page": 1,
                "data": [
                    {
                        "id": 32,
                        "uid": "603427b47ca18",
                        "shop_id": "2",
                        "customer_id": "3",
                        "stars": "5",
                        "reviewer_email": "abc@gmail.com",
                        "reviewer_name": "John Doe",
                        "title": "Title",
                        "message": "This is review message",
                        "verified_purchase": true,
                        "approved": true,
                        "ip_address": "70.27.93.204",
                        "created_at": "2021-01-13 00:00:00",
                        "updated_at": "2021-02-28 01:29:48",
                        "shop_name": "ankit-dev-2",
                        "shopify_product_id": "6012666839204",
                        "subscriber_id": null,
                        "product_title": "6012666839204",
                        "images": [
                            {
                                "id": 25,
                                "review_id": "32",
                                "created_at": "2021-02-22 21:52:52",
                                "updated_at": "2021-02-22 21:52:52",
                                "full_path": new EmailDashboardAPIs().getFrontEndApiBaseURL() + "/assets/images/review_1.jpg"
                            },
                        ],
                        "product": null
                    },
                    {
                        "id": 32,
                        "uid": "603427b47ca18",
                        "shop_id": "2",
                        "customer_id": "3",
                        "stars": "3",
                        "reviewer_email": "abc@gmail.com",
                        "reviewer_name": "John Smith",
                        "title": "Title",
                        "message": "This is review message",
                        "verified_purchase": true,
                        "approved": true,
                        "ip_address": "70.27.93.204",
                        "created_at": "2021-01-13 00:00:00",
                        "updated_at": "2021-02-28 01:29:48",
                        "shop_name": "ankit-dev-2",
                        "shopify_product_id": "6012666839204",
                        "subscriber_id": null,
                        "product_title": "6012666839204",
                        "images": [
                            {
                                "id": 25,
                                "review_id": "32",
                                "created_at": "2021-02-22 21:52:52",
                                "updated_at": "2021-02-22 21:52:52",
                                "full_path": new EmailDashboardAPIs().getFrontEndApiBaseURL() + "/assets/images/review_2.jpg"
                            },
                        ],
                        "product": null
                    },
                    {
                        "id": 32,
                        "uid": "603427b47ca18",
                        "shop_id": "2",
                        "customer_id": "3",
                        "stars": "1",
                        "reviewer_email": "abc@gmail.com",
                        "reviewer_name": "Amelia Rodriguez ",
                        "title": "Title",
                        "message": "This is review message",
                        "verified_purchase": true,
                        "approved": true,
                        "ip_address": "70.27.93.204",
                        "created_at": "2021-01-13 00:00:00",
                        "updated_at": "2021-02-28 01:29:48",
                        "shop_name": "ankit-dev-2",
                        "shopify_product_id": "6012666839204",
                        "subscriber_id": null,
                        "product_title": "6012666839204",
                        "images": [
                            {
                                "id": 25,
                                "review_id": "32",
                                "created_at": "2021-02-22 21:52:52",
                                "updated_at": "2021-02-22 21:52:52",
                                "full_path": new EmailDashboardAPIs().getFrontEndApiBaseURL() + "/assets/images/review_3.jpg"
                            },
                        ],
                        "product": null
                    },

                    {
                        "id": 32,
                        "uid": "603427b47ca18",
                        "shop_id": "2",
                        "customer_id": "3",
                        "stars": "2",
                        "reviewer_email": "abc@gmail.com",
                        "reviewer_name": "Patricia Gonzalez",
                        "title": "Title",
                        "message": "This is review message",
                        "verified_purchase": true,
                        "approved": true,
                        "ip_address": "70.27.93.204",
                        "created_at": "2021-01-13 00:00:00",
                        "updated_at": "2021-02-28 01:29:48",
                        "shop_name": "ankit-dev-2",
                        "shopify_product_id": "6012666839204",
                        "subscriber_id": null,
                        "product_title": "6012666839204",
                        "images": [
                            {
                                "id": 25,
                                "review_id": "32",
                                "created_at": "2021-02-22 21:52:52",
                                "updated_at": "2021-02-22 21:52:52",
                                "full_path": new EmailDashboardAPIs().getFrontEndApiBaseURL() + "/assets/images/review_4.jpg"
                            },
                        ],
                        "product": null
                    },

                    {
                        "id": 32,
                        "uid": "603427b47ca18",
                        "shop_id": "2",
                        "customer_id": "3",
                        "stars": "5",
                        "reviewer_email": "abc@gmail.com",
                        "reviewer_name": "Betty",
                        "title": "Title",
                        "message": "This is review message",
                        "verified_purchase": true,
                        "approved": true,
                        "ip_address": "70.27.93.204",
                        "created_at": "2021-01-13 00:00:00",
                        "updated_at": "2021-02-28 01:29:48",
                        "shop_name": "ankit-dev-2",
                        "shopify_product_id": "6012666839204",
                        "subscriber_id": null,
                        "product_title": "6012666839204",
                        "images": [],
                        "product": null
                    },

                ],
                "first_page_url": process.env.REACT_APP_SERVER_PATH+"/shopify_reviews/listing?page=1",
                "from": 1,
                "last_page": 3,
                "last_page_url": process.env.REACT_APP_SERVER_PATH+"/shopify_reviews/listing?page=3",
                "next_page_url": process.env.REACT_APP_SERVER_PATH+"/shopify_reviews/listing?page=2",
                "path": process.env.REACT_APP_SERVER_PATH+"/shopify_reviews/listing",
                "per_page": "20",
                "prev_page_url": null,
                "to": 20,
                "total": 47
            },
            statusCode: 200,
        } : undefined
    )
    const [open, setOpen] = React.useState(false);
    const [dialogOpen, setDialogOpen] = React.useState(false);
    const [loadingReviews, setLoadingReviews] = useState<boolean>(false);
    const loadSummary = useCallback(() => {
        if (meta_data) {
            new ReviewApis().get_summary(
                meta_data.client_id,
                meta_data.product_id,
                meta_data.shop_name,
            ).then((res) => {
                if (isMounted.current) {
                    if (ReviewApis.hasError(res)) {

                    } else {
                        setReviewStats(res)
                    }
                }

            })
        }
    }, [meta_data, isMounted])
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const loadReviews = useCallback(() => {
        setLoadingReviews(true)
        if (meta_data) {
            new ReviewApis().embedShopifyReviews(
                meta_data.client_id,
                meta_data.product_id,
                meta_data.shop_name,
                query
            ).then((res) => {
                if (isMounted.current) {
                    if (ReviewApis.hasError(res)) {

                    } else {
                        setReviewsResponse(res)
                        setLoadingReviews(false)
                    }
                }
            })
        }
    }, [meta_data, query, isMounted])
    useEffect(() => {
        if (meta_data) {
            loadSummary()
        }
    }, [loadSummary, meta_data])
    useEffect(() => {
        if (meta_data) {
            loadReviews()
        }
    }, [loadReviews, query, meta_data]);

    const [addReviewStep, setAddReviewStep] = useState<number>();

    const handleClose = () => {
        setOpen(false);
    };
    const handleDialogClose = () => {
        setDialogOpen(false);
    };
    const handleDialogOpen = () => {
        setDialogOpen(true);
    };
    const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        setQuery((prevState: any) => {
            return {...prevState, filter_stars: event.target.value, page: 1}
        })
    };

    const handleOpen = () => {
        setOpen(true);
    };

    const hidden = useMediaQuery((theme: any) => theme.breakpoints.down('sm'));

    if (!reviewStats) return null;


    return <div className={summaryClasses.review_root_main}>
        <Container style={{paddingTop: "48px"}}>
            <Box className={summaryClasses.review_root}>
                {
                    reviewStats && <Box className={summaryClasses.review_state_wrapper} paddingBottom={1}>
                        <Grid container spacing={2} justifyContent={"space-between"}>
                            <Grid item md={6} xs={12}>
                                <Grid container spacing={1}>
                                    <Grid item xs={12} sm={6} md={6}>
                                        <Box display="flex">
                                            <Box p={1}>
                                                <Box p={1} className={summaryClasses.review_state_average_score_box}
                                                     borderRadius={"2px"}>
                                                    <Typography
                                                        className={summaryClasses.review_state_average_score_box_text}>
                                                        {parseFloat(reviewStats.average_score.toString()).toFixed(1)}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                            <Box p={1}>
                                                <Box display={"flex"} flexDirection={"column"}>
                                                    <Box>
                                                        <RatingStars star={reviewStats.average_score}
                                                                     starColor={starColors}
                                                                     starSize={starSize}/>
                                                    </Box>
                                                    <Box>
                                                        <Typography className={summaryClasses.review_state_rating_text}>Based
                                                            on {reviewStats.total_reviews} reviews</Typography>
                                                    </Box>
                                                </Box>
                                            </Box>

                                        </Box>
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={6}>
                                        <Box className={summaryClasses.review_state_rating_wrapper}>
                                            <Box display={"flex"} flexDirection={"column"}>
                                                {
                                                    [reviewStats.stars_5, reviewStats.stars_4, reviewStats.stars_3, reviewStats.stars_2, reviewStats.stars_1].map((r, index) => {
                                                        let total = (reviewStats && reviewStats.total_reviews) || 1;
                                                        return <Box display={"flex"} width={"100%"} key={index}
                                                                    alignItems={"center"} p={0.5}
                                                                    className={css.ratingItem} onClick={() => {
                                                            setQuery((prevState: any) => {
                                                                return {
                                                                    ...prevState,
                                                                    filter_stars: (10 - (index + 5)).toString(),
                                                                    page: 1
                                                                }
                                                            })
                                                        }}>
                                                            <Typography
                                                                className={`${css.ratingItemChild} ${summaryClasses.primary_text_color}`}>{10 - (index + 5)}</Typography>
                                                            <StarRateIcon
                                                                className={r === 0 ? summaryClasses.inactive_star_color : summaryClasses.active_star_color} style={{width: starSize.sizeSmall + starSize.units, height: starSize.sizeSmall + starSize.units}}/>
                                                            <Box width={"100%"}
                                                                 bgcolor={starColors.inactive}
                                                                 m={0.5}
                                                                 height={"0.22em"}
                                                                 borderRadius={"1.125em"}>
                                                                <Box width={`${r * 100 / total}%`}
                                                                     className={summaryClasses.active_star_color_as_bg}
                                                                     height={"100%"}
                                                                     borderRadius={"1.125em"}>
                                                                </Box>
                                                            </Box>
                                                            <Typography
                                                                className={`${css.ratingItemChild} ${summaryClasses.inactive_star_color}`}>{r}</Typography>
                                                        </Box>
                                                    })
                                                }
                                            </Box>
                                        </Box>
                                    </Grid>
                                </Grid>
                            </Grid>
                            {
                                !hidden && <Grid item md={6} sm={12}>
                                    <Box display={"flex"} justifyContent={"flex-end"}>
                                        <Button className={summaryClasses.review_button} variant={"contained"}
                                                color={"primary"}
                                                onClick={handleDialogOpen}>
                                            Write a review
                                        </Button>
                                    </Box>
                                </Grid>
                            }

                        </Grid>
                    </Box>
                }

                {
                    (
                        (reviewsResponse && reviewsResponse.items && (reviewsResponse.items.last_page > 1 || reviewsResponse.items.data.length > 0))
                        ||
                        query.filter_stars !== "0"
                        || ui_testing
                    ) && <Box marginBottom={2}>
                        <Grid container spacing={1}>
                            <Grid item xs={12}>
                                <Box display="flex" justifyContent={"flex-end"}>
                                    <FormControl className={summaryClasses.review_formControl}>
                                        <InputLabel id="rating-controlled-open-select-label"
                                                    className={summaryClasses.primary_text_color}>Rating</InputLabel>
                                        <Select
                                            labelId="rating-controlled-open-select-label"
                                            id="rating-controlled-open-select-label"
                                            open={open}
                                            onClose={handleClose}
                                            onOpen={handleOpen}
                                            value={query.filter_stars}
                                            className={summaryClasses.primary_text_color}
                                            onChange={handleChange}
                                        >
                                            <MenuItem value={"0"}>
                                                All
                                            </MenuItem>
                                            <MenuItem value={"5"}>5</MenuItem>
                                            <MenuItem value={"4"}>4</MenuItem>
                                            <MenuItem value={"3"}>3</MenuItem>
                                            <MenuItem value={"2"}>2</MenuItem>
                                            <MenuItem value={"1"}>1</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Box>
                            </Grid>
                            {
                                !loadingReviews && reviewsResponse &&
                                reviewsResponse.items &&
                                reviewsResponse.items.data && reviewsResponse.items.data.length > 0 && <>
                                    <Grid item xs={12}>
                                        <Box marginBottom={1}>
                                            <ResponsiveMasonry
                                                columnsCountBreakPoints={{200: 1, 350: 2, 750: 3, 900: 5}}>
                                                <Masonry columnsCount={3} gutter="10px">
                                                    {
                                                        reviewsResponse &&
                                                        reviewsResponse.items &&
                                                        reviewsResponse.items.data &&
                                                        reviewsResponse.items.data
                                                            .map((review, index) => {
                                                                return <Box key={index}>
                                                                    <Box className={summaryClasses.review_item_wrapper}>
                                                                        <Box display={"flex"} flexDirection={"column"}>
                                                                            {review.images && review.images.length > 0 &&
                                                                            <Box marginTop={"-1px"}>
                                                                                <img src={review.images[0].full_path}
                                                                                     alt={"Review"}
                                                                                     style={{
                                                                                         width: "100%",
                                                                                         objectFit: "cover",
                                                                                         margin: 0
                                                                                     }}/>
                                                                            </Box>
                                                                            }
                                                                            <Box display={"flex"}
                                                                                 flexDirection={"column"}
                                                                                 p={1}>
                                                                                <div>
                                                                                    <Typography
                                                                                        className={`${summaryClasses.primary_text_color} ${summaryClasses.name_text}`}>
                                                                                        {review.reviewer_name}
                                                                                    </Typography>
                                                                                </div>
                                                                                <div>
                                                                                    <Typography
                                                                                        className={`${summaryClasses.primary_text_color} ${summaryClasses.date_text}`}>
                                                                                        {dayjs(review.created_at).format('MMM D, YYYY')}
                                                                                    </Typography>
                                                                                </div>
                                                                                <div>
                                                                                    <RatingStars star={review.stars}
                                                                                                 starColor={starColors}
                                                                                                 starSize={starSize}/>
                                                                                </div>
                                                                                <div>
                                                                                    <Typography
                                                                                        className={`${summaryClasses.primary_text_color} ${summaryClasses.name_text}`}>
                                                                                        {review.title}
                                                                                    </Typography>
                                                                                </div>
                                                                                <div>
                                                                                    <Typography
                                                                                        className={`${summaryClasses.primary_text_color} ${summaryClasses.secondary_font_family}`}>
                                                                                        {review.message}
                                                                                    </Typography>
                                                                                </div>
                                                                            </Box>

                                                                        </Box>
                                                                    </Box>
                                                                </Box>
                                                            })
                                                    }

                                                </Masonry>
                                            </ResponsiveMasonry>
                                        </Box>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Box display={"flex"} justifyContent={"center"}>
                                            {
                                                reviewsResponse.items.last_page > 1 &&
                                                <Pagination count={reviewsResponse.items.last_page}
                                                            page={query.page}
                                                            className={summaryClasses.pagination_ui}
                                                            onChange={((event: any, page: any) => {
                                                                setQuery((prevState: any) => {
                                                                    return {...prevState, page: page}
                                                                })
                                                            })}

                                                            renderItem={(item) => <PaginationItem {...item}
                                                                                                  classes={{selected: summaryClasses.pagination_ui_selected}}/>}
                                                />
                                            }
                                        </Box>
                                    </Grid>
                                </>
                            }

                        </Grid>

                        {
                            !loadingReviews && reviewsResponse &&
                            reviewsResponse.items &&
                            reviewsResponse.items.data && reviewsResponse.items.data.length === 0 &&
                            <Box marginBottom={2} display={"flex"} alignItems={"center"} flexDirection={"column"}>
                                <Box p={2}>
                                    <Typography variant={"h5"} className={summaryClasses.primary_text_color}>
                                        No reviews found
                                    </Typography>
                                </Box>
                                <Box p={1}>
                                    <Button variant={"contained"} color={"primary"} onClick={() => {
                                        setQuery((prevState: any) => {
                                            return {...prevState, filter_stars: "0", page: 1}
                                        })
                                    }} className={summaryClasses.review_button}>
                                        Show All
                                    </Button>
                                </Box>
                            </Box>
                        }
                    </Box>
                }
                {
                    ((!loadingReviews && reviewsResponse && reviewsResponse.items && !(reviewsResponse.items.last_page > 1 || reviewsResponse.items.data.length > 0) &&
                        query.filter_stars === "0") || ui_testing) &&
                    <Box marginBottom={2} display={"flex"} alignItems={"center"} flexDirection={"column"}>
                        <Box p={2}>
                            <Typography variant={"h5"}
                                        className={`${summaryClasses.primary_text_color} ${summaryClasses.bold_text}`}>
                                Be the first to write a review
                            </Typography>
                        </Box>
                        <Box p={1}>
                            <Button className={summaryClasses.review_button} variant={"contained"} color={"primary"}
                                    onClick={handleDialogOpen}>
                                Write a review
                            </Button>
                        </Box>
                    </Box>
                }


            </Box>
            <Dialog fullScreen={fullScreen}
                    open={dialogOpen}

                    onClose={handleDialogClose} maxWidth={"xs"}
                    fullWidth>
                <Box minWidth={"100%"} className={summaryClasses.add_dialog_wrapper}>
                    <Formik
                        initialValues={{
                            first_name: "",
                            last_name: "",
                            reviewer_email: "",
                            image: "",
                            stars: "",
                            form_step: "1",
                            title: "",
                            message: "",
                            progress: 0,
                            shopify_product_id: meta_data && meta_data.product_id,
                            shop_name: meta_data && meta_data.shop_name
                        }}
                        onSubmit={(values: any, helpers) => {
                            if (!ui_testing) {
                                values["reviewer_name"] = values.first_name + " " + values.last_name;

                                new ReviewApis().storeFromReviewer(values, progressEvent => {
                                    try {
                                        const percentage = Math.round(progressEvent.loaded / (progressEvent.total ?? 0) * 100);
                                        helpers.setFieldValue("progress", percentage)
                                    } catch (e) {

                                    }
                                }).then((res) => {
                                    if (isMounted.current) {
                                        if (ReviewApis.hasError(res)) {
                                            helpers.setFieldValue("progress", 0);
                                        } else {
                                            loadSummary()
                                            loadReviews()
                                            helpers.resetForm()
                                            helpers.setFieldValue("form_step", "5")
                                        }
                                        helpers.setSubmitting(false);
                                    }


                                })
                            } else {

                                helpers.resetForm()
                                helpers.setFieldValue("progress", 0);
                                helpers.setFieldValue("form_step", "5")
                                helpers.setSubmitting(false);
                            }

                        }}
                        validationSchema={yup.object({
                            first_name: yup.string().required("Please enter first name"),
                            last_name: yup.string().required("Please enter last name"),
                            image: yup.mixed(),
                            reviewer_email: yup
                                .string()
                                .email("Please enter valid email")
                                .required("Please enter email"),
                            title: yup
                                .string()
                                .required("Please enter title"),
                            message: yup
                                .string()
                                .required("Please enter message"),

                        })}
                    >
                        {props => {
                            return <form onSubmit={props.handleSubmit}>
                                {
                                    !props.isSubmitting && <>
                                        {
                                            props.values.form_step === "1" && <>
                                                <DialogTitle
                                                    classes={{
                                                        closeButton: summaryClasses.dialog_button
                                                    }}
                                                    id="customized-dialog-title"
                                                    onClose={handleDialogClose}>
                                                    <Box paddingX={5}>
                                                        <Typography align={"center"}
                                                                    className={summaryClasses.primary_text_color}>
                                                            HOW WOULD YOU RATE THIS ITEM?
                                                        </Typography>
                                                    </Box>

                                                </DialogTitle>
                                                <DialogContent>
                                                    <Grow in={props.values.form_step === "1"} timeout={600}>
                                                        <Box display={"flex"} flexDirection={"column"}
                                                             alignItems={"center"}
                                                             padding={1}>
                                                            <Box p={1} width={"100%"}>

                                                                <Button className={summaryClasses.addReviewButton}
                                                                        onClick={() => {
                                                                            props.setFieldValue("stars", "5");
                                                                            props.setFieldValue("form_step", "2");

                                                                        }}>
                                                                    <Box display={"flex"} width={"100%"}
                                                                         justifyContent={"space-between"}>
                                                                        <RatingStars star={5} starColor={starColors} starSize={starSize}/>
                                                                        <Box flexGrow={1}>
                                                                            <Typography
                                                                                className={summaryClasses.primary_text_color}>
                                                                                EXCELLENT
                                                                            </Typography>
                                                                        </Box>


                                                                    </Box>
                                                                </Button>
                                                            </Box>
                                                            <Box p={1} width={"100%"}>
                                                                <Button className={summaryClasses.addReviewButton}
                                                                        onClick={() => {
                                                                            props.setFieldValue("stars", "4");
                                                                            props.setFieldValue("form_step", "2");

                                                                        }}>
                                                                    <Box display={"flex"} width={"100%"}
                                                                         justifyContent={"space-between"}>
                                                                        <RatingStars star={4} starColor={starColors} starSize={starSize}/>
                                                                        <Box flexGrow={1}>
                                                                            <Typography
                                                                                className={summaryClasses.primary_text_color}>
                                                                                JUST WOW
                                                                            </Typography>
                                                                        </Box>


                                                                    </Box>
                                                                </Button>
                                                            </Box>
                                                            <Box p={1} width={"100%"}>
                                                                <Button className={summaryClasses.addReviewButton}
                                                                        onClick={() => {
                                                                            props.setFieldValue("stars", "3");
                                                                            props.setFieldValue("form_step", "2");

                                                                        }}>
                                                                    <Box display={"flex"} width={"100%"}
                                                                         justifyContent={"space-between"}>
                                                                        <RatingStars star={3} starColor={starColors} starSize={starSize}/>
                                                                        <Box flexGrow={1}>
                                                                            <Typography
                                                                                className={summaryClasses.primary_text_color}>
                                                                                I LIKE IT
                                                                            </Typography>
                                                                        </Box>


                                                                    </Box></Button>
                                                            </Box>
                                                            <Box p={1} width={"100%"}>
                                                                <Button className={summaryClasses.addReviewButton}
                                                                        onClick={() => {
                                                                            props.setFieldValue("stars", "2");
                                                                            props.setFieldValue("form_step", "2");

                                                                        }}>
                                                                    <Box display={"flex"} width={"100%"}
                                                                         justifyContent={"space-between"}>
                                                                        <RatingStars star={2} starColor={starColors} starSize={starSize}/>
                                                                        <Box flexGrow={1}>
                                                                            <Typography
                                                                                className={summaryClasses.primary_text_color}>
                                                                                I DON'T LIKE IT
                                                                            </Typography>
                                                                        </Box>
                                                                    </Box>
                                                                </Button>
                                                            </Box>
                                                            <Box p={1} width={"100%"}>
                                                                <Button className={summaryClasses.addReviewButton}
                                                                        onClick={() => {
                                                                            props.setFieldValue("stars", "1");
                                                                            props.setFieldValue("form_step", "2");

                                                                        }}>
                                                                    <Box display={"flex"} width={"100%"}
                                                                         justifyContent={"space-between"}>
                                                                        <RatingStars star={1} starColor={starColors} starSize={starSize}/>
                                                                        <Box flexGrow={1}>
                                                                            <Typography align="center"
                                                                                        className={summaryClasses.primary_text_color}>
                                                                                I HATE IT
                                                                            </Typography>
                                                                        </Box>


                                                                    </Box>
                                                                </Button>
                                                            </Box>
                                                        </Box>
                                                    </Grow>
                                                </DialogContent>
                                                <DialogActions>
                                                    <Button onClick={handleDialogClose}
                                                            className={summaryClasses.dialog_button}
                                                    >
                                                        Close
                                                    </Button>
                                                </DialogActions>
                                            </>
                                        }
                                        {
                                            props.values.form_step === "2" && <>
                                                <DialogTitle
                                                    classes={{
                                                        closeButton: summaryClasses.dialog_button
                                                    }}
                                                    id="customized-dialog-title" onClose={handleDialogClose}>
                                                    <Typography align={"center"}
                                                                className={summaryClasses.primary_text_color}>
                                                        SHOW IT OFF
                                                    </Typography>
                                                </DialogTitle>
                                                <DialogContent style={{height: "100%"}}>
                                                    <Grow in={props.values.form_step === "2"} timeout={600}>
                                                        <Box display={"flex"} flexDirection={"column"}
                                                             alignItems={"center"}>
                                                            <Box>
                                                                <FieldArray name={"images"}>
                                                                    {
                                                                        props1 => {
                                                                            return <DropzoneArea
                                                                                dropzoneClass={summaryClasses.dropZone}
                                                                                acceptedFiles={['image/*']}
                                                                                maxFileSize={100000000}
                                                                                filesLimit={3}
                                                                                onChange={(files: any) => {
                                                                                    props.setFieldValue("images", files)
                                                                                }}
                                                                                previewGridClasses={{
                                                                                    container: summaryClasses.review_root,
                                                                                    image: summaryClasses.dropZoneImage
                                                                                }}
                                                                                previewChipProps={{
                                                                                    size: "small",
                                                                                    style: {width: "10px"}
                                                                                }}
                                                                                previewGridProps={{
                                                                                    container: {spacing: 2},
                                                                                    item: {md: 4,}

                                                                                }}
                                                                                classes={{
                                                                                    root: summaryClasses.review_root
                                                                                }}

                                                                                initialFiles={props.values.images}
                                                                            />
                                                                        }
                                                                    }
                                                                </FieldArray>

                                                            </Box>
                                                        </Box>
                                                    </Grow>
                                                </DialogContent>
                                                <DialogActions>
                                                    <Box display={"flex"} justifyContent={"space-between"}
                                                         width={"100%"}>
                                                        <Button className={summaryClasses.dialog_button}
                                                                onClick={() => {
                                                                    props.setFieldValue("form_step", "1");
                                                                }} color="primary">
                                                            Back
                                                        </Button>
                                                        {
                                                            (props.values.images && props.values.images.length === 0) &&
                                                            <Button className={summaryClasses.dialog_button}
                                                                    onClick={() => {
                                                                        props.setFieldValue("form_step", "3");
                                                                    }}>
                                                                Skip
                                                            </Button>
                                                        }
                                                        {
                                                            props.values.images && props.values.images.length > 0 &&
                                                            <Button className={summaryClasses.dialog_button}
                                                                    onClick={() => {
                                                                        props.setFieldValue("form_step", "3");
                                                                    }}>
                                                                Next
                                                            </Button>
                                                        }
                                                    </Box>

                                                </DialogActions>
                                            </>
                                        }
                                        {
                                            props.values.form_step === "3" && <>
                                                <DialogTitle
                                                    classes={{
                                                        closeButton: summaryClasses.dialog_button
                                                    }}
                                                    id="customized-dialog-title" onClose={handleDialogClose}>
                                                    <Typography align={"center"}
                                                                className={summaryClasses.primary_text_color}>

                                                        TELL US MORE!
                                                    </Typography>
                                                </DialogTitle>
                                                <DialogContent>
                                                    <Grow in={props.values.form_step === "3"} timeout={600}>
                                                        <Box width={"100%"}>

                                                            <Grid container spacing={1}>
                                                                <Grid item xs={12}>
                                                                    <Box>
                                                                        <TextField
                                                                            placeholder={"Your message title goes here"}
                                                                            name="title"
                                                                            value={props.values.title}
                                                                            onChange={props.handleChange}
                                                                            label="Title"
                                                                            className={summaryClasses.dialog_textField}
                                                                            variant="outlined"
                                                                            fullWidth
                                                                            helperText={
                                                                                (props.touched && props.touched.title)
                                                                                &&
                                                                                (props.errors && props.errors.title)
                                                                            }
                                                                            error={(props.touched && props.touched.title)
                                                                            &&
                                                                            !!(props.errors && props.errors.title)}
                                                                        />
                                                                    </Box>
                                                                </Grid>
                                                                <Grid item xs={12}>
                                                                    <Box>
                                                                        <TextField
                                                                            placeholder={"Your message goes here"}
                                                                            name="message"

                                                                            className={summaryClasses.dialog_textField}
                                                                            value={props.values.message}
                                                                            onChange={props.handleChange}
                                                                            label="Message"
                                                                            variant="outlined"
                                                                            fullWidth
                                                                            multiline
                                                                            rows={4}
                                                                            helperText={
                                                                                (props.touched && props.touched.message)
                                                                                &&
                                                                                (props.errors && props.errors.message)
                                                                            }
                                                                            error={(props.touched && props.touched.message)
                                                                            &&
                                                                            !!(props.errors && props.errors.message)}
                                                                        />
                                                                    </Box>
                                                                </Grid>
                                                            </Grid>
                                                        </Box>
                                                    </Grow>
                                                </DialogContent>
                                                <DialogActions>
                                                    <Box display={"flex"} justifyContent={"space-between"}
                                                         width={"100%"}>
                                                        <Button className={summaryClasses.dialog_button}
                                                                onClick={() => {
                                                                    props.setFieldValue("form_step", "2");
                                                                }} color="primary">
                                                            Back
                                                        </Button>

                                                        <Button className={summaryClasses.dialog_button} color="primary"
                                                                onClick={() => {
                                                                    props.setFieldValue("form_step", "4");
                                                                }}
                                                                disabled={!!(props.errors
                                                                    &&
                                                                    props.errors.message
                                                                ) ||
                                                                !!(props.errors
                                                                    &&
                                                                    props.errors.title
                                                                )
                                                                }
                                                        >
                                                            Next
                                                        </Button>
                                                    </Box>

                                                </DialogActions>
                                            </>
                                        }
                                        {
                                            props.values.form_step === "4" && <>
                                                <DialogTitle
                                                    classes={{
                                                        closeButton: summaryClasses.dialog_button
                                                    }}
                                                    id="customized-dialog-title" onClose={handleDialogClose}>
                                                    <Typography align={"center"}
                                                                className={summaryClasses.primary_text_color}>
                                                        About You
                                                    </Typography>
                                                </DialogTitle>
                                                <DialogContent>
                                                    <Grow in={props.values.form_step === "4"} timeout={600}>
                                                        <Grid container spacing={1}>
                                                            <Grid item xs={6}>
                                                                <Box>
                                                                    <TextField
                                                                        name="first_name"
                                                                        className={summaryClasses.dialog_textField}
                                                                        value={props.values.first_name}
                                                                        onChange={props.handleChange}
                                                                        label="F.Name"
                                                                        variant="outlined"
                                                                        fullWidth
                                                                        helperText={
                                                                            (props.touched && props.touched.first_name)
                                                                            &&
                                                                            (props.errors && props.errors.first_name)
                                                                        }
                                                                        error={(props.touched && props.touched.first_name)
                                                                        &&
                                                                        !!(props.errors && props.errors.first_name)}
                                                                    />
                                                                </Box>
                                                            </Grid>
                                                            <Grid item xs={6}>
                                                                <Box>
                                                                    <TextField
                                                                        name="last_name"

                                                                        className={summaryClasses.dialog_textField}

                                                                        value={props.values.last_name}
                                                                        onChange={props.handleChange}
                                                                        label="L.Name"
                                                                        variant="outlined"
                                                                        fullWidth
                                                                        helperText={
                                                                            (props.touched && props.touched.last_name)
                                                                            &&
                                                                            (props.errors && props.errors.last_name)
                                                                        }
                                                                        error={(props.touched && props.touched.last_name)
                                                                        &&
                                                                        !!(props.errors && props.errors.last_name)}
                                                                    />
                                                                </Box>
                                                            </Grid>
                                                            <Grid item xs={12}>
                                                                <Box>
                                                                    <TextField
                                                                        name="reviewer_email"

                                                                        className={summaryClasses.dialog_textField}
                                                                        value={props.values.reviewer_email}
                                                                        onChange={props.handleChange}
                                                                        label="Email"
                                                                        variant="outlined"
                                                                        fullWidth
                                                                        helperText={
                                                                            (props.touched && props.touched.reviewer_email)
                                                                            &&
                                                                            (props.errors && props.errors.reviewer_email)
                                                                        }
                                                                        error={(props.touched && props.touched.reviewer_email)
                                                                        &&
                                                                        !!(props.errors && props.errors.reviewer_email)}
                                                                    />
                                                                </Box>
                                                            </Grid>
                                                        </Grid>
                                                    </Grow>
                                                </DialogContent>
                                                <DialogActions>
                                                    <Box display={"flex"} justifyContent={"space-between"}
                                                         width={"100%"}>
                                                        <Button onClick={() => {
                                                            props.setFieldValue("form_step", "3");
                                                        }}
                                                                className={summaryClasses.dialog_button}
                                                                color="primary">
                                                            Back
                                                        </Button>
                                                        <Button color="primary"
                                                                className={summaryClasses.dialog_button} type="submit"
                                                                disabled={!!(props.errors
                                                                    &&
                                                                    props.errors.first_name
                                                                ) ||
                                                                !!(props.errors
                                                                    &&
                                                                    props.errors.last_name
                                                                ) ||
                                                                !!(props.errors
                                                                    &&
                                                                    props.errors.reviewer_email
                                                                )
                                                                }>
                                                            Submit
                                                        </Button>
                                                    </Box>

                                                </DialogActions>
                                            </>
                                        }
                                        {
                                            props.values.form_step === "5" && <>
                                                <DialogTitle
                                                    classes={{
                                                        closeButton: summaryClasses.dialog_button
                                                    }}
                                                    id="customized-dialog-title" onClose={handleDialogClose}>
                                                    <Typography align={"center"}
                                                                className={summaryClasses.primary_text_color}>
                                                        Thank You
                                                    </Typography>
                                                </DialogTitle>
                                                <DialogContent>
                                                    <Grow in={props.values.form_step === "5"} timeout={600}>
                                                        <Box paddingY={5}>
                                                            <Typography className={summaryClasses.primary_text_color}>
                                                                By submitting, I acknowledge the Privacy Policy and that
                                                                my
                                                                review will be publicly
                                                                posted and shared online
                                                            </Typography>
                                                        </Box>

                                                    </Grow>
                                                </DialogContent>
                                                <DialogActions>
                                                    <Button color="primary" onClick={handleDialogClose}
                                                            className={summaryClasses.dialog_button}>
                                                        Close
                                                    </Button>
                                                </DialogActions>
                                            </>
                                        }
                                    </>
                                }


                                {
                                    props.isSubmitting && <>
                                        <DialogTitle
                                            classes={{
                                                closeButton: summaryClasses.dialog_button
                                            }}
                                            id="customized-dialog-title" onClose={handleDialogClose}>
                                            <Typography align={"center"}>
                                                Thank you
                                            </Typography>
                                        </DialogTitle>
                                        <DialogContent>
                                            <Box className={summaryClasses.review_root} paddingY={5}>
                                                <LinearProgressWithLabel variant="determinate"
                                                                         value={props.values.progress}/>
                                            </Box>
                                        </DialogContent>
                                    </>
                                }

                            </form>
                        }}
                    </Formik>
                </Box>

            </Dialog>
        </Container>
    </div>
}

function LinearProgressWithLabel(props: LinearProgressProps & { value: number }) {
    return (
        <Box display="flex" alignItems="center">
            <Box width="100%" mr={1}>
                <LinearProgress variant="determinate" {...props} />
            </Box>
            <Box minWidth={35}>
                <Typography variant="body2" color="textSecondary">{`${Math.round(
                    props.value,
                )}%`}</Typography>
            </Box>
        </Box>
    );
}
