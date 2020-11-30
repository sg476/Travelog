import React, { Component, Fragment } from 'react';
import { Redirect } from 'react-router-dom';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import Alert from '@material-ui/lab/Alert';
import { ProgressSpinner } from 'primereact/progressspinner';
import axios from 'axios';

const useStyles = makeStyles((theme) => ({
    root: {
        '& > *': {
            margin: theme.spacing(1),
        },
    },
}));

class Register extends Component {
    constructor(props) {
        super(props);
        this.state = {
            form: {
                name: "",
                emailId: "",
                contactNo: "",
                password: ""
            },
            formErrorMessage: {
                nameErrorMessage: "",
                emailIdErrorMessage: "",
                contactNoErrorMessage: "",
                passwordErrorMessage: ""
            },
            formValid: {
                nameValid: false,
                emailIdValid: false,
                contactNoValid: false,
                passwordValid: false
            },
            buttonEnable: false,
            displayError: {
                name: false,
                emailId: false,
                contactNo: false,
                password: false
            },
            showPassword: false,
            showSuccessAlert: false,
            showErrorAlert: false,
            revertLogin: false,
            successMessage: "",
            errorMessage: "",
            progressSpinner: false
        }
    }

    handleClickShowPassword = () => {
        this.state.showPassword ? this.setState({ showPassword: false }) : this.setState({ showPassword: true })
    };

    showSuccessAlert = () => {
        this.state.showSuccessAlert ? this.setState({ showSuccessAlert: false }) : this.setState({ showSuccessAlert: true })
    }

    showErrorAlert = () => {
        this.state.showErrorAlert ? this.setState({ showErrorAlert: false }) : this.setState({ showErrorAlert: true })
    }

    handleChange = (event) => {
        event.preventDefault();
        let { form } = this.state;
        let inputFieldName = event.target.name;
        let inputFieldValue = event.target.value;
        form[inputFieldName] = inputFieldValue;
        this.setState({ form: form }, () => {
            //console.log(this.state.form);
            this.validator(inputFieldName, inputFieldValue);
        })

    }

