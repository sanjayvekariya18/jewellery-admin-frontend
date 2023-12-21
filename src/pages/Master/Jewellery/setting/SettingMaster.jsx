import React, { useEffect, useState, useCallback } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import SettingsApplicationsIcon from '@mui/icons-material/SettingsApplications';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import AddCardIcon from '@mui/icons-material/AddCard';
import { makeStyles } from '@material-ui/core/styles';
import { Card } from "@mui/material"
import { API, HELPER } from '../../../../services';
import { apiConfig } from '../../../../config';
import ImgUploadBoxInput from '../../../../components/UI/ImgUploadBoxInput';
import Textinput from '../../../../components/UI/TextInput';
import ProductSettings from './partials/ProductSettings';
import AddHomeWorkIcon from '@mui/icons-material/AddHomeWork';
import MetalPriceSetting from './partials/MetalPriceSetting';
import DataSaverOnIcon from '@mui/icons-material/DataSaverOn';

const useStyles = makeStyles({
    horizontalIconLabel: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        gap: '8px', // Adjust the gap between icon and label as needed
    },
});

const SettingMaster = () => {
    const [value, setValue] = useState('general');
    const [formOpen, setFormOpen] = useState(true);
    const [setting, setSetting] = useState({});
    const [settingMetal, setSettingMetal] = useState({});
    const [formState, setFormState] = useState({});
    // const [formStateMetal, setFormStateMetal] = useState({});

    const handleChange = (event, batch) => {
        setValue(batch);
        setFormOpen(true); // Open form when tab is clicked

        setFormState((prevState) => ({
            ...setting[batch]
        }));
    };

    // const handleChangeMetal = (event, batch) => {
    //     setValue(batch);
    //     setFormOpen(true); // Open form when tab is clicked

    //     setFormStateMetal((prevState) => ({
    //         ...settingMetal[batch]
    //     }));
    // };

    const uploadLogo = (callback) => {
        if (formState?.logo && typeof formState?.logo != 'string') {
            const formData = new FormData();
            formData.append('file', formState.logo)

            API.post(apiConfig.appSettingsUploadFile, formData)
                .then((res) => {
                    if (res?.upload_path) {
                        callback(res.upload_path)
                    }
                })
                .catch((error) => {
                });
        }
    };

    const handleSubmit = (formData) => {
        if (formOpen && value === 'fixed_price')
            if (formData.engraving_price === null || formData.engraving_price === undefined || formData.engraving_price === "") {
                HELPER.toaster.error('Engraving Price is required and at least provide 0.');
                return;
            }
        // Continue with the API call if engraving_price is not null
        API.put(apiConfig.appSettingsEdit, formData)
            .then((res) => {
                getAllAppSettings();
                HELPER.toaster.success('Setting updated successfully!');
            })
            .catch(() => { })
    };

    const onChange = useCallback((e) => {
        const { name, value } = e.target;
        setFormState((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    }, []);
    // const onChangeMetal = useCallback((e) => {
    //     const { name, value } = e.target;
    //     setFormStateMetal((prevState) => ({
    //         ...prevState,
    //         [name]: value,
    //     }));
    // }, []);

    const getAllAppSettings = () => {
        API.get(apiConfig.appSettings)
            .then((res) => {
                setSetting(res);
                setFormState((prevState) => ({
                    ...res[value],
                }));
            })
            .catch((error) => {
                console.error('Error fetching settings:', error);
            });
    }
    const getAllAppSettingsMetal = () => {
        API.get(apiConfig.metalPrice)
            .then((res) => {
                setSettingMetal(res);
                // setFormStateMetal((prevState) => ({
                //     ...res[value],
                // }));
            })
            .catch((error) => {
                console.error('Error fetching settings:', error);
            });
    }

    useEffect(() => {
        getAllAppSettings()
        getAllAppSettingsMetal()
    }, []);


    // Inside your component
    const classes = useStyles();
    return (
        <Box sx={{ display: 'flex' }} className="tab">
            <Box sx={{ width: '20%', borderRight: 1, paddingTop: "20px", borderColor: 'divider' }}>
                <Tabs
                    orientation="vertical"
                    variant="scrollable"
                    value={value}
                    onChange={handleChange}
                >
                    <Tab
                        value={'general'}
                        label={
                            <div className={classes.horizontalIconLabel}>
                                <SettingsApplicationsIcon />
                                <span>General</span>
                            </div>
                        }
                    />
                    <Tab
                        value={'social_link'}
                        label={
                            <div className={classes.horizontalIconLabel}>
                                <ChatBubbleOutlineIcon />
                                <span>Social Link</span>
                            </div>
                        }
                    />
                    <Tab
                        value={'fixed_price'}
                        label={
                            <div className={classes.horizontalIconLabel}>
                                <AddCardIcon />
                                <span>Fixed Price</span>
                            </div>
                        }
                    />
                    <Tab
                        value={'home_products'}
                        label={
                            <div className={classes.horizontalIconLabel}>
                                <AddHomeWorkIcon />
                                <span>Home Product</span>
                            </div>
                        }
                    />
                    <Tab
                        value={'metal_price'}
                        label={
                            <div className={classes.horizontalIconLabel}>
                                <DataSaverOnIcon />
                                <span>Metal Price</span>
                            </div>
                        }
                    />
                </Tabs>
            </Box>

            <Card style={{ margin: "30px", width: "100%" }}>
                <Box sx={{ flexGrow: 1, padding: 2 }}>
                    <form>
                        {formOpen && value === 'general' && (
                            <>
                                <Textinput
                                    size="medium"
                                    label="Contact Number"
                                    value={formState.contact_number || ""}
                                    onChange={onChange}
                                    type="text"
                                    name="contact_number"
                                    fullWidth
                                    sx={{ mb: 2, mt: 1, width: "100%" }}
                                />
                                <Textinput
                                    size="medium"
                                    label="Company Name"
                                    value={formState.company_name || ""}
                                    onChange={onChange}
                                    name="company_name"
                                    type="text"
                                    sx={{ mb: 2, mt: 1, width: "100%", height: "100%" }}
                                />
                                <Textinput
                                    size="medium"
                                    label="Email"
                                    value={formState.email || ""}
                                    onChange={onChange}
                                    type="text"
                                    name="email"
                                    sx={{ mb: 2, mt: 1, width: "100%", height: "100%" }}
                                />
                                <Textinput
                                    size="medium"
                                    label="Address"
                                    value={formState.address || ""}
                                    onChange={onChange}
                                    type="text"
                                    name="address"
                                    sx={{ mb: 2, mt: 1, width: "100%", height: "100%" }}
                                />
                                <Textinput
                                    size="medium"
                                    label="Cancel Days"
                                    value={formState.cancel_days || ""}
                                    onChange={onChange}
                                    type="number"
                                    name="cancel_days"
                                    sx={{ mb: 2, mt: 1, width: "100%", height: "100%" }}
                                />
                                <Textinput
                                    size="medium"
                                    label="Return Days"
                                    value={formState.returnDays || ""}
                                    onChange={onChange}
                                    type="number"
                                    name="returnDays"
                                    sx={{ mb: 2, mt: 1, width: "100%", height: "100%" }}
                                />
                                <Textinput
                                    size="medium"
                                    label="Delivery Days"
                                    value={formState.deliveryDays || ""}
                                    onChange={onChange}
                                    type="number"
                                    name="deliveryDays"
                                    sx={{ mb: 2, mt: 1, width: "100%", height: "100%" }}
                                />
                                <Textinput
                                    size="medium"
                                    label="Map Link"
                                    value={formState.map_link || ""}
                                    onChange={onChange}
                                    type="text"
                                    name="map_link"
                                    sx={{ mb: 2, mt: 1, width: "100%", height: "100%" }}
                                />

                                <label className="label-class">Logo</label>
                                <ImgUploadBoxInput
                                    name="logo"
                                    onChange={onChange}
                                    value={HELPER.getImageUrl(formState?.logo) || ''}
                                    label={"Profile Image"}
                                />
                            </>
                        )}

                        {formOpen && value === 'social_link' && (
                            <>
                                <Textinput
                                    size="medium"
                                    label="FaceBook"
                                    value={formState.facebook}
                                    onChange={onChange}
                                    type="text"
                                    name="facebook"
                                    fullWidth
                                    sx={{ mb: 2, mt: 1, width: "100%" }}
                                />
                                <Textinput
                                    size="medium"
                                    label="Instagram"
                                    value={formState.instagram}
                                    onChange={onChange}
                                    type="text"
                                    name="instagram"
                                    fullWidth
                                    sx={{ mb: 2, mt: 1, width: "100%" }}
                                />
                                <Textinput
                                    size="medium"
                                    label="Twitter"
                                    value={formState.twitter}
                                    onChange={onChange}
                                    type="text"
                                    name="twitter"
                                    fullWidth
                                    sx={{ mb: 2, mt: 1, width: "100%" }}
                                />
                                <Textinput
                                    size="medium"
                                    label="Linkedin"
                                    value={formState.linkedin}
                                    onChange={onChange}
                                    type="text"
                                    name="linkedin"
                                    fullWidth
                                    sx={{ mb: 2, mt: 1, width: "100%" }}
                                />
                                <Textinput
                                    size="medium"
                                    label="Skype"
                                    value={formState.skype}
                                    onChange={onChange}
                                    type="text"
                                    name="skype"
                                    fullWidth
                                    sx={{ mb: 2, mt: 1, width: "100%" }}
                                />
                            </>
                        )}

                        {formOpen && value === 'fixed_price' && (

                            <Textinput
                                size="medium"
                                label="Engraving Price"
                                value={formState.engraving_price}
                                onChange={onChange}
                                type="number"
                                name="engraving_price"
                                fullWidth
                                sx={{ mb: 2, mt: 1, width: "100%" }}
                            />
                        )}
                        {formOpen && value === 'metal_price' && (
                            <MetalPriceSetting metalProduct={settingMetal} callback={() => getAllAppSettingsMetal()} />
                        )}

                        {formOpen && value === 'home_products' && (
                            <ProductSettings homeProduct={setting?.meta?.home_product || {}} callback={() => getAllAppSettings()} />
                        )}

                        {!['home_products', 'metal_price'].includes(value) && (
                            <>
                                <Button type="button" variant="contained" color="primary" onClick={() => {
                                    if (formState?.logo && typeof formState?.logo != 'string') {
                                        uploadLogo((logoUrl) => {
                                            handleSubmit({
                                                ...formState,
                                                logo: logoUrl
                                            })
                                        })
                                    } else {
                                        handleSubmit({
                                            ...formState,
                                        })
                                    }
                                }}>
                                    Submit
                                </Button>

                            </>
                        )}
                    </form>

                </Box>
            </Card >
        </Box>
    );
}

export default SettingMaster;
