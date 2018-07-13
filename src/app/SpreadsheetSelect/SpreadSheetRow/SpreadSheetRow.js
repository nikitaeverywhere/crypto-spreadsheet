import React, { Component } from "react";
import "./SpreadsheetRow.scss";
import autobind from "autobind-decorator";
import { publish } from "pubsub-js";

export default class SpreadsheetSelect extends Component {

    @autobind
    onClick () {
        const { id, name } = this.props;
        publish("uiEvents.openSpreadsheet", { id, name });
    }

    render () {
        return <div class="spreadsheet-row"
                    onClick={ this.onClick }>
            { this.props.name }
        </div>;
    }

}