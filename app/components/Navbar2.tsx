"use client";

import Link from "next/link";
import { useContext } from "react";
import { AuthenticationContext } from "../context/AuthContext";
import AuthModal from "./AuthModal";
import useAuth from "../../hooks/useAuth";

const Navbar2 = () => {
  const { loading, data } = useContext(AuthenticationContext);
  const { signout } = useAuth();
  return (
    <nav className="bg-white p-2 flex justify-between">
      <Link href="/" className="font-bold text-gray-700 text-2xl">
        OpenTable
      </Link>
      <div>
        {loading ? null : (
          <div className="flex items-center justify-center">
            {data ? (
              <button
                className="bg-red-400 hover:bg-red-600 text-white mr-2 border rounded-lg px-4 py-1"
                onClick={signout}
              >
                Signout
              </button>
            ) : (
              <>
                <AuthModal isSignin={true} />
                <AuthModal isSignin={false} />
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar2;
