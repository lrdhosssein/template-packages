import { updateObject } from "../../utils/utility";
import * as actionTypes from "../actions/actionTypes";

const initialState = {
    token: null,
    user: null,
    error: "",
    verified: false,
    phone: "",
    notification: {
        type: "",
        title: "",
        message: "",
        warning: "",
        important: false,
        buttons: [],
    },
    notifLoadingIndex: -1,
    loading: false,
    authRedirectPath: null,
    checked: false,
    socket: null,
    reminder: {
        show: false,
        trialDays: "",
        children: null,
        color: null,
        close: undefined
    },
    lang: 'fa',
};

const setState = (state, action) => {
    const { key, value } = action.payload;
    return {
        ...state,
        [key]: value,
    };
};

const authStart = (state, action) => {
    return updateObject(state, {
        error: "",
        loading: true,
    });
};

const authSuccess = (state, action) => {
    return updateObject(state, {
        token: action.token,
        error: "",
        loading: false,
    });
};

const authFail = (state, action) => {
    return updateObject(state, {
        error: action.error,
        loading: false,
    });
};

const authLogout = (state, action) => {
    return updateObject(state, {
        token: null,
        user: null,
    });
};

const setUserData = (state, action) => {
    return updateObject(state, {
        user: action.user,
    });
};

const setReminder = (state, action) => {
    const { children, color, close } = action.payload;
    return updateObject(state, {
        reminder: {
            show: action.payload.show,
            children: children || null,
            color: color || null,
            close: close || undefined,
        },
    });
};
const setChecked = (state, action) => {
    return updateObject(state, { checked: action.checked });
};


const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.SET_STATE_AUTH:
            return setState(state, action);
        case actionTypes.AUTH_START:
            return authStart(state, action);
        case actionTypes.AUTH_SUCCESS:
            return authSuccess(state, action);
        case actionTypes.AUTH_FAIL:
            return authFail(state, action);
        case actionTypes.AUTH_LOGOUT:
            return authLogout(state, action);
        case actionTypes.SET_USER_DATA:
            return setUserData(state, action);
        case actionTypes.SET_REMINDER:
            return setReminder(state, action);
        case actionTypes.SET_CHECKED:
            return setChecked(state, action);
        default:
            return state;
    }
};

export default reducer;
