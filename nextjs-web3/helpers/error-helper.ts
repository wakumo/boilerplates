import { toast } from "react-toastify";

const showErrorMessage = (message: any) => {
  let errorMessage = "";

  if (typeof message === "string") {
    toast.error(message);
  } else {
    errorMessage = message?.message || message?.data?.message;
    if (errorMessage.length > 0 && typeof errorMessage === "string") {
      if (
        errorMessage.includes("Response has no error or result for request")
      ) {
        errorMessage = "Response has no error or result for request";
      } else if (errorMessage.includes("User denied transaction signature")) {
        errorMessage = "User denied transaction signature";
      }
      if (errorMessage.length > 100)
        errorMessage = "Opps something went wrong!";
      toast.error(errorMessage);
    } else toast.error("Opps something went wrong!");
  }
};

export { showErrorMessage };