    validator = (fieldName, fieldValue) => {
        let { formErrorMessage, formValid, displayError, ...stateValue } = this.state;
        switch (fieldName) {
            case "name":
                if (fieldValue === "") {
                    formErrorMessage["nameErrorMessage"] = "Required Field";
                    formValid["nameValid"] = false;
                    displayError["name"] = true;
                } else if (!fieldValue.match(/^[A-z]+(\s?[A-z])*$/)) {
                    formErrorMessage["nameErrorMessage"] = "Please enter valid name";
                    formValid["nameValid"] = false;
                    displayError["name"] = true;
                } else {
                    formErrorMessage["nameErrorMessage"] = "";
                    formValid["nameValid"] = true;
                    displayError["name"] = false;
                }
                break;
            case "emailId":
                if (fieldValue === "") {
                    formErrorMessage["emailIdErrorMessage"] = "Required Field";
                    formValid["emailIdValid"] = false;
                    displayError["emailId"] = true;
                } else if (!fieldValue.match(/^[A-z]+@[A-z]+\.com$/)) {
                    formErrorMessage["emailIdErrorMessage"] = "Please enter valid email Id in the format example@example.com";
                    formValid["emailIdValid"] = false;
                    displayError["emailId"] = true;
                } else {
                    formErrorMessage["emailIdErrorMessage"] = "";
                    formValid["emailIdValid"] = true;
                    displayError["emailId"] = false;
                }
                break;
            case "contactNo":
                if (fieldValue === "") {
                    formErrorMessage["contactNoErrorMessage"] = "Required Field";
                    formValid["contactNoValid"] = false;
                    displayError["contactNo"] = true;
                } else if (!fieldValue.match(/^[0-9]{10}$/)) {
                    formErrorMessage["contactNoErrorMessage"] = "Please enter valid 10 digit contact number";
                    formValid["contactNoValid"] = false;
                    displayError["contactNo"] = true;
                } else {
                    formErrorMessage["contactNoErrorMessage"] = "";
                    formValid["contactNoValid"] = true;
                    displayError["contactNo"] = false;
                }
                break;
            case "password":
                if (fieldValue === "") {
                    formErrorMessage["passwordErrorMessage"] = "Required Field";
                    formValid["passwordValid"] = false;
                    displayError["password"] = true;
                } else {
                    if (!fieldValue.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/)) {
                        formErrorMessage["passwordErrorMessage"] = "Please, use one uppercase, one lowercase, one digit and any one !, @, #, $, %, ^, &, *";
                        formValid["passwordValid"] = false;
                        displayError["password"] = true;
                    } else if (fieldValue.length < 7 || fieldValue.length > 20) {
                        formErrorMessage["passwordErrorMessage"] = "Password should be of 7 to 20 characters";
                        formValid["passwordValid"] = false;
                        displayError["password"] = true;
                    } else {
                        formErrorMessage["passwordErrorMessage"] = "";
                        formValid["passwordValid"] = true;
                        displayError["password"] = false;
                    }
                }
                break;
            default:
                break;
        }
        stateValue.buttonEnable = formValid.nameValid && formValid.emailIdValid && formValid.contactNoValid && formValid.passwordValid;
        this.setState({ formErrorMessage: formErrorMessage, formValid: formValid, displayError: displayError, buttonEnable: stateValue.buttonEnable })
    }

    handlesubmit = (event) => {
        event.preventDefault()
        this.setState({ progressSpinner: true })
        this.updateDatabase();
    }
    updateDatabase = () => {
        let { form } = this.state;
        axios.post("http://localhost:4000/user/register", form)
            .then((response) => {
                console.log(response.data);
                this.setState({ successMessage: response.data, showErrorAlert: false }, () => {
                    this.showSuccessAlert();
                    setTimeout(() => {
                        this.setState({ revertLogin: true })
                    }, 3000)
                });
            })
            .catch((error) => {
                if (error.response) {
                    this.setState({ errorMessage: error.response.data.message, progressSpinner: false }, () => {
                        this.showErrorAlert();
                    });
                } else {
                    console.log(error);
                }
            })
    }
    render() {
        const { classes } = this.props;
        if (this.state.revertLogin) { return <Redirect to='/login' /> }
        return (
            <Fragment>
                {this.state.showSuccessAlert ? <Alert severity="success">{this.state.successMessage}</Alert> : null}
                {this.state.showErrorAlert ? <Alert severity="error">{this.state.errorMessage}</Alert> : null}
                {this.state.progressSpinner ? <div style={{ margin: "175px" }}><ProgressSpinner /></div> : (
                    <section id="registerPage" className="registerSection">
                        <div className="container-fluid">
                            <div className="row">
                                <div className="col-lg-6 offset-3" style={{ padding: "15px", marginBottom: "50px" }}>
                                    <h1>Join Us</h1>
                                    <p>Register with us to feed your wanderlust. You can easily manage all your travel-packages and can avail the premium services offered to our registered customer.</p>
                                    <form className={classes.root} onSubmit={this.handlesubmit}>
                                        <FormControl error={this.state.displayError.name}>
                                            <InputLabel htmlFor="name">Name<span style={{ color: "red" }}>*</span></InputLabel>
                                            <Input type="text" id="name" name="name" aria-describedby="component-error-text" style={{ width: "500px" }} onChange={this.handleChange} />
                                            <FormHelperText id="nameError">{this.state.formErrorMessage.nameErrorMessage}</FormHelperText>
                                        </FormControl><br /><br />

                                        <FormControl error={this.state.displayError.emailId}>
                                            <InputLabel htmlFor="emailId">Email Id<span style={{ color: "red" }}>*</span></InputLabel>
                                            <Input type="text" id="emailId" name="emailId" aria-describedby="component-error-text" style={{ width: "500px" }} onChange={this.handleChange} />
                                            <FormHelperText id="emailIdError">{this.state.formErrorMessage.emailIdErrorMessage}</FormHelperText>
                                        </FormControl><br /><br />

                                        <FormControl error={this.state.displayError.contactNo}>
                                            <InputLabel htmlFor="contactNo">Contact No.<span style={{ color: "red" }}>*</span></InputLabel>
                                            <Input type="number" id="contactNo" name="contactNo" aria-describedby="component-error-text" style={{ width: "500px" }} onChange={this.handleChange} />
                                            <FormHelperText id="contactNoError">{this.state.formErrorMessage.contactNoErrorMessage}</FormHelperText>
                                        </FormControl><br /><br />

                                        <FormControl error={this.state.displayError.password}>
                                            <InputLabel htmlFor="password">Password<span style={{ color: "red" }}>*</span></InputLabel>
                                            <Input
                                                id="password"
                                                name="password"
                                                type={this.state.showPassword ? 'text' : 'password'}
                                                style={{ width: "500px" }}
                                                onChange={this.handleChange}
                                                endAdornment={
                                                    <InputAdornment position="end">
                                                        <IconButton
                                                            aria-label="toggle password visibility"
                                                            onClick={this.handleClickShowPassword}
                                                        >
                                                            {this.state.showPassword ? <Visibility /> : <VisibilityOff />}
                                                        </IconButton>
                                                    </InputAdornment>
                                                }
                                            />
                                            <FormHelperText id="passwordError">{this.state.formErrorMessage.passwordErrorMessage}</FormHelperText>
                                        </FormControl><br /><br />

                                        <FormControl><span><span style={{ color: "red" }} >*</span> marked field are mandatory</span></FormControl><br /><br />

                                        <FormControl>
                                            <button type="submit" className="btn btn-dark" style={{ width: "500px" }} disabled={!this.state.buttonEnable} >
                                                Register
                                        </button>
                                        </FormControl>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </section>)}
            </Fragment>
        )
    }


}

export default withStyles(useStyles)(Register);