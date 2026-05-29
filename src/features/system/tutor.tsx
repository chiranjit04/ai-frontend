import { useCallback, useEffect, useState } from "react";
import Papa from "papaparse";
import Header from "../../components/header";
import { useDeferredValue } from "react";
import { getDomains } from "../../service/domain.service";
import { Eye, Pencil, Trash2 } from "lucide-react";
import Swal from "sweetalert2";
import {
  getStudents,
  registerUser,
  listOfExams,
  createExam,
  deleteExam,
} from "../../service/user.service";
import RegisterModal from "../../components/registration/registerModal";
import { showSuccess, showError } from "../../service/toast.service";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

export default function Tutor() {
  const [questions, setQuestions] = useState<any[]>([]);
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState("");
  const [domains, setDomains] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [exams, setExams] = useState<any[]>([]);
  const [examTitle, setExamTitle] = useState("");
  const [selectedDomain, setSelectedDomain] = useState("");

const [examDescription, setExamDescription] = useState("");

const [duration, setDuration] = useState(60);

const [totalMarks, setTotalMarks] = useState(100);

const schema = yup.object({
  examTitle: yup
    .string()
    .required("Title is required"),

  examDescription: yup
    .string()
    .required("Description is required"),

  duration: yup
    .number()
    .required(),
  totalMarks: yup
    .number()
    .required(),
});

const {
  register,
  handleSubmit,
  formState: { errors },
} = useForm({
  resolver: yupResolver(schema),
});

  const refreshStudents = async () => {
    try {
      const studentData = await getStudents();

      setStudents(studentData);
    } catch (err) {
      console.error(err);
    }
  };

  const refreshExamList = async () => {
    try {
      const examData = await listOfExams();

      setExams(examData);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete =
  async (
    examId: string
  ) => {

     const result = await Swal.fire({
       title: "Delete Exam?",
       text: "This action cannot be undone.",
       icon: "warning",
       width: 320,
       showCancelButton: true,
       confirmButtonText: "Delete",
       cancelButtonText: "Cancel",
       confirmButtonColor: "#ef4444",
       customClass: {
         popup: "small-swal",
         title: "text-l font-semibold",
       },
     });

  if (!result.isConfirmed) {
    return;
  }

    try {

      await deleteExam(
        examId
      );

      showSuccess(
        "Exam deleted successfully"
      );

      await refreshExamList();

    } catch (
      err: any
    ) {

      showError(
        err?.response?.data
          ?.error ||
          "Delete failed"
      );
    }
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const [domainData, studentData, examData] = await Promise.all([
          getDomains(),
          getStudents(),
          listOfExams(),
        ]);

        setDomains(
          domainData.sort((a: any, b: any) => {
            if (a.name === "Others") return -1;

            return a.name.localeCompare(b.name);
          }),
        );

        setStudents(studentData);

        setExams(examData);
        console.log(examData);
      } catch (err) {
        console.error(err);
      }
    };

    loadData();
  }, []);

  // ✅ CSV Upload
  const handleFileUpload = (e: any) => {
    const file = e.target.files[0];
    setFileName(file.name); // ✅ show file name

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        try {
          const formatted = result.data.map((q: any, index: number) => {
            if (
              !q.question ||
              !q.option1 ||
              !q.option2 ||
              !q.option3 ||
              !q.option4 ||
              !q.correctAnswer
            ) {
              throw new Error(`Missing data at row ${index + 1}`);
            }

            if (
              ![q.option1, q.option2, q.option3, q.option4].includes(
                q.correctAnswer,
              )
            ) {
              throw new Error(`Correct answer mismatch at row ${index + 1}`);
            }

            return {
              id: Number(q.id) || Date.now() + index,
              question: q.question,
              options: [q.option1, q.option2, q.option3, q.option4],
              correctAnswer: q.correctAnswer,
            };
          });
          console.log(formatted);
          setQuestions(formatted);
          setError("");
        } catch (err: any) {
          setError(err.message);
        }
      },
    });
  };

  // ✅ Download Sample CSV
  const downloadSampleCSV = () => {
    const csv = `question,option1,option2,option3,option4,correctAnswer
    What is React?,Library,Framework,Language,Database,Library
    What is Angular?,State manager,API tool,Database,Framework,State manager
    What is Java?,State manager,API tool,Database,Framework,State manager`;

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "sample-questions.csv";
    a.click();

    URL.revokeObjectURL(url);
  };

  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  const handleUserSelect = (user: string) => {
    setSelectedUsers((prev) =>
      prev.includes(user) ? prev.filter((u) => u !== user) : [...prev, user],
    );
  };

  const saveParticipants = async () => {
    localStorage.setItem("allowedUsers", JSON.stringify(selectedUsers));
    try {
      // FINAL PAYLOAD
      const payload = {
        title: examTitle,
        description: examDescription,
        domain_id: selectedDomain,
        duration_minutes: duration,
        total_marks: totalMarks,

        // STUDENTS
        participants: selectedUsers.map((user: any) => user.id),

        // QUESTIONS
        questions: questions.map((question, index) => ({
          text: question.question,
          explanation: "",
          marks: 1,
          type: "MCQ_SINGLE",
          sequence: index + 1,
          section_id: null,
          options: question.options.map((option: any, optionIndex: number) => ({
            text: option,
            is_correct: option === question.correctAnswer,
            sequence: optionIndex + 1,
          })),
        })),
      };

      console.log(payload);

      // API CALL
      await createExam(payload);

      showSuccess("Exam created successfully");
    } catch (err: any) {
      console.error(err);

      showError(err?.response?.data?.error || "Failed to create exam");
    }
  };

  const [search, setSearch] = useState("");

  const deferredSearch = useDeferredValue(search);

  const filteredUsers = students.filter((user) =>
    user.first_name.toLowerCase().includes(deferredSearch.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <Header />
      <div className="pt-4">
        <div className="mx-auto bg-white text-black p-2 rounded-xl">
          <h1 className="text-2xl font-bold mb-6 text-center">Admin Panel</h1>

          <div className="flex gap-6">
            {/* 🔹 LEFT SIDE (SMALL WIDTH) */}
            <div className="w-[30%] space-y-6">
              {/* Upload */}
              <div className="p-4 border shadow-md rounded-xl bg-gray-50 space-y-4">
                <h3 className="font-semibold text-lg">Upload Questions</h3>

                {/* EXAM TITLE */}

                <div>
                  <label className="text-justify block text-sm font-medium mb-1">
                    Exam Title<span className="text-red-500">*</span>
                  </label>

                  <input
                    type="text"
                    {...register("examTitle")}
                    value={examTitle}
                    onChange={(e) => setExamTitle(e.target.value)}
                    placeholder="Enter exam title"
                    className="w-full p-2 border rounded-lg"
                  />
                  {errors.examTitle && (
                    <p className="text-justify text-red-500 text-xs">
                      {errors.examTitle.message}
                    </p>
                  )}
                </div>

                {/* DESCRIPTION */}

                <div>
                  <label className="text-justify block text-sm font-medium mb-1">
                    Description<span className="text-red-500">*</span>
                  </label>

                  <textarea
                    {...register("examDescription")}
                    value={examDescription}
                    onChange={(e) => setExamDescription(e.target.value)}
                    rows={3}
                    placeholder="Enter exam description"
                    className="w-full p-2 border rounded-lg resize-none"
                  />
                  {errors.examDescription && (
                    <p className="text-justify text-red-500 text-xs">
                      {errors.examDescription.message}
                    </p>
                  )}
                </div>

                {/* DURATION + TOTAL */}

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-justify block text-sm font-medium mb-1">
                      Duration<span className="text-red-500">*</span>
                    </label>

                    <input
                      type="number"
                      {...register("duration")}
                      value={duration}
                      onChange={(e) => setDuration(Number(e.target.value))}
                      className="w-full p-2 border rounded-lg"
                    />
                    {errors.duration && (
                      <p className="text-justify text-red-500 text-xs">
                        {errors.duration.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="text-justify block text-sm font-medium mb-1">
                      Total Marks<span className="text-red-500">*</span>
                    </label>

                    <input
                      type="number"
                      {...register("totalMarks")}
                      value={totalMarks}
                      onChange={(e) => setTotalMarks(Number(e.target.value))}
                      className="w-full p-2 border rounded-lg"
                    />
                    {errors.totalMarks && (
                      <p className="text-justify text-red-500 text-xs">
                        {errors.totalMarks.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* FILE INPUT */}

                <div>
                  <input
                    id="csvUpload"
                    type="file"
                    accept=".csv"
                    onChange={handleFileUpload}
                    className="hidden"
                  />

                  <label
                    htmlFor="csvUpload"
                    className="inline-block px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 cursor-pointer transition"
                  >
                    Upload
                  </label>
                </div>

                {/* FILE PREVIEW */}

                {questions.length > 0 && (
                  <div className="flex items-center gap-3 p-3 bg-gray-100 rounded-xl border">
                    <div className="w-10 h-10 flex items-center justify-center bg-blue-500 text-white rounded-lg">
                      📄
                    </div>

                    <div className="overflow-hidden">
                      <p className="font-medium text-sm truncate">{fileName}</p>

                      <p className="text-xs text-gray-500">
                        {questions.length} questions loaded
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Download */}
              <div className="p-2 border shadow-md rounded-xl bg-gray-50 text-center">
                <button
                  onClick={downloadSampleCSV}
                  className="px-4 py-2 bg-green-600 text-white rounded"
                >
                  Download Format
                </button>
              </div>

              {/* Participants */}
              <div className="p-4 border shadow-md rounded-xl bg-gray-50">
                {/* 🔽 DOMAIN DROPDOWN */}
                <div className="mb-3">
                  <label className="text-sm text-gray-600 mb-1 block">
                    Select Domain
                  </label>

                  <select
                    value={selectedDomain}
                    onChange={(e) => setSelectedDomain(e.target.value)}
                    className="w-full p-2 border rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  >
                    {/* DEFAULT OPTION */}
                    <option value="">Select Domain</option>
                    {domains.map((domain: any) => (
                      <option key={domain.domain_id} value={domain.domain_id}>
                        {domain.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold">Participants</h3>

                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="text-sm px-3 py-1 rounded-lg border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white transition whitespace-nowrap"
                  >
                    + Add Participants
                  </button>
                  <RegisterModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSubmit={async (data: any) => {
                      try {
                        await registerUser({
                          ...data,
                          type: "student",
                        });

                        await refreshStudents();
                        showSuccess("Student registered successfully");
                        setIsModalOpen(false);
                        setTimeout(() => {
                          setSuccessMessage("");
                        }, 3000);
                      } catch (err: any) {
                        console.error(err);
                        showError(
                          err?.response?.data?.error || "Something went wrong",
                        );
                        setTimeout(() => {
                          setSuccessMessage("");
                        }, 3000);
                      }
                    }}
                  />
                </div>
                {successMessage && (
                  <div className="mb-4 bg-green-100 text-green-700 border border-green-300 px-4 py-3 rounded-lg">
                    {successMessage}
                  </div>
                )}
                <input
                  type="text"
                  placeholder="Search Participants..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full mb-3 p-2 border rounded-lg"
                />

                <div className="w-full max-h-[250px] overflow-y-auto border rounded-xl p-3 bg-gray-50">
                  <div className="flex flex-wrap gap-2">
                    {filteredUsers.map((user) => (
                      <div
                        key={user.id}
                        onClick={() => handleUserSelect(user)}
                        className={`px-3 py-2 rounded-full text-sm cursor-pointer border transition break-words max-w-full ${
                          selectedUsers.some((u: any) => u.id === user.id)
                            ? "bg-blue-500 text-white border-blue-500"
                            : "bg-white hover:bg-gray-200"
                        }`}
                      >
                        {user.first_name} {user.last_name}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="text-center mt-3 text-sm">
                  {selectedUsers.length} selected
                </div>

                <button
                  onClick={handleSubmit(saveParticipants)}
                  className="mt-3 w-full px-4 py-2 bg-green-500 text-white rounded"
                >
                  Create Test
                </button>
              </div>
            </div>

            {/* 🔹 RIGHT SIDE (LARGE WIDTH) */}
            <div className="w-[70%] space-y-6">
              {/* Instructions */}
              <div className="p-2 bg-gray-100 rounded-xl text-left text-xs text-gray-700 space-y-2">
                <h3 className="font-semibold text-base">Instructions:</h3>

                <ul className="list-disc pl-5 space-y-1">
                  <li>
                    Download the sample format using <b>"Download Format"</b>.
                  </li>
                  <li>Open the file in Excel or Google Sheets.</li>
                  <li>Fill in the questions, options, and correct answers.</li>
                  <li>
                    If MCQ, the <b>correct answer</b> must match one of the
                    options exactly.
                  </li>
                  <li>Do not change column names in the file.</li>
                  <li>
                    Save the file in <b>.csv format</b>.
                  </li>
                  <li>
                    Upload the file using <b>"Upload Formatted Questions"</b>.
                  </li>
                </ul>
              </div>

              {/* Error */}
              {error && <p className="text-red-500">{error}</p>}

              {/* Preview */}
              {questions.length > 0 && (
                <div className="bg-white rounded-2xl shadow-md p-3 border bg-gray-50 ">
                  <div className="flex items-center justify-between mb-3">
                    {/* LEFT SIDE */}
                    <div className="flex items-center gap-2">
                      {/* Accent Icon / Indicator */}
                      <div className="w-8 h-8 flex items-center justify-center rounded-xl bg-blue-100 text-blue-600 text-lg shadow-sm">
                        📝
                      </div>

                      {/* Title + Subtitle */}
                      <div>
                        <h2 className="text-lg font-semibold text-gray-800">
                          Review Questions
                        </h2>
                      </div>
                    </div>
                  </div>

                  {/* Table */}
                  <div className="overflow-auto max-h-[350px] border rounded-lg">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-200 sticky top-0">
                        <tr>
                          <th className="p-2">Q</th>
                          <th className="p-2">Question</th>
                          <th className="p-2">Correct</th>
                          <th className="p-2">Status</th>
                        </tr>
                      </thead>

                      <tbody>
                        {questions.map((q, i) => {
                          const isValid = q.options.includes(q.correctAnswer);

                          return (
                            <tr
                              key={q.id}
                              className={`border-t ${
                                isValid ? "bg-white" : "bg-red-100"
                              }`}
                            >
                              <td className="p-2">{i + 1}</td>
                              <td className="p-2">{q.question}</td>
                              <td className="p-2">{q.correctAnswer}</td>
                              <td className="p-2">
                                {isValid ? (
                                  <span className="text-green-600">
                                    ✔ Valid
                                  </span>
                                ) : (
                                  <span className="text-red-600">
                                    ❌ Invalid
                                  </span>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {/* Save Questions */}
                </div>
              )}
              <div className="bg-white rounded-2xl shadow-md p-3 border bg-gray-50">
                <div className="flex items-center justify-between mb-4">
                  {/* LEFT SIDE */}
                  <div className="flex items-center gap-2">
                    {/* Accent Icon / Indicator */}
                    <div className="w-8 h-8 flex items-center justify-center rounded-xl bg-blue-100 text-blue-600 text-lg shadow-sm">
                      📊
                    </div>

                    {/* Title + Subtitle */}
                    <div>
                      <h2 className="text-lg font-semibold text-gray-800">
                        Current Active Tests
                      </h2>
                    </div>
                  </div>
                </div>

                {/* Table */}
                <div className="overflow-auto max-h-[350px] border rounded-lg">
                  <table className="w-full text-sm">
                    {/* Header */}
                    <thead className="bg-gray-100 text-gray-700">
                      <tr>
                        <th className="p-3 text-left">Exam</th>
                        <th className="p-3 text-left">Domain</th>
                        <th className="p-3 text-left">Participants</th>
                        <th className="p-3 text-left">Status</th>
                        <th className="p-3 text-left">Action</th>
                      </tr>
                    </thead>

                    {/* Body */}
                    <tbody>
                      {exams.map((exam: any) => (
                        <tr
                          key={exam.exam_id}
                          className="border-t hover:bg-gray-50"
                        >
                          <td className="p-3 text-left">{exam.title}</td>
                          <td className="p-3 text-left">{exam.description}</td>
                          <td className="p-3 text-left">
                            {exam.students?.length > 0
                              ? exam.students.length
                              : 0}
                          </td>
                          <td
                            className={`text-left p-3 font-medium ${
                              exam.status === "ACTIVE"
                                ? "text-green-600"
                                : "text-yellow-600"
                            }`}
                          >
                            ● {exam.status}
                          </td>
                          <td className="p-3 text-left flex gap-2">
                            <button className="p-2 rounded-lg bg-yellow-100 text-yellow-600 hover:bg-yellow-200" title="Edit">
              
                              <Pencil size={18} />
                            </button>
                            <button
                              onClick={() => handleDelete(exam.exam_id)}
                              className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200"
                            title="Delete">
                              
                              <Trash2 size={18} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
