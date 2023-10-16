import { Alert, Card, Grid, Snackbar, Button, Checkbox } from "@mui/material";
import { Box, styled, useTheme } from "@mui/material";
import { Paragraph } from "../../components/Typography";
import useAuth from "../../hooks/useAuth";
import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import Textinput from "../../components/UI/TextInput";
import Validators from "../../components/validations/Validator";
import { HELPER } from "../../services";

const FlexBox = styled(Box)(() => ({ display: "flex", alignItems: "center" }));

const JustifyBox = styled(FlexBox)(() => ({ justifyContent: "center" }));

const ContentBox = styled(Box)(() => ({
	height: "100%",
	padding: "32px",
	position: "relative",
	background: "rgba(0, 0, 0, 0.01)",
}));

const JWTRoot = styled(JustifyBox)(() => ({
	background: "#1A2038",
	minHeight: "100% !important",
	"& .card": {
		maxWidth: 800,
		minHeight: 400,
		margin: "1rem",
		display: "flex",
		borderRadius: 12,
		alignItems: "center",
	},
}));

// inital login credentials
const initialValues = {
	email: "admin@admin.com",
	password: "admin@123",
	remember: true,
};

const JwtLogin = () => {
	// -------formState-----

	const [formState, setFormState] = useState({
		...initialValues
	});
	//  -------------Validation --------------
	const rules = {
		password: "required|min:6",
		email: "required",
	};
	const theme = useTheme();
	const navigate = useNavigate();
	const [loading, setLoading] = useState(false);

	const { login } = useAuth();

	const handleSubmit = async (values) => {
		setLoading(true);
		try {
			await login(values.email, values.password, values.remember);
			HELPER.toaster.success("Login SuccessFully..");
			navigate("/");
		} catch (e) {
			setLoading(false);
			HELPER.toaster.error(e.errors.message);

		}
	};
	const onChange = ({ target: { value, name } }) => {
		setFormState((prev) => ({
			...prev,
			[name]: value,
		}));
	};
	return (
		<JWTRoot>
			<Card className="card">
				<Grid container>
					<Grid item sm={6} xs={12}>
						<JustifyBox p={4} height="100%" sx={{ minWidth: 320 }}>
							<img src="/assets/images/illustrations/dreamer.svg" width="100%" alt="" />
						</JustifyBox>
					</Grid>

					<Grid item sm={6} xs={12}>
						<ContentBox>
							<Validators formData={formState} rules={rules}>
								{({ onSubmit, errors }) => {
									return (
										<>
											<Textinput
												size="small"
												type="email"
												name="email"
												label="Email"
												value={formState.email}
												onChange={onChange}
												error={errors?.email}
												sx={{ mb: 3 }}
											/>

											<Textinput
												size="small"
												type="password"
												name="password"
												label="password"
												value={formState.password}
												onChange={onChange}
												error={errors?.password}
												sx={{ mb: 1.5 }}
											/>
											<FlexBox justifyContent="space-between">
												<FlexBox gap={1}>
													<Checkbox size="small" name="remember" onChange={onChange} checked={formState.remember} sx={{ padding: 0 }} />

													<Paragraph>Remember Me</Paragraph>
												</FlexBox>

												<NavLink to="/session/forgot-password" style={{ color: theme.palette.primary.main }}>
													Forgot password?
												</NavLink>
											</FlexBox>

											<Button type="submit" color="primary" loading={loading} variant="contained" sx={{ my: 2 }} onClick={() => onSubmit(handleSubmit)}>
												Login
											</Button>

											<Paragraph>
												Don't have an account?
												<NavLink to="/session/signup" style={{ color: theme.palette.primary.main, marginLeft: 5 }}>
													Register
												</NavLink>
											</Paragraph>
										</>
									)
								}}
							</Validators>
						</ContentBox>
					</Grid>
				</Grid>
			</Card>
		</JWTRoot >
	);
};

export default JwtLogin;
