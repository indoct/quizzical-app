import { createBrowserRouter, defer } from "react-router-dom";
import App from "./App";
import ErrorBoundary from "./components/ErrorBoundary";
import Settings from "./pages/Settings";
import QuizPage from "./pages/QuizPage";
import { fetchQuizData } from "./utils/api";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        path: "/",
        element: <Settings />,
      },
      {
        path: "quiz",
        element: <QuizPage />,
        loader: async ({ request }) => {
          const url = new URL(request.url);
          const category = url.searchParams.get("category");
          const difficulty = url.searchParams.get("difficulty");
          return defer({
            quizData: fetchQuizData(category, difficulty),
          });
        },
        errorElement: <ErrorBoundary />,
      },
    ],
  },
]);
