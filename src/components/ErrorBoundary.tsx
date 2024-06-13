import React from "react";
import { isRouteErrorResponse, useRouteError } from "react-router-dom";

const ErrorBoundary: React.FC = () => {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    const customError = error.data as {
      title: string;
      response_code: number;
      message: string;
    };

    return (
      <div>
        <p className="error-code">Error Code {customError.response_code}</p>
        <h2>{customError.title}</h2>
        <p>Sorry, an unexpected error has occurred.</p>
        <p>
          <i>{customError.message}</i>
        </p>
      </div>
    );
  } else if (
    error instanceof Error &&
    "title" in error &&
    "response_code" in error
  ) {
    const customError = error as {
      title: string;
      response_code: number;
      message: string;
    };

    return (
      <div>
        <p className="error-code">Error Code {customError.response_code}</p>
        <h2>{customError.title}</h2>
        <p>Sorry, an unexpected error has occurred.</p>
        <p>
          <i>{customError.message}</i>
        </p>
      </div>
    );
  } else if (error instanceof Error) {
    return (
      <div>
        <h2>Oops!</h2>
        <p>Sorry, an unexpected error has occurred.</p>
        <p>
          <i>{error.message}</i>
        </p>
      </div>
    );
  }

  return <div>Oops! Something went wrong.</div>;
};

export default ErrorBoundary;
