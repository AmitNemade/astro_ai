import React, { useRef } from "react";
import { User as UserUtil } from "../utils/User";
import {
  Plus,
  User,
  PaperPlaneTilt,
  PencilSimple,
  ArrowLeft,
} from "phosphor-react";
import { useParams, useNavigate } from "react-router-dom";
import { UserService } from "../api/UserService";
import { classNames } from "../utils/classNames";
import { PersonService } from "../api/PersonService";
import toast from "react-hot-toast";
import AddPersonForm from "./AddPersonForm";

const AskAstro = () => {
  const [query, setQuery] = React.useState("");
  const [showAddPerson, setShowAddPerson] = React.useState(-1); // -1 false, 0 add, id edit
  const isLoggedIn = !!UserUtil.getToken();
  let { id } = useParams();
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = React.useState({});
  const [person, setPerson] = React.useState({});
  const chatEndDiv = useRef();

  React.useEffect(() => {
    if (isLoggedIn) {
      if (id === "add") {
        setShowAddPerson(0);
        return;
      }
      setShowAddPerson(-1);
      fetchUserDetails();
    } else {
      navigate("/");
    }
  }, [id]);

  const askQuestion = async () => {
    try {
      const lastChat = person.conversation[person.conversation.length - 1];
      let message = lastChat.role === "error" ? lastChat.message : query;
      setPerson((prev) => ({
        ...prev,
        conversation: [
          ...prev.conversation,
          { role: "user", message: message },
        ],
      }));
      const response = await PersonService.askQuestion({
        id: id,
        question: message,
      }); // res.result => role,content
      setPerson((prev) => ({
        ...prev,
        conversation: [...prev.conversation, { ...response.result }],
      }));
    } catch (e) {
      console.log(e);
      setPerson((prev) => ({
        ...prev,
        conversation: [
          ...prev.conversation,
          { role: "error", message: e.error.message },
        ],
      }));
      toast.error(e.error.message);
    } finally {
      setQuery("");

      chatEndDiv.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  };

  const fetchUserDetails = async () => {
    const response = await UserService.getUserDetails();
    setUserDetails(response.user);
    const response1 = await PersonService.getPersonDetails(id);
    setPerson(response1.person);
  };

  return (
    <div className="relative flex flex-col w-full h-screen max-h-screen min-h-screen md:flex-row overflow-clip">
      <div className="md:fixed p-4 md:inset-y-0 md:flex md:w-[300px] md:flex-col">
        <div className="flex h-full min-h-0 gap-2 p-4 overflow-auto rounded-lg md:flex-col bg-white/10">
          <div
            className="flex items-center justify-start gap-3 p-3 text-white border rounded-lg cursor-pointer hover: border-white/40 hover:bg-white/5"
            onClick={() => navigate("/ask-astroai/add")}
          >
            <Plus size={20} className="text-white" />
            <span className="hidden md:inline-block">Add Person</span>
          </div>
          {userDetails?.persons?.map((p) => (
            <div key={p._id} className="flex items-center gap-2">
              <div
                key={p._id}
                className={classNames(
                  "cursor-pointer w-full items-center p-3 flex justify-start gap-4 rounded-lg text-white whitespace-nowrap",
                  id === p._id ? "bg-white/10" : "hover:bg-white/5"
                )}
                onClick={() => {
                  setShowAddPerson(-1);
                  navigate(`/ask-astroai/${p._id}`);
                }}
              >
                <User size={20} className="text-white" />
                {p.name}
              </div>
              <div
                className="flex items-center justify-center p-2 rounded-lg cursor-pointer hover:bg-white/5"
                onClick={() => {
                  setShowAddPerson(p._id);
                }}
              >
                <PencilSimple
                  size={20}
                  className="ml-auto text-theme-secondary-500"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div
        className={
          "flex relative md:ml-[300px] md:mr-4 w-[calc(100%-32px)] mx-auto md:w-[calc(100%-300px)] h-full md:h-auto my-4 overflow-auto"
        }
      >
        {showAddPerson !== -1 ? (
          <div className="z-10 flex flex-col items-center justify-center w-full gap-6 p-4">
            <AddPersonForm
              selectedPerson={
                userDetails.persons?.filter(
                  (p) => p._id === showAddPerson
                )?.[0] ?? {}
              }
              type={showAddPerson === "0" ? "add" : "edit"}
              persons={userDetails.persons}
              onSuccess={(newPerson) => {
                if (showAddPerson === 0) {
                  setUserDetails((prev) => ({
                    ...prev,
                    persons: [...prev.persons, newPerson],
                  }));
                  return;
                }
                setUserDetails((prev) => ({
                  ...prev,
                  persons: prev.persons.map((e) =>
                    e._id === showAddPerson ? newPerson : e
                  ),
                }));
                setShowAddPerson(-1);
                navigate(`/ask-astroai/${newPerson._id}`);
              }}
            />
          </div>
        ) : (
          <>
            <div className="relative flex flex-col w-full h-full gap-4 p-4 ml-0 overflow-auto rounded-lg bg-white/10">
              <span className="sticky top-0 flex items-center gap-6 px-4 py-2 mb-4 font-bold tracking-wider text-left rounded-lg text-theme-secondary-500 bg-white/10">
                <a href="/">
                  <ArrowLeft className="w-5 h-5 cursor-pointer text-theme-gray-300 hover:text-white hover:font-bold" />
                </a>{" "}
                {person.name}
              </span>
              <div className="flex flex-col justify-center font-bold tracking-wider text-center text-theme-secondary-500">
                <a href="/" className="mx-auto w-fit">
                  ASTRO AI - ChatGPT based Astrology Prediction
                </a>
                <span className="mb-4 font-normal text-white">
                  Type your query in chatbox below to start discussion
                </span>
              </div>
              {person.conversation?.map((chat) => (
                <div
                  key={chat._id}
                  className={classNames(
                    "w-full flex",
                    chat.role === "user" ? "justify-end" : "justify-start"
                  )}
                >
                  <div
                    className={classNames(
                      "flex flex-col max-w-xl p-3 text-white rounded-lg bg-white/10",
                      !["user", "assistant"].includes(chat.role) &&
                        "border border-theme-red-500 "
                    )}
                  >
                    <div
                      className={classNames(
                        "font-semibold",
                        !["user", "assistant"].includes(chat.role)
                          ? "text-theme-red-500"
                          : "text-theme-secondary-500"
                      )}
                    >
                      {chat.role === "user"
                        ? person.name
                        : chat.role === "assistant"
                        ? "ASTRO AI"
                        : "Error"}
                    </div>
                    {chat.message}{" "}
                    {!["user", "assistant"].includes(chat.role) && (
                      <button
                        className="px-3 py-1 mt-2 rounded bg-white/10 w-fit hover:bg-white/20"
                        onClick={() => askQuestion()}
                      >
                        Retry request
                      </button>
                    )}
                  </div>
                </div>
              ))}
              <div ref={chatEndDiv} className="flex min-h-[96px] w-full"></div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 w-full px-8 pt-12 pb-6 md:px-0 bg-gradient-to-b from-theme-primary-500/0 to-theme-primary-500">
              <div className="flex flex-col w-full py-2 flex-grow md:py-3 max-w-2xl mx-auto md:pl-4 relative  bg-whitetext-white bg-[#3a3a3c] border border-theme-primary-500 rounded-md shadow-[0_0_10px_rgba(0,0,0,0.10)] dark:shadow-[0_0_15px_rgba(0,0,0,0.10)]">
                <textarea
                  tabIndex="0"
                  rows="1"
                  value={query}
                  placeholder="Send a message..."
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full h-6 p-0 pl-2 m-0 overflow-y-hidden font-medium text-white bg-transparent border-0 resize-none pr-7 focus:ring-0 focus-visible:ring-0 md:pl-0 focus:outline-none max-h-52"
                ></textarea>
                <button
                  className="absolute p-1 rounded-md text-gray-500 bottom-1.5 md:bottom-2.5 enabled:hover:text-white/20 hover:bg-white/30 disabled:hover:bg-transparent dark:disabled:hover:bg-transparent right-1 md:right-2 disabled:opacity-40"
                  disabled=""
                  onClick={() => {
                    if (query === "") return;
                    askQuestion();
                  }}
                >
                  <PaperPlaneTilt size={16} className="text-white" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AskAstro;
