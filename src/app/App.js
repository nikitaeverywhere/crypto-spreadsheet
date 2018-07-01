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
        this.subscription = subscribe("uiEvents.openSpreadsheet", (_, { id, name }) => this.setState({
            spreadsheet: { id, name }
        }));
    }

    componentWillUnmount () {
        unsubscribe(this.subscription);
    }

    render () {
        return this.state.spreadsheet
            ? <Spreadsheet id={ this.state.spreadsheet.id } name={ this.state.spreadsheet.name }/>
            : <SpreadsheetSelect/>;
    }

}