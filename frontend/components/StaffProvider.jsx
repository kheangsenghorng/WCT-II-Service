'use client';

import { Phone, Mail } from 'lucide-react';

export default function StaffProvider() {
  const staffList = [
    {
      photoUrl: 'https://randomuser.me/api/portraits/men/75.jpg',
      name: 'John Doe',
      from: 'Phnom Penh',
      phone: '+855 12 345 678',
      email: 'john.doe@example.com',
    },
    {
      photoUrl: 'https://randomuser.me/api/portraits/women/65.jpg',
      name: 'Jane Smith',
      from: 'Siem Reap',
      phone: '+855 98 765 432',
      email: 'jane.smith@example.com',
    },
    {
      photoUrl: 'https://randomuser.me/api/portraits/men/45.jpg',
      name: 'Michael Lee',
      from: 'Battambang',
      phone: '+855 17 222 333',
      email: 'michael.lee@example.com',
    },
    {
      photoUrl: 'https://randomuser.me/api/portraits/women/22.jpg',
      name: 'Sophea Chum',
      from: 'Kampong Cham',
      phone: '+855 10 555 666',
      email: 'sophea.chum@example.com',
    },
  ];

  return (
    <div className="max-w-8xl mx-auto bg-white rounded-lg shadow p-4 sm:p-6 overflow-x-auto">
      <h2 className="w-full bg-indigo-100 text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 p-3 text-center rounded text-indigo-800">
        Staff Provider Info
      </h2>

      <table className="w-full text-sm border border-gray-200 shadow-sm rounded overflow-hidden">
        <thead className="bg-indigo-200 text-indigo-800 font-medium text-xs uppercase tracking-wide">
          <tr>
            <th className="p-2 sm:p-3 text-left border border-gray-200">Name</th>
            <th className="p-2 sm:p-3 text-left border border-gray-200">Profile</th>
            <th className="p-2 sm:p-3 text-left border border-gray-200">From</th>
            <th className="p-2 sm:p-3 text-left border border-gray-200">Contact</th>
          </tr>
        </thead>
        <tbody>
          {staffList.map((staff, index) => (
            <tr
              key={index}
              className={`border-t border-gray-100 ${
                index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
              } hover:bg-indigo-50 transition-colors`}
            >
              <td className="p-2 sm:p-3">{staff.name}</td>
              <td className="p-2 sm:p-3">
                <img
                  src={staff.photoUrl}
                  alt={staff.name}
                  className="w-20 h-20 rounded-full object-cover border-2 border-indigo-200"
                />
              </td>
              <td className="p-2 sm:p-3">{staff.from}</td>
              <td className="p-2 sm:p-3">
                <div className="flex flex-col space-y-1">
                  <span className="flex items-center space-x-1">
                    <Phone size={14} className="text-indigo-500" />
                    <span>{staff.phone}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Mail size={14} className="text-indigo-500" />
                    <span>{staff.email}</span>
                  </span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
