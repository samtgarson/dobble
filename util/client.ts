import Axios from "axios";

export const createClient = (token: string) => Axios.create({
  headers: {
    Authorization: token
  }
})
