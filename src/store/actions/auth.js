import axios from "axios";
import * as actionTypes from "./actionTypes";
import { baseUrl } from "../../constants/Config";

export const setStateAuth = (payload) => {
    return {
        type: actionTypes.SET_STATE_AUTH,
        payload,
    };
};

export const authStart = () => {
    return {
        type: actionTypes.AUTH_START,
    };
};

export const authSuccess = (token) => {
    return {
        type: actionTypes.AUTH_SUCCESS,
        token,
    };
};

export const authFail = (error) => {
    return {
        type: actionTypes.AUTH_FAIL,
        error,
    };
};

export const logout = () => {
    localStorage.removeItem("a1");
    localStorage.removeItem("a2");
    return {
        type: actionTypes.AUTH_LOGOUT,
    };
};

export const setUserData = (user) => {
    return {
        type: actionTypes.SET_USER_DATA,
        user,
    };
};

export const getUserData = (token) => {
    return (dispatch) => {
        return axios
            .get(`${baseUrl}api/get_user_data`, { headers: { "auth-token": token } })
            .then((result) => {
                dispatch({
                    type: actionTypes.SET_USER_DATA,
                    user: result.data.result.user,
                });
            });
    };
};

export const setReminder = (payload) => {
    return {
        type: actionTypes.SET_REMINDER,
        payload,
    };
};
export const setChecked = () => {
    return {
        type: actionTypes.SET_CHECKED,
        checked: true,
    };
};

export const authCheckState = () => {
    return (dispatch) => {
        const token = localStorage.getItem("a1");
        let valid = token ? true : false
        dispatch(setChecked());
        if (!valid) {
            dispatch(logout());
        } else {
            dispatch(authSuccess(token));
        }
    };
};