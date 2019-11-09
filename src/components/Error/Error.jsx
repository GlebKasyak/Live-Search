import React from "react";

export const Error = ( props ) => {

    const display = props.message ? "d-block" : "d-none";
    return (
            <div className={`alert alert-danger error-message ${display}`} role="alert">
                {props.message}
            </div>
        )
};