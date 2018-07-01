import React, { Component } from "react";
import "./EncryptionControl.scss";
import autobind from "autobind-decorator";
import { publish } from "pubsub-js";

export default class EncryptionControl extends Component {

    state = {
        key: ""
    };

    @autobind
    onKeyChange ({ target }) {
        const newKey = target.value;
        this.setState({
            key: newKey
        });
        publish("uiEvents.changeCipherKey", newKey);
    }

    render () {
        return <div class="encryption-control">
            <label>
                <input type="password"
                       placeholder="Type password..."
                       value={ this.state.key }
                       onChange={ this.onKeyChange }/>
            </label>
        </div>;
    }

}