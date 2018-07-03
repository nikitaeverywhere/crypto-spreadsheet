import React, { Component } from "react";
import { HotTable } from '@handsontable/react';
import "handsontable/dist/handsontable.full.css";
import "./Sheet.scss";
import autobind from "autobind-decorator";
import { updateSheet } from "../../../modules/googleSheetsApi.js";
import { encrypt, decrypt } from "../../../modules/crypto.js";
import { subscribe, unsubscribe } from "pubsub-js";

export default class Spreadsheet extends Component {

    state = {
        dummy: 0
    };

    @autobind
    async onAfterChange (changes, trigger) {
        if (trigger === "loadData") {
            return;
        }
        const sheetTitle = this.props.sheet.properties.title;
        await updateSheet(this.props.spreadsheetId, sheetTitle, changes.map(([y, x, prev, next]) => {
            return {
                row: y,
                col: x,
                value: encrypt(next, [y, x])
            };
        }));
    }

    componentDidMount () {
        this.subscription = subscribe("uiEvents.changeCipherKey", () => this.setState({
            dummy: this.state.dummy + 1
        }));
    }

    componentWillUnmount () {
        unsubscribe(this.subscription);
    }

    render () {
        const { rowCount, columnCount } = this.props.sheet.properties.gridProperties;
        const rowData = this.props.sheet.data[0].rowData || [];
        const data = rowData.concat(
            Array.from({ length: rowCount - rowData.length }, () => ({}))
        ).map((row, rowIndex) => !row.values
            ? Array.from({ length: columnCount }, () => "")
            : row.values.concat(
                Array.from({ length: columnCount - row.values.length }, () => ({}))
            ).map((cell, colIndex) => {
                return decrypt(cell.formattedValue || "", [rowIndex, colIndex]);
            })
        );
        return <HotTable contextMenu={ true }
                         data={ data }
                         colHeaders={ true }
                         rowHeaders={ true }
                         afterChange={ this.onAfterChange }/>
    }

}