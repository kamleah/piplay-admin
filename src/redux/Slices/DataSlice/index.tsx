import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    sideBardata: [],
    createdroles: [],
    allRoles: [],
    selectedFacility : {}
};

const dataSlice = createSlice({
    name: 'data',
    initialState,
    reducers: {
        setCreatedRoles: (state, action) => {
            state.createdroles = action.payload;
        },
        setSideBarData: (state, action) => {
            state.sideBardata = action.payload;
        },
        setAllRoles: (state, action) => {
            state.allRoles = action.payload;
        },
        setSelectedFacility: (state, action) => {
            state.selectedFacility = action.payload;
        }

    }
});

export const { setCreatedRoles, setSideBarData, setAllRoles, setSelectedFacility } = dataSlice.actions;

export default dataSlice.reducer;
