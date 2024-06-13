import React from "react";
import { isRouteErrorResponse, useRouteError } from "react-router-dom";

const ErrorBoundary: React.FC = () => {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <div>
        <h2>Oops!</h2>
        <p>Sorry, an unexpected error has occurred.</p>
        <p>
          <i>{error.statusText}</i>
        </p>
        {error.data?.message && <p>{error.data.message}</p>}
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
