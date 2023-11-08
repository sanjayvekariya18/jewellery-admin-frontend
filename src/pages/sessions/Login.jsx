import { Card, Grid, Button } from "@mui/material";
import { Box, styled } from "@mui/material";
import useAuth from "../../hooks/useAuth";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
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

// Initial login credentials
const initialValues = {
  email: "admin@admin.com",
  password: "admin@123",
};

const JwtLogin = () => {
  // Form state
  const [formState, setFormState] = useState({
    ...initialValues,
  });

  // Validation rules
  const rules = {
    password: "required|min:6",
    email: "required",
  };

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      await login(values.email, values.password);
      HELPER.toaster.success("Login Successfully ...");
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
      <>
        <Validators formData={formState} rules={rules}>
          {({ onSubmit, errors }) => {
            return (
              <>
                <div
                  style={{
                    background: "white",
                    width: "100%",
                    height: "100vh",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      width: "50%",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "baseline",
                      }}
                    >
                      <h2
                        style={{
                          color: "#131313",
                          fontWeight: "500",
                          marginRight: "10px",
                          fontFamily: "system-ui",
                          fontSize: "26px",
                        }}
                      >
                        Welcome To Jewellery ,
                      </h2>
                      <h2
                        style={{
                          color: "#405189",
                          fontWeight: "600",
                          fontFamily: "system-ui",
                          fontSize: "26px",
                        }}
                      >
                        Admin ! 👋
                      </h2>
                    </div>
                    <div className="text-input-top main-login-text-input">
                      <Textinput
                        size="small"
                        type="email"
                        name="email"
                        label="Email"
                        value={formState.email}
                        placeholder="Enter Email Address"
                        onChange={onChange}
                        error={errors?.email}
                        sx={{ mb: 0, width: "500px" }}
                      />
                    </div>
                    <div className="text-input-top main-login-text-input">
                      <Textinput
                        size="small"
                        type="password"
                        name="password"
                        label="Password"
                        placeholder="******"
                        value={formState.password}
                        onChange={onChange}
                        error={errors?.password}
                        sx={{ mb: 0, width: "500px" }}
                      />
                    </div>
                    <div className="main-login-text-input">
                      <Button
                        type="submit"
                        color="primary"
                        variant="contained"
                        disabled={loading}
                        sx={{ my: 2 }}
                        onClick={() => onSubmit(handleSubmit)}
                        style={{ width: "500px" }}
                      >
                        {loading ? "Loading..." : "Login"}
                      </Button>
                    </div>
                  </div>
                  <div
                    style={{
                      width: "50%",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      background: "#405198",
                      height: "100vh",
                    }}
                  >
                    <h2
                      style={{
                        color: "white",
                        fontWeight: "700",
                        fontFamily: "inherit",
                        fontSize: "120px",
                        letterSpacing: "2px",
                      }}
                    >
                      JEWELLERY
                    </h2>
                    {/* <img
                      src="/assets/images/illustrations/dreamer.svg"
                      width="500px"
                      alt=""
                    /> */}
                  </div>
                </div>
              </>
            );
          }}
        </Validators>
      </>
    </JWTRoot>
  );
};

export default JwtLogin;
