import React, { Component } from "react";
import "./Icon.scss";

export default class Icon extends Component {

    render () {
        return <div class={ `icon ${ this.props.size || "normal" } ${ this.props.image }` }/>;
    }

}