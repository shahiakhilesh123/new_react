import React from "react";
import {Col, Form, Row, Spinner} from "react-bootstrap";
import {FormControlLabel, Grid, Switch} from "@material-ui/core";
import google_play_store from "../../assets/images/play_store.png"
import {AiFillDollarCircle, AiOutlineFall} from "react-icons/ai";
import CustomMenu from "../CustomMenu/CustomMenu";

interface HeadingColProps {
    title: string,
    description?: any,
    enable_button_text?: string
    enable_button_text_data_tut?: string
    "data-tut"?: string,
    checked?: boolean
    onCheckChanged?: (value: boolean) => void,
    chat_ads?: boolean,
    onHelpClick?: any
    content_between_search_add?: any
    noSearchFilter?: any
    onKeywordChange?: any,
    right?:any
}

function HeadingCol(props: HeadingColProps) {
    return (<Col md="12" className="mt-1 heading-col" data-tut={props["data-tut"]}>
        <Row>
            {
                props.title && <Col md={(props && !!props.content_between_search_add)?2:true} sm={12} className="d-flex align-items-center">
                    <div>
                        <div className="d-flex mt-3 ">
                            <h5 className="app-dark-color u500" style={{letterSpacing: "0.5px"}}>{props.title} </h5>
                            {
                                props.onHelpClick && <>
                                    <div className="p-1"/>
                                    <a className="app-link" onClick={() => {
                                        props.onHelpClick()
                                    }}>Learn how?</a></>
                            }
                        </div>
                        {
                            props.description && <p className="app-dark-color dashboard-data u300 m-0">{props.description}</p>
                        }

                        {
                            props.chat_ads && <div className="d-flex align-items-center">
                                <a href={"https://play.google.com/store/apps/details?id=com.emailwish.app"} target="_blank">
                                    <img src={google_play_store} style={{height: "60px"}}
                                            alt={"Emailwish on Google Playstore"}/>

                                </a>
                            </div>
                        }
                    </div>
                </Col>
            }
            
            {
                props && props.content_between_search_add && <Col md className="mt-3">
                    {
                        props && props.content_between_search_add
                    }
                </Col>
            }
            <Col md={"auto"} sm={12} className="d-flex justify-content-end">
                {
                    props.right && props.right
                }
                
                {
                    props.enable_button_text && props.enable_button_text !== "" && (props.checked === undefined ?
                        <Spinner animation="border"/> : <FormControlLabel
                            data-tut={props.enable_button_text_data_tut}
                            value="start"
                            control={<Switch color="primary"
                                             checked={props.checked}
                                             onChange={(e) => {
                                                 props.onCheckChanged && props.onCheckChanged(e.target.checked)
                                             }}/>}
                            label={props.enable_button_text}
                            labelPlacement="start"
                        />)
                }
            </Col>
        </Row>
    </Col>);
}

export default HeadingCol;
