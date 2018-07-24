import React, { Component } from "react";
import { HotTable } from '@handsontable/react';
import "handsontable/dist/handsontable.full.css";
import "./Sheet.scss";
import autobind from "autobind-decorator";
import { updateSheet } from "../../../modules/googleSheetsApi.js";
import { encrypt, decrypt } from "../../../modules/crypto.js";
import { subscribe, unsubscribe, publish } from "pubsub-js";

export default class Spreadsheet extends Component {

    hotTable = null;
    beforeRowsChangeData = null;

    state = {
        dummy: 0
    };

    @autobind
    setHotTableReference (ref) {
        this.hotTable = ref && ref.hotInstance;
    }

    @autobind
    async onAfterChange (changes, trigger) {
        if (trigger === "loadData") {
            return;
        }
        const sheetTitle = this.props.sheet.properties.title;
        await updateSheet(this.props.spreadsheetId, sheetTitle, changes.map(([y, x, _, next]) => {
            return {
                row: y,
                col: x,
                value: encrypt(next, this.getEncryptionSalt(y, x))
            };
        }));
    }

    /**
     * 
     * @param {number} rowIndex - Index of the starting row (when user inserts the first row, index is 1)
     * @param {number} _ - Number of rows inserted (positive) or deleted (negative) after the rowIndex
     * @param {string} trigger - Row change or delete
     */
    @autobind
    async onAfterRowsChange (rowIndex, _, trigger) {
        const data = this.hotTable.getData();
        const lastRow = Math.max(data.length, this.beforeRowsChangeData.length);
        const changes = [];
        for (let y = rowIndex; y < lastRow; ++y) {
            const curRow = data[y] || [];
            const pastRow = this.beforeRowsChangeData[y] || [];
            const lastCol = Math.max(curRow.length, pastRow.length);
            for (let x = 0; x < lastCol; ++x) {
                if (curRow[x] === pastRow[x] || !(curRow[x] || pastRow[x])) { // !(null || undefined)
                    continue;
                }
                changes.push([y, x, pastRow[x] || "", curRow[x] || ""]);
            }
        }
        if (changes.length) {
            await this.onAfterChange(changes, trigger);
        }
    }

    @autobind
    async onAfterRowsDelete (rowIndex, changed, trigger) {
        this.onAfterRowsChange(rowIndex, -changed, trigger);
    }

    @autobind
    onBeforeRowsChange () {
        this.beforeRowsChangeData = this.hotTable.getData();
    }

    @autobind
    onBeforeRowsDelete (rowIndex, changed) {
        this.onBeforeRowsChange(rowIndex, -changed);
    }

    getEncryptionSalt (row, col) {
        return [this.props.spreadsheetId, this.props.sheet.properties.sheetId, row, col];
    }

    componentDidMount () {
        this.subscription = subscribe("uiEvents.changeCipherKey", () => this.setState({
            dummy: this.state.dummy + 1
        }));
    }

    componentWillUnmount () {
        unsubscribe(this.subscription);
        publish("uiEvents.changeCipherKey", "");
    }

    render () {

        const { rowCount, columnCount } = this.props.sheet.properties.gridProperties;
        const rowData = this.props.sheet.data[0].rowData || [];
        const data = rowData.concat(
            Array.from({ length: rowCount - rowData.length }, () => ({}))
        ).map((row, rowIndex) => !row.values
            ? Array.from({ length: columnCount }, () => null)
            : row.values.concat(
                Array.from({ length: columnCount - row.values.length }, () => ({}))
            ).map((cell, colIndex) => {
                return decrypt(cell.formattedValue || null, this.getEncryptionSalt(rowIndex, colIndex));
            })
        );

        return <HotTable contextMenu={ true }
                         data={ data }
                         ref={ this.setHotTableReference }
                         colHeaders={ true }
                         rowHeaders={ true }
                         afterChange={ this.onAfterChange }
                         afterCreateRow={ this.onAfterRowsChange }
                         afterRemoveRow={ this.onAfterRowsDelete }
                         beforeCreateRow={ this.onBeforeRowsChange }
                         beforeRemoveRow={ this.onBeforeRowsDelete }/>

    }

}