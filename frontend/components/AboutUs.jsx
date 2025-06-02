"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { Linkedin, Facebook, Github, Mail, ChevronRight, Users, Lightbulb, Palette, Zap } from "lucide-react"

// Reusable Components
const SectionTitle = ({ children, centered = false }) => (
  <motion.h2
    className={`text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-8 ${
      centered ? "text-center" : ""
    }`}
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6 }}
  >
    {children}
  </motion.h2>
)

const SectionParagraph = ({ children }) => (
  <motion.p
    className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed mb-6"
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6, delay: 0.1 }}
  >
    {children}
  </motion.p>
)

const TeamMemberCard = ({ name, title, imageUrl, linkedinUrl, facebookUrl, githubUrl, email, index }) => {
  return (
    <motion.div
      className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 dark:border-gray-700/20 overflow-hidden hover:shadow-xl transition-all duration-300"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -8 }}
    >
      <div className="relative h-64 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20 z-10" />
        <Image
          src={imageUrl || "/placeholder.svg?height=256&width=256"}
          alt={name}
          fill
          className="object-cover transition-transform duration-500 hover:scale-110"
        />
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{name}</h3>
        <p className="text-sm text-blue-600 dark:text-blue-400 font-medium mb-4">{title}</p>

        <div className="flex space-x-4 mt-4">
          {linkedinUrl && (
            <motion.a
              href={linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 transition-colors duration-300"
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.95 }}
            >
              <Linkedin className="w-4 h-4" />
            </motion.a>
          )}
          {facebookUrl && (
            <motion.a
              href={facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 transition-colors duration-300"
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.95 }}
            >
              <Facebook className="w-4 h-4" />
            </motion.a>
          )}
          {githubUrl && (
            <motion.a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center text-gray-700 dark:text-gray-300 hover:bg-gray-700 hover:text-white dark:hover:bg-gray-600 transition-colors duration-300"
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.95 }}
            >
              <Github className="w-4 h-4" />
            </motion.a>
          )}
          {email && (
            <motion.a
              href={`mailto:${email}`}
              className="w-9 h-9 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center text-purple-600 dark:text-purple-400 hover:bg-purple-600 hover:text-white dark:hover:bg-purple-600 transition-colors duration-300"
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.95 }}
            >
              <Mail className="w-4 h-4" />
            </motion.a>
          )}
        </div>
      </div>
    </motion.div>
  )
}

const ServiceDetailCard = ({ title, description, icon, index }) => {
  const icons = {
    "💡": <Lightbulb className="w-6 h-6" />,
    "✏️": <Users className="w-6 h-6" />,
    "🎨": <Palette className="w-6 h-6" />,
    "🧪": <Zap className="w-6 h-6" />,
  }

  return (
    <motion.div
      className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 dark:border-gray-700/20 overflow-hidden hover:shadow-xl transition-all duration-300"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -8 }}
    >
      <div className="p-8">
        <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg">
          {icons[icon] || icon}
        </div>

        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{title}</h3>

        <p className="text-gray-600 dark:text-gray-400 mb-6">{description}</p>

        <motion.div
          className="inline-flex items-center text-blue-600 dark:text-blue-400 font-medium text-sm"
          whileHover={{ x: 5 }}
        >
          Learn more <ChevronRight className="w-4 h-4 ml-1" />
        </motion.div>
      </div>
    </motion.div>
  )
}

