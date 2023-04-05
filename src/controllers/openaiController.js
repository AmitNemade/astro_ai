import { Configuration, OpenAIApi } from "openai";
import { Person } from "../models/personModel.js";
import { Chat } from "../models/chatModel.js";

export default async function (req, res) {
  // return res.status(500).json({
  //   success: false,
  //   error: {
  //     message: "An error occurred during your request.",
  //   },
  // });
  // return res.status(200).json({
  //   success: true,
  //   result: {
  //     role: "assistant",
  //     content:
  //       "According to your birth chart, you are an Aries ascendant with Jupiter in the first house. The lord of the seventh house, which represents marriage, is Venus and it is placed in the third house with Mercury. \n\nThis placement of Venus indicates that you will have a successful and harmonious marriage life. Your spouse will be intelligent, witty, and communicative, and you will share a strong mental connection with them. Your marriage will be a partnership that will bring balance to your life, and your spouse will support you in your endeavors.\n\nThe influence of Jupiter and Venus also suggests that your marriage will be blessed with material and financial prosperity. You may experience some ups and downs in your marriage, but you will navigate through them effectively with your partner's support.\n\nIn addition to this, the presence of Mars in the second house of your birth chart may indicate that you may have a tendency to be domineering and opinionated. You may need to work on your communication skills and learn to compromise to maintain a healthy and successful marriage.\n\nOverall, your birth chart suggests a fulfilling and successful marriage life, with a partner who shares your values and supports your goals. Remember to communicate openly and honestly with your spouse to ensure a long-lasting and happy marriage.",
  //   },
  // });
  const configuration = new Configuration({
    organization: "org-TyGHai5QapnDlzbwoQmhomAC",
    apiKey: process.env.OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);
  if (!configuration.apiKey) {
    return res.status(500).json({
      success: false,
      error_message:
        "OpenAI API key not configured, please follow instructions in README.md",
    });
  }
  const { person_id } = req.params;
  const person = await Person.findById(person_id);
  const query = req.query.query || "";

  if (
    !person.birth_date.day ||
    !person.birth_date.month ||
    !person.birth_date.year ||
    !person.birth_date.hours ||
    !person.birth_date.minutes ||
    !person.birth_location
  ) {
    return res.status(422).json({
      success: false,
      error_message: "Please enter a valid question",
    });
  }
  if (query.trim().length === 0) {
    return res.status(400).json({
      error_message: "Please enter a valid question",
    });
  }

  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: generateMessages(
        person.birth_date,
        person.birth_location,
        query
      ),
    });
    const person_query = new Chat({
      role: "user",
      message: query,
      user_id: person._id,
    });
    await person_query.save();
    const assistant_query = new Chat({
      message: completion.data.choices[0].message.content,
      role: completion.data.choices[0].message.role,
      user_id: person._id,
    });
    await assistant_query.save();
    return res.status(200).json({
      success: true,
      result: {
        message: completion.data.choices[0].message.content,
        role: completion.data.choices[0].message.role,
      },
    });
  } catch (error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res
        .status(error.response.status)
        .json({ success: false, error: error.response.data });
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        success: false,
        error: {
          message: "An error occurred during your request.",
        },
      });
    }
  }
}

function generateMessages(birth_date, birth_location, query) {
  return [
    {
      role: "system",
      content: "You are a astrologer",
    },
    {
      role: "user",
      content: generateQuery(birth_date, birth_location, query),
    },
  ];
}

function generateQuery(birth_date, birth_location, query) {
  return `I was born on ${birth_date.month}/${birth_date.day}/${birth_date.year} at ${birth_date.hours}:${birth_date.minutes} in ${birth_location}. Based on details of my birth chart, ${query}.`;
}
