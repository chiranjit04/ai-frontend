import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks";
import { selectAnswer, prevQuestion, nextQuestion } from "./examSlice";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { setExam, setQuestions, setScore } from "./examSlice";
import { enrolledExamCheck, getExamQuestions, submitExam } from "../../service/exam.service";
import { useSelector } from "react-redux";

export default function Exam() {
  const dispatch = useAppDispatch();
  const INITIAL_TIME = 90 * 60;
  const [startExam, setStartExam] = useState(false);
  const [timeLeft, setTimeLeft] = useState(INITIAL_TIME);
  const [showResult, setShowResult] = useState(false);
  //const [score, setScore] = useState(0);
  const navigate = useNavigate();
  //const { currentIndex, answers } = useAppSelector((state) => state.exam);

  const { exam, questions, currentIndex, answers } = useSelector(
    (state: any) => state.exam,
  );

  const currentQuestion =
  questions?.[currentIndex];

useEffect(() => {
  const loadExam = async () => {
    try {
      const exam = await enrolledExamCheck();

      dispatch(setExam(exam));

      const questions = await getExamQuestions(exam.exam_id);

      dispatch(setQuestions(questions));
    } catch (err) {
      console.error(err);
    }
  };

  loadExam();
}, [dispatch]);

  useEffect(() => {
    if (!startExam || showResult) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setShowResult(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [startExam, showResult]);

  const formatTime = (seconds: number) => {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  return `${String(hrs).padStart(2, "0")} : ${String(mins).padStart(2, "0")} : ${String(secs).padStart(2, "0")}`;
};

useEffect(() => {
  if (exam?.duration_minutes) {
    setTimeLeft(exam.duration_minutes * 60);
  }
}, [exam]);

  return (
    <>
      <div className="h-screen flex gap-6 p-4  bg-[#90E29D] text-black">
        {/* Exam info */}

        <div className="w-[400px] p-6 rounded-2xl bg-white border border-gray-200 space-y-5">
          {/* TEST */}
          <div className="p-4 rounded-xl border border-gray-200">
            <p className="text-green-600 font-semibold mb-1">Test</p>
            <p className="text-gray-800 text-sm">{exam?.title}</p>
          </div>

          {/* TIMER */}
          <div className="p-4 rounded-xl border border-gray-200">
            <p className="text-green-600 font-semibold mb-1">Time Remaining</p>
            <p className="text-gray-800 text-sm font-medium">
              {formatTime(timeLeft)}
            </p>
          </div>

          {/* QUESTIONS GRID */}
          <div className="p-4 rounded-xl border border-gray-200">
            <p className="text-green-600 font-semibold mb-3">Questions</p>

            <div className="flex flex-wrap gap-2">
              {questions.map((q, i) => {
                const isAnswered = !!answers[q.id];
                const isCurrent = i === currentIndex;

                return (
                  <div
                    key={q.id}
                    className={`w-10 h-10 flex items-center justify-center rounded-md text-sm font-medium cursor-pointer transition
              
              ${
                isCurrent
                  ? "border-2 border-blue-500 text-blue-600 bg-white"
                  : isAnswered
                    ? "bg-green-600 text-white"
                    : "bg-red-500 text-white"
              }

              hover:opacity-80
            `}
                  >
                    {i + 1}
                  </div>
                );
              })}
            </div>
          </div>

          {/* LEGEND */}
          <div className="flex gap-4 text-sm">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-green-600 rounded-sm" />
              Attempted
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-red-500 rounded-sm" />
              Not Attempted
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 border-2 border-blue-500 rounded-sm" />
              Current
            </div>
          </div>

          {/* NEXT TEST */}
          {/* <div className="p-4 rounded-xl border border-gray-200">
            <p className="text-green-600 font-semibold mb-1">Next Test</p>
            <p className="text-gray-800 text-sm">Academic Aptitude Test</p>
          </div> */}
        </div>

        {/* Exam content */}

        <div
          className={`p-6 rounded-2xl min-w-[1000px] border border-white/10 
  ${!startExam ? "bg-[url('/bg-study.png')] bg-cover bg-center" : "bg-white"}`}
        >
          {/* Question */}
          {!startExam && !showResult && (
            <div className="mt-6 flex justify-end gap-4">
              <button
                onClick={() => setStartExam(!startExam)}
                className="px-5 py-2 rounded-xl text-white bg-blue-500 hover:bg-blue-600"
              >
                Start Exam
              </button>
            </div>
          )}
          {startExam && !showResult && (
            <>
              <div className="flex flex-row">
                <h2 className="text-xl flex font-semibold mb-4 text-left">
                  Q{currentIndex + 1}.
                </h2>
                <h2 className="text-xl flex font-semibold mb-4 text-left">
                  {currentQuestion.question}
                </h2>
              </div>

              {/* Options */}
              <div className="space-y-3">
                {currentQuestion.options.map((option, i) => (
                  <div
                    key={i}
                    onClick={() =>
                      dispatch(
                        selectAnswer({
                          questionId: currentQuestion.id,
                          answer: option,
                        }),
                      )
                    }
                    className={`flex p-3 rounded-xl cursor-pointer border ${
                      answers[currentQuestion.id] === option
                        ? "bg-blue-500/40 border-blue-400"
                        : "bg-white/10 border-white/10 hover:bg-white/20"
                    }`}
                  >
                    <input
                      type="radio"
                      name={`question-${currentQuestion.id}`}
                      checked={answers[currentQuestion.id] === option}
                      readOnly
                      className="mr-2"
                    />
                    {option}
                  </div>
                ))}
              </div>

              {/* Buttons */}
              <div className="mt-6 flex justify-end gap-4">
                <button
                  onClick={() => dispatch(prevQuestion())}
                  className="px-5 py-2 bg-gray-500 rounded-xl hover:bg-gray-600"
                >
                  Back
                </button>
                <button
                  onClick={async () => {
                    if (currentIndex === questions.length - 1) {
                      try {
                        const result = await submitExam(exam.exam_id, answers);

                        console.log(result);
                        setShowResult(true);
                        navigate("/result", {
                          state: result,
                        });
                      } catch (err) {
                        console.error(err);
                      }
                    } else {
                      dispatch(nextQuestion());
                    }
                  }}
                  className="px-5 py-2 rounded-xl bg-blue-500 hover:bg-blue-600"
                >
                  {currentIndex === questions.length - 1 ? "Submit" : "Next"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
