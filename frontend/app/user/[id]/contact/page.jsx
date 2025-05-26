// "use client";

// import React, { useState } from "react";
// import { motion } from "framer-motion";
// import { MapPin, Mail, Phone, Send } from "lucide-react";

// const ContactUsPage = () => {
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [message, setMessage] = useState("");
//   const [success, setSuccess] = useState(false);
//   const [error, setError] = useState("");

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     setSuccess(false);

//     // Basic client-side validation
//     if (!name || !email || !message) {
//       setError("Please fill in all fields.");
//       return;
//     }

//     // Simple email validation
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
//     if (!emailRegex.test(email)) {
//       setError("Please enter a valid email address.");
//       return;
//     }

//     // Simulate sending data (replace with your actual API call)
//     try {
//       // Replace with your actual API endpoint
//       const response = await fetch("/api/contact", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ name, email, message }),
//       });

//       if (response.ok) {
//         setSuccess(true);
//         setName("");
//         setEmail("");
//         setMessage("");
//       } else {
//         setError("Failed to send message. Please try again later.");
//       }
//     } catch (err) {
//       console.error("Error sending message:", err);
//       setError("An unexpected error occurred. Please try again later.");
//     }
//   };

//   return (
//     <motion.div
//       className="container mx-auto p-4 md:p-8"
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       exit={{ opacity: 0 }}
//     >
//       <section className="mb-12 text-center">
//         <h1 className="text-4xl font-extrabold text-gray-800 dark:text-white mb-4">
//           Get In Touch
//         </h1>
//         <p className="text-lg text-gray-600 dark:text-gray-400">
//           We'd love to hear from you! Let us know how we can help.
//         </p>
//       </section>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//         {/* Contact Information */}
//         <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-8">
//           <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-300 mb-6">
//             Contact Information
//           </h2>
//           <div className="space-y-5">
//             <div className="flex items-start">
//               <MapPin className="w-6 h-6 text-blue-500 mr-3 flex-shrink-0" />
//               <div>
//                 <h3 className="font-semibold text-gray-700 dark:text-gray-200">
//                   Address
//                 </h3>
//                 <p className="text-gray-600 dark:text-gray-400">
//                   123 Main Street, Anytown, CA 12345
//                 </p>
//               </div>
//             </div>
//             <div className="flex items-start">
//               <Mail className="w-6 h-6 text-blue-500 mr-3 flex-shrink-0" />
//               <div>
//                 <h3 className="font-semibold text-gray-700 dark:text-gray-200">
//                   Email
//                 </h3>
//                 <p className="text-gray-600 dark:text-gray-400">
//                   info@example.com
//                 </p>
//               </div>
//             </div>
//             <div className="flex items-start">
//               <Phone className="w-6 h-6 text-blue-500 mr-3 flex-shrink-0" />
//               <div>
//                 <h3 className="font-semibold text-gray-700 dark:text-gray-200">
//                   Phone
//                 </h3>
//                 <p className="text-gray-600 dark:text-gray-400">
//                   (123) 456-7890
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Contact Form */}
//         <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-8">
//           <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-300 mb-6">
//             Send us a message
//           </h2>
//           {success && (
//             <div className="bg-green-100 text-green-700 border border-green-500 py-3 px-4 rounded mb-4">
//               Thank you! Your message has been sent.
//             </div>
//           )}
//           {error && (
//             <div className="bg-red-100 text-red-700 border border-red-500 py-3 px-4 rounded mb-4">
//               {error}
//             </div>
//           )}
//           <form onSubmit={handleSubmit} className="space-y-8">
//             <div>
//               <label
//                 htmlFor="name"
//                 className="block text-sm font-medium text-gray-700 dark:text-gray-300"
//               >
//                 Name
//               </label>
//               <input
//                 type="text"
//                 id="name"
//                 className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-4xl border-gray-300 rounded-md dark:bg-gray-700 dark:text-white"
//                 value={name}
//                 onChange={(e) => setName(e.target.value)}
//                 required
//               />
//             </div>
//             <div>
//               <label
//                 htmlFor="email"
//                 className="block text-sm font-medium text-gray-700 dark:text-gray-300"
//               >
//                 Email
//               </label>
//               <input
//                 type="email"
//                 id="email"
//                 className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-4xl border-gray-300 rounded-md dark:bg-gray-700 dark:text-white"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 required
//               />
//             </div>
//             <div>
//               <label
//                 htmlFor="message"
//                 className="block text-sm font-medium text-gray-700 dark:text-gray-300"
//               >
//                 Message
//               </label>
//               <textarea
//                 id="message"
//                 rows="5"
//                 className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md dark:bg-gray-700 dark:text-white"
//                 value={message}
//                 onChange={(e) => setMessage(e.target.value)}
//                 required
//               ></textarea>
//             </div>
//             <button
//               type="submit"
//               className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-5 rounded-md focus:outline-none focus:shadow-outline flex items-center justify-center"
//             >
//               Send Message <Send className="w-5 h-5 ml-2" />
//             </button>
//           </form>
//         </div>
//       </div>
//     </motion.div>


