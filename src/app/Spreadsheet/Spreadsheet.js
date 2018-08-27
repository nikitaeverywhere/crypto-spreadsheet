import React, { Component } from "react";
import "./Spreadsheet.scss";
import { getSheet } from "../../modules/googleSheetsApi.js";
import Sheet from "./Sheet/Sheet.js";
import Icon from "../Components/Icon.js";
import EncryptionControl from "../Components/EncryptionControl.js";
import autobind from "autobind-decorator";
import { publish } from "pubsub-js";

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

    @autobind
    onBackClick () {
        publish("uiEvents.closeSpreadsheet");
    }

    @autobind
    async onTabClick (tabIndex) {
        this.setState({
            selectedSheet: tabIndex
        });
    }

    @autobind
    async onDownloadClick () {
        window.open(`https://docs.google.com/spreadsheets/d/${ this.props.id }/export?format=xlsx&id=${ this.props.id }`);
    }

    render () {
        const spreadsheet = this.state.spreadsheet;
        return <div class="spreadsheet">
            <div class="header">
                <Icon size="big" image="back" clickable onClick={ this.onBackClick }/>
                <EncryptionControl/>
                <span class="title">{ spreadsheet ? spreadsheet.properties.title : "Loading..." }</span>
                <Icon size="big" image="download" clickable onClick={ this.onDownloadClick }/>
            </div>
            <div class="body">{ !spreadsheet ? null :
                <Sheet sheet={ spreadsheet.sheets[this.state.selectedSheet] }
                       spreadsheetId={ this.props.id }/>
            }</div>
            <div class="footer">{ !spreadsheet ? null : spreadsheet.sheets.map((sheet, i) =>
                <div class={ `tab${ i === this.state.selectedSheet ? " selected" : "" }` }
                     key={ sheet.properties.sheetId }
                     onClick={ () => this.onTabClick(i) }>
                    { sheet.properties.title }
                </div>
            )}</div>
        </div>;
    }

}