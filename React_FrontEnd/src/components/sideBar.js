import React, { Component } from 'react'
import { Sidebar } from 'primereact/sidebar';
import { TabView, TabPanel } from 'primereact/tabview';
import { InputSwitch } from 'primereact/inputswitch';
import { connect } from 'react-redux';
import actionObj from '../Action/Action';
import { Redirect } from 'react-router-dom';

class SidebarElement extends Component {
    constructor(props) {
        super(props);
        this.state = {
            bookingForm: {
                noOfPersons: "",
                date: "",  //2020-05-20
                flights: false
            },
            bookingFormErrorMessage: {
                noOfPersons: "",
                date: ""
            },
            bookingFormValid: {
                noOfPersons: false,
                date: false,
                buttonActive: false
            },
            showItinerary: this.props.show,
            bookingPage: false,
            show: false,
            packages: [],
            errorMessage: "",
            successMessage: "",
            totalCharges: "",
            continent: "",
            dealId: "",
            deal: this.props.deal,
            index: this.props.index,
            packagePage: false,
            checkOutDate: new Date(),
            visibleRight: false,
        }
    }

    componentWillUnmount() {
        this.hideSidebar();
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
                    fieldValidationErrors.noOfPersons = "No. of persons can't be more than 5!";
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
            successMessage: ""
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
        let checkOutDateinMs = Math.round(Math.abs((checkInDate.getTime() + (this.state.deal.noOfNights) * oneDay)));
        let finalCheckOutDate = new Date(checkOutDateinMs);
        this.setState({ checkOutDate: finalCheckOutDate.toDateString() });
        if (this.state.bookingForm.flights) {
            let totalCost = (-(-this.state.bookingForm.noOfPersons)) * this.state.deal.chargesPerPerson + this.state.deal.flightCharges;
            let finalCost = totalCost - (totalCost * (this.state.deal.discount / 100));
            this.setState({ totalCharges: finalCost });
        } else {
            let totalCost = (-(-this.state.bookingForm.noOfPersons)) * this.state.deal.chargesPerPerson;
            let finalCost = totalCost - (totalCost * (this.state.deal.discount / 100));
            this.setState({ totalCharges: finalCost });
        }
    }

    displayPackageInclusions = () => {
        const packageInclusions = this.state.deal.details.itinerary.packageInclusions;
        if (this.state.deal) {
            return packageInclusions.map((pack, index) => (<li key={index}>{pack}</li>))
        }
        else {
            return null;
        }
    }
    displayPackageHighlights = () => {
        let packageHighLightsArray = [];
        let firstElement = (
            <div key={0}>
                <h3><b>Day wise itinerary</b></h3><br />
                <span className="alignLeft"><h5><b>Day 1:</b> {this.state.deal.details.itinerary.dayWiseDetails.firstDay}</h5></span>
            </div>
        );
        packageHighLightsArray.push(firstElement);
        if (this.state.deal) {
            this.state.deal.details.itinerary.dayWiseDetails.restDaysSightSeeing.forEach((packageHighlight, index) => {
                let element = (
                    <div key={index + 1} className="alignLeft">
                        <h5><b>Day {this.state.deal.details.itinerary.dayWiseDetails.restDaysSightSeeing.indexOf(packageHighlight) + 2}:</b> {packageHighlight}</h5>
                    </div>
                );
                packageHighLightsArray.push(element)
            });
            let lastElement = (
                <div key={666} className="alignLeft">
                    <h5><b>Day {this.state.deal.details.itinerary.dayWiseDetails.restDaysSightSeeing.length + 2}:</b> {this.state.deal.details.itinerary.dayWiseDetails.lastDay}</h5>
                    <br />
                    <div className="text-danger">
                        **This itinerary is just a suggestion, itinerary can be modified as per requirement. <a
                            href="/">Contact us</a> for more details.
                    </div>
                </div>
            );
            packageHighLightsArray.push(lastElement);
            return packageHighLightsArray;
        } else {
            return null;
        }
    }

    handleSubmit = (event) => {
        event.preventDefault();
        this.calculateCharges();
    }

    hideSidebar = () => {
        let action = actionObj.hideSidebar("", false, null);
        this.props.dispatch(action);
        this.setState({ showItinerary: false });
    }

