import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setLoading, setTutors } from "../admin/adminSlice";
import { getTutors, registerUser } from "../../service/user.service";
import RegisterModal from "../../components/registration/registerModal";
import { Pencil, Trash2 } from "lucide-react";
import Header from "../../components/header";

export default function Admin() {
  const tutors = useSelector((state: any) => state.admin.tutors);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadTutors();
  }, []);

  const loadTutors = async () => {
    try {
      dispatch(setLoading(true));

      const data = await getTutors();

      dispatch(setTutors(data));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const dispatch = useDispatch();

  return (
    <div className="min-h-screen bg-slate-900 text-white p-2 sm:p-4 md:p-6">
        <Header />
      <div className="pt-4">
        <div className="mx-auto bg-gradient-to-r from-[#90E29D] to-[#d8eadb] text-black p-4 rounded-xl">
          <h1 className="text-2xl font-bold text-center mb-6">Admin Panel</h1>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* LEFT SECTION */}

            <div className="bg-white rounded-2xl shadow-md p-5">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-semibold text-lg">Tutor Management</h2>

                <button
                  onClick={() => setIsModalOpen(true)}
                  className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  + Add Tutor
                </button>
              </div>

              <div className="space-y-3">
                <div className="p-4 rounded-xl border bg-blue-50">
                  <p className="text-sm text-gray-500">Total Tutors</p>

                  <p className="text-2xl font-bold">{tutors.length}</p>
                </div>

                <div className="p-4 rounded-xl border bg-green-50">
                  <p className="text-sm text-gray-500">Active Tutors</p>

                  <p className="text-2xl font-bold">{tutors.length}</p>
                </div>
              </div>
            </div>

            {/* RIGHT SECTION */}

            <div className="xl:col-span-2 bg-white rounded-2xl shadow-md p-5">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-semibold text-lg">Registered Tutors</h2>

                <input
                  type="text"
                  placeholder="Search Tutor..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="border rounded-lg px-3 py-2"
                />
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[700px]">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="p-3 text-left">Name</th>

                      <th className="p-3 text-left">Email</th>

                      <th className="p-3 text-left">Mobile</th>

                      <th className="p-3 text-left">Status</th>

                      <th className="p-3 text-left">Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {tutors.map((tutor: any) => (
                      <tr key={tutor.id} className="border-b hover:bg-gray-50">
                        <td className="p-3">
                          {tutor.first_name} {tutor.last_name}
                        </td>

                        <td className="p-3">{tutor.email}</td>

                        <td className="p-3">{tutor.mobile_number}</td>

                        <td className="p-3">
                          <span className="px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs">
                            Active
                          </span>
                        </td>

                        <td className="p-3 flex gap-2">
                          <button className="p-2 rounded-lg bg-yellow-100 text-yellow-600 hover:bg-yellow-200">
                            <Pencil size={18} />
                          </button>

                          <button className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200">
                            <Trash2 size={18} />
                          </button>

                          <button className="px-3 py-1 rounded-lg bg-blue-500 text-white hover:bg-blue-600 text-sm">
                            Reset Password
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* REGISTER MODAL */}

          <RegisterModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSubmit={async (data: any) => {
              await registerUser({
                ...data,
                type: "TUTOR",
              });

              await loadTutors();

              setIsModalOpen(false);
            }}
          />
        </div>
      </div>
    </div>
  );
}

