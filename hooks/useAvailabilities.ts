import axios from "axios";
import { useState } from "react";

const useAvailabilities = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState<
    { time: string; available: boolean }[] | null
  >(null);

  const fetchAvailabilities = async ({
    slug,
    partySize,
    day,
    time,
  }: {
    slug: string;
    partySize: string;
    day: string;
    time: string;
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
      const response = await axios.get(
        // `http://localhost:3000/api/restaurant/${slug}/availability?day=${day}&time=${time}&partySize=${partySize}`
        `http://localhost:3000/api/restaurant/${slug}/availability`,
        {
          params: {
            day,
            time,
            partySize,
          },
        }
      );
      setLoading(false);
      setData(response.data);
    } catch (error: any) {
      setLoading(false);
      setError(error.response.data.error);
    }
  };

  return { loading, data, error, fetchAvailabilities };
};

export default useAvailabilities;
