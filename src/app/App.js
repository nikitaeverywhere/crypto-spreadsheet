import React, { Component } from "react";
import "./App.scss";
import SpreadsheetSelect from "./SpreadsheetSelect/SpreadsheetSelect.js";
import Spreadsheet from "./Spreadsheet/Spreadsheet.js";
import { subscribe, unsubscribe } from "pubsub-js";
import autobind from "autobind-decorator";
import { APP_NAME } from "../constants.js";

export default class App extends Component {

    state = {
        spreadsheetId: null
    };

    @autobind
    onWindowHashChange () {
        const path = location.hash.slice(1).split("/");
        if (path[0] === "spreadsheet" && path[1]) {
            this.setState({
                spreadsheetId: path[1]
            });
        } else {
            this.setState({
                spreadsheetId: null
            });
        }
    }

    componentDidMount () {
        this.onWindowHashChange();
        this.subscriptions = [
            subscribe("uiEvents.openSpreadsheet", (_, { id }) => {
                location.hash = `spreadsheet/${ id }`;
            }),
            subscribe("uiEvents.closeSpreadsheet", () => {
                location.hash = "";
            })
        ];
        window.addEventListener("hashchange", this.onWindowHashChange);
    }

    componentWillUnmount () {
        this.subscriptions.map(sub => unsubscribe(sub));
        window.removeEventListener("hashchange", this.onWindowHashChange);
    }

    render () {
        return this.state.spreadsheetId
            ? <Spreadsheet id={ this.state.spreadsheetId }/>
            : <SpreadsheetSelect/>;
    }

}