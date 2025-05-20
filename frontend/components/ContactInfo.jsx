import React from 'react';

const ContactInfo = () => {
  return (
    <div className="w-full">
      <p className="text-sm font-medium text-gray-500 mb-1">Contact info</p>
      <h2 className="text-4xl font-bold text-gray-800 mb-4">Keep In Touch</h2>
      <p className="text-gray-600 mb-8">
        We prioritize responding to your inquiries promptly to ensure you
        receive the assistance you need in a timely manner
      </p>

      <form action="#" method="POST" className="space-y-6">
        <div>
          <label htmlFor="name" className="sr-only">
            Name
          </label>
          <input
            type="text"
            name="name"
            id="name"
            autoComplete="name"
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm p-3 placeholder-gray-400"
            placeholder="Name"
          />
        </div>
        <div>
          <label htmlFor="email" className="sr-only">
            Email
          </label>
          <input
            type="email"
            name="email"
            id="email"
            autoComplete="email"
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm p-3 placeholder-gray-400"
            placeholder="Email"
          />
        </div>
        <div>
          <label htmlFor="message" className="sr-only">
            Message
          </label>
          <textarea
            id="message"
            name="message"
            rows={4}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm p-3 placeholder-gray-400"
            placeholder="Message"
            defaultValue={''}
          />
        </div>
        <div>
          <button
            type="submit"
            className="w-full sm:w-auto flex items-center justify-center rounded-md border border-transparent bg-green-500 py-3 px-8 text-base font-medium text-white hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            Sent Message
          </button>
        </div>
      </form>
    </div>
  );
};

export default ContactInfo;