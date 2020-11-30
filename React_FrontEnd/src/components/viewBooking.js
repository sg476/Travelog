import React, { Component, Fragment } from 'react';
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import { Dialog } from 'primereact/dialog';
import { ProgressSpinner } from 'primereact/progressspinner';

class ViewBooking extends Component {
    constructor(props) {
        super(props);
        this.state = {
            contactNo: sessionStorage.getItem("contactNo"),
            userBookingData: "",
            userBookingError: "",
            dialog_visible: false,
            bookingIdToDelete: "",
            deletePackage: "",
            progressSpinner: true

        }
    }

    showDialog = (deletePackage) => {
        this.setState({ dialog_visible: true, bookingIdToDelete: deletePackage.bookingId, deletePackage: deletePackage })
    }
    componentWillMount() {
        axios.get("http://localhost:4000/booking/" + this.state.contactNo)
            .then(response => {
                this.setState({ userBookingData: response.data })
            })
            .catch(error => {
                if (error.response) {
                    this.setState({ userBookingError: error.response.data.message })
                } else {
                    console.log(error);
                }
            })
    }

    componentDidMount() {
        setTimeout(() => {
            this.setState({ progressSpinner: false })
        }, 2000)
    }

    onHide = () => {
        this.setState({ dialog_visible: false, bookingIdToDelete: "" })
    }

    cancelBooking = (deletePackage) => {
        let { ...state } = this.state;
        axios.put("http://localhost:4000/booking/delete", deletePackage)
            .then(response => {
                state.userBookingData = response.data;
            })
            .catch(error => {
                if (error.response) {
                    state.userBookingError = error.response.data.message;
                } else {
                    console.log(error);
                }
            })
        this.setState({ dialog_visible: false, userBookingData: state.userBookingData, userBookingError: state.userBookingError }, () => {
            window.location.reload();
        })

    }
    displayBookingDetails = () => {
        if (this.state.userBookingData) {
            let bookingDataArray = [];
            this.state.userBookingData.forEach((bookingData, index) => {
                let element = (
                    <div className="container-fluid" key={index}>
                        <div className="row">
                            <div className="card cardStyle col-lg-8 offset-lg-2 shadow">
                                <div className="card-header alignLeft">
                                    <b>Booking Id: {bookingData.bookingId}</b>
                                </div>
                                <div className="card-body">
                                    <h4 className="alignLeft"><b>{bookingData.destinationName}</b></h4>
                                    <p className="alignLeft">
                                        Trip Starts On: <span className="text-success">{bookingData.checkInDate}</span><br />
                                        Trip Starts End: <span className="text-danger">{bookingData.checkOutDate}</span><br />
                                        Total Tickets Booked: {bookingData.noOfPersons}
                                        <span style={{ marginLeft: "150px" }}></span>Total Amount Paid: $ {bookingData.totalCharges}
                                    </p>
                                </div>
                                <div className="card-footer">
                                    <button className="btn btn-dark" type="submit" onClick={() => { this.showDialog(bookingData) }}>Cancel Booking</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )
                bookingDataArray.push(element)
            })

            return bookingDataArray
        }

    }
    render() {
        let loggedIn = Boolean(sessionStorage.getItem("loggedIn"))
        if (!loggedIn) {
            alert("We planned trips together, login to view them. ")
            return <Redirect to="/login" />
        }

        const footer = (
            <div>
                <button className="btn btn-dark" onClick={this.onHide}>Back</button>
                <button className="btn btn-dark" onClick={() => { this.cancelBooking(this.state.deletePackage) }}>Confirm cancellation</button>
            </div>
        );

        return (
            <Fragment>
                {
                    this.state.userBookingError ? (
                        <div style={{ margin: "155px" }}>
                            <h2 className="text-danger" style={{ marginTop: "100px" }}>{this.state.userBookingError}</h2>
                            <br />
                            <a href="/hotdeals">Click here to view hotdeals</a><br /><br />
                        </div>
                    ) : (
                            <Fragment>
                                {this.state.progressSpinner ? <div style={{ margin: "175px" }}><ProgressSpinner /> </div> : (
                                    <Fragment>
                                        <div style={{ margin: "50px" }}>
                                            {this.displayBookingDetails()}
                                        </div>
                                        <div className="content-section implementation">
                                            <Dialog
                                                header="Confirmation"
                                                visible={this.state.dialog_visible}
                                                style={{ width: '50vw' }}
                                                footer={footer}
                                                onHide={this.onHide}>
                                                Are you sure you want to cancel booking {this.state.bookingIdToDelete} ?
                                            </Dialog>
                                        </div>
                                    </Fragment>
                                )
                                }
                            </Fragment>
                        )

                }
            </Fragment>
        )
    }
}

export default ViewBooking;