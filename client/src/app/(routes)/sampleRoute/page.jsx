"use client";

import { motion } from "framer-motion";

const hardcodedData = {
  id: 26,
  name: "Faddy",
  email: "www.fareedsayed786@gmail.com",
  is_staff: false,
  testimonial: [],
  is_company: true,
  companies: [
    {
      user_email: "www.fareedsayed786@gmail.com",
      user_id: 26,
      id: 2,
      name: "Faddy",
      description: "tere bhai ki company hi bkl",
      logo: null,
      website: "google.com",
      location: "aajiiii tund mera ",
      industry: "Food ",
      founded_at: "2025-02-20",
      contact_phone: "998767831",
      internships: [
        {
          id: 1,
          company: 2,
          title: "Django",
          description: "lelo bhai django ka internship hai mera ",
          stipend: "12000",
          duration: "3 months ",
          location: "mumbai",
          skills_required: "django",
          openings: 1,
          application_deadline: "2025-02-19",
          posted_at: "2025-01-31T14:12:15Z",
          students_for_interview: [
            {
              id: 1,
              user: 30,
              user_name: "FAREED wHATSAPP",
              internship: 1,
              internship_name: "Django",
              registered_at: "2025-02-20T16:00:12.595907Z",
              is_selected: true,
              company_name: "Faddy",
              interviw_time: "2025-03-15T14:30:00Z"
            }
          ],
          students_under_review: [
            {
              id: 2,
              user: 36,
              user_name: "Study!",
              internship: 1,
              internship_name: "Django",
              registered_at: "2025-02-20T09:02:00Z",
              is_selected: false,
              company_name: "Faddy",
              interviw_time: null
            }
          ]
        }
      ]
    }
  ]
};

const StudentCard = ({ student }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    className="bg-white/5 border border-glass-border p-4 rounded-xl backdrop-blur-sm relative group overflow-hidden"
  >
    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-transparent to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    <div className="relative z-10">
      <div className="flex justify-between items-start">
        <h3 className="text-lg font-semibold text-neutral-text">{student.user_name}</h3>
        <span className={`px-3 py-1 rounded-full text-xs ${
          student.is_selected ? 'bg-green-500/20 text-green-500' : 'bg-yellow-500/20 text-yellow-500'
        }`}>
          {student.is_selected ? 'Selected' : 'Pending'}
        </span>
      </div>
      <div className="mt-2 space-y-2 text-sm text-neutral-accent">
        <p>Internship: {student.internship_name}</p>
        <p>Company: {student.company_name}</p>
        {student.interviw_time && (
          <p>Interview Time: {new Date(student.interviw_time).toLocaleString()}</p>
        )}
        <p>Registered: {new Date(student.registered_at).toLocaleDateString()}</p>
      </div>
    </div>
  </motion.div>
);

export default function SampleRoute() {
  // Get data from the hardcoded object
  const internship = hardcodedData.companies[0].internships[0];
  const studentsForInterview = internship.students_for_interview;
  const studentsUnderReview = internship.students_under_review;

  return (
    <div className="min-h-screen bg-black p-6 mt-20">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-neutral-glass border border-glass-border p-6 rounded-2xl backdrop-blur-md">
          <h1 className="text-3xl font-bold text-neutral-text">Interview Management</h1>
          <p className="text-neutral-accent mt-2">
            Internship: {internship.title} ({internship.company_name})
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Panel - Students for Interview */}
          <div className="bg-neutral-glass border border-glass-border p-6 rounded-2xl backdrop-blur-md">
            <h2 className="text-xl font-bold text-neutral-text mb-4">Students for Interview</h2>
            <div className="space-y-4">
              {studentsForInterview.map((student) => (
                <StudentCard key={student.id} student={student} />
              ))}
            </div>
          </div>

          {/* Right Panel - Students Under Review */}
          <div className="bg-neutral-glass border border-glass-border p-6 rounded-2xl backdrop-blur-md">
            <h2 className="text-xl font-bold text-neutral-text mb-4">Students Under Review</h2>
            <div className="space-y-4">
              {studentsUnderReview.map((student) => (
                <StudentCard key={student.id} student={student} />
              ))}
            </div>
          </div>
        </div>

        {/* Internship Details */}
        <div className="bg-neutral-glass border border-glass-border p-6 rounded-2xl backdrop-blur-md">
          <h2 className="text-xl font-bold text-neutral-text mb-4">Internship Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-neutral-accent">
            <div>
              <p><span className="font-semibold">Title:</span> {internship.title}</p>
              <p><span className="font-semibold">Stipend:</span> ₹{internship.stipend}</p>
              <p><span className="font-semibold">Duration:</span> {internship.duration}</p>
              <p><span className="font-semibold">Location:</span> {internship.location}</p>
            </div>
            <div>
              <p><span className="font-semibold">Skills Required:</span> {internship.skills_required}</p>
              <p><span className="font-semibold">Openings:</span> {internship.openings}</p>
              <p><span className="font-semibold">Deadline:</span> {new Date(internship.application_deadline).toLocaleDateString()}</p>
              <p><span className="font-semibold">Posted:</span> {new Date(internship.posted_at).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 