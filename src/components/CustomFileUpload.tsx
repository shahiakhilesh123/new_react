import {Button, Col, Form, ProgressBar, Row, Spinner} from "react-bootstrap";

import React, {useState} from "react";

import useIsMounted from "ismounted";
import DataTable from "react-data-table-component";
import {customStyles} from "./common/common";
import {FaTrashAlt} from "react-icons/all";
import CommonApis from "../apis/common.apis";
import {focusOnError} from "./helper/form.helper";

const {v4: uuidv4} = require('uuid');
export default function CustomFileUpload(
    {
        prop_files_name,
        files,
        props,
        accept,
        label,
        validateForm,
        setFieldValue,
        loadProposalSilently,
        uploadFunction,
        deleteFunction,
        downloadFileLink,
        uploadedFiles,
        title,
    }: {
        prop_files_name?: any,
        files: any
        props: any,
        accept: any,
        label: any,
        validateForm: any,
        setFieldValue: any,
        loadProposalSilently: any,
        uploadFunction: any,
        deleteFunction: any,
        downloadFileLink: any,
        uploadedFiles: any
        title: any
    }
) {

    const [deleteFile, setDeleteFile] = useState<number[]>([]);

    let prop_name = prop_files_name || "files"
    const isMounted = useIsMounted()


    const columns_with_thumb = [
        {
            name: 'File name',
            selector: 'name',
        },
        {
            name: "Thumbnail Image",
            cell: (row: any) => {
                return <div>
                    <img src={"/"} width={350} alt={row.name}
                         className="mt-1" style={{height: "150px", width: "auto"}}/>

                </div>
            },
        },
        {
            name: 'Actions',
            button: true,
            cell: (row: any) => <div>
                <Button
                    disabled={deleteFile.includes(row.id)}
                    size="sm"
                    variant="danger"
                    className="ml-1" onClick={() => {
                    let confirm = window.confirm("Do you really want to delete this file?");
                    if (confirm) {
                        let file = [...deleteFile];
                        file.push(row.id)
                        setDeleteFile(file)
                        deleteFunction && deleteFunction(row.id,).then((res: any) => {
                            if (isMounted.current) {
                                if (CommonApis.hasError(res)) {
                                    window.alert(res.message);
                                }
                                loadProposalSilently && loadProposalSilently()
                            }
                        });
                    }
                }}> {deleteFile.includes(row.id) ?
                    <Spinner animation="border"
                             size="sm"/> : <FaTrashAlt/>}
                </Button>
            </div>
        },
    ];
    return <Row className="no-gutters">
        <Col md={12}>
            <div className="d-flex justify-content-between">
                <div>
                    <Form.Label className="sub-heading">
                        {title}
                    </Form.Label>
                </div>
                <div className="p-1"/>
            </div>

        </Col>
        {uploadedFiles && uploadedFiles.length > 0 && <Col md={12} className="mb-1">
            <DataTable
                columns={columns_with_thumb}
                data={uploadedFiles || []}
                noHeader
                customStyles={customStyles}
                persistTableHead
            />
        </Col>}
        {
            files && files.length > 0 && <Col md={12} className="mb-3"> {
                files.map((file: any, index: any) => {
                    if (!file) return null;
                    return <Row
                        key={file.id}>
                        <Col md={8}
                             className="d-flex align-items-center mt-4"
                             style={{wordBreak: "break-all"}}>
                            <Row>
                                <Col
                                    md={12}>
                                    {file.file && file.file.name}
                                </Col>
                                {(file.is_uploading && !file.error) &&
                                <Col
                                    md={12}>
                                    <ProgressBar
                                        animated={file.uploading !== "100"}
                                        label={`${file.uploading}%`}
                                        now={file.uploading}/>
                                </Col>}
                                {file.error &&
                                <Col md={12}
                                     sm={12}>
                                    <div
                                        className="error-message">{file.error}</div>
                                </Col>}
                            </Row>
                        </Col>
                        <Col
                            md="2"
                            className="d-flex align-items-end">
                            {!file.is_uploading &&
                            <Button
                                onClick={() => {
                                    props.remove(index);
                                }
                                }><FaTrashAlt/></Button>}
                        </Col>
                    </Row>
                })
            } </Col>
        }
        <Form.Group as={Col}
                    md="12">

            <Form.File
                onClick={(e: any) => {
                    e.target.value = null
                }}
                multiple
                custom
                disabled={files && files.filter((file: any) => {
                    return file && file.is_uploading
                }).length}
                accept={accept}
                onChange={(e: any) => {
                    if (e.target && e.target.files && e.target.files.length) {
                        [...e.target.files].forEach((target_file: any) => {
                            props.push({
                                id: uuidv4(),
                                uploading: "0",
                                is_uploading: false,
                                has_uploading_error: false,
                                file: target_file
                            });
                        });
                    }
                }}
                label={label}
            /> <Form.Text className="text-muted">
            Allowed file formats: {accept}
        </Form.Text>

        </Form.Group>
        {files && files.length !== 0 && <Form.Group as={Col} md="4">
            <Button
                disabled={files && files.length && files.filter((file: any) => {
                    return file.is_uploading
                }).length}
                className="button-primary"
                onClick={async () => {
                    let err = await validateForm();
                    if (!err || !err[prop_name]) {
                        let _files = [...files];
                        if (_files.length) {
                            _files.forEach((_file: any, index: number) => {

                                if (_file.uploading !== "100" || _file.has_uploading_error) {
                                    setFieldValue(`${prop_name}[${index}].error`, "");
                                    setFieldValue(`${prop_name}[${index}].is_uploading`, true);
                                    uploadFunction && uploadFunction(
                                        _file.file,
                                        (e: any) => {
                                            try {
                                                const percentage = Math.round(e.loaded / e.total * 100);
                                                setFieldValue(`${prop_name}[${index}].uploading`, percentage.toString());
                                            } catch (e) {

                                            }
                                        }).then((res: any) => {
                                        if (isMounted.current) {
                                            loadProposalSilently && loadProposalSilently()
                                            if (!CommonApis.hasError(res)) {
                                                setFieldValue(`${prop_name}[${index}].uploading`, "100");
                                                files[index].uploading = "100";

                                                setFieldValue(`${prop_name}[${index}].is_uploading`, false);
                                                let isUploadedAll = files.findIndex((_file_: any) => {
                                                    return _file_.uploading !== "100";
                                                });
                                                if (isUploadedAll === -1) {
                                                    setFieldValue(`${prop_name}`, []);
                                                }
                                            } else {

                                                setFieldValue(`${prop_name}[${index}].is_uploading`, false);
                                                setFieldValue(`${prop_name}[${index}].has_uploading_error`, true);

                                                setFieldValue(`${prop_name}[${index}].error`,
                                                    (res.validation_errors &&
                                                        res.validation_errors.file && res.validation_errors.file.length
                                                        && res.validation_errors.file[0]
                                                    ) || (res.validation_errors &&
                                                        res.validation_errors.type_id && res.validation_errors.type_id.length
                                                        && res.validation_errors.type_id[0]
                                                    ) || res.message || "Cannot upload right now. Please retry");

                                            }
                                        }
                                    });
                                }

                            })

                        }
                    } else {
                        focusOnError(err)
                    }
                }}> {files && files.length !== 0 && files.filter((file: any) => {
                return file.is_uploading
            }).length !== 0 && <Spinner animation="border"
                                        size="sm"/>} &nbsp;Upload
            </Button></Form.Group>}
    </Row>
}
