import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

import AccountNav from "../AccountNav";
import PlaceImg from "../PlaceImg";
import BookingDates from "../BookingDates";

export default function BookingsPage() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    axios.get("/bookings").then((response) => {
      setBookings(response.data);
    });
  }, []);

  return (
    <div className="px-4 md:px-8 lg:px-16">
      <AccountNav />

      <div className="mt-6 grid gap-6">
        {bookings?.length > 0 &&
          bookings.map((booking) => (
            <Link
              key={booking._id}
              to={`/account/bookings/${booking._id}`}
              className="flex flex-col md:flex-row items-center gap-4 bg-white shadow-md hover:shadow-xl transition-shadow rounded-2xl overflow-hidden p-4"
            >
              <div className="w-full md:w-60">
                <PlaceImg place={booking.place} />
              </div>

              <div className="flex flex-col gap-2 grow">
                <h2 className="text-xl font-semibold text-gray-800">{booking.place.title}</h2>  

                <div className="flex items-center gap-2 text-lg text-gray-700">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z"
                    />
                  </svg>
                  <span className="font-medium">Precio Total:</span>
                  <span className="text-2xl font-bold text-black">${booking.price}</span>
                </div>
              </div>
            </Link>
          ))}
      </div>
    </div>
  );
}
