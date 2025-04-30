"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  Linkedin,
  Facebook,
  Github,
  Mail,
} from "lucide-react"; // Import icons

// Reusable Components (to keep code DRY)
const SectionTitle = ({ children }) => (
  <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">
    {children}
  </h2>
);

const SectionParagraph = ({ children }) => (
  <p className="text-gray-600 dark:text-gray-400 mb-4">{children}</p>
);

const TeamMemberCard = ({
  name,
  title,
  imageUrl,
  linkedinUrl,
  facebookUrl,
  githubUrl,
  email,
}) => {
  return (
    <motion.div
      className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition duration-300 p-4 flex flex-col items-center text-center"
      whileHover={{ scale: 1.05 }}
    >
      <div className="relative w-52 h-52 rounded-full overflow-hidden mb-3">
        <Image
          src={imageUrl}
          alt={name}
          layout="fill"
          objectFit="cover"
        />
      </div>
      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-300">
        {name}
      </h3>
      <p className="text-sm text-gray-500 dark:text-gray-500">{title}</p>
      <div className="flex space-x-3 mt-3">
        {linkedinUrl && (
          <motion.a
            href={linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:text-blue-700 transition-colors duration-200"
            whileHover={{ y: -2 }}
          >
            <Linkedin className="inline-block w-5 h-5" />
          </motion.a>
        )}
        {facebookUrl && (
          <motion.a
            href={facebookUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:text-blue-700 transition-colors duration-200"
            whileHover={{ y: -2 }}
          >
            <Facebook className="inline-block w-5 h-5" />
          </motion.a>
        )}
        {githubUrl && (
          <motion.a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100 transition-colors duration-200"
            whileHover={{ y: -2 }}
          >
            <Github className="inline-block w-5 h-5" />
          </motion.a>
        )}
        {email && (
          <motion.a
            href={`mailto:${email}`}
            className="text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100 transition-colors duration-200"
            whileHover={{ y: -2 }}
          >
            <Mail className="inline-block w-5 h-5" />
          </motion.a>
        )}
      </div>
    </motion.div>
  );
};

const ServiceDetailCard = ({ title, description, icon }) => (
  <motion.div
    className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition duration-300 p-4"
    whileHover={{ scale: 1.03 }}
  >
    <div className="flex items-center mb-2">
      {icon && <span className="mr-3 text-blue-500">{icon}</span>}
      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-300">
        {title}
      </h3>
    </div>
    <p className="text-gray-600 dark:text-gray-400">{description}</p>
  </motion.div>
);

export default function AboutUsPage() {
  // Mock Data (replace with your actual data source)
  const teamMembers = [
    {
      name: "John Doe",
      title: "CEO",
      imageUrl: "/team/1.png",
      linkedinUrl: "https://www.linkedin.com/in/johndoe",
      facebookUrl: "https://www.facebook.com/johndoe",
      githubUrl: "https://github.com/johndoe",
      email: "john.doe@example.com",
    },
    {
      name: "Jane Smith",
      title: "Lead Designer",
      imageUrl: "/team/2.png",
      linkedinUrl: "https://www.linkedin.com/in/janesmith",
      facebookUrl: "https://www.facebook.com/janesmith",
      githubUrl: "https://github.com/janesmith",
      email: "jane.smith@example.com",
    },
    {
      name: "Mike Johnson",
      title: "Frontend Developer",
      imageUrl: "/team/3.png",
      linkedinUrl: "https://www.linkedin.com/in/mikejohnson",
      facebookUrl: "https://www.facebook.com/mikejohnson",
      githubUrl: "https://github.com/mikejohnson",
      email: "mike.johnson@example.com",
    },
    {
      name: "Sarah Williams",
      title: "Backend Developer",
      imageUrl: "/team/4.png",
      linkedinUrl: "https://www.linkedin.com/in/sarahwilliams",
      githubUrl: "https://github.com/sarahwilliams",
      email: "sarah.williams@example.com",
    },
    {
      name: "David Brown",
      title: "Marketing Manager",
      imageUrl: "/team/5.png",
      linkedinUrl: "https://www.linkedin.com/in/davidbrown",
      facebookUrl: "https://www.facebook.com/davidbrown",
      githubUrl: "https://github.com/davidbrown",
      email: "david.brown@example.com",
    },
  ];

  const serviceDetails = [
    {
      title: "User Research",
      description:
        "We conduct in-depth user research to understand your target audience and their needs. This helps us create designs that are user-centered and effective.",
      icon: "💡", // Example emoji icon
    },
    {
      title: "Wireframing & Prototyping",
      description:
        "We create wireframes and prototypes to visualize the user flow and functionality of your product. This allows us to test and iterate on designs before development begins.",
      icon: "✏️", // Example emoji icon
    },
    {
      title: "UI Design",
      description:
        "Our UI designers create visually appealing and engaging interfaces that are consistent with your brand. We pay close attention to typography, color, and layout to create a seamless user experience.",
      icon: "🎨", // Example emoji icon
    },
    {
      title: "Usability Testing",
      description:
        "We conduct usability testing to identify areas where your product can be improved. This helps us ensure that your product is easy to use and meets the needs of your users.",
      icon: "🧪", // Example emoji icon
    },
  ];

  return (
    <motion.div
      className="container mx-auto p-4 md:p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <section className="mb-12">
      <div className="flex justify-center text-4xl p-5 font-bold">About Us</div>
        <SectionParagraph >
          We are a team of passionate service designers dedicated to creating
          user-centered and effective digital experiences. Our goal is to
          help our clients connect with their customers in meaningful ways and
          achieve their business objectives.
        </SectionParagraph>
        <SectionParagraph>
          We believe that great design starts with a deep understanding of user
          needs. That's why we invest heavily in user research and usability
          testing. We are committed to creating products that are not only
          visually appealing but also easy to use and effective.
        </SectionParagraph>
      </section>

      <section className="mb-12">
        <SectionTitle>Our Service Design Details</SectionTitle>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {serviceDetails.map(({ title, description, icon }, index) => (
            <ServiceDetailCard
              key={index}
              title={title}
              description={description}
              icon={icon}
            />
          ))}
        </div>
      </section>

      <section>
      <div className="flex justify-center text-4xl p-5 font-bold">Team Member</div>

        <div className="flex flex-wrap justify-center">
          {teamMembers.slice(0, 3).map(({ name, title, imageUrl, linkedinUrl, facebookUrl, githubUrl, email }) => (
            <div key={name} className="w-full sm:w-1/2 md:w-1/3 p-4">
              <TeamMemberCard
                name={name}
                title={title}
                imageUrl={imageUrl}
                linkedinUrl={linkedinUrl}
                facebookUrl={facebookUrl}
                githubUrl={githubUrl}
                email={email}
              />
            </div>
          ))}
        </div>

        <div className="flex flex-wrap justify-center mt-6">
          {teamMembers.slice(3).map(({ name, title, imageUrl, linkedinUrl, facebookUrl, githubUrl, email }) => (
            <div key={name} className="w-full sm:w-1/2 md:w-1/3 p-4">
              <TeamMemberCard
                name={name}
                title={title}
                imageUrl={imageUrl}
                linkedinUrl={linkedinUrl}
                facebookUrl={facebookUrl}
                githubUrl={githubUrl}
                email={email}
              />
            </div>
          ))}
        </div>
      </section>
    </motion.div>
  );
}