import { PhoneIcon, EnvelopeIcon, MapPinIcon } from '@heroicons/react/24/solid';

const contactItems = [
  {
    icon: <PhoneIcon className="h-6 w-6 text-white" />,
    title: 'Call Us',
    details: ['+(855) 255 201 888'],
  },
  {
    icon: <EnvelopeIcon className="h-6 w-6 text-white" />,
    title: 'Email Now',
    details: ['Samnisa@cleaningpro.com'],
  },
  {
    icon: <MapPinIcon className="h-6 w-6 text-white" />,
    title: 'Address',
    details: ['7510, Terk Tla, San sok, Phnom Penh, Cambodia'],
  },
];

const FindUs = () => {
  return (
    <div className="w-full">
      <h2 className="text-4xl font-bold text-gray-800 mb-10">Find us</h2>
      <div className="space-y-6">
        {contactItems.map((item, index) => (
          <div
            key={index}
            className="flex items-start p-6 bg-slate-50 rounded-xl shadow-sm"
          >
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center h-12 w-12 rounded-full bg-green-500">
                {item.icon}
              </div>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
              {item.details.map((detail, i) => (
                <p key={i} className="mt-1 text-sm text-gray-600">
                  {detail}
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FindUs;