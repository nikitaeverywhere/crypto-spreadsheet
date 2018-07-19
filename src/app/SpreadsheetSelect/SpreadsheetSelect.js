import React, { Component } from "react";
import "./SpreadsheetSelect.scss";
import { getSheetsList } from "../../modules/googleSheetsApi.js";
import SpreadsheetRow from "./SpreadSheetRow/SpreadSheetRow.js";

export default class SpreadsheetSelect extends Component {

    state = {
        spreadsheetsList: []
    };

    constructor () {
        super();
        this.init();
    }

    async init () {
        const list = await getSheetsList();
        this.setState({
            spreadsheetsList: list
        });
    }

    render () {
        return <div class="spreadsheet-select">
            <div class="head">
                <h2 class="title">Select the Spreadsheet You Want to Interact With</h2>
                <div class="subtext">
                    If you want to create a new spreadsheet, go
                    to <a href="https://docs.google.com/spreadsheets/">Google Spreadsheets</a> and
                    create one, then come back to crypto-spreadsheet.
                </div>
            </div>
        { !this.state.spreadsheetsList
            ? <div>Loading...</div>
            : this.state.spreadsheetsList.map(
                ({ id, name }) => <SpreadsheetRow key={ id } id={ id } name={ name }/>
            )
        }
        </div>;
    }

}