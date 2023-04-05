import API from "./apiConfig";
import { urls } from "./config";

const getAllPerson = () => {
  return API(
    {
      method: "GET",
      url: urls.person.get_all_person,
    },
    true
  );
};
const getPersonDetails = (id) => {
  return API(
    {
      method: "GET",
      url: urls.person.get_person_details(id),
    },
    true
  );
};
const addPerson = ({ data }) => {
  return API(
    {
      method: "POST",
      url: urls.person.add_person,
      data,
    },
    true
  );
};
const updatePerson = ({ id, data }) => {
  return API(
    {
      method: "PATCH",
      url: urls.person.update_person(id),
      data,
    },
    true
  );
};
const askQuestion = ({ id, question }) => {
  return API(
    {
      method: "GET",
      url: urls.person.ask_question(id, question),
    },
    true
  );
};

export const PersonService = {
  getAllPerson,
  addPerson,
  updatePerson,
  askQuestion,
  getPersonDetails,
};
