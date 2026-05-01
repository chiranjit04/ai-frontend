import { useAppSelector, useAppDispatch } from "../../hooks/reduxHooks";
import { useNavigate } from "react-router-dom";
import { resetExam } from "./examSlice";
import { questions } from "./examData";

export default function Result() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { answers } = useAppSelector((state) => state.exam);

  const score = questions.reduce((acc, q) => {
    if (answers[q.id] === q.answer) acc++;
    return acc;
  }, 0);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <div className="w-[800px] p-8 bg-white rounded-2xl text-center">

        <h2 className="text-2xl font-bold">Exam Result</h2>

        <div className="mt-6 text-xl">
          Score: <span className="font-bold">{score}</span> / {questions.length}
        </div>

        <div className="mt-4">
          {score / questions.length >= 0.5 ? (
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