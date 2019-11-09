import React from "react";

export const PageNavigation = ( props ) => {

    const {
        loading,
        showPrevLink,
        showNextLink,
        handlePrevClick,
        handleNextClick
    } = props;

    const isBlocked = loading === true;
    return (
        <div className="nav-link-container">
            <button
                className={
                    `nav-link ${showPrevLink ? "d-inline-block" : "d-none"}`
                }
                onClick={ handlePrevClick }
                disabled={isBlocked}
            >
                Prev
            </button>
            <button
                className={
                    `nav-link ${showNextLink ? "d-inline-block" : "d-none"}`
                }
                onClick={ handleNextClick }
                disabled={isBlocked}
            >
                Next
            </button>
        </div>
    )
};