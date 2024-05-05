import React, {useContext} from 'react';
import {iPopupContext, PopupContext, PopupProps, usePopupStyles} from "../popup_props/props";
import styles from "../styles.module.css";
import cn from "classnames";
import classNames from "classnames";

import {Box, Button, Grid, Typography} from "@material-ui/core";

export default function Popup8(props: PopupProps) {


    const popupContext: iPopupContext = useContext(PopupContext);
    const classes = usePopupStyles({...props, ...popupContext});
    return (
        <Box className={classes.root} onClick={() => {
            if (props.creationMode) {
                props.onBackgroundSelected && props.onBackgroundSelected();
            }
        }}>
            <Box height={"100%"} display={"flex"} flexDirection={"column"}>
                <Box height={"25%"}>
                    <div
                        onClick={(e) => {
                            if (props.creationMode) {
                                e.stopPropagation();
                                props.onImageSelected && props.onImageSelected();

                            }
                        }}
                        className={cn(
                            props.creationMode ? styles.creation_mode_image : "",
                            classes.image
                        )}
                    />
                </Box>
                <Box p={2} height={"75%"}>
                    <div className={classes.formParent}>
                        <form style={{width: "100%", height: "100%"}}
                              onSubmit={(e) => {
                                  e.preventDefault();
                                  if (!props.creationMode) {
                                      props.onPositiveButtonClicked && props.onPositiveButtonClicked(e, props.hasForm, props.positiveButtonLink);
                                  } else {
                                      e.stopPropagation();
                                      props.onButtonSelected && props.onButtonSelected();
                                  }
                              }}>
                            <Grid container justifyContent="center">
                                {!props.hideTitle && <Grid item xs={12} style={{width: "100%", height: "100%"}}>
                                    <Typography className={cn(
                                        props.creationMode ? styles.creation_mode_text : "",
                                        classes.title
                                    )}
                                                onClick={(e) => {
                                                    if (props.creationMode) {
                                                        e.stopPropagation();
                                                        props.onTextSelected && props.onTextSelected();
                                                    }
                                                }}>
                                        {props.title}
                                    </Typography>
                                </Grid>
                                }
                                {!props.hideBody && <Grid item xs={12}>
                                    <Typography className={cn(
                                        props.creationMode ? styles.creation_mode_text : "",
                                        classes.body
                                    )}
                                                onClick={(e) => {
                                                    if (props.creationMode) {
                                                        e.stopPropagation();
                                                        props.onTextSelected && props.onTextSelected();
                                                    }
                                                }}>
                                        {props.body}
                                    </Typography>
                                </Grid>
                                }
                                <Grid item xs={12}>

                                    <div className={classes.positiveButtonWrapper}>
                                        <Button
                                            type="submit"
                                            className={classNames(classes.positiveButton, props.creationMode ? styles.creation_mode_button : "")}
                                        >{props.submitting_form ? "Please wait" : props.PositiveButtonText} </Button>
                                    </div>


                                </Grid>
                                {
                                    !props.hideNegativeButton &&
                                    <Grid item xs={12}>
                                        <Box display="flex" justifyContent="center">
                                            <Button
                                                className={classNames(classes.negativeButton, props.creationMode ? styles.creation_mode_button : "", styles.no_background)}
                                                type="button"
                                                onClick={() => {
                                                    props.onNegativeButtonClicked && props.onNegativeButtonClicked()
                                                }}
                                            >{props.NegativeButtonText}</Button>
                                        </Box>
                                    </Grid>
                                }
                                <Grid item xs={12}>
                                    {!props.hideFooter && <Typography className={cn(
                                        props.creationMode ? styles.creation_mode_text : "",
                                        classes.footer
                                    )}
                                                                      onClick={(e) => {
                                                                          if (props.creationMode) {
                                                                              e.stopPropagation();
                                                                              props.onTextSelected && props.onTextSelected();
                                                                          }
                                                                      }}
                                    >
                                        {props.footer}
                                    </Typography>}
                                    <div className={classes.powered_by}>
                                        <Typography className={cn(
                                            classes.powered_by_typo
                                        )}

                                        >
                                            Powered by <a href={"https://emailwish.com"} target={"_blank"}
                                                          className={cn(
                                                              classes.powered_by_typo
                                                          )}
                                                          rel="noopener noreferrer">Emailwish</a>
                                        </Typography>
                                    </div>
                                </Grid>
                            </Grid>
                        </form>
                    </div>

                </Box>
            </Box>
        </Box>
    );
}
