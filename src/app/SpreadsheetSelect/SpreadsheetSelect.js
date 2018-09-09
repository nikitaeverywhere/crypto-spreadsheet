import React, { Component } from "react";
import "./SpreadsheetSelect.scss";
import { getSheetsList } from "../../modules/googleSheetsApi.js";
import SpreadsheetRow from "./SpreadSheetRow/SpreadSheetRow.js";
import { signOut } from "../../modules/gapi";

export default class SpreadsheetSelect extends Component {

    unmounted = false;

    state = {
        spreadsheetsList: []
    };

    constructor () {
        super();
        this.init();
    }

    async init () {
        const list = await getSheetsList();
        if (!this.unmounted) this.setState({
            spreadsheetsList: list
        });
    }

    componentWillUnmount () {
        this.unmounted = true;
    }

    render () {
        return <div class="spreadsheet-select">
            <div class="head">
                <h2 class="title">Select the Spreadsheet You Want to Interact With</h2>
                <div class="subtext">
                    <input class="float-right" type="button" value="Sign Out" onClick={ signOut }/>
                    <div>
                        If you want to create a new spreadsheet, go
                        to <a href="https://docs.google.com/spreadsheets/" target="_blank">Google Spreadsheets</a> and
                        create one, then come back to crypto-spreadsheet.
                    </div>
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