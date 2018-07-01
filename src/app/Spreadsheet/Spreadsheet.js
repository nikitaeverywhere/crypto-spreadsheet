import React, { Component } from "react";
import "./Spreadsheet.scss";
import { getSheet } from "../../modules/googleSheetsApi.js";
import Sheet from "./Sheet/Sheet.js";
import Icon from "../Icon.js";

export default class Spreadsheet extends Component {

    state = {
        spreadsheet: null,
        selectedSheet: 0
    };

    constructor () {
        super();
    }

    async componentDidMount () {
        this.setState({
            spreadsheet: await getSheet(this.props.id)
        });
    }

    render () {
        return <div class="spreadsheet">
            <div class="header">
                <Icon size="big" image="lock"/>
                { this.props.name }
            </div>
            <div class="body">{ !this.state.spreadsheet ? null :
                <Sheet sheet={ this.state.spreadsheet.sheets[this.state.selectedSheet] }
                       spreadsheetId={ this.props.id }/>
            }</div>
            <div class="footer">{ !this.state.spreadsheet ? null : this.state.spreadsheet.sheets.map(sheet =>
                <div class="tab"
                     key={ sheet.properties.sheetId }>
                    { sheet.properties.title }
                </div>
            )}</div>
        </div>;
    }

}