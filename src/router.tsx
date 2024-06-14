import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import ErrorBoundary from "./components/ErrorBoundary";
import Settings from "./pages/Settings";
import QuizPage from "./pages/QuizPage";

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
        errorElement: <ErrorBoundary />,
      },
    ],
  },
]);
