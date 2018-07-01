import React, { Component } from "react";
import "./SpreadsheetRow.scss";
import { publish } from "pubsub-js";

export default class SpreadsheetSelect extends Component {

    constructor () {
        super();
        this.onClick = this.onClick.bind(this);
    }

    onClick () {
        const { name, id } = this.props;
        publish("uiEvents.openSpreadsheet", { name, id });
    }

    render () {
        return <div class="spreadsheet-row"
                    onClick={ this.onClick }>
            { this.props.name }
        </div>;
    }

}