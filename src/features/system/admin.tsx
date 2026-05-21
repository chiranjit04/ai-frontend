import { useState } from "react";
import Papa from "papaparse";
import Header from "../../components/header";
import { useDeferredValue } from "react";

export default function Admin() {
  const [questions, setQuestions] = useState<any[]>([]);
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState("");

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
              ![
                q.option1,
                q.option2,
                q.option3,
                q.option4,
              ].includes(q.correctAnswer)
            ) {
              throw new Error(
                `Correct answer mismatch at row ${index + 1}`
              );
            }

            return {
              id: Number(q.id) || Date.now() + index,
              question: q.question,
              options: [
                q.option1,
                q.option2,
                q.option3,
                q.option4,
              ],
              correctAnswer: q.correctAnswer,
            };
          });
console.log(formatted)
          setQuestions(formatted);
          setError("");
        } catch (err: any) {
          setError(err.message);
        }
      },
    });
  };

  // ✅ Save
  const handleSave = () => {
    localStorage.setItem("questions", JSON.stringify(questions));
    alert("Questions saved successfully!");
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

  const allUsers = ["chiranjit", "rahul", "amit", "admin", "john","alice","bob","charlie","dave"];

  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  const handleUserSelect = (user: string) => {
    setSelectedUsers((prev) =>
      prev.includes(user) ? prev.filter((u) => u !== user) : [...prev, user],
    );
  };

  const saveParticipants = () => {
    localStorage.setItem("allowedUsers", JSON.stringify(selectedUsers));
    console.log(selectedUsers, questions, selectedUsers, selectedUsers);
    alert("Participants saved!");
  };

  const [search, setSearch] = useState("");

  const deferredSearch = useDeferredValue(search);

  const filteredUsers = allUsers.filter((user) =>
    user.toLowerCase().includes(deferredSearch.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <Header />
      <div className="pt-4">
        <div className="mx-auto bg-white text-black p-6 rounded-xl">
          <h1 className="text-2xl font-bold mb-6 text-center">Admin Panel</h1>

          <div className="flex gap-6">
            {/* 🔹 LEFT SIDE (SMALL WIDTH) */}
            <div className="w-[30%] space-y-6">
              {/* Upload */}
              <div className="p-4 border shadow-md rounded-xl bg-gray-50">
                <h3 className="font-semibold mb-3">Upload Questions</h3>

                <label className="flex flex-col items-center gap-3 cursor-pointer">
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleFileUpload}
                    className="hidden"
                  />

                  <div className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                    Upload CSV
                  </div>
                  {questions.length > 0 && (
                    <div className="flex items-center gap-3 p-2 bg-gray-100 rounded-xl border">
                      <div className="w-10 h-10 flex items-center justify-center bg-blue-500 text-white rounded-lg">
                        📄
                      </div>
                      <div>
                        <p className="font-medium text-sm">{fileName}</p>
                        <p className="text-xs text-gray-500">
                          {questions.length} questions loaded
                        </p>
                      </div>
                    </div>
                  )}
                </label>
              </div>

              {/* Download */}
              <div className="p-4 border shadow-md rounded-xl bg-gray-50 text-center">
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

                  <select className="w-full p-2 border rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400">
                    <option value="">Select domain</option>
                    <option>Bank</option>
                    <option>PCS</option>
                    <option>UPSC</option>
                    <option>Railway</option>
                  </select>
                </div>
                <h3 className="font-semibold mb-3 text-center">Participants</h3>

                <input
                  type="text"
                  placeholder="Search user..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full mb-3 p-2 border rounded-lg"
                />

                <div className="flex flex-wrap gap-2 justify-center max-h-[200px] overflow-auto">
                  {filteredUsers.map((user) => (
                    <div
                      key={user}
                      onClick={() => handleUserSelect(user)}
                      className={`px-3 py-1 rounded-full text-sm cursor-pointer border ${
                        selectedUsers.includes(user)
                          ? "bg-blue-500 text-white"
                          : "bg-white hover:bg-gray-200"
                      }`}
                    >
                      {user}
                    </div>
                  ))}
                </div>

                <div className="text-center mt-3 text-sm">
                  {selectedUsers.length} selected
                </div>

                <button
                  onClick={saveParticipants}
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
                    Download the sample format using{" "}
                    <b>"Download Format"</b>.
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
                      {/* Row 1 */}
                      <tr className="border-t hover:bg-gray-50">
                        <td className="p-3">Bank</td>
                        <td className="p-3">Pre</td>
                        <td className="p-3">5 Users</td>
                        <td className="p-3 text-green-600 font-medium">
                          ● Active
                        </td>
                        <td className="p-3">
                          <button className="px-3 py-1 bg-blue-500 text-white rounded text-xs">
                            View
                          </button>
                        </td>
                      </tr>

                      {/* Row 2 */}
                      <tr className="border-t hover:bg-gray-50">
                        <td className="p-3">PCS</td>
                        <td className="p-3">Mock</td>
                        <td className="p-3">3 Users</td>
                        <td className="p-3 text-yellow-600 font-medium">
                          ● Pending
                        </td>
                        <td className="p-3">
                          <button className="px-3 py-1 bg-blue-500 text-white rounded text-xs">
                            View
                          </button>
                        </td>
                      </tr>
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