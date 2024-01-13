import React, { useEffect, useMemo, useState } from 'react';
import _ from "lodash";
import PaginationTable, { usePaginationTable } from '../../components/UI/Pagination/PaginationTable';
import { API, HELPER } from '../../services';
import { apiConfig, appConfig } from '../../config';
import {
    Box,
    Icon,
    Tooltip,
    IconButton,
} from "@mui/material";
import { Breadcrumb, Container, StyledAddButton } from '../../components';
import { pageRoutes } from '../../constants/routesList';
import error400cover from "../../assets/no-data-found-page.png"
import TaxMaterDetails from './TaxMaterDetails';
import SearchFilterDialog from "../../components/UI/Dialog/SearchFilterDialog";
import ThemeSwitch from '../../components/UI/ThemeSwitch';
import Textinput from '../../components/UI/TextInput';
import ReactSelect from '../../components/UI/ReactSelect';
const TaxMaster = () => {

    /* Pagination code */
    const COLUMNS = [
        // { title: "Tax Type", classNameWidth: "thead-second-width-action-index" },
        { title: "Country Name", classNameWidth: "thead-second-width-action-index" },
        { title: "State Name", classNameWidth: "thead-second-width-action-index" },
        // { title: "Zipcode Type", classNameWidth: "thead-second-width-action-index" },
        // { title: "From Zipcode", classNameWidth: "thead-second-width-action-index" },
        // { title: "To Zipcode", classNameWidth: "thead-second-width-action-index" },
        { title: "Tax Rate", classNameWidth: "thead-second-width-action-index" },
        { title: "Visible", classNameWidth: "thead-second-width-action-index" },
        { title: "Action", classNameWidth: "thead-second-width-action-index" },
    ];
    const [paragraphs, setParagraphs] = useState([]);
    const [open, setOpen] = useState(false);
    const [openSearch, setOpenSearch] = useState(false);
    const [selectedUserData, setSelectedUserData] = useState(null);
    const [loading, setLoading] = useState();
    const [countryMaster, setCountryMaster] = useState([]);
    const [stateMaster, setStateMaster] = useState([]);
    const hiddenVisibleTax = (Id) => {
        API.put(apiConfig.visibility_tax.replace(":id", Id))
            .then((res) => {
                HELPER.toaster.success(res.message);
                paginate();
                setLoading(false);
            })
            .catch((err) => {
                HELPER.toaster.error(err);
            })
    };

    const handleEdit = (data) => {
        setSelectedUserData(data);
        setOpen(true);
    };
    useEffect(() => {
        API.get(`${apiConfig.listCountry}?searchTxt=`, { is_public_url: true })
            .then((res) => {
                setCountryMaster(res);
            })
            .catch(() => { });
    }, []);
    // ------------------- Shap options --------------------------------
    let _sortOptionsCountry = countryMaster.map((option) => ({
        label: option.name,
        value: option.id,
    }));

    // useEffect(() => {
    //     const paragraphElements = countryMaster.map(item => (
    //         <p key={item.id}>{item.id}</p>
    //     ));
    //     console.log(paragraphElements,"paragraphElements");
    //     setParagraphs(paragraphElements);
    // }, [countryMaster]);

    useEffect(() => {
        API.get(`${apiConfig.listStates}?countryId=`, { is_public_url: true })
            .then((res) => {
                setStateMaster(res);
            })
            .catch(() => { });
    }, []);


    // ------------------- Shap options --------------------------------
    let _sortOptionsState = stateMaster.map((option) => ({
        label: option.name,
        value: option.id,
    }));

    const { state, setState, changeState, ...otherTableActionProps } =
        usePaginationTable({
            // searchTxt: "",
            // isActive: "",
        });

    const paginate = (clear = false, isNewFilter = false) => {
        changeState("loader", true);
        let clearStates = {
            searchTxt: "",
            country_id: "",
            state_id: "",
            ...appConfig.default_pagination_state,
        };

        let filter = {
            page: state.page,
            searchTxt: state.searchTxt,
            rowsPerPage: state.rowsPerPage,
            country_id: state.country_id,
            state_id: state.state_id,
        };

        let newFilterState = { ...appConfig.default_pagination_state };
        if (clear) {
            delete filter.searchTxt;
            delete filter.isActive;
            delete filter.country_id;
            delete filter.state_id;
        } else if (isNewFilter) {
            filter = _.merge(filter, newFilterState);
        }
        // ----------Get Product Details Group Api------------
        setLoading(true);
        API.get(apiConfig.taxes, filter)
            .then((res) => {
                setLoading(false);
                setState({
                    ...state,
                    total_items: res.count,
                    data: res.rows,
                    ...(clear && clearStates),
                    ...(isNewFilter && newFilterState),
                    loader: false,
                });
            })
            .catch(() => {
                setLoading(false);
                setState({
                    ...state,
                    ...(clear && clearStates),
                    ...(isNewFilter && newFilterState),
                    loader: false,
                });
            });
    };
    useEffect(() => {
        paginate();
    }, [state.page, state.rowsPerPage]);
    const rows = useMemo(() => {
        return state.data.map((item) => {
            return {
                item: item,
                columns: [
                    <span>{item.country_name}</span>,
                    <span>{item.state_name}</span>,
                    <span>{item.tax_rate}</span>,
                    <span>
                        <ThemeSwitch
                            checked={item.status}
                            color="warning"
                            onChange={() => {
                                hiddenVisibleTax(item.id);
                            }}
                        />
                    </span>,
                    <div>
                        <IconButton onClick={(e) => handleEdit(item)}>
                            <Icon color="primary">create</Icon>
                        </IconButton>
                    </div>,
                ],
            };
        });
    }, [state.data]);

    const togglePopup = () => {
        if (open) {
            setSelectedUserData(null);
        }
        setOpen(!open);
    };
    const togglePopupSearch = () => {
        setOpenSearch(!openSearch);
    };
    console.log(selectedUserData, "select")

    return (
        <Container>
            <Box
                className="breadcrumb"
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                <Breadcrumb
                    routeSegments={[
                        { name: "Masters", path: pageRoutes.master.user.user },
                        { name: "Tax Details" },
                    ]}
                />
                <Tooltip title="Filter">
                    <IconButton
                        color="inherit"
                        className="button"
                        aria-label="Filter"
                        onClick={togglePopupSearch}
                    >
                        <Icon>filter_list</Icon>
                    </IconButton>
                </Tooltip>
            </Box>
            <div className='tax_first_row'>
                <PaginationTable
                    header={COLUMNS}
                    rows={rows}
                    totalItems={state.total_items || 0}
                    perPage={state.rowsPerPage}
                    activePage={state.page}
                    checkboxColumn={false}
                    selectedRows={state.selectedRows}
                    enableOrder={true}
                    isLoader={loading}
                    emptyTableImg={<img src={error400cover} width="400px" />}
                    {...otherTableActionProps}
                    orderBy={state.orderby}
                    order={state.order}
                ></PaginationTable>
            </div>

            <Tooltip title="Create" placement="top">
                <StyledAddButton
                    color="secondary"
                    aria-label="Add"
                    className="button"
                    onClick={togglePopup}
                >
                    <Icon>add</Icon>
                </StyledAddButton>
            </Tooltip>

            <SearchFilterDialog
                isOpen={openSearch}
                maxWidth="sm"
                onClose={() => setOpenSearch(false)}
                reset={() => {
                    changeState("searchTxt", ""); // Clear the search text
                    paginate(true);
                }}
                search={() => {
                    paginate(false, true);
                    setOpenSearch(false); // Close the modal
                }}
                loader={loading}
                className="product-details-select-box"
            >
                <ReactSelect
                    placeholder="Select Country"
                    options={_sortOptionsCountry}
                    value={state.country_id}
                    onChange={(e) => {
                        changeState("country_id", e.target.value || "");
                    }}
                    name="country_id"
                />
                <div style={{ marginTop: "20px"}}>
                    <ReactSelect
                        placeholder="Select State"
                        options={_sortOptionsState}
                        value={state.state_id}
                        onChange={(e) => {
                            changeState("state_id", e.target.value || "");
                        }}
                        name="state_id"
                    />
                </div>
            </SearchFilterDialog>

            <TaxMaterDetails
                open={open}
                togglePopup={() => {
                    togglePopup();
                    // paginate();
                }}
                userData={selectedUserData}
                callBack={() => paginate()}
            />
        </Container>
    );
}

export default TaxMaster;
