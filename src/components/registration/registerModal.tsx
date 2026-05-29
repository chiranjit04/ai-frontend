import { useState } from "react";
import { registerUser } from "../../service/user.service";

interface Props {
  isOpen: boolean;

  onClose: () => void;

  onSubmit: (data: any) => void;
}

export default function RegisterModal({
  isOpen,
  onClose,
  onSubmit
}: Props) {
  const [formData, setFormData] =
    useState({
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      qualification: "",
      mobile: ""
    });

  if (!isOpen) return null;

  const handleChange = (
    e: any
  ) => {
    setFormData({
      ...formData,

      [e.target.name]:
        e.target.value,
    });
  };

  const handleSubmit = () => {
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
        
        {/* HEADER */}

        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-semibold">
            Register Participants
          </h2>

          <button
            onClick={onClose}
            className="text-gray-500 hover:text-black text-xl"
          >
            ×
          </button>
        </div>

        {/* FORM */}

        <div className="space-y-4">

          <input
            type="text"
            name="first_name"
            placeholder="First Name"
            value={
              formData.first_name
            }
            onChange={handleChange}
            className="w-full border rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="text"
            name="last_name"
            placeholder="Last Name"
            value={
              formData.last_name
            }
            onChange={handleChange}
            className="w-full border rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="text"
            name="qualification"
            placeholder="Qualification"
            value={
              formData.qualification
            }
            onChange={handleChange}
            className="w-full border rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="tel"
            name="mobile"
            placeholder="Mobile"
            value={
              formData.mobile
            }
            onChange={handleChange}
            className="w-full border rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500"
          />


          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={
              formData.password
            }
            onChange={handleChange}
            className="w-full border rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* ACTIONS */}

        <div className="flex justify-end gap-3 mt-6">
          
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
}