    bookPackage = (selectedPackage) => {
        let dealId = selectedPackage.destinationId;
        let action = actionObj.bookingPackage(selectedPackage);
        let actionTwo = actionObj.sidebarBooking(this.state.bookingForm.noOfPersons, this.state.bookingForm.date, this.state.totalCharges, this.state.bookingForm.flights, true);
        this.props.dispatch(action);
        this.props.dispatch(actionTwo);
        this.setState({ dealId: dealId, bookingPage: true })
    }
    render() {
        if (this.state.bookingPage) { return <Redirect to={"/book/" + this.state.dealId} /> }
        return (
            <Sidebar visible={this.state.showItinerary} position="right" className="p-sidebar-lg" onHide={this.hideSidebar}>
                <h2 style={{ margin: "15px" }}><b>{this.state.deal.name}</b></h2>
                <TabView activeIndex={Number(this.state.index)} onTabChange={(e) => this.setState({ index: e.index })}>
                    <TabPanel header="Overview">
                        <div className="row" style={{ padding: "20px" }}>
                            {this.state.deal ?
                                <div className="col-md-6 text-center">
                                    <img className="package-image" src={this.state.deal.imageUrl} alt="destination comes here" />
                                </div> : null}

                            <div className="col-md-6 alignLeft">
                                <h4><b>Package Includes:</b></h4>
                                <ul>
                                    {this.state.showItinerary ? this.displayPackageInclusions() : null}
                                </ul>
                            </div>
                        </div>
                        <div className="text-justify itineraryAbout">
                            <h4><b>Tour Overview:</b></h4>
                            {this.state.deal ? this.state.deal.details.about : null}
                        </div>
                    </TabPanel>

                    <TabPanel header="Itinerary">
                        <div style={{ padding: "20px" }}>
                            {this.displayPackageHighlights()}
                        </div>

                    </TabPanel>

                    <TabPanel header="Book">
                        <div style={{ padding: "20px" }}>
                            <h4 className="itenaryAbout text-success alignLeft"><b>Charges per person: $ {this.state.deal.chargesPerPerson}</b></h4><br />
                            <form onSubmit={this.handleSubmit}>
                                <div className="form-group alignLeft">
                                    <label htmlFor="noOfPersons"><b>Number of Traveller(s):</b><span className="text-danger">*</span></label>
                                    <input
                                        type="number"
                                        id="noOfPersons"
                                        className="form-control"
                                        name="noOfPersons"
                                        value={this.state.bookingForm.noOfPersons}
                                        onChange={this.handleChange}
                                        placeholder="Number of Traveller(s)"
                                    />
                                    {this.state.bookingFormErrorMessage.noOfPersons ?
                                        <span className="text-danger">{this.state.bookingFormErrorMessage.noOfPersons}</span>
                                        : null}
                                </div>
                                <div className="form-group alignLeft">
                                    <label htmlFor="date"><b>Trip start Date:</b><span className="text-danger">*</span></label>
                                    <input
                                        type="date"
                                        id="date"
                                        className="form-control"
                                        name="date"
                                        value={this.state.bookingForm.date}
                                        onChange={this.handleChange}
                                    />
                                    {this.state.bookingFormErrorMessage.date ?
                                        <span className="text-danger">{this.state.bookingFormErrorMessage.date}</span>
                                        : null}
                                </div>
                                <div className="form-group">
                                    <label><b>Include Flights: </b></label>&nbsp;
                                <InputSwitch name="flights" id="flights" checked={this.state.bookingForm.flights} onChange={this.handleChange} />
                                </div>
                            </form>
                            {!this.state.totalCharges ?
                                (
                                    null
                                )
                                :
                                (
                                    <h5 className="text-success">
                                        Your trip ends on {this.state.checkOutDate} and
                                        you will pay ${this.state.totalCharges} {this.state.bookingForm.flights ? <span>including flights</span> : <span>excluding flights</span>}
                                    </h5>
                                )
                            }
                            <p><span className="text-danger">*</span>Required fields</p>
                            <div className="text-center">
                                <button disabled={!this.state.bookingFormValid.buttonActive} className="btn btn-dark" onClick={() => this.bookPackage(this.state.deal)}>Book</button>
                                &nbsp; &nbsp; &nbsp;
                            <button type="button" className="btn btn-dark" onClick={this.hideSidebar}>Cancel</button>
                            </div>
                        </div>
                    </TabPanel>
                </TabView>
            </Sidebar>
        )
    }
}

let mapStateToProps = (state) => {
    return {
        show: state.sidebarReducer.show,
        index: state.sidebarReducer.index,
        deal: state.sidebarReducer.deal,
        bookingPackage: state.bookingReducer.bookingPackage,
        noOfPerson: state.bookingReducer.noOfPerson,
        date: state.bookingReducer.date,
        totalCharge: state.bookingReducer.totalCharge,
        flights: state.bookingReducer.flights,
        buttonEnable: state.bookingReducer.buttonEnable
    }
}

export default connect(mapStateToProps)(SidebarElement);