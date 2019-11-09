import React from "react";

export const Gallery = (props) => {

    return (
        <div className="results-container row">

            {props.results.map(result => {
                return (
                    <div className="col-6 col-md-4 result-item" key={result.id}>
                        <a href={result.previewURL}>
                            <h6 className="image-username">{result.user}</h6>
                            <div className="image-wrapper">
                                <img className="image" src={result.previewURL} alt={`${result.username} image`}/>
                            </div>
                        </a>
                    </div>
                )
            })}
        </div>
    )

};