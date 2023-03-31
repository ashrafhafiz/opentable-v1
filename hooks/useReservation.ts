import axios from "axios";
import { Dispatch, SetStateAction, useState } from "react";

const useReservation = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createReservation = async ({
    slug,
    partySize,
    day,
    time,
    booker_email,
    booker_phone,
    booker_first_name,
    booker_last_name,
    booker_occasion,
    booker_request,
    setSuccess,
  }: {
    slug: string;
    partySize: string;
    day: string;
    time: string;
    booker_email: string;
    booker_phone: string;
    booker_first_name: string;
    booker_last_name: string;
    booker_occasion: string;
    booker_request: string;
    setSuccess: Dispatch<SetStateAction<boolean>>;
  }) => {
    // console.log({
    //   slug,
    //   partySize,
    //   day,
    //   time,
    // });
    // return;
    setLoading(true);
    try {
      const response = await axios.post(
        // `http://localhost:3000/api/restaurant/${slug}/availability?day=${day}&time=${time}&partySize=${partySize}`
        `http://localhost:3000/api/restaurant/${slug}/reserve`,
        {
          booker_email,
          booker_phone,
          booker_first_name,
          booker_last_name,
          booker_occasion,
          booker_request,
        },
        {
          params: {
            day,
            time,
            partySize,
          },
        }
      );
      setLoading(false);
      setSuccess(true);
      return response.data;
    } catch (error: any) {
      setLoading(false);
      setError(error.response.data.error);
    }
  };

  return { loading, error, createReservation };
};

export default useReservation;
