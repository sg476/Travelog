let actionObj = {}

actionObj.showSidebar = (deal, show, index) => {
    return {
        type: "SHOWSIDEBAR",
        show: show,
        deal: deal,
        index: index
    }
}

actionObj.hideSidebar = (deal, show, index) => {
    return {
        type: "HIDESIDEBAR",
        show: show,
        deal: deal,
        index: index
    }
}

actionObj.bookingPackage = (deal) => {
    return {
        type: "SENDBOOKINGDEAL",
        bookingPackage: deal
    }
}

actionObj.sidebarBooking = (noOfPerson, date, totalCharge, flights, buttonEnable) => {
    return {
        type: "BOOKINGSIDEBAR",
        noOfPerson: noOfPerson,
        date: date,
        totalCharge: totalCharge,
        flights: flights,
        buttonEnable: buttonEnable
    }
}

export default actionObj; 