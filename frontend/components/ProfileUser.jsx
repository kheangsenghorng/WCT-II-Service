// 'use client';

// import React, { useEffect } from 'react';
// import Image from 'next/image';
// import { Mail, MapPin, Phone, Calendar } from 'lucide-react';
// import { motion } from 'framer-motion';
// import { useParams, useRouter } from 'next/navigation';
// import { useUserStore } from '@/store/useUserStore'; // ✅ import store

// const ProfilePage = () => {
//   const { id } = useParams();
//   const router = useRouter();

//   const { user, fetchUserById, loading, error, clearUsers } = useUserStore(); // ✅ Corrected the method name and change clearUsers to clearUser

//   useEffect(() => {
//     if (id) { // Only fetch user if 'id' exists
//       fetchUserById(id); // Store handles fetching based on the cookie/user ID
//     }
//   }, [id, fetchUserById]);

//   const containerVariants = {
//     hidden: { opacity: 0, scale: 0.9 },
//     visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: 'easeInOut' } },
//   };

//   if (loading) return <div className="text-center">Loading user data...</div>;
//   if (error) return <div className="text-center text-red-500">Error: {error}</div>;
//   if (!user) return <div className="text-center">User not found.</div>;

//   return (
//     <div className="flex justify-center items-center py-5 px-10 bg-gray-100 min-h-screen">
//       <motion.div
//         className="w-full max-w-3xl bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-8"
//         variants={containerVariants}
//         initial="hidden"
//         animate="visible"
//       >
//         {/* Avatar */}
//         <div className="relative w-40 h-40 rounded-full overflow-hidden border-4 border-blue-500">
//           <Image
//             src={user.avatarUrl || '/default-user.svg'}
//             alt="User Avatar"
//             layout="fill"
//             objectFit="cover"
//             priority
//           />
//         </div>

//         {/* User Information */}
//         <div className="flex-1">
//           <h1 className="text-4xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
//             {user.first_name} {user.last_name}
//           </h1>

//           {/* Contact Details */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 text-gray-600 dark:text-gray-400">
//             <div className="flex items-center space-x-2 hover:text-blue-500 transition-all duration-200">
//               <Mail className="w-5 h-5 text-blue-400" />
//               <span>{user.email}</span>
//             </div>
//             <div className="flex items-center space-x-2 hover:text-blue-500 transition-all duration-200">
//               <MapPin className="w-5 h-5 text-blue-400" />
//               <span>{user.location || 'N/A'}</span>
//             </div>
//             <div className="flex items-center space-x-2 hover:text-blue-500 transition-all duration-200">
//               <Phone className="w-5 h-5 text-blue-400" />
//               <span>{user.phone || 'N/A'}</span>
//             </div>
//             <div className="flex items-center space-x-2 hover:text-blue-500 transition-all duration-200">
//               <Calendar className="w-5 h-5 text-blue-400" />
//               <span>{user.hotelsBooked ?? 0} Hotels Booked</span>
//             </div>
//           </div>
//         </div>
//       </motion.div>
//     </div>
//   );
// };

// export default ProfilePage;
