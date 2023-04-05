export const urls = {
  user: {
    get_user_details: "user/get_user_details",
    login: "user/login",
    register: "user/register",
  },
  person: {
    add_person: "person/add_person",
    get_person_details: (id) => `person/${id}`,
    update_person: (id) => `person/update_person/${id}`,
    get_all_person: "person/get_all_persons",
    ask_question: (id, question) =>
      `person/${id}/ask_question/?query=${question}`,
  },
};
