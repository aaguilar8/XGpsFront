import { types } from "../../types/types";

const initialState = {
    open: false,
    severity:'',
    message:''
}

const openSnackBarReducer = (state = initialState, action) => {
    switch (action.type) {
        case types.openSnackBar:
            return {
                ...state,
                open: true,
                severity: action.openMessage.severity,
                message: action.openMessage.message
            };
        case types.closeSnackBar:
            return {
                ...state,
                open: false,
                severity: action.openMessage.severity,
                message: action.openMessage.message
            };
    }
}

export default openSnackBarReducer;