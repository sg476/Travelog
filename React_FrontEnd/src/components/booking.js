import React, { Component, Fragment } from 'react';
import { Redirect } from 'react-router';
import { InputSwitch } from 'primereact/inputswitch';
import { connect } from 'react-redux';
import { Accordion, AccordionTab } from 'primereact/accordion';
import axios from 'axios';
import { ProgressSpinner } from 'primereact/progressspinner';
import actionObj from '../Action/Action';


class Booking extends Component {
    constructor(props) {
        super(props);
        this.state = {
            bookingPackage: this.props.bookingPackage,
            bookingForm: {
                noOfPersons: this.props.buttonEnable ? this.props.noOfPerson : "",
                date: this.props.buttonEnable ? this.props.date : "",
                flights: this.props.buttonEnable ? this.props.flights : false,
            },
            bookingFormErrorMessage: {
                noOfPersons: "",
                date: ""
            },
            bookingFormValid: {
                noOfPersons: this.props.buttonEnable ? this.props.buttonEnable : false,
                date: this.props.buttonEnable ? this.props.buttonEnable : false,
                buttonActive: this.props.buttonEnable ? this.props.buttonEnable : false
            },
            goBack: false,
            showCharge: false,
            totalCharges: this.props.buttonEnable ? this.props.totalCharge : "",
            checkOutDate: "",
            responseData: "",
            errorMessage: "",
            progressSpinner: true
        }
    }

    componentDidMount() {
        if (this.props.buttonEnable) {
            this.calculateCharges();
        }
    }
    handleChange = (event) => {
        const target = event.target;
        const name = target.name;
        if (target.checked) {
            var value = target.checked;
        } else {
            value = target.value;
        }
        const { bookingForm } = this.state;
        this.setState({
            bookingForm: { ...bookingForm, [name]: value }
        });
        this.validateField(name, value);
    }

    validateField = (fieldname, value) => {
        let fieldValidationErrors = this.state.bookingFormErrorMessage;
        let formValid = this.state.bookingFormValid;
        switch (fieldname) {
            case "noOfPersons":
                if (value === "") {
                    fieldValidationErrors.noOfPersons = "This field can't be empty!";
                    formValid.noOfPersons = false;
                } else if (value < 1) {
                    fieldValidationErrors.noOfPersons = "No. of persons can't be less than 1!";
                    formValid.noOfPersons = false;
                } else if (value > 5) {
                    fieldValidationErrors.noOfPersons = "No. of persons can't be more than 5.";
                    formValid.noOfPersons = false;
                } else {
                    fieldValidationErrors.noOfPersons = "";
                    formValid.noOfPersons = true;
                }
                break;
            case "date":
                if (value === "") {
                    fieldValidationErrors.date = "This field can't be empty!";
                    formValid.date = false;
                } else {
                    let checkInDate = new Date(value);
                    let today = new Date();
                    if (today.getTime() > checkInDate.getTime()) {
                        fieldValidationErrors.date = "Check-in date cannot be a past date!";
                        formValid.date = false;
                    } else {
                        fieldValidationErrors.date = "";
                        formValid.date = true;
                    }
                }
                break;
            default:
                break;
        }

        formValid.buttonActive = formValid.noOfPersons && formValid.date;
        this.setState({
            loginformErrorMessage: fieldValidationErrors,
            loginformValid: formValid,
            successMessage: "",
            showCharge: formValid.buttonActive
        }, () => {
            if (this.state.bookingFormValid.buttonActive) {
                this.calculateCharges();

            }
        });
    }

