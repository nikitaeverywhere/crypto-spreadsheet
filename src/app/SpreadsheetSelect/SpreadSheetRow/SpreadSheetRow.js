import React, { Component } from "react";
import "./SpreadsheetRow.scss";
import autobind from "autobind-decorator";
import { publish } from "pubsub-js";

export default class SpreadsheetSelect extends Component {

    @autobind
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