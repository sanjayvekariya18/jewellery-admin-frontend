import { createSelector } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";

const auth = (state) => state.auth;

export const getUserData = () =>
    useSelector(createSelector([auth], (state) => state.user)) || {};