    calculateCharges = () => {
        this.setState({ totalCharges: 0 });
        let oneDay = 24 * 60 * 60 * 1000;
        let checkInDate = new Date(this.state.bookingForm.date);
        let checkOutDateinMs = Math.round(Math.abs((checkInDate.getTime() + (this.state.bookingPackage.noOfNights) * oneDay)));
        let finalCheckOutDate = new Date(checkOutDateinMs);
        this.setState({ checkOutDate: finalCheckOutDate.toDateString() });
        if (this.state.bookingForm.flights) {
            let totalCost = (-(-this.state.bookingForm.noOfPersons)) * this.state.bookingPackage.chargesPerPerson + this.state.bookingPackage.flightCharges;
            let finalCost = totalCost - (totalCost * (this.state.bookingPackage.discount / 100));
            this.setState({ totalCharges: finalCost });
        } else {
            let totalCost = (-(-this.state.bookingForm.noOfPersons)) * this.state.bookingPackage.chargesPerPerson;
            let finalCost = totalCost - (totalCost * (this.state.bookingPackage.discount / 100));
            this.setState({ totalCharges: finalCost });
        }
    }
    displayPackageInclusion = () => {
        const packageInclusions = this.state.bookingPackage.details.itinerary.packageInclusions;
        if (this.state.bookingPackage) {
            return packageInclusions.map((pack, index) => (<li key={index}>{pack}</li>))
        }
        else {
            return null;
        }
    }

    displayPackageHighlights = () => {
        let packageHighLightsArray = [];
        let firstElement = (
            <li className="alignLeft" key="0">
                <p><b>Day 1:</b> {this.state.bookingPackage.details.itinerary.dayWiseDetails.firstDay}</p>
            </li>
        );
        packageHighLightsArray.push(firstElement);
        if (this.state.bookingPackage) {
            this.state.bookingPackage.details.itinerary.dayWiseDetails.restDaysSightSeeing.forEach((packageHighlight, index) => {
                let element = (
                    <li className="alignLeft" key={index + 1}>
                        <p><b>Day {this.state.bookingPackage.details.itinerary.dayWiseDetails.restDaysSightSeeing.indexOf(packageHighlight) + 2}:</b> {packageHighlight}</p>
                    </li>
                );
                packageHighLightsArray.push(element)
            });
            let lastElement = (
                <li className="alignLeft" key="last">
                    <p><b>Day {this.state.bookingPackage.details.itinerary.dayWiseDetails.restDaysSightSeeing.length + 2}:</b> {this.state.bookingPackage.details.itinerary.dayWiseDetails.lastDay}</p>
                </li>
            );
            packageHighLightsArray.push(lastElement);
            return packageHighLightsArray;
        } else {
            return null;
        }
    }

    goBack = () => {
        this.setState({ goBack: true })
    }

    bookPackage = (event) => {
        event.preventDefault();
        alert("Confirm Booking")
        let checkInDate = new Date(this.state.bookingForm.date).toDateString()
        let bookingData = {
            userId: sessionStorage.getItem("userId"),
            destId: this.state.bookingPackage.destinationId,
            destinationName: this.state.bookingPackage.name,
            checkInDate: checkInDate,
            checkOutDate: this.state.checkOutDate,
            noOfPersons: this.state.bookingForm.noOfPersons,
            totalCharges: this.state.totalCharges
        }
        axios.post("http://localhost:4000/booking/createBooking", bookingData)
            .then(response => {
                this.setState({ responseData: response.data })
            }).catch(error => {
                if (error.response) {
                    this.setState({ errorMessage: error.response.data.message })
                } else {
                    console.log(error);
                }
            })
        setTimeout(() => {
            this.setState({ progressSpinner: false })
        }, 2000)

    }

