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