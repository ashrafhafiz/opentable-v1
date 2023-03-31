"use client";

import { useEffect, useState, useContext } from "react";
import {
  Alert,
  Box,
  Button,
  Collapse,
  Typography,
  Modal,
  TextField,
  CircularProgress,
  IconButton,
  Stack,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import useAuth from "../../hooks/useAuth";
import { AuthenticationContext } from "../context/AuthContext";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  bgcolor: "background.paper",
  border: "2px solid #8d8d8d",
  borderRadius: "5px",
  boxShadow: 24,
  p: 4,
};

export default function AuthModal({ isSignin }: { isSignin: boolean }) {
  const [openAlert, setOpenAlert] = useState(true);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const { signin, signup } = useAuth();
  const { loading, data, error } = useContext(AuthenticationContext);

  const [inputs, setInputs] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    city: "",
    password: "",
  });

  const [disabled, setDisabled] = useState(true);

  useEffect(() => {
    if (isSignin) {
      if (inputs.password && inputs.email) {
        return setDisabled(false);
      }
    } else {
      if (
        inputs.firstName &&
        inputs.lastName &&
        inputs.email &&
        inputs.phone &&
        inputs.city &&
        inputs.password
      ) {
        return setDisabled(false);
      }
    }
    setDisabled(true);
  }, [inputs]);

  const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOpenAlert(false);
    setInputs({
      ...inputs,
      [e.target.name]: e.target.value,
    });
  };

  const handleOnClick = () => {
    setOpenAlert(true);
    if (isSignin) {
      signin({ email: inputs.email, password: inputs.password }, handleClose);
    } else {
      signup(
        {
          firstName: inputs.firstName,
          lastName: inputs.lastName,
          email: inputs.email,
          password: inputs.password,
          city: inputs.city,
          phone: inputs.phone,
        },
        handleClose
      );
    }
  };

  // console.log("Error: ", error);

  return (
    <div>
      <button
        className={`${
          isSignin
            ? "bg-blue-400 hover:bg-blue-600 text-white mr-4"
            : "bg-gray-100 hover:bg-gray-600 hover:text-white mr-2"
        } border rounded-lg px-4 py-1`}
        onClick={handleOpen}
      >
        {isSignin ? "Sign in" : "Sign up"}
      </button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} component="form" noValidate autoComplete="off">
          {loading ? (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <CircularProgress />
            </Box>
          ) : (
            <div className="p-2">
              {error ? (
                <Collapse in={openAlert}>
                  <Alert
                    severity="error"
                    action={
                      <IconButton
                        aria-label="close"
                        color="inherit"
                        size="small"
                        onClick={() => {
                          setOpenAlert(false);
                        }}
                      >
                        <CloseIcon fontSize="inherit" />
                      </IconButton>
                    }
                    sx={{ mb: 2 }}
                  >
                    {error}
                  </Alert>
                </Collapse>
              ) : null}
              <div className="uppercase font-bold text-center pb-2 border-b mb-2">
                <p className="text-sm">{isSignin ? "Sign In" : "Sign Up"}</p>
              </div>

              <Stack spacing={2} justifyContent="center" alignItems="center">
                <Typography variant="h5">
                  {isSignin
                    ? "Login to your account"
                    : "Create your OpenTable account"}
                </Typography>
                {!isSignin ? (
                  <Stack
                    spacing={2}
                    direction="row"
                    justifyContent="center"
                    alignItems="center"
                  >
                    <TextField
                      sx={{
                        "& > :not(style)": { mt: 1, mb: 1, width: "20ch" },
                      }}
                      id="firstName"
                      label="First Name"
                      variant="outlined"
                      name="firstName"
                      value={inputs.firstName}
                      onChange={handleChangeInput}
                    />
                    <TextField
                      sx={{
                        "& > :not(style)": { mt: 1, mb: 1, width: "20ch" },
                      }}
                      id="lastName"
                      label="Last Name"
                      variant="outlined"
                      name="lastName"
                      value={inputs.lastName}
                      onChange={handleChangeInput}
                    />
                  </Stack>
                ) : null}

                <TextField
                  sx={{
                    "& > :not(style)": { mt: 1, mb: 1, width: "42ch" },
                  }}
                  id="email"
                  type="email"
                  label="Email"
                  variant="outlined"
                  name="email"
                  value={inputs.email}
                  onChange={handleChangeInput}
                />
                <TextField
                  sx={{
                    "& > :not(style)": { mt: 1, mb: 1, width: "42ch" },
                  }}
                  id="password"
                  type="password"
                  label="Password"
                  variant="outlined"
                  name="password"
                  value={inputs.password}
                  onChange={handleChangeInput}
                />
                {!isSignin ? (
                  <Stack
                    spacing={2}
                    direction="row"
                    justifyContent="center"
                    alignItems="center"
                  >
                    <TextField
                      sx={{
                        "& > :not(style)": { mt: 1, mb: 1, width: "20ch" },
                      }}
                      id="phone"
                      label="Phone"
                      variant="outlined"
                      name="phone"
                      value={inputs.phone}
                      onChange={handleChangeInput}
                    />
                    <TextField
                      sx={{
                        "& > :not(style)": { mt: 1, mb: 1, width: "20ch" },
                      }}
                      id="city"
                      label="City"
                      variant="outlined"
                      name="city"
                      value={inputs.city}
                      onChange={handleChangeInput}
                    />
                  </Stack>
                ) : null}

                <Button
                  disabled={disabled}
                  onClick={handleOnClick}
                  variant="contained"
                  sx={{
                    width: "50%",
                    backgroundColor: "#0066ff !important",
                    "&:hover": {
                      backgroundColor: "#0050c9 !important",
                      // opacity: [0.9, 0.8, 0.7],
                    },
                  }}
                >
                  {isSignin ? "Sign In" : "Sign Up"}
                </Button>
              </Stack>
            </div>
          )}
        </Box>
      </Modal>
    </div>
  );
}