export default function AboutUsPage() {
  // Mock Data
  const teamMembers = [
    {
      name: "Chen SreyNeat",
      title: "EER and USE Case Designer",
      imageUrl: "/team/1.png",
      linkedinUrl: "https://www.linkedin.com/in/johndoe",
      facebookUrl: "https://www.facebook.com/johndoe",
      githubUrl: "https://github.com/johndoe",
      email: "john.doe@example.com",
    },
    {
      name: "Sen Vibol",
      title: "UX/UI Designer",
      imageUrl: "/team/2.png",
      linkedinUrl: "https://www.linkedin.com/in/janesmith",
      facebookUrl: "https://www.facebook.com/janesmith",
      githubUrl: "https://github.com/janesmith",
      email: "jane.smith@example.com",
    },
    {
      name: "Sam Nisa",
      title: "Frontend Developer",
      imageUrl: "/team/3.png",
      linkedinUrl: "https://www.linkedin.com/in/mikejohnson",
      facebookUrl: "https://www.facebook.com/mikejohnson",
      githubUrl: "https://github.com/mikejohnson",
      email: "mike.johnson@example.com",
    },
    {
      name: "Khorn Saokhouch",
      title: "Frontend Developer",
      imageUrl: "/team/4.png",
      linkedinUrl: "https://www.linkedin.com/in/sarahwilliams",
      githubUrl: "https://github.com/sarahwilliams",
      email: "sarah.williams@example.com",
    },
    {
      name: "Kheng Senghorng",
      title: "Backend Developer",
      imageUrl: "/team/5.png",
      linkedinUrl: "https://www.linkedin.com/in/davidbrown",
      facebookUrl: "https://www.facebook.com/davidbrown",
      githubUrl: "https://github.com/davidbrown",
      email: "david.brown@example.com",
    },
  ]

  const serviceDetails = [
    {
      title: "User Research",
      description:
        "We conduct in-depth user research to understand your target audience and their needs. This helps us create designs that are user-centered and effective.",
      icon: "💡",
    },
    {
      title: "Wireframing & Prototyping",
      description:
        "We create wireframes and prototypes to visualize the user flow and functionality of your product. This allows us to test and iterate on designs before development begins.",
      icon: "✏️",
    },
    {
      title: "UI Design",
      description:
        "Our UI designers create visually appealing and engaging interfaces that are consistent with your brand. We pay close attention to typography, color, and layout to create a seamless user experience.",
      icon: "🎨",
    },
    {
      title: "Usability Testing",
      description:
        "We conduct usability testing to identify areas where your product can be improved. This helps us ensure that your product is easy to use and meets the needs of your users.",
      icon: "🧪",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Hero Section */}
      <section className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 dark:from-blue-800 dark:via-purple-800 dark:to-blue-900 h-96 md:h-[500px]">
          <div className="absolute inset-0 bg-black/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        </div>

        <div className="relative pt-32 pb-40 md:pt-40 md:pb-56 px-4">
          <div className="max-w-5xl mx-auto text-center">
            <motion.h1
              className="text-4xl md:text-6xl font-bold text-white mb-6"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              About Our Team
            </motion.h1>

            <motion.p
              className="text-xl text-blue-100 max-w-3xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              We're a passionate team of designers and developers dedicated to creating exceptional digital experiences.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="relative -mt-20 md:-mt-32 px-4 pb-20">
        <div className="max-w-8xl mx-auto px-20">
          {/* About Section */}
          <motion.section
            className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/20 p-8 md:p-12 mb-20"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <SectionTitle>Our Mission</SectionTitle>

            <SectionParagraph>
              We are a team of passionate service designers dedicated to creating user-centered and effective digital
              experiences. Our goal is to help our clients connect with their customers in meaningful ways and achieve
              their business objectives.
            </SectionParagraph>

            <SectionParagraph>
              We believe that great design starts with a deep understanding of user needs. That's why we invest heavily
              in user research and usability testing. We are committed to creating products that are not only visually
              appealing but also easy to use and effective.
            </SectionParagraph>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              <motion.div
                className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-6 border border-blue-100 dark:border-blue-800/30"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent mb-2">
                  5+
                </div>
                <div className="text-gray-700 dark:text-gray-300 font-medium">Years of Experience</div>
              </motion.div>

              <motion.div
                className="bg-purple-50 dark:bg-purple-900/20 rounded-2xl p-6 border border-purple-100 dark:border-purple-800/30"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent mb-2">
                  100+
                </div>
                <div className="text-gray-700 dark:text-gray-300 font-medium">Projects Completed</div>
              </motion.div>

              <motion.div
                className="bg-green-50 dark:bg-green-900/20 rounded-2xl p-6 border border-green-100 dark:border-green-800/30"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <div className="text-3xl font-bold bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-transparent mb-2">
                  50+
                </div>
                <div className="text-gray-700 dark:text-gray-300 font-medium">Happy Clients</div>
              </motion.div>
            </div>
          </motion.section>

          {/* Services Section */}
          <section className="mb-20">
            <SectionTitle centered>Our Service Design Expertise</SectionTitle>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {serviceDetails.map((service, index) => (
                <ServiceDetailCard
                  key={index}
                  title={service.title}
                  description={service.description}
                  icon={service.icon}
                  index={index}
                />
              ))}
            </div>
          </section>

          {/* Team Section */}
          <section className="mb-20">
            <SectionTitle centered>Meet Our Amazing Team</SectionTitle>

            <div className="max-w-8xl mx-auto">
              {/* Team Introduction */}
              <motion.div
                className="text-center mb-16"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                  Our diverse team of 5 talented professionals brings together expertise in design, development, and
                  user experience to create exceptional digital solutions.
                </p>
              </motion.div>

              {/* Main Team Grid - 3 + 2 Layout */}
              <div className="mb-16">
                {/* First Row - 3 Members */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
                  {teamMembers.slice(0, 3).map((member, index) => (
                    <motion.div
                      key={member.name}
                      className="group relative overflow-hidden rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500"
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      whileHover={{ y: -12, scale: 1.02 }}
                    >
                      {/* Card Background with Gradient */}
                      <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700 rounded-3xl overflow-hidden">
                        {/* Member Photo */}
                        <div className="relative overflow-hidden h-82">
                          <Image
                            src={member.imageUrl || "/placeholder.svg?height=320&width=320"}
                            alt={member.name}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                          />

                          {/* Gradient Overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                          {/* Role Badge */}
                          <div className="absolute top-4 left-4">
                            <span className="px-4 py-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full text-sm font-semibold text-gray-800 dark:text-white shadow-lg">
                              {member.title.split(" ")[0]}
                            </span>
                          </div>

                          {/* Social Links - Appear on Hover */}
                          <div className="absolute top-4 right-4 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-all duration-300 delay-100">
                            {member.linkedinUrl && (
                              <motion.a
                                href={member.linkedinUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg hover:bg-blue-700 transition-colors duration-200"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                <Linkedin className="w-4 h-4" />
                              </motion.a>
                            )}
                            {member.facebookUrl && (
                              <motion.a
                                href={member.facebookUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white shadow-lg hover:bg-blue-600 transition-colors duration-200"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                <Facebook className="w-4 h-4" />
                              </motion.a>
                            )}
                            {member.githubUrl && (
                              <motion.a
                                href={member.githubUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-white shadow-lg hover:bg-gray-900 transition-colors duration-200"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                <Github className="w-4 h-4" />
                              </motion.a>
                            )}
                            {member.email && (
                              <motion.a
                                href={`mailto:${member.email}`}
                                className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white shadow-lg hover:bg-purple-700 transition-colors duration-200"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                <Mail className="w-4 h-4" />
                              </motion.a>
                            )}
                          </div>
                        </div>

                        {/* Member Info */}
                        <div className="p-6">
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{member.name}</h3>
                          <p className="text-sm text-blue-600 dark:text-blue-400 font-medium mb-4">{member.title}</p>

                          {/* Skills/Expertise Tags */}
                          <div className="flex flex-wrap gap-2 mb-4">
                            {member.title.includes("Designer") && (
                              <>
                                <span className="px-3 py-1 bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300 rounded-full text-xs font-medium">
                                  Design
                                </span>
                                <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-xs font-medium">
                                  UX/UI
                                </span>
                              </>
                            )}
                            {member.title.includes("Frontend") && (
                              <>
                                <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs font-medium">
                                  React
                                </span>
                                <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-xs font-medium">
                                  JavaScript
                                </span>
                              </>
                            )}
                            {member.title.includes("Backend") && (
                              <>
                                <span className="px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded-full text-xs font-medium">
                                  Node.js
                                </span>
                                <span className="px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-full text-xs font-medium">
                                  Database
                                </span>
                              </>
                            )}
                            {member.title.includes("EER") && (
                              <>
                                <span className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full text-xs font-medium">
                                  Analysis
                                </span>
                                <span className="px-3 py-1 bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 rounded-full text-xs font-medium">
                                  Modeling
                                </span>
                              </>
                            )}
                          </div>

                          {/* Contact Button */}
                          <motion.button
                            className="w-full mt-4 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            Connect with {member.name.split(" ")[0]}
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Second Row - 2 Members Centered */}
                <div className="flex justify-center">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full">

                    {teamMembers.slice(3).map((member, index) => (
                      <motion.div
                        key={member.name}
                        className="group relative overflow-hidden rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: (index + 3) * 0.1 }}
                        whileHover={{ y: -12, scale: 1.02 }}
                      >
                        {/* Card Background with Gradient */}
                        <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700 rounded-3xl overflow-hidden">
                          {/* Member Photo */}
                          <div className="relative overflow-hidden h-82">
                            <Image
                              src={member.imageUrl || "/placeholder.svg?height=320&width=320"}
                              alt={member.name}
                              fill
                              className="object-cover transition-transform duration-700 group-hover:scale-110"
                            />

                            {/* Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                            {/* Role Badge */}
                            <div className="absolute top-4 left-4">
                              <span className="px-4 py-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full text-sm font-semibold text-gray-800 dark:text-white shadow-lg">
                                {member.title.split(" ")[0]}
                              </span>
                            </div>

                            {/* Social Links - Appear on Hover */}
                            <div className="absolute top-4 right-4 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-all duration-300 delay-100">
                              {member.linkedinUrl && (
                                <motion.a
                                  href={member.linkedinUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg hover:bg-blue-700 transition-colors duration-200"
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.95 }}
                                >
                                  <Linkedin className="w-4 h-4" />
                                </motion.a>
                              )}
                              {member.facebookUrl && (
                                <motion.a
                                  href={member.facebookUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white shadow-lg hover:bg-blue-600 transition-colors duration-200"
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.95 }}
                                >
                                  <Facebook className="w-4 h-4" />
                                </motion.a>
                              )}
                              {member.githubUrl && (
                                <motion.a
                                  href={member.githubUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-white shadow-lg hover:bg-gray-900 transition-colors duration-200"
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.95 }}
                                >
                                  <Github className="w-4 h-4" />
                                </motion.a>
                              )}
                              {member.email && (
                                <motion.a
                                  href={`mailto:${member.email}`}
                                  className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white shadow-lg hover:bg-purple-700 transition-colors duration-200"
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.95 }}
                                >
                                  <Mail className="w-4 h-4" />
                                </motion.a>
                              )}
                            </div>
                          </div>

                          {/* Member Info */}
                          <div className="p-6">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{member.name}</h3>
                            <p className="text-sm text-blue-600 dark:text-blue-400 font-medium mb-4">{member.title}</p>

                            {/* Skills/Expertise Tags */}
                            <div className="flex flex-wrap gap-2 mb-4">
                              {member.title.includes("Designer") && (
                                <>
                                  <span className="px-3 py-1 bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300 rounded-full text-xs font-medium">
                                    Design
                                  </span>
                                  <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-xs font-medium">
                                    UX/UI
                                  </span>
                                </>
                              )}
                              {member.title.includes("Frontend") && (
                                <>
                                  <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs font-medium">
                                    React
                                  </span>
                                  <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-xs font-medium">
                                    JavaScript
                                  </span>
                                </>
                              )}
                              {member.title.includes("Backend") && (
                                <>
                                  <span className="px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded-full text-xs font-medium">
                                    Node.js
                                  </span>
                                  <span className="px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-full text-xs font-medium">
                                    Database
                                  </span>
                                </>
                              )}
                              {member.title.includes("EER") && (
                                <>
                                  <span className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full text-xs font-medium">
                                    Analysis
                                  </span>
                                  <span className="px-3 py-1 bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 rounded-full text-xs font-medium">
                                    Modeling
                                  </span>
                                </>
                              )}
                            </div>

                            {/* Contact Button */}
                            <motion.button
                              className="w-full mt-4 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0"
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              Connect with {member.name.split(" ")[0]}
                            </motion.button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Team Collaboration Section */}
              <motion.div
                className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 rounded-3xl overflow-hidden shadow-2xl"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div className="relative p-8 lg:p-12">
                  <div className="absolute inset-0 bg-black/10" />
                  <div className="relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                      <div className="text-white">
                        <h3 className="text-3xl font-bold mb-4">Stronger Together</h3>
                        <p className="text-blue-100 text-lg mb-6 leading-relaxed">
                          Our team of 5 brings diverse skills and perspectives to every project. From initial concept to
                          final deployment, we collaborate seamlessly to deliver exceptional results.
                        </p>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="text-center p-4 bg-white/10 backdrop-blur-sm rounded-xl">
                            <div className="text-2xl font-bold mb-1">5</div>
                            <div className="text-blue-100 text-sm">Team Members</div>
                          </div>
                          <div className="text-center p-4 bg-white/10 backdrop-blur-sm rounded-xl">
                            <div className="text-2xl font-bold mb-1">3</div>
                            <div className="text-blue-100 text-sm">Specializations</div>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-4">
                          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-white">
                            <div className="text-sm font-medium text-blue-100 mb-1">Design Excellence</div>
                            <div className="text-lg font-bold">UX/UI Design</div>
                          </div>
                          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-white">
                            <div className="text-sm font-medium text-blue-100 mb-1">Frontend Magic</div>
                            <div className="text-lg font-bold">React Development</div>
                          </div>
                        </div>
                        <div className="space-y-4 mt-8">
                          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-white">
                            <div className="text-sm font-medium text-blue-100 mb-1">System Design</div>
                            <div className="text-lg font-bold">Architecture</div>
                          </div>
                          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-white">
                            <div className="text-sm font-medium text-blue-100 mb-1">Backend Power</div>
                            <div className="text-lg font-bold">Server Development</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </section>

          {/* Contact CTA */}
          <motion.section
            className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl shadow-2xl overflow-hidden"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative p-12 text-center">
              <div className="absolute inset-0 bg-black/10" />
              <div className="relative z-10">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to Work With Us?</h2>
                <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
                  Let's create something amazing together. Reach out to discuss how we can help bring your vision to
                  life.
                </p>
                <motion.button
                  className="px-8 py-4 bg-white text-blue-600 font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Get in Touch
                </motion.button>
              </div>
            </div>
          </motion.section>
        </div>
      </div>
    </div>
  )
}
