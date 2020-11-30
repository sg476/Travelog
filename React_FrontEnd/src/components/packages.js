import React, { Component } from 'react';
import axios from 'axios';
import Sidebar from './sideBar';

import { connect } from 'react-redux';
import actionObj from '../Action/Action';

//import { ProgressSpinner } from 'primereact/progressspinner';
import { Redirect } from 'react-router-dom';





class Packages extends Component {
    constructor(props) {
        super(props);
        this.state = {
            bookingPage: false,
            show: false,
            showItinerary: false,
            packages: [],
            errorMessage: "",
            successMessage: "",
            totalCharges: "",
            continent: "",
            dealId: "",
            index: "",
            deal: "",
            packagePage: false,
            visibleRight: false,
        }
    }

    getPackages = (continent) => {
        let newContinent = continent[0].toUpperCase()+ continent.substring(1).toLowerCase()
        axios.get('http://localhost:4000/package/destinations/' + newContinent)
            .then((response) => {
                this.setState({ packages: response.data, show: false }, () => {
                    if (this.state.packages.length === 0) this.setState({ errorMessage: "some error occured" })
                })

            }).catch(error => {
                this.setState({ errorMessage: error.message, packages: [] })
            })
    }

    componentWillMount() {
        window.scrollTo(0, 0)
        const continent = sessionStorage.getItem("continent");
        if (continent) { this.getPackages(continent) }
        else this.getHotDeals(this.state.continent);
    }


    getitinerary = (selectedPackage) => {
        //this.setState({ index: 0, deal: selectedPackage, showItinerary: true })
        let action = actionObj.showSidebar(selectedPackage, true, 0)
        this.props.dispatch(action)
    }

    openBooking = (selectedPackage) => {
        let dealId = selectedPackage.destinationId;
        let action = actionObj.bookingPackage(selectedPackage);
        this.props.dispatch(action);
        this.setState({ dealId: dealId, bookingPage: true })

    }
    displayPackages = () => {
        if (!this.state.errorMessage) {
            let packagesArray = [];
            for (let mypackage of this.state.packages) {
                let element = (
                    <div className="card bg-light text-dark package-card shadow" key={mypackage.destinationId}>
                        <div className="card-body row">
                            <div className="col-md-4">
                                <br /><br />
                                <img className="package-image" src={mypackage.imageUrl} alt="destination comes here" />
                            </div>
                            <div className="col-md-5">
                                <div className="featured-text text-center text-lg-left">
                                    <h4>{mypackage.name}</h4>
                                    <div className="badge badge-info">{mypackage.noOfNights}<em> Nights</em></div>
                                    {mypackage.discount ? <div className="discount text-danger">{mypackage.discount}% Instant Discount</div> : null}
                                    <p className="text-dark mb-0">{mypackage.details.about}</p>
                                </div>
                                <br />

                            </div>
                            <div className="col-md-3">
                                <h4>Prices Starting From:</h4>
                                <div className="text-center text-success"><h6>$ {mypackage.chargesPerPerson}</h6></div><br /><br />
                                <div>
                                    <button className="btn btn-dark book" style={{ width: "200px" }} onClick={() => this.getitinerary(mypackage)}>View Details</button><br /><br />
                                    <button className="btn btn-dark book" style={{ width: "200px" }} onClick={() => this.openBooking(mypackage)}>Book </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )
                packagesArray.push(element);
            }
            return packagesArray;
        }
    }

    render() {

        if (this.state.bookingPage) { return <Redirect to={"/book/" + this.state.dealId} /> }
        return (
            <div>
                {
                    !this.state.packagePage ?
                        (
                            <div>
                                {this.displayPackages()}
                                {
                                    this.state.errorMessage ?
                                        (
                                            <div className="container-fluid">
                                                <div className="row">
                                                    <div className="col-lg-10 offset-lg-1" style={{ marginTop: "200px", marginBottom: "150px" }} >
                                                        <h2 className="text-danger">Sorry we don't operate in this Destination.</h2><br />
                                                        <a href="/hotDeals">Click Here to checkout our Hot Deals</a>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                        : null
                                }
                            </div>
                        ) : null
                }
                {this.props.show ? <Sidebar /> : null}
            </div>
        )
    }
}

let mapStateToProps = (state) => {
    return {
        show: state.sidebarReducer.show,
        deal: state.sidebarReducer.deal,
        index: state.sidebarReducer.index,
        bookingPackage: state.bookingReducer.bookingPackage
    }
}

export default connect(mapStateToProps)(Packages);