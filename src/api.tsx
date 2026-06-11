import axios from "axios";

const API_URL = "http://localhost:5000/api/chat";

export const sendMessage = async (message: string): Promise<string> => {
  const res = await axios.post<{ reply: string }>(API_URL, { message });
  return res.data.reply;
};

const api = axios.create({
  baseURL:
    import.meta.env
      .VITE_API_URL,
});