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
        return <div class="select">{ !this.state.spreadsheetsList
            ? <div>Loading...</div>
            : this.state.spreadsheetsList.map(
                ({ id, name }) => <SpreadsheetRow key={ id } id={ id } name={ name }/>
            )
        }</div>;
    }

}