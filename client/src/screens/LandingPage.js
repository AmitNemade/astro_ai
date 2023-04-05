import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { User } from "../utils/User";
import { UserService } from "../api/UserService";
import ShowParticles from "./particles";
import AddPersonForm from "./AddPersonForm";

const LandingPage = () => {
  const addPersonFormRef = useRef();
  const [userDetails, setUserDetails] = React.useState({});
  const isLoggedIn = !!User.getToken();

  React.useEffect(() => {
    if (isLoggedIn) {
      fetchUserDetails();
    }
  }, []);

  const fetchUserDetails = async () => {
    const response = await UserService.getUserDetails();
    setUserDetails(response.user);
  };
  const logoutUser = () => {
    User.clearToken();
    window.location.reload();
  };

  return (
    <>
      <div className="relative flex flex-col w-full">
        <div className="fixed -top-[225px] -left-[225px] w-[450px] animate-[spin_40s_linear_infinite]">
          <img
            alt="img-1"
            className="w-full h-full"
            src={
              "https://i.pinimg.com/originals/44/fe/1a/44fe1adaea01826537e20009750bd0a6.png"
            }
          />
        </div>
        <div className="fixed -bottom-[250px] -right-[250px] w-[500px] animate-[spin_40s_linear_infinite]">
          <img
            alt="img-2"
            className="w-full h-full "
            src={
              "https://png.monster/wp-content/uploads/2022/09/png.monster-207.png"
            }
          />
        </div>
        <div className="absolute w-full h-full">
          <ShowParticles />
        </div>
        <div className="flex flex-col overflow-clip justify-between w-full h-screen lg:h-[80vh] z-10">
          {/* Header */}
          <div className="sticky top-0 flex items-center justify-between h-20 px-2 py-2 md:px-10">
            {/* Logo */}
            <div
              className="p-2 text-lg font-bold rounded lg:text-3xl text-theme-secondary-500"
              style={{ textShadow: "0px 0px 15px #fff" }}
            >
              ASTRO AI
            </div>
            {/* Menus */}
            <div />
            {/* Login/Signup */}
            <div className="flex items-center text-theme-secondary-500 gap-4 tracking-[0.12em] text-sm lg:text-lg">
              {isLoggedIn ? (
                <div className="flex flex-col items-end w-fit">
                  <span>Hi {userDetails?.email?.split("@")?.[0]} !</span>
                  <button
                    className="text-white hover:text-theme-secondary-500 hover:underline"
                    onClick={() => logoutUser()}
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <>
                  <Link to="/auth/login" className="uppercase">
                    Login
                  </Link>
                  <Link
                    to="/auth/register"
                    className="p-2 uppercase bg-white rounded hover:bg-white/90"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
          <div className="flex flex-col items-center">
            <div className="text-theme-secondary-500 tracking-[0.15em]">
              MAP DEVINATION & HOROSCOPE
            </div>
            <div className="max-w-4xl mt-6 text-2xl font-bold tracking-wide text-center lg:leading-tight lg:text-6xl text-white/90">
              Do You Want to Know More About Your Destiny?
            </div>
            <button
              className="p-4 mt-20 font-bold tracking-widest uppercase border-2 border-theme-secondary-500 text-theme-secondary-500 hover:bg-theme-secondary-500 hover:text-theme-primary-500"
              onClick={() => {
                addPersonFormRef.current.scrollIntoView({
                  behavior: "smooth",
                });
              }}
            >
              Hear about yourself
            </button>
          </div>
          <div />
        </div>
        {/* <div className="flex gap-2 p-6 bg-white ">
          <div className="w-20 h-20 p-6 rounded-md bg-theme-primary-500" />
          <div className="w-20 h-20 p-6 rounded-md bg-theme-secondary-500" />
          <div className="w-20 h-20 p-6 rounded-md bg-theme-gray-500" />
          <div className="w-20 h-20 p-6 rounded-md bg-theme-gray-300" />
          <div className="w-20 h-20 p-6 rounded-md bg-theme-red-500" />
        </div> */}
        {/* Birth Details Input */}
        <div
          ref={addPersonFormRef}
          className="w-full gap-6 flex flex-col z-10 p-4 h-[75vh] justify-center items-center"
        >
          <AddPersonForm
            persons={userDetails.persons}
            type="add"
            onSuccess={(newPerson) =>
              setUserDetails((prev) => ({
                ...prev,
                persons: [...prev.persons, newPerson],
              }))
            }
          />
        </div>
        <div className="sticky bottom-0 z-10 block px-4 py-2 text-theme-secondary-500">
          Developed by{" "}
          <a
            className="underline underline-offset-4"
            target="_blank"
            rel="noreferrer"
            href="https://www.linkedin.com/in/amitnemade/"
          >
            Amit Nemade
          </a>
        </div>
      </div>
    </>
  );
};
export default LandingPage;
