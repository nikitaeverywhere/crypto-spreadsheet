import React, { Component } from "react";
import { HotTable } from '@handsontable/react';
import "handsontable/dist/handsontable.full.css";
import "./Sheet.scss";
import { updateSheet } from "../../../modules/googleSheetsApi.js";

export default class Spreadsheet extends Component {

    constructor () {
        super();
        this.onAfterChange = this.onAfterChange.bind(this);
    }

    async onAfterChange (changes, trigger) {
        if (trigger === "loadData") {
            return;
        }
        const sheetTitle = this.props.sheet.properties.title;
        await updateSheet(this.props.spreadsheetId, sheetTitle, changes.map(([y, x, prev, next]) => {
            return {
                row: y,
                col: x,
                value: next
            };
        }));
    }

    render () {
        const { rowCount, columnCount } = this.props.sheet.properties.gridProperties;
        const rowData = this.props.sheet.data[0].rowData;
        const data = rowData.concat(
            Array.from({ length: rowCount - rowData.length }, () => ({}))
        ).map(row => !row.values
            ? Array.from({ length: columnCount }, () => "")
            : row.values.concat(Array.from({ length: columnCount - row.values.length }, () => ({}))).map(row => {
                return row.formattedValue || "";
            })
        );
        return <HotTable contextMenu={ true }
                         data={ data }
                         colHeaders={ true }
                         rowHeaders={ true }
                         afterChange={ this.onAfterChange }/>
    }

}