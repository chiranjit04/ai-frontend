import { useState } from "react";
import Papa from "papaparse";
import Header from "../../components/header";

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
    const csv = `id,question,option1,option2,option3,option4,correctAnswer
1,What is React?,Library,Framework,Language,Database,Library
2,What is Redux?,State manager,API tool,Database,Framework,State manager
3,What is Redux?,State manager,API tool,Database,Framework,State manager
4,What is Redux?,State manager,API tool,Database,Framework,State manager
5,What is Redux?,State manager,API tool,Database,Framework,State manager
6,What is Redux?,State manager,API tool,Database,Framework,State manager
7,What is Redux?,State manager,API tool,Database,Framework,State manager
8,What is Redux?,State manager,API tool,Database,Framework,State manager
9,What is Redux?,State manager,API tool,Database,Framework,State manager
10,What is Redux?,State manager,API tool,Database,Framework,State manager`;

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "sample-questions.csv";
    a.click();

    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <Header />
      <div className="pt-16 p-6">
        <div className="max-w-5xl mx-auto bg-white text-black p-6 rounded-xl">
          <h1 className="text-2xl font-bold mb-4">Admin Panel</h1>

          {/* Upload */}
          <div className="mb-4">
            <label className="flex flex-col items-center gap-3 cursor-pointer">
              {/* Hidden input */}
              <input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="hidden"
              />

              {/* Custom Button */}
              <div className="px-4 flex items-center py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                Upload Formated Questions
              </div>

              {/* File Name */}
              {fileName && (
                <span className="text-sm text-gray-600">{fileName}</span>
              )}
            </label>
          </div>

          {/* Download Sample */}
          <button
            onClick={downloadSampleCSV}
            className="mb-4 px-4 py-2 bg-green-600 text-white rounded"
          >
            Download Questions Format
          </button>

          {/* Error */}
          {error && <p className="text-red-500 mb-4">{error}</p>}

          {/* Preview */}
          {questions.length > 0 && (
            <div className="mt-4 mb-4">
              {/* File Card (Chat Style) */}
              <div className="flex items-center gap-3 p-3 bg-gray-100 rounded-xl border mb-4">
                <div className="w-10 h-10 flex items-center justify-center bg-blue-500 text-white rounded-lg">
                  📄
                </div>
                <div>
                  <p className="font-medium text-sm">questions.csv</p>
                  <p className="text-xs text-gray-500">
                    {questions.length} questions loaded
                  </p>
                </div>
              </div>

              {/* Preview Table */}
              <div className="overflow-auto max-h-[300px] border rounded-lg">
                <table className="w-full text-sm">
                  <thead className="bg-gray-200 sticky top-0">
                    <tr>
                      <th className="p-2 ">Q</th>
                      <th className="p-2 ">Question</th>
                      <th className="p-2 ">Correct</th>
                      <th className="p-2 ">Status</th>
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
                              <span className="text-green-600">✔ Valid</span>
                            ) : (
                              <span className="text-red-600">❌ Invalid</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Save */}
          {questions.length > 0 && (
            <button
              onClick={handleSave}
              className="px-5 py-2 bg-blue-500 text-white rounded"
            >
              Save Questions
            </button>
          )}
        </div>
      </div>
    </div>
  );
}