import React, { Component } from "react";
import axios from "axios";
import actionObj from '../Action/Action';
import Sidebar from './sideBar';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

class HotDeals extends Component {
    constructor(props) {
        super(props);
        this.state = {
            hotDeals: [],
            selectedHotdeal: "",
            showItenary: false,
            errorMessage: "",
            bookingPage: false,
            dealId: ""
        }
    }

    getHotDeals = () => {
        axios.get("http://localhost:4000/package/hotdeals")
            .then(response => {
                this.setState({ hotDeals: response.data, errorMessage: null })
            }).catch(error => {
                this.setState({ errorMessage: error.message, hotDeals: null })
            })
    }

    getitenary = (hotDeal) => {
        let action = actionObj.showSidebar(hotDeal, true, 0)
        this.props.dispatch(action)
    }

    openBooking = (selectedPackage) => {
        let dealId = selectedPackage.destinationId;
        let action = actionObj.bookingPackage(selectedPackage);
        this.props.dispatch(action);
        this.setState({ dealId: dealId, bookingPage: true })
    }

    displayHotDeals = () => {
        let packagesArray = [];
        for (let mypackage of this.state.hotDeals) {
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
                                <button className="btn btn-dark book" style={{ width: "200px" }} onClick={() => this.getitenary(mypackage)}>View Details</button><br /><br />
                                <button className="btn btn-dark book" style={{ width: "200px" }} onClick={() => this.openBooking(mypackage)}>Book </button>
                            </div>
                        </div>
                    </div>
                </div>
            )
            packagesArray.push(element);
        }
        return packagesArray
    }

    componentWillMount() {
        this.getHotDeals();
    }
    render() {
        if (this.state.bookingPage) { return <Redirect to={"/book/" + this.state.dealId} /> }
        return (
            <React.Fragment>
                {/* <!-- hot deals normal list display --> */}
                <div className="row destination card">  {/* *ngIf="!bookingPage" */}
                    {this.displayHotDeals()}
                </div>
                {this.props.show ? <Sidebar /> : null}
            </React.Fragment>
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

// <Redirect to="/book" />
export default connect(mapStateToProps)(HotDeals);