import { QuizError } from "../types";

export const fetchQuizData = async (
  category: string | null,
  difficulty: string | null
) => {
  const categoryParam =
    category && category !== "any" ? `&category=${category}` : "";
  const difficultyParam =
    difficulty && difficulty !== "any" ? `&difficulty=${difficulty}` : "";
  const response = await fetch(
    `https://opentdb.com/api.php?amount=5${categoryParam}${difficultyParam}`
  );

  if (!response.ok && response.status !== 429) {
    const error: QuizError = {
      name: Error.name,
      title: "API Error",
      message: "An error occurred while fetching quiz data.",
      response_code: -1,
    };
    throw error;
  }

  const data = await response.json();
  console.log(data);
  const createQuizError = (
    title: string,
    message: string,
    response_code: number
  ): QuizError => {
    const error = new Error(message) as QuizError;
    error.title = title;
    error.response_code = response_code;
    return error;
  };

  switch (data.response_code) {
    case 1:
      throw createQuizError(
        "No Data Available",
        "No quiz data available for the selected category and difficulty.",
        1
      );
    case 2:
      throw createQuizError(
        "Invalid Parameter",
        "Contains an invalid parameter. Arguments passed in aren't valid. (Ex. Amount = Five)",
        2
      );
    case 3:
      throw createQuizError(
        "Token Not Found",
        "Session Token does not exist.",
        3
      );
    case 4:
      throw createQuizError(
        "Token Empty Session",
        "Token has returned all possible questions for the specified query. Resetting the Token is necessary.",
        4
      );
    case 5:
      throw createQuizError(
        "Rate Limit Hit",
        "Too many requests have occurred. Each IP can only access the API once every 5 seconds.",
        5
      );
    default:
      return data;
  }
};
