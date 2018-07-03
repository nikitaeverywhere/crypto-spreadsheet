import React, { Component } from "react";
import "./EncryptionControl.scss";
import autobind from "autobind-decorator";
import { publish } from "pubsub-js";
import { debounce } from "throttle-debounce";

export default class EncryptionControl extends Component {

    state = {
        key: ""
    };

    changeCipherTrigger = debounce(1000, (newKey) => publish("uiEvents.changeCipherKey", newKey));

    @autobind
    onKeyChange ({ target }) {
        const newKey = target.value;
        this.setState({
            key: newKey
        });
        this.changeCipherTrigger(newKey);
    }

    render () {
        return <div class="encryption-control">
            <label>
                <input type="password"
                       placeholder="Client encryption password..."
                       value={ this.state.key }
                       onChange={ this.onKeyChange }/>
            </label>
        </div>;
    }

}