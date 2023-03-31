"use client";

import { CircularProgress } from "@mui/material";
import { useState, useEffect } from "react";
import useReservation from "../../../../hooks/useReservation";

const Form = ({
  slug,
  day,
  time,
  partySize,
}: {
  slug: string;
  day: string;
  time: string;
  partySize: string;
}) => {
  const [inputs, setInputs] = useState({
    booker_first_name: "",
    booker_last_name: "",
    booker_email: "",
    booker_phone: "",
    booker_occasion: "",
    booker_request: "",
  });

  const [disabled, setDisabled] = useState(true);
  const [success, setSuccess] = useState(false);
  const { loading, error, createReservation } = useReservation();

  const handleClick = async () => {
    const bookin = createReservation({
      slug,
      partySize,
      day,
      time,
      booker_first_name: inputs.booker_first_name,
      booker_last_name: inputs.booker_last_name,
      booker_email: inputs.booker_email,
      booker_phone: inputs.booker_phone,
      booker_occasion: inputs.booker_occasion,
      booker_request: inputs.booker_request,
      setSuccess,
    });
  };

  const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputs({
      ...inputs,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    if (
      inputs.booker_first_name &&
      inputs.booker_last_name &&
      inputs.booker_email &&
      inputs.booker_phone
    ) {
      return setDisabled(false);
    }
    return setDisabled(true);
  }, [inputs]);

  return (
    <>
      {success ? (
        <div>
          <h1 className="text-xl font-light">You are all booked up</h1>
          <p className="text-reg">Wish you a nic experiance!</p>
        </div>
      ) : (
        <div className="mt-10 flex flex-wrap justify-between w-[660px]">
          <input
            type="text"
            className="border rounded p-3 w-80 mb-4"
            placeholder="First name"
            name="booker_first_name"
            value={inputs.booker_first_name}
            onChange={handleChangeInput}
          />
          <input
            type="text"
            className="border rounded p-3 w-80 mb-4"
            placeholder="Last name"
            name="booker_last_name"
            value={inputs.booker_last_name}
            onChange={handleChangeInput}
          />
          <input
            type="text"
            className="border rounded p-3 w-80 mb-4"
            placeholder="Email"
            name="booker_email"
            value={inputs.booker_email}
            onChange={handleChangeInput}
          />
          <input
            type="text"
            className="border rounded p-3 w-80 mb-4"
            placeholder="Phone number"
            name="booker_phone"
            value={inputs.booker_phone}
            onChange={handleChangeInput}
          />
          <input
            type="text"
            className="border rounded p-3 w-80 mb-4"
            placeholder="Occasion (optional)"
            name="booker_occasion"
            value={inputs.booker_occasion}
            onChange={handleChangeInput}
          />
          <input
            type="text"
            className="border rounded p-3 w-80 mb-4"
            placeholder="Requests (optional)"
            name="booker_request"
            value={inputs.booker_request}
            onChange={handleChangeInput}
          />
          <button
            className="bg-red-600 w-full p-3 text-white font-bold rounded disabled:bg-gray-300"
            onClick={handleClick}
            disabled={disabled || loading}
          >
            {loading ? (
              <CircularProgress color="inherit" />
            ) : (
              "Compelete reservation"
            )}
          </button>
          <p className="mt-4 text-sm">
            By clicking “Complete reservation” you agree to the OpenTable Terms
            of Use and Privacy Policy. Standard text message rates may apply.
            You may opt out of receiving text messages at any time.
          </p>
        </div>
      )}
    </>
  );
};

export default Form;
