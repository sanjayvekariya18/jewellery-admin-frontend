import React, { useEffect, useState, useCallback } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import SettingsApplicationsIcon from '@mui/icons-material/SettingsApplications';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import AddCardIcon from '@mui/icons-material/AddCard';
import { makeStyles } from '@material-ui/core/styles';
import { Card } from "@mui/material"
import { API } from '../../../../services';
import { apiConfig } from '../../../../config';


const SettingMaster = () => {

    const [value, setValue] = useState(0);
    const [formOpen, setFormOpen] = useState(true);
    const [setting, setSetting] = useState({});
    const [formState, setFormState] = useState({});

    const handleChange = (event, newValue) => {
        setValue(newValue);
        setFormOpen(true); // Open form when tab is clicked
    };

    const handleCloseForm = () => {
        setFormOpen(false); // Close form when submit or close button is clicked
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log(Object.values(formState), "formState")


        const payload = {
            key: Object.keys(formState), // Add the key 'engraving_price'
            value: Object.values(formState) === "" ? Object.values(setting) : Object.values(formState), // Add the corresponding value
        }

            API.put(apiConfig.appSettingsEdit, payload)
                .then((res) => {
                    console.log('Settings updated:', res);
                    handleCloseForm(); // Close form after successful update
                })
                .catch((error) => {
                    console.error('Error updating settings:', error);
                    // Handle error
                });

        };

        const onChange = useCallback((e) => {
            const { name, value } = e.target;
            setFormState((prevState) => ({
                ...prevState,
                [name]: value,
            }));
        }, []);


        const useStyles = makeStyles({
            horizontalIconLabel: {
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'flex-start',
                gap: '8px', // Adjust the gap between icon and label as needed
            },
        });

        useEffect(() => {
            API.get(apiConfig.appSettings)
                .then((res) => {
                    setSetting(res);
                    // Update the formState with retrieved settings
                    setFormState((prevState) => ({
                        ...prevState,
                        ...res.general,
                    }));
                })
                .catch((error) => {
                    console.error('Error fetching settings:', error);
                });
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
                            value={0}
                            label={
                                <div className={classes.horizontalIconLabel}>
                                    <SettingsApplicationsIcon />
                                    <span>General</span>
                                </div>
                            }
                        />
                        <Tab
                            value={1}
                            label={
                                <div className={classes.horizontalIconLabel}>
                                    <ChatBubbleOutlineIcon />
                                    <span>Social Link</span>
                                </div>
                            }
                        />
                        <Tab
                            value={2}
                            label={
                                <div className={classes.horizontalIconLabel}>
                                    <AddCardIcon />
                                    <span>Fixed Price</span>
                                </div>
                            }
                        />
                    </Tabs>
                </Box>

                <Card style={{ marginTop: "30px" }}>
                    <Box sx={{ flexGrow: 1, padding: 2 }}>
                        {formOpen && value === 0 && (
                            <form onSubmit={handleSubmit}>
                                <TextField label="Contact Number" fullWidth margin="normal" value={formState.contact_number || ''} onChange={onChange} name='contact_number' />
                                <TextField label="Company Name" fullWidth margin="normal" value={formState.company_name || ''} onChange={onChange} name='company_name' />
                                <TextField label="Email" fullWidth margin="normal" value={setting?.general?.email === undefined ? "" : setting?.general?.email} />
                                <TextField label="Address" fullWidth margin="normal" value={setting?.general?.address === undefined ? "" : setting?.general?.address} />
                                <TextField label="Cancel Days" fullWidth margin="normal" value={setting?.general?.cancel_days === undefined ? "" : setting?.general?.cancel_days} />
                                <TextField label="Logo" fullWidth margin="normal" value={setting?.general?.logo === undefined ? "" : setting?.social_link?.logo} />

                                <Button type="submit" variant="contained" color="primary">
                                    Submit
                                </Button>

                            </form>
                        )}
                        {formOpen && value === 1 && (
                            <form onSubmit={handleSubmit}>

                                <TextField label="FaceBook" fullWidth margin="normal" value={setting?.social_link?.facebook === undefined ? "" : setting?.social_link?.facebook} />
                                <TextField label="Instagram" fullWidth margin="normal" value={setting?.social_link?.instagram === undefined ? "" : setting?.social_link?.instagram} />
                                <TextField label="Twitter" fullWidth margin="normal" value={setting?.social_link?.twitter === undefined ? "" : setting?.social_link?.twitter} />
                                <TextField label="Linkedin" fullWidth margin="normal" value={setting?.social_link?.linkedin === undefined ? "" : setting?.social_link?.linkedin} />
                                <TextField label="Skype" fullWidth margin="normal" value={setting?.social_link?.skype === undefined ? "" : setting?.social_link?.skype} />

                                <Button type="submit" variant="contained" color="primary">
                                    Submit
                                </Button>

                            </form>
                        )}

                        {formOpen && value === 2 && (
                            <form onSubmit={handleSubmit}>
                                {console.log(formState.engraving_price || '', "jrgejreg")}

                                <TextField label="Engraving Price" fullWidth margin="normal" value={formState.engraving_price || ''} onChange={onChange} name='engraving_price' />

                                <Button type="submit" variant="contained" color="primary">
                                    Submit
                                </Button>

                            </form>
                        )}
                    </Box>
                </Card >
            </Box>
        );
    }

    export default SettingMaster;
