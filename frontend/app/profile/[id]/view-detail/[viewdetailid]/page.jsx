'use client';

import { CalendarDays, Clock, MapPin, Users, ArrowLeft} from 'lucide-react';
import { User, Calendar,  DollarSign, CheckCircle } from 'lucide-react';
import StaffProvider from '@/components/StaffProvider';

export default function ViewDetail() {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Title & Back */}
        <div className="flex items-center space-x-4 mb-4">
        <button
            className="text-gray-600 hover:text-gray-800 bg-gray-200 hover:bg-gray-300 rounded-full p-2 flex items-center justify-center"
        >
            <ArrowLeft size={24} />
        </button>
        <h1 className="text-2xl font-bold">Home Service</h1>
        </div>



      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side: Image + Info */}
        <div className="col-span-2 flex flex-col">
          {/* Tour Gallery */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="text-lg font-bold text-gray-700 mb-4">Tour Gallery</div>
        <img
            src="https://picsum.photos/id/1015/800/450"
            alt="Tour"
            className="rounded-lg w-full h-[260px] object-cover mb-4"
        />
        <div className='flex flex-wrap gap-2 mb-4 pe-4'>
                    <div className="flex space-x-2">
            <img
            src="https://picsum.photos/id/1016/250/150"
            alt="Tour"
            className="rounded-lg w-1/3 aspect-video object-cover flex-shrink-0"
            />
            <img
            src="https://picsum.photos/id/1018/250/150"
            alt="Tour"
            className="rounded-lg w-1/3 aspect-video object-cover flex-shrink-0"
            />
            <img
            src="https://picsum.photos/id/1019/250/150"
            alt="Tour"
            className="rounded-lg w-1/3 aspect-video object-cover flex-shrink-0"
            />
        </div>
        </div>

        <div className="text-sm text-blue-600 text-center mt-2 cursor-pointer">
            View All Photos (4)
        </div>
        </div>


       

        </div>

        {/* Right Side: Booking Summary */}
        <div className="bg-white px-6 pt-3 pb-1 h-[510px] rounded-xl shadow-lg w-full max-w-lg mx-auto">
        <h2 className="text-xl font-semibold mb-2 text-indigo-700 py-3">Booking Summary</h2>
        <p className="text-sm text-gray-500 mb-4">Your Service package details</p>

        <div className="space-y-1">
            {/* Provider */}
            <div className="flex items-center justify-between p-2 rounded-md hover:bg-indigo-50 cursor-default transition">
            <div className="flex items-center space-x-2">
                <User className="text-indigo-400" size={20} />
                <span className="text-gray-700 font-medium">Provider:</span>
            </div>
            <span className="font-semibold text-gray-900">Adventure Travels</span>
            </div>

            {/* Create Date */}
            <div className="flex items-center justify-between p-2 rounded-md hover:bg-indigo-50 cursor-default transition">
            <div className="flex items-center space-x-2">
                <Calendar className="text-indigo-400" size={20} />
                <span className="text-gray-700 font-medium">Create Date:</span>
            </div>
            <span className="font-semibold text-gray-900">2025-04-25</span>
            </div>

            {/* Booking Date */}
            <div className="flex items-center justify-between p-2 rounded-md hover:bg-indigo-50 cursor-default transition">
            <div className="flex items-center space-x-2">
                <Calendar className="text-indigo-400" size={20} />
                <span className="text-gray-700 font-medium">Booking Date:</span>
            </div>
            <span className="font-semibold text-gray-900">2025-05-11</span>
            </div>

            {/* Time Booking */}
            <div className="flex items-center justify-between p-2 rounded-md hover:bg-indigo-50 cursor-default transition">
            <div className="flex items-center space-x-2">
                <Clock className="text-indigo-400" size={20} />
                <span className="text-gray-700 font-medium">Time Booking:</span>
            </div>
            <span className="font-semibold text-gray-900">10:30 AM</span>
            </div>

            {/* Location */}
            <div className="flex items-center justify-between p-2 rounded-md hover:bg-indigo-50 cursor-default transition">
            <div className="flex items-center space-x-2">
                <MapPin className="text-indigo-400" size={20} />
                <span className="text-gray-700 font-medium">Your Location:</span>
            </div>
            <span className="font-semibold text-gray-900">Phnom Penh, Cambodia</span>
            </div>

            {/* Total Price */}
            <div className="flex items-center justify-between p-2 rounded-md font-bold text-lg text-indigo-700 cursor-default">
            <div className="flex items-center space-x-2">
                <CheckCircle size={22} />
                <span>Total Price:</span>
            </div>
            <span>$12000</span>
            </div>
        </div>
        </div>

           
       


      </div>
      <div className='className="min-h-screen'> <StaffProvider/></div>
    </div>
  );
}
