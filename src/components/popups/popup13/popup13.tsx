import React, {useContext} from 'react';
import {iPopupContext, PopupContext, PopupProps, usePopupStyles} from "../popup_props/props";
import styles from "../styles.module.css";
import cn from "classnames";
import classNames from "classnames";

import {Box, Button, Grid, TextField, Typography} from "@material-ui/core";

export default function Popup13(props: PopupProps) {

    const popupContext: iPopupContext = useContext(PopupContext);
    const classes = usePopupStyles({...props, ...popupContext});

    return (
        <Box className={classes.root} onClick={() => {
            if (props.creationMode) {
                props.onBackgroundSelected && props.onBackgroundSelected();
            }
        }}>
            <Box display={"flex"} height={"100%"} className={classes.root_grid}>
                <Box width="50%" className={classes.root_grid_image}>
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
                <Box
                    width={!popupContext.isMobile ? "50%" : "100%"} display="flex" alignItems="center"
                    className={classes.root_grid_form}>
                    <Box p={2} className={classes.formParent}>
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
                            <Grid container justifyContent="center" spacing={1}>
                                {!props.hideTitle && <Grid item xs={12} style={{width: "100%", height: "100%"}}>
                                    <Typography className={cn(
                                        props.creationMode ? styles.creation_mode_text : "",
                                        classes.title
                                    )} onClick={(e) => {
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
                                    <Grid container spacing={1}>
                                        {!props.hideFirstTextFormField &&
                                        <Grid item sm
                                              onClick={(e: any) => {
                                                  if (props.creationMode) {
                                                      e.stopPropagation();
                                                      props.onFormInputSelected && props.onFormInputSelected();
                                                  }
                                              }}>
                                            <TextField
                                                className={classNames(classes.firstFormField, props.creationMode ? styles.creation_mode_text : "", styles.bottom_footer_input)}
                                                fullWidth
                                                inputProps={{className: classNames(classes.firstFormFieldInput)}}
                                                placeholder={props.firstTextFormFieldHint}
                                                type="text" name="first_name"

                                                disabled={props.creationMode}
                                            />
                                        </Grid>}
                                        {!props.hideSecondTextFormField &&
                                        <Grid item sm
                                              onClick={(e: any) => {
                                                  if (props.creationMode) {
                                                      e.stopPropagation();
                                                      props.onFormInputSelected && props.onFormInputSelected();
                                                  }
                                              }}> <TextField
                                            className={classNames(classes.secondFormField, props.creationMode ? styles.creation_mode_text : "", styles.bottom_footer_input)}
                                            inputProps={{className: classNames(classes.secondFormFieldInput)}}
                                            fullWidth

                                            placeholder={props.secondTextFormFieldHint}
                                            type="text" name="last_name"

                                            disabled={props.creationMode}
                                        />
                                        </Grid>
                                        }
                                    </Grid>
                                </Grid>
                                <Grid item xs={12}>
                                    <Grid container spacing={1}>
                                        <Grid item xs={12} onClick={(e: any) => {
                                            if (props.creationMode) {
                                                e.stopPropagation();
                                                props.onFormInputSelected && props.onFormInputSelected();
                                            }
                                        }}> <TextField
                                            className={classNames(classes.thirdFormField, props.creationMode ? styles.creation_mode_text : "", styles.bottom_footer_input)}

                                            type="email" name="email" required
                                            placeholder={props.thirdTextFormFieldHint}

                                            fullWidth

                                            disabled={props.creationMode}
                                        />

                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item xs={12}>
                                    <Box display={"flex"} justifyContent={"center"}>
                                        <div className={classes.positiveButtonWrapper}>
                                            <Button

                                                className={classNames(classes.positiveButton, props.creationMode ? styles.creation_mode_button : "")}
                                                type="submit">{props.submitting_form ? "Please wait" : props.PositiveButtonText} </Button>
                                        </div>
                                    </Box>
                                </Grid>
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
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}
