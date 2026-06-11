import { useAppDispatch } from "../../hooks/reduxHooks";
import { useLocation, useNavigate } from "react-router-dom";
import { resetExam } from "./examSlice";
//import { useSelector } from "react-redux";

export default function Result() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  //const score = useSelector((state: any) => state.exam.score);

  // const { questions } = useSelector(
  //   (state: any) => state.exam,
  // );

  const location = useLocation();

  const { score, totalMarks } = location.state;

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <div className="w-[800px] p-8 bg-white rounded-2xl text-center">
        <h2 className="text-2xl font-bold">Exam Result</h2>

        <div className="mt-6 text-xl">
          Score: <span className="font-bold">{score}</span> /{" "}{totalMarks}
        </div>

        <div className="mt-4">
          {score / totalMarks >= 0.5 ? (
            <p className="text-green-600 font-semibold">Passed 🎉</p>
          ) : (
            <p className="text-red-500 font-semibold">Failed ❌</p>
          )}
        </div>

        <button
          onClick={() => {
            dispatch(resetExam());
            navigate("/");
          }}
          className="mt-6 px-5 py-2 bg-blue-500 text-white rounded-xl"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}