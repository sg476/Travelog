let initialState = {
    show: false,
    deal: "",
    index: null
}

let sidebarReducer = (state = initialState, action) => {
    switch (action.type) {
        case "SHOWSIDEBAR":
            return {
                ...state,
                deal: action.deal,
                show: action.show,
                index: action.index
            }
        case "HIDESIDEBAR":
            return {
                ...state,
                deal: action.deal,
                show: action.show,
                index: action.index
            }
        default:
            return state
    }
}

export default sidebarReducer;