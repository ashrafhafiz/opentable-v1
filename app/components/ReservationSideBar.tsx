"use client";

import { useState } from "react";
import { partySize, times } from "../../data";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import useAvailabilities from "../../hooks/useAvailabilities";
import { CircularProgress } from "@mui/material";
import Link from "next/link";
import { convertToDisplayTime } from "../../utilities/convertToDisplayTime";

const ReservationSideBar = ({
  openTime,
  closeTime,
  slug,
}: {
  openTime: string;
  closeTime: string;
  slug: string;
}) => {
  const { loading, data, error, fetchAvailabilities } = useAvailabilities();
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [time, setTime] = useState(openTime);
  const [pSize, setPSize] = useState("1");
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [day, setDay] = useState(new Date().toISOString().split("T")[0]);

  const handleChangeDate = (date: Date | null) => {
    if (date) {
      setDay(date.toISOString().split("T")[0]);
      return setSelectedDate(date);
    }
    return setSelectedDate(null);
  };

  const getRestaurantAvailableTimes = () => {
    const availableTimes: typeof times = [];
    let availableTime = false;
    times.forEach((time) => {
      if (time.time === openTime) {
        availableTime = true;
      }
      if (availableTime) {
        availableTimes.push(time);
      }
      if (time.time === closeTime) {
        availableTime = false;
      }
    });
    return availableTimes;
  };

  const handleFindAvailability = () => {
    fetchAvailabilities({
      slug,
      day,
      time,
      partySize: pSize,
    });
  };

  console.log(data);

  return (
    <div className="fixed w-[15%] bg-white rounded p-3 shadow">
      <div className="text-center border-b pb-2 font-bold">
        <h4 className="mr-7 text-lg">Make a Reservation</h4>
      </div>
      <div className="my-3 flex flex-col">
        <label htmlFor="">Party size</label>
        <select
          name=""
          className="py-3 border-b font-light"
          id=""
          value={pSize}
          onChange={(e) => setPSize(e.target.value)}
        >
          {partySize.map((size, index) => (
            <option key={index} value={size.value}>
              {size.label}
            </option>
          ))}
        </select>
      </div>
      <div className="flex justify-between">
        <div className="flex flex-col w-[48%]">
          <label htmlFor="">Date</label>
          {/* <input type="text" className="py-3 border-b font-light w-28" /> */}
          <DatePicker
            dateFormat="dd/M/yyyy"
            minDate={new Date()}
            maxDate={new Date().setDate(new Date().getDate() + 5)}
            className="pl-2 py-2 border-b font-light w-20"
            selected={selectedDate}
            onChange={handleChangeDate}
          />
        </div>
        <div className="flex flex-col w-[48%]">
          <label htmlFor="">Time</label>
          <select
            name=""
            id=""
            className="py-2 border-b font-light"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          >
            {getRestaurantAvailableTimes().map((time, index) => (
              <option key={index} value={time.time}>
                {time.displayTime}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="mt-5">
        <button
          className={`rounded w-full px-4 text-white font-bold h-16 ${
            loading ? "bg-gray-500" : "bg-red-600"
          }`}
          onClick={handleFindAvailability}
          disabled={loading}
        >
          {loading ? <CircularProgress color="inherit" /> : "Find a Time"}
        </button>
      </div>
      {data && data.length ? (
        <>
          <div className="mt-4">
            <p className="text-reg">Select a Time</p>
            <div className="flex flex-wrap mt-2">
              {data.map((time) => {
                return time.available ? (
                  <Link
                    href={`/reserve/${slug}?date=${day}T${time.time}&partySize=${pSize}`}
                    className="bg-red-600 hover:bg-red-700 cursor-pointer p-2 w-24 text-center text-white text-sm font-bold mb-3 rounded mr-3"
                  >
                    {convertToDisplayTime(time.time)}
                  </Link>
                ) : (
                  <div className="bg-gray-600 p-2 w-24 text-center text-white text-sm font-bold mb-3 rounded mr-3">
                    NA
                  </div>
                );
              })}
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
};

export default ReservationSideBar;
