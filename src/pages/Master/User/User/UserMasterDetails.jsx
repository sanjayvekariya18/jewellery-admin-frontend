import { Box, Button, InputAdornment } from "@mui/material";
import { useEffect, useState } from "react";
import { API, HELPER } from "../../../../services";
import { apiEndPoint } from "../../../../constants/routesList";
import ThemeDialog from "../../../../components/UI/Dialog/ThemeDialog";
import Validators from "./../../../../components/validations/Validator";
import Textinput from "../../../../components/UI/TextInput";
import ImgUploadBoxInput from "../../../../components/UI/ImgUploadBoxInput";

// inital data
const initialValues = {
	id: "",
	firstName: "",
	lastName: "",
	email: "",
	profile: "",
};

const UserMasterDetails = ({ open, togglePopup, userData }) => {
	const url = apiEndPoint.user;

	//  -------------formState --------------
	const [formState, setFormState] = useState({
		...initialValues
	  });
	  //  -------------Validation --------------
	  const rules = {
		firstName: "required",
		lastName: "required",
		email: "required",
		profile: "mimes:png,jpg,jpeg|max_file_size:1048576",
	  };
	
	  //  --------------handle onSubmit   --------------
	  const handleSubmit = (data) => {
		const fd = new FormData();

		for (const field in data) {
			fd.append(field, data[field]);
		}
		if (data.id === "") {
			API.post(url, fd)
				.then(() => {
					HELPER.toaster.success("Record created");
					togglePopup();
				})
				.catch((e) => HELPER.toaster.error(e.errors.message));
		} else {
			API.put(`${url}/${data.id}`, fd)
				.then(() => {
					HELPER.toaster.success("Record saved");
					togglePopup();
				})
				.catch((e) => {
					HELPER.toaster.error(e.errors.message);
				});
		}
	  };
	
	  const onChange = ({ target: { value, name } }) => {
		setFormState((prev) => ({
		  ...prev,
		  [name]: value,
		}));
	  };

	useEffect(() => {
		if (open === true && userData !== null) {
			userData.profile = HELPER.getImageUrl(userData.image)
			setFormState(userData)
		} else {
			setFormState({...initialValues})
		}
	}, [open]);
	
	return (
		<>
			<Validators formData={formState} rules={rules}>
				{({ onSubmit, errors }) => {
					return (
						<ThemeDialog
							title={`${formState?.id === "" ? "Add" : "Edit"} User`}
							isOpen={open}
							onClose={togglePopup}
							actionBtns={<>
								<ImgUploadBoxInput 
									name="profile"
									onChange={onChange}
									value={formState?.profile}
									error={errors?.profile}
									label={'Profile Image'}
								/>
								<Box>
									<Button variant="outlined" color="secondary" onClick={togglePopup}>
										Cancel
									</Button>
									<Button type="submit" color="primary" onClick={() => onSubmit(handleSubmit)}>
										Save
									</Button>
								</Box>
							</>}
						>
							<>
								<Textinput
									size="small"
									type="text"
									name="firstName"
									label="First Name"
									value={formState.firstName}
									onChange={onChange}
									error={errors?.firstName}
									sx={{ mb: 2, mt: 1, width: "49%" }}
								/>
								<Textinput
									type="text"
									name="lastName"
									label="Last Name"
									value={formState.lastName}
									onChange={onChange}
									error={errors?.lastName}
									sx={{ mb: 2, mt: 1, ml: 0.5, width: "49.5%" }}
								/>
								<Textinput
									fullWidth={true}
									size="small"
									type="email"
									name="email"
									label="Email"
									value={formState.email}
									onChange={onChange}
									error={errors?.email}
									sx={{ mb: 2, mt: 1 }}
									InputProps={{
										startAdornment: <InputAdornment position="start">@</InputAdornment>,
									}}
								/>
							</>
						</ThemeDialog>
					);
				}}
			</Validators>
		</>
	);
};

export default UserMasterDetails;
