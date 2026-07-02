import { useDispatch } from "react-redux";
import { logout } from "../auth/authSlice";
import Header from "../../components/header";

export default function NoExam() {
    const dispatch = useDispatch();
     dispatch(logout());

  return (

    <div className="h-screen flex items-center justify-center bg-[#90E29D]">
<Header />
      <div className="bg-white p-8 rounded-xl">

        <h2 className="text-2xl font-bold">
          No Active Exam Assigned
        </h2>

        <p className="mt-3">
          You have completed your exam or no exam has been assigned.
        </p>

      </div>

    </div>

  );
}