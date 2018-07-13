import React, { Component } from "react";
import "./App.scss";
import SpreadsheetSelect from "./SpreadsheetSelect/SpreadsheetSelect.js";
import Spreadsheet from "./Spreadsheet/Spreadsheet.js";
import { subscribe, unsubscribe } from "pubsub-js";

export default class App extends Component {

    state = {
        spreadsheet: null
    };

    componentDidMount () {
        this.subscriptions = [
            subscribe("uiEvents.openSpreadsheet", (_, { id, name }) => this.setState({
                spreadsheet: { id, name }
            })),
            subscribe("uiEvents.closeSpreadsheet", () => this.setState({
                spreadsheet: null
            }))
        ];
    }

    componentWillUnmount () {
        this.subscriptions.map(sub => unsubscribe(sub));
    }

    render () {
        return this.state.spreadsheet
            ? <Spreadsheet id={ this.state.spreadsheet.id }/>
            : <SpreadsheetSelect/>;
    }

}