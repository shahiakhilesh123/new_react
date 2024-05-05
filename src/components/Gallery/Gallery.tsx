import React, {useContext, useEffect, useRef, useState} from "react";
import {GalleryWidgetApiContext} from "../../pages/Popup/Popup.Create";
import PanToolIcon from '@material-ui/icons/PanTool';
import {
    Box,
    Button,
    createStyles,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    LinearProgress,
    Theme
} from "@material-ui/core";
import PopupAPIs from "../../apis/Popup/popup.apis";
import GalleryAPIs, {iGalleryListingResponse} from "../../apis/Gallery/gallery.api";
import {getEmptyApiListingQuery, iApiListingQuery} from "../../types/api";
import {Alert, Col, Row} from "react-bootstrap";
import {makeStyles} from "@material-ui/styles";
import {FileDrop} from 'react-file-drop';
import {NotificationContext} from "../../App";
import {Scrollbar} from "../CustomScroll/ScrollBars";
import useIsMounted from "ismounted";
import {Pagination} from "@material-ui/lab";

export interface GalleryProps {
    openGallery?: boolean,
    HideGallery?: () => void
    onImageSelected?: (address: string) => void,
}

interface TabPanelProps {
    children?: React.ReactNode;
    index: any;
    value: any;
}

function TabPanel(props: TabPanelProps) {
    const {children, value, index, ...other} = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`scrollable-auto-tabpanel-${index}`}
            aria-labelledby={`scrollable-auto-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box p={3}>
                    {children}
                </Box>
            )}
        </div>
    );
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-around',
            overflow: 'hidden',
            backgroundColor: theme.palette.background.paper,
        },
        gridList: {
            width: 500,
            height: 450,
        },
        gridItem: {
            '&:hover': {
                cursor: "pointer",
                opacity: "50%"
            }
        },
        icon: {
            color: 'rgba(255, 255, 255, 0.54)',
        },
    }),
);
const useGalleryStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            width: '100%',
            '& > * + *': {
                marginTop: theme.spacing(2),
            },
        },
    }),
);

export default function Gallery() {
    const api = useContext(GalleryWidgetApiContext);
    const [loading, setLoading] = useState<boolean>(false);
    const [uploading, setUploading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    const [response, setResponse] = useState<iGalleryListingResponse | undefined>(undefined);
    let _query = getEmptyApiListingQuery();
    _query.sort_order = "created_at";
    const isMounted = useIsMounted();

    const notificationContext = useContext(NotificationContext);
    const [query, setQuery] = useState<iApiListingQuery>({
        ..._query,
        per_page: 12
    });
    const classes = useStyles();
    const inputFile = useRef(null)
    const fileInputRef = useRef<any>(null);
    const _classes = useGalleryStyles();


    function fetchResource() {
        setLoading(true);
        setError("");
        new GalleryAPIs().listing(query).then(response => onListResourceResponse(response));
    }

    function uploadImage(file: any) {
        setUploading(true);
        setError("")
        new GalleryAPIs().create(file).then(response => {
            if (isMounted.current) {
                setUploading(false);
                if (GalleryAPIs.hasError(response)) {
                    if (response.validation_errors && response.validation_errors.image && response.validation_errors.image.length > 0) {
                        setError(response.validation_errors.image[0])
                    } else {
                        setError(response.message || "There is some error uploading the image")
                    }
                } else {

                    fetchResource();
                }
            }


        });
    }

    function onListResourceResponse(response: iGalleryListingResponse) {
        if (isMounted.current) {
            if (GalleryAPIs.hasError(response, notificationContext) || !response.images) {
                setLoading(false);
                setError(PopupAPIs.getError(response))
                setResponse(undefined);
            } else {
                setLoading(false);
                setError("")
                setResponse(response);
            }
        }

    }

    function renderErrorMessage() {
        if (!error) return null;
        return <Alert variant="danger">{error}</Alert>
    }

    const onTargetClick = () => {
        fileInputRef.current.click()
    }
    const onFileInputChange = (event: any) => {
        const {files} = event.target;
        if (files) {
            for (let i = 0; i < files.length; i++) {
                uploadImage(files[i]);
            }
        }
    }
    useEffect(() => {
        fetchResource();
    }, [query]);
    return <>
        <Dialog
            maxWidth={"lg"}
            fullWidth
            open={api.openGallery || false}
            onClose={api.HideGallery}
            aria-labelledby="max-width-dialog-title"
        >
            <DialogTitle id="max-width-dialog-title">Select an Image</DialogTitle>
            <DialogContent>
                <div>
                    <Scrollbar permanentTrackY={false} style={{height: "500px"}}>
                        {renderErrorMessage()}
                        {
                            !uploading && <div>
                                <FileDrop onDrop={(files, event) => {

                                    event.preventDefault()
                                    if (files) {
                                        for (let i = 0; i < files.length; i++) {
                                            uploadImage(files[i]);
                                        }
                                    }
                                }}
                                          onTargetClick={onTargetClick}>
                                    <div className="gallery-upload">
                                <span className="gallery-upload__text">
                                    Drag and drop or Click here to select file
                                <br/>
                                <PanToolIcon width={100}/>
                                </span>
                                    </div>
                                </FileDrop>
                            </div>
                        }
                        {
                            uploading && <div className={"file-drop"}>
                                <LinearProgress color="secondary"/>
                            </div>
                        }
                        <div className="gallery-dialog">
                            <Row>
                                {
                                    response && response.images && response.images.data && response.images.data.map((e) => {
                                        return <Col key={e.uid} md={"auto"} sm="auto">
                                            {
                                                e.public_thumbnail_path &&
                                                <img src={e.public_thumbnail_path} onClick={() => {
                                                    api.onImageSelected && api.onImageSelected(e.public_path);
                                                }} alt={""}/>
                                            }
                                            {
                                                !e.public_thumbnail_path && <img src={e.public_path} onClick={() => {
                                                    api.onImageSelected && api.onImageSelected(e.public_path);
                                                }} alt={""}/>
                                            }
                                        </Col>
                                    })
                                }
                                <Col md={12}>
                                    <div className="float-right mt-1 mb-1">
                                        <Pagination
                                            count={response && response.images && response.images.last_page}
                                            page={query.page}
                                            onChange={((event, page) => {
                                                setQuery(prevState => {
                                                    return {...prevState, page: page}
                                                })
                                            })}
                                        />
                                    </div>
                                </Col>

                            </Row>
                        </div>
                    </Scrollbar>
                </div>


            </DialogContent>
            <DialogActions>
                <Button onClick={api.HideGallery} color="primary">
                    Close
                </Button>
            </DialogActions>
        </Dialog>
        <input
            onChange={onFileInputChange}
            ref={fileInputRef}
            type="file"
            className="d-none"
        />
    </>
}
