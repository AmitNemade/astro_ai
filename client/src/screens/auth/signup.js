import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserService } from "../../api/UserService";
import { toast } from "react-hot-toast";
import ShowParticles from "../particles";
import {SpinnerGap} from "phosphor-react"

const Signup = () => {
  const navigate = useNavigate()
  const [values, setValues] = React.useState({
    email: "",
    password: "",
    confirm_password: "",
  });
  const [submittingForm,setSubmittingForm] =React.useState(false)

  const handleOnChange = (e) => {
    setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const onSubmitForm = async (e) => {
    setSubmittingForm(true)
    e.preventDefault();
    try {
      console.log(values);
      const response = await UserService.register({ data: values });
      console.log(response);
      toast.success(response.message);
      navigate("/auth/login")
    } catch (e) {
      console.log(e);
      toast.error(e.error_message);
    }finally{
      setSubmittingForm(false)
    }
  };

  return (
    <div className="relative flex items-center justify-center h-full min-h-screen p-6 md:p-28">
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
      <div className="z-10 flex flex-col items-start w-full max-w-lg p-6 bg-white rounded-2xl">
        <div className="text-3xl font-bold text-black">Create an account</div>
        <div className="text-base text-black">
          Let's go through a few simple steps
        </div>
        <form
          onSubmit={onSubmitForm}
          className="flex flex-col w-full gap-4 mt-6"
        >
          <div className="flex flex-col w-full">
            <label className="text-black text-sm mb-0.5" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="Enter email"
              name="email"
              value={values.email ?? ""}
              onChange={handleOnChange}
              className="w-full px-2 py-1 text-black bg-white border rounded hover:border-black focus:outline-none"
            />
          </div>
          <div className="flex flex-col w-full">
            <label className="text-black text-sm mb-0.5" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="Enter Password"
              name="password"
              value={values.password ?? ""}
              onChange={handleOnChange}
              className="w-full px-2 py-1 text-black bg-white border rounded hover:border-black focus:outline-none"
            />
          </div>
          <div className="flex flex-col w-full">
            <label className="text-black text-sm mb-0.5" htmlFor="password">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirm_password"
              placeholder="Re-enter Password"
              name="confirm_password"
              value={values.confirm_password ?? ""}
              onChange={handleOnChange}
              className="w-full px-2 py-1 text-black bg-white border rounded hover:border-black focus:outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={submittingForm}
            className="px-4 py-2 font-bold tracking-wide text-white bg-orange-600 rounded-md hover:bg-orange-700"
          >
           {submittingForm ? <SpinnerGap size={20} className="mx-auto animate-spin" />: "Create Account"}
          </button>
        </form>
        <div className="mt-2 text-sm text-black">
          Already have a account?{" "}
          <Link className="text-orange-600 hover:underline" to="/auth/login">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