    componentWillUnmount() {
        let action = actionObj.sidebarBooking("", "", "", false, false);
        this.props.dispatch(action);
    }
    render() {
        let loggedIn = Boolean(sessionStorage.getItem("loggedIn"))
        if (!loggedIn) {
            alert("Please, login to continue booking with Wanderlust!!")
            return <Redirect to="/login" />
        }
        if (this.state.goBack) {
            return <Redirect to={"/"} />
        }
        return (
            <Fragment>
                {((this.state.bookingPackage.destinationId !== this.state.responseData.destId) && (!this.state.errorMessage)) ? (
                    <Fragment>
                        <h3 style={{ margin: "50px" }} className="text-success"><b>Booking: {this.state.bookingPackage.name}</b></h3>
                        <div className="container" style={{ marginBottom: "150px" }}>
                            <div className="row">

                                <br /><br />
                                <Accordion className="col-lg-6 accordion">
                                    <AccordionTab header="Overview" style={{ marginRight: "10px" }}>
                                        {this.state.bookingPackage.details.about}
                                    </AccordionTab>

                                    <AccordionTab header="Package Inclusion">
                                        <ul>
                                            {this.displayPackageInclusion()}
                                        </ul>
                                    </AccordionTab>

                                    <AccordionTab header="Itinerary">
                                        <ul>
                                            {this.displayPackageHighlights()}
                                        </ul>
                                    </AccordionTab>
                                </Accordion>

                                <div className="card cardStyle offset-lg-1 col-lg-5 shadow" style={{ padding: "15px" }}>
                                    <form onSubmit={this.bookPackage}>
                                        <div className="form-group">
                                            <label htmlFor="noOfPersons">Number of Traveller(s):</label>
                                            <input
                                                type="number"
                                                id="noOfPersons"
                                                className="form-control"
                                                name="noOfPersons"
                                                value={this.state.bookingForm.noOfPersons}
                                                onChange={this.handleChange}
                                                placeholder="Number of Traveller(s)"
                                            />
                                            <span className="text-danger">{this.state.bookingFormErrorMessage.noOfPersons}</span>
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="date">Trip start Date:</label>
                                            <input
                                                type="date"
                                                id="date"
                                                className="form-control"
                                                name="date"
                                                value={this.state.bookingForm.date}
                                                onChange={this.handleChange}
                                            />
                                            <span className="text-danger">{this.state.bookingFormErrorMessage.date}</span>
                                        </div>

                                        <div className="form-group">
                                            <label>Include Flights:</label>&nbsp;
                                            <InputSwitch name="flights" id="flights" checked={this.state.bookingForm.flights} onChange={this.handleChange} />
                                        </div>

                                        {this.state.totalCharges ?
                                            (
                                                <span className="text-success">
                                                    Your trip ends on {this.state.checkOutDate} and
                                        you will pay ${this.state.totalCharges} {this.state.bookingForm.flights ? <span>including flights</span> : <span>excluding flights</span>}
                                                </span>
                                            )
                                            : null}
                                        <br /><br />
                                        <div className="form-group">
                                            <button id="buttonBooking" className="btn btn-dark" type="submit" disabled={!this.state.bookingFormValid.buttonActive}>Confirm Booking</button>
                                            <button id="buttonGoBack" className="btn btn-dark" type="reset" onClick={this.goBack} style={{ marginLeft: "10px" }}>Go Back</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </Fragment>
                ) : (
                        <Fragment>
                            {(this.state.progressSpinner && (this.state.responseData || this.state.errorMessage)) ? <div style={{ margin: "175px" }}><ProgressSpinner /> </div> : (
                                <Fragment>
                                    {this.state.errorMessage ? (
                                        <h2 className="text-danger" style={{ margin: "200px" }}>{this.state.errorMessage}</h2>
                                    ) : (
                                            <div style={{ margin: "100px" }}>
                                                {this.state.responseData ? (
                                                    <Fragment>
                                                        <h1>Booking Confirmed !!</h1>
                                                        <br />
                                                        <h3 className="text-success">Congratulations!! Pack your bags for {this.state.responseData.destinationName}</h3>
                                                        <br />
                                                        <h4>Trip starts on: {this.state.responseData.checkInDate}</h4>
                                                        <h4>Trip ends on: {this.state.responseData.checkOutDate}</h4>
                                                        <br /><br />
                                                        <a href="/viewBookings">Click here to view your booking</a>
                                                    </Fragment>

                                                ) : (
                                                        <h1 className="text-danger" style={{ margin: "175px" }}>Sorry, something went wrong. Please try again !!</h1>
                                                    )}
                                            </div>)}
                                </Fragment>
                            )}
                        </Fragment>
                    )}
            </Fragment>
        )
    }
}

let mapStateToProps = (state) => {
    return {
        bookingPackage: state.bookingReducer.bookingPackage,
        noOfPerson: state.bookingReducer.noOfPerson,
        date: state.bookingReducer.date,
        totalCharge: state.bookingReducer.totalCharge,
        flights: state.bookingReducer.flights,
        buttonEnable: state.bookingReducer.buttonEnable
    }
}

export default connect(mapStateToProps)(Booking);