//   );
// };

// export default ContactUsPage; 



 "use client";

// Reusable InputField component for JavaScript (no type annotations)
const InputField = ({ label, type = 'text', name }) => ( // REMOVED: : { label: string; type?: string; name: string; }
  <div>
    <label htmlFor={name} className="block text-xs font-medium text-gray-500 mb-1">
      {label}
    </label>
    <input
      type={type}
      name={name}
      id={name}
      className="mt-1 block w-full bg-transparent border-0 border-b border-gray-400 focus:ring-0 focus:border-[#4A7358] py-2 text-gray-800"
    />
  </div>
);

const ContactUsPage = () => {
  const backgroundImageUrl =
    'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80';

  return (
    <div className=" rounded-lg overflow-hidden w-full max-w-6xl m-auto p-4 md:p-8 lg:p-12">
      <div className="grid grid-cols-1 lg:grid-cols-5">
        {/* Left Panel: "Get In Touch" */}
        <div
          className="lg:col-span-2 rounded-lg bg-cover bg-center p-8 md:p-12 text-white relative min-h-[300px] lg:min-h-0 flex flex-col justify-center"
          style={{ backgroundImage: `url(${backgroundImageUrl})` }}
        >
          <div className="absolute inset-0 bg-[#4A7358] opacity-90 rounded-lg"></div>
          <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-4">Get In Touch</h2>
            <p className="text-base leading-relaxed text-gray-200">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Amet penatibus
              viverra sed pellentesque. Sit justo purus viverra turpis.
            </p>
          </div>
        </div>

        {/* Right Panel: "Send Us a Message" Form */}
        <div className="lg:col-span-3 p-8 md:p-12 bg-white">
          <h2 className="text-2xl font-bold text-[#4A7358] mb-10">
            Send Us a Message
          </h2>
          <form action="#" method="POST">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6 mb-8">
              <InputField label="Your name" name="name" />
              <InputField label="E-mail" name="email" type="email" />
              <InputField label="Phone Number" name="phone" type="tel" />
              <InputField label="Subject" name="subject" />
            </div>
            <div className="mb-8">
              <label htmlFor="message" className="block text-xs font-medium text-gray-500 mb-1">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={4}
                className="mt-1 block w-full bg-transparent border border-gray-400 rounded-md py-2 px-3 focus:ring-1 focus:ring-[#4A7358] focus:border-[#4A7358] text-gray-800"
                defaultValue={''}
              />
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="inline-flex justify-center py-3 px-10 border border-transparent shadow-sm text-sm font-semibold rounded-md text-white bg-[#4A7358] hover:bg-[#3f634b] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4A7358]"
              >
                SEND
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactUsPage;