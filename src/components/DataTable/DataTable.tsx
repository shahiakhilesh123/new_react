import React from "react";
import Table from "../Table/Table"

export interface iDataTableProps {
    keys: Array<string>
    headers: { [key: string]: string }
    data: Array<{ [key: string]: string }>
}

function DataTable(props: iDataTableProps) {

    return <Table>
        <thead>
        <tr>
            {props.keys.map(k => <th key={k}>{props.headers[k]}</th>)}
        </tr>
        </thead>
        <tbody>
        {props.data.map((row, id) => <tr key={id}>
            {props.keys.map(k => <td key={k}>{row[k]}</td>)}
        </tr>)}
        </tbody>
    </Table>;

}

export default DataTable;