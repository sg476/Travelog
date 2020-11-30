let initialState = {
    bookingPackage: ""
}

let bookingReducer = (state = initialState, action) => {
    switch (action.type) {
        case "SENDBOOKINGDEAL":
            return {
                ...state,
                bookingPackage: action.bookingPackage
            }
        case "BOOKINGSIDEBAR":
            return {
                ...state,
                noOfPerson: action.noOfPerson,
                date: action.date,
                totalCharge: action.totalCharge,
                flights: action.flights,
                buttonEnable: action.buttonEnable
            }
        default:
            return state
    }

}

export default bookingReducer;