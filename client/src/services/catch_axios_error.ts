import axios from "axios";
import { toast } from "react-toastify";

export function catchAxiosError(err: unknown) {
  if (axios.isAxiosError(err)) {
    console.log(err.response);
    toast.error(err.response?.data.detail);
  } else {
    console.error(err);
  }
}