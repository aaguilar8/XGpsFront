import { alertSeverity } from "../../types/types";
import { types } from "../../types/types";

export const ShowInfoMessage = (message) => {
    return(messageStructure(message,alertSeverity.info));
}

export const ShowSuccessMessage = (message) => {
    return(messageStructure(message,alertSeverity.success));
}

export const ShowErrorMessage = (message) => {
    return(messageStructure(message,alertSeverity.error));
}

export const ShowWarningMessage = (message) => {
    return(messageStructure(message,alertSeverity.warning));
}

const messageStructure = (message,severity) => {
    return(
        {type:types.openSnackBar,
            openMessage: {
                message:message,
                severity: severity
            }
        });
}