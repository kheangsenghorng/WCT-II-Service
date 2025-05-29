import React from 'react';
import { Calendar, Clock, MapPin, User } from 'lucide-react';

const BookedServiceCard = ({ service }) => {
  const getCategoryColor = (category) => {
    const colors = {
      'Home Services': 'bg-purple-500',
      'Beauty & Wellness': 'bg-pink-500',
      'Automotive': 'bg-blue-500',
      'Health & Fitness': 'bg-green-500',
    };
    return colors[category] || 'bg-gray-500';
  };

  return (
    <div className="bg-white rounded-lg shadow-md border max-w-[1100px] mx-auto border-gray-200 overflow-hidden gap-x-8 hover:shadow-lg transition-shadow duration-300 flex mb-6">
      {/* Service Image on the Left */}
      <div className="relative w-1/3 min-w-[200px] max-w-[300px]">
        <img
          src={service.image}
          alt={service.serviceName}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Card Content on the Right */}
      <div className="p-6 w-2/3 flex flex-col justify-between">
        {/* Content */}
        <div>
          {/* Category and Title */}
          <div className="mb-3">
            <div className="flex items-center gap-2 mb-2">
              <div className={`w-3 h-3 rounded-full ${getCategoryColor(service.category)}`}></div>
              <span className="text-sm text-gray-500 font-medium">{service.category}</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">{service.serviceName}</h3>
            <p className="text-gray-600 text-sm leading-relaxed">{service.description}</p>
          </div>

          {/* Created and Provider */}
          <div className="flex items-center gap-6 mb-4 text-gray-600 text-sm">
            {/* Created Date */}
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>
                Created: {new Date(service.createdDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </span>
            </div>

            {/* Provider */}
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span>{service.provider}</span>
            </div>
          </div>

          {/* Booking Date & Time */}
          <div className="space-y-3 mb-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-gray-600">
                <Calendar className="w-4 h-4" />
                <span className="text-sm font-medium">
                  Booking: {new Date(service.date).toLocaleDateString('en-US', {
                    weekday: 'short',
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Clock className="w-4 h-4" />
                <span className="text-sm font-medium">{service.time}</span>
              </div>
            </div>

            {/* Location */}
            <div className="flex items-center gap-2 text-gray-600">
              <MapPin className="w-4 h-4" />
              <span className="text-sm">{service.location}</span>
            </div>
          </div>
        </div>

        {/* Price and View Detail */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <span className="text-2xl font-bold text-gray-900">${service.price}</span>
          <button
            type="button"
            className="text-blue-600 bg-blue-50 hover:bg-blue-100 hover:text-blue-800 font-medium text-sm px-4 py-2 rounded-md transition-colors duration-200 flex items-center gap-1"
          >
            View Detail
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

const BookedServiceList = () => {
  const services = [
    {
      id: '1',
      serviceName: 'Professional House Cleaning',
      provider: 'Sarah Johnson',
      date: '2024-06-15',
      time: '10:00 AM',
      location: '123 Main St, Downtown',
      price: 120,
      category: 'Home Services',
      description:
        'Complete deep cleaning service including all rooms, kitchen, bathrooms, and common areas. Eco-friendly products used.',
      createdDate: '2024-06-01',
      image: 'https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=400&h=300&fit=crop',
    },
    {
      id: '2',
      serviceName: 'Luxury Spa Treatment',
      provider: 'Anna Lee',
      date: '2024-06-20',
      time: '2:00 PM',
      location: '789 Wellness Ave',
      price: 150,
      category: 'Beauty & Wellness',
      description: 'Relaxing full-body spa treatment with aromatherapy and hot stone massage.',
      createdDate: '2024-05-28',
      image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400&h=300&fit=crop',
    },
    {
      id: '3',
      serviceName: 'Car Detailing Service',
      provider: 'Mike Thompson',
      date: '2024-06-18',
      time: '11:30 AM',
      location: '456 Auto Blvd',
      price: 80,
      category: 'Automotive',
      description: 'Complete exterior and interior car cleaning and polishing.',
      createdDate: '2024-05-30',
      image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=400&h=300&fit=crop',
    },
    {
      id: '4',
      serviceName: 'Personal Training Session',
      provider: 'Emily Davis',
      date: '2024-06-22',
      time: '9:00 AM',
      location: 'Downtown Gym',
      price: 100,
      category: 'Health & Fitness',
      description: 'One-on-one training session tailored to your fitness goals.',
      createdDate: '2024-06-05',
      image: 'https://images.unsplash.com/photo-1594737625785-c7784d8474f1?w=400&h=300&fit=crop',
    },
  ];

  return (
    <div className="max-w-6xl mx-auto p-6">
      {services.map((service) => (
        <BookedServiceCard key={service.id} service={service} />
      ))}
    </div>
  );
};

export default BookedServiceList;
