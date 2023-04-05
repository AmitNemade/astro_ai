import React, { useEffect } from "react";
import { toast } from "react-hot-toast";
import dayjs from "dayjs";
import { PersonService } from "../api/PersonService";
import { useNavigate } from "react-router-dom";
import {SpinnerGap} from "phosphor-react"

const isEmpty = (val) =>
  val === null ||
  val === undefined ||
  val === "" ||
  (Array.isArray(val) && val?.length === 0);

const formatTwoDigit = (val) => {
  return val < 10 ? `0${val}` : "val";
};

const AddPersonForm = ({
  selectedPerson = {},
  persons,
  type = "add",
  onSuccess,
}) => {
  const [birthDetails, setBirthDetails] = React.useState({});
  const [submittingForm,setSubmittingForm] =React.useState(false)
  const navigate = useNavigate();

  useEffect(() => {
    if (Object.keys(selectedPerson).length === 0) return;
    setBirthDetails({
      name: selectedPerson?.name ?? "",
      date: `${selectedPerson?.birth_date?.year}-${formatTwoDigit(
        selectedPerson?.birth_date?.month
      )}-${formatTwoDigit(selectedPerson?.birth_date?.day)}`,
      time: `${selectedPerson?.birth_date?.hours}:${selectedPerson?.birth_date?.minutes}`,
      location: selectedPerson?.birth_location,
    });
  }, [selectedPerson]);

  const handleBirthDetailChange = async (e) => {
    setBirthDetails((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const onSubmitForm = async (e) => {
    setSubmittingForm(true)
    e.preventDefault();
    try {
      const date = dayjs(birthDetails.date);
      const day = date.date();
      const month = date.month() + 1;
      const year = date.year();
      const time = birthDetails.time?.split(":");
      const hours = time?.[0];
      const minutes = time?.[1];
      const postBody = {
        name: birthDetails.name,
        birth_date: {
          day,
          month,
          year,
          hours,
          minutes,
        },
        birth_location: birthDetails.location,
      };
      if (
        isEmpty(day) ||
        isEmpty(month) ||
        isEmpty(year) ||
        isEmpty(hours) ||
        isEmpty(month) ||
        isEmpty(birthDetails.location) ||
        isEmpty(birthDetails.name)
      ) {
        toast.error("Please enter valid data");
        return;
      }
      if (type === "add") {
        const response = await PersonService.addPerson({
          data: postBody,
        });
        onSuccess({ _id: response._id, ...postBody });

        toast.success(response.message);
      } else {
        const response = await PersonService.updatePerson({
          id: selectedPerson._id,
          data: postBody,
        });
        onSuccess({ _id: selectedPerson._id, ...postBody });

        toast.success(response.message);
      }
    } catch (e) {
      console.log(e);
      toast.error(e.error_message);
    }finally{
      setSubmittingForm(false)
    }
  };
  console.log(birthDetails);
  return (
    <>
      <form
        onSubmit={onSubmitForm}
        className="flex flex-wrap w-full max-w-2xl p-4 rounded-md bg-white/80"
      >
        <input
          type="text"
          name="name"
          placeholder="Enter person name"
          value={birthDetails.name}
          onChange={handleBirthDetailChange}
          className="w-full text-black bg-transparent border-0 placeholder:text-theme-primary-500 placeholder:font-light focus:outline-none"
        />
        <div className="flex w-full h-0 my-2 border-t border-theme-gray-500" />
        <div className="flex w-full gap-2">
          <div className="flex flex-col w-full gap-2 md:flex-row">
            <div className="flex w-full gap-2">
              <input
                type="date"
                name="date"
                value={birthDetails.date}
                onChange={handleBirthDetailChange}
                className="w-full text-black bg-transparent border-0 placeholder:text-theme-primary-500 placeholder:font-light focus:outline-none"
              />
              <div className="h-full border-l border-theme-gray-500" />
              <input
                type="time"
                name="time"
                value={birthDetails.time}
                onChange={handleBirthDetailChange}
                className="w-full text-black bg-transparent border-0 placeholder:text-theme-primary-500 placeholder:font-light focus:outline-none"
              />
            </div>
            <div className="w-full border-t md:w-0 md:border-t-0 md:border-l border-theme-gray-500" />
            <div className="flex w-full gap-2">
              <input
                type="text"
                name="location"
                placeholder="Birth location"
                value={birthDetails.location}
                onChange={handleBirthDetailChange}
                className="w-full text-black bg-transparent border-0 placeholder:text-theme-primary-500 placeholder:font-light focus:outline-none"
              />
              <button
                type="submit"
                disabled={submittingForm}
                className="w-full py-1 text-white rounded bg-theme-primary-500/80 hover:bg-theme-primary-500/90"
              >
                {submittingForm ? <SpinnerGap size={20} className="mx-auto animate-spin" />:type === "add" ? "Add Person" : "Update Person"}
              </button>
            </div>
          </div>
        </div>
      </form>
      {type === "add" && (
        <>
          <div className="flex items-center w-full max-w-xl gap-3 text-2xl text-white">
            <span className="w-full border-b border-theme-gray-300"></span>
            <span className="leading-none text-theme-secondary-500">Or</span>
            <span className="w-full border-b border-theme-gray-300"></span>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            <div className="flex justify-center w-full font-medium text-center text-white">
              Select Person from below
            </div>
            {persons?.length === 0 ? (
              <div className="text-white/40">--- No persons added ---</div>
            ) : (
              persons?.map((p) => (
                <div
                  key={p._id}
                  className="px-4 py-1 font-semibold text-white border rounded-full cursor-pointer border-theme-secondary-500 hover:bg-theme-secondary-500"
                  onClick={() => {
                    navigate(`/ask-astroai/${p._id}`);
                  }}
                >
                  {p.name}
                </div>
              ))
            )}
          </div>
        </>
      )}
    </>
  );
};

export default AddPersonForm;
