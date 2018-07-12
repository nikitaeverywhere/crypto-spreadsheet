import React, { Component } from "react";
import "./Icon.scss";

export default class Icon extends Component {

    render () {
        const { image, size, clickable, ...props } = this.props;
        return <div class={ `icon ${ size || "normal" } icon-${ image }${ clickable ? " clickable" : "" }` }
                    { ...props }/>;
    }

}