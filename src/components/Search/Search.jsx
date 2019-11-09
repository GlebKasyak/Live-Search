import React from "react";
import axios from "axios";

import { PageNavigation } from "../PageNavigation";
import { API_KEY, RESULT_NOT_FOUND, FAILD_TO_FEACH } from "../../constants/constants";
import { Gallery } from "../Gallery";
import { Loader } from "../Loader";
import { Error } from "../Error";


export class Search extends React.Component {
    constructor( props ) {
        super( props );

        this.state = {
            query: "",
            results: {},
            isLoading: false,
            errorMessage: "",
            totalResults: 0,
            totalPages: 0,
            currentPageNumber: 0
        };

        this.cancel = "";
    }

    getPageCount = ( total, denominator ) => {

        const divisible = total % denominator === 0;
        const valueToBeAdded = divisible ? 0 : 1;
        return Math.floor(total/denominator) + valueToBeAdded;

    };


    handleOnInputChange = ( event ) => {

        const query = event.target.value;
        if( !query ) {
            this.setState({query, results: {}, errorMessage: "", totalPages: 0, totalResults: 0})
        } else {
            this.setState({query, isLoading: true, errorMessage: ""}, () => {
                this.fetchSearchResults(1, query);
            });
        }

    };

    fetchSearchResults = ( updatedPageNumber, query ) => {
        const pageNumber = updatedPageNumber ? `&page=${updatedPageNumber}` : "";
        const searchUrl = `https://pixabay.com/api/?key=${API_KEY}&q=${query}${pageNumber}`;

        if(this.cancel) {
            this.cancel.cancel();
        }
        this.cancel = axios.CancelToken.source();

        axios.get(searchUrl, {
            cancelToken: this.cancel.token
        })
            .then(res => {

                const total = res.data.total;
                const totalPagesCount = this.getPageCount( total, 20 );
                const resultNotFoundMessage =
                    !res.data.hits.length ? FAILD_TO_FEACH : "";

                this.setState({
                    results: res.data.hits,
                    errorMessage: resultNotFoundMessage,
                    totalResults: total,
                    totalPages: totalPagesCount,
                    currentPageNumber: updatedPageNumber,
                    isLoading: false
                });

            })
            .catch( error => {

                if ( axios.isCancel(error) || error ) {
                    this.setState({
                        isLoading: false,
                        errorMessage: RESULT_NOT_FOUND
                    })
                }

            })
    };

    handlePageClick = ( type, event ) => {

        event.preventDefault();

        const updatePageNumber = "prev" === type
            ? this.state.currentPageNumber - 1
            : this.state.currentPageNumber + 1;

        if(!this.state.isLoading) {
            this.setState({isLoading: true, errorMessage: ""}, () => {
                this.fetchSearchResults(updatePageNumber, this.state.query);
            });
        }

    };

    renderSearchResults = () => {

        const { results } = this.state;

        if (Object.keys(results).length && results.length) {
            return (
              <Gallery  results={results} />
            )
        }

    };

    render() {
        const {query, isLoading, errorMessage, currentPageNumber, totalPages} = this.state;
        const showPrevLink = 1 < currentPageNumber;
        const showNextLink = totalPages > currentPageNumber;

        return (
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-8">
                        <h2 className="heading">Live Search: React Application</h2>
                        <label htmlFor="search-input" className="search-label">
                            <input
                                type="text"
                                value={query}
                                id="search-input"
                                placeholder="Search..."
                                onChange={this.handleOnInputChange}
                            />
                            <i className="fas fa-search search-icon" />
                        </label>

                        <Error message={errorMessage}/>

                        <Loader display={isLoading ? "d-flex" : "d-none"}/>

                    </div>
                </div>
                <PageNavigation
                    loading={isLoading}
                    showPrevLink={showPrevLink}
                    showNextLink={showNextLink}
                    handlePrevClick={ (event) => this.handlePageClick("prev", event) }
                    handleNextClick={ (event) =>this.handlePageClick("next", event) }
                />

                {this.renderSearchResults()}

            </div>
        )
    }
}