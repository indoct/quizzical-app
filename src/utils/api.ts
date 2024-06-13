export const fetchQuizData = async (
  category: string | null,
  difficulty: string | null
) => {
  const categoryParam =
    category && category !== "any" ? `&category=${category}` : "";
  const difficultyParam =
    difficulty && difficulty !== "any" ? `&difficulty=${difficulty}` : "";
  const response = await fetch(
    `https://opentdb.com/api.php?amount=10${categoryParam}${difficultyParam}`
  );
  if (!response.ok) {
    throw new Error(`Failed to fetch quiz data: ${response.statusText}`);
  }
  const data = await response.json();
  if (data.response_code !== 0) {
    throw new Error(
      "No quiz data available for the selected category and difficulty."
    );
  }
  return data;
};
