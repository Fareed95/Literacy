"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";

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
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { data: session } = useSession();

  useEffect(() => {
    if (!session?.user?.accessToken) {
      setError('Please log in to view the data');
      setLoading(false);
      return;
    }

    fetch('http://localhost:8000/api/user', {
      headers: {
        'Authorization': `Bearer ${session.user.accessToken}`,
        'Content-Type': 'application/json',
      },
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(result => {
        console.log('Full API Response:', result);
        console.log('Companies:', result.companies);
        console.log('First Company:', result.companies[0]);
        console.log('Internships:', result.companies[0].internships);
        console.log('First Internship:', result.companies[0].internships[0]);
        console.log('Students for Interview:', result.companies[0].internships[0].students_for_interview);
        console.log('Students under Review:', result.companies[0].internships[0].students_under_review);
        setData(result);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error:', error);
        setError(error.message);
        setLoading(false);
      });
  }, [session]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black p-6 mt-20">
        <div className="max-w-7xl mx-auto">
          <div className="bg-neutral-glass border border-glass-border p-6 rounded-2xl backdrop-blur-md">
            <p className="text-neutral-text">Loading data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !session?.user?.accessToken) {
    return (
      <div className="min-h-screen bg-black p-6 mt-20">
        <div className="max-w-7xl mx-auto">
          <div className="bg-neutral-glass border border-glass-border p-6 rounded-2xl backdrop-blur-md">
            <p className="text-red-500">Error: {error || 'Please log in to view the data'}</p>
            <p className="text-neutral-accent mt-2">Make sure you are logged in and have the necessary permissions.</p>
          </div>
        </div>
      </div>
    );
  }

  // Extract data with null checks
  const company = data?.companies?.[0];
  const internship = company?.internships?.[0];
  
  // Log the extracted data
  console.log('Extracted company:', company);
  console.log('Extracted internship:', internship);

  if (!internship) {
    return (
      <div className="min-h-screen bg-black p-6 mt-20">
        <div className="max-w-7xl mx-auto">
          <div className="bg-neutral-glass border border-glass-border p-6 rounded-2xl backdrop-blur-md">
            <p className="text-neutral-text">No internship data available</p>
          </div>
        </div>
      </div>
    );
  }

  const studentsForInterview = internship.students_for_interview || [];
  const studentsUnderReview = internship.students_under_review || [];

  // Log the student arrays
  console.log('Mapped students for interview:', studentsForInterview);
  console.log('Mapped students under review:', studentsUnderReview);

  return (
    <div className="min-h-screen bg-black p-6 mt-20">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-neutral-glass border border-glass-border p-6 rounded-2xl backdrop-blur-md">
          <h1 className="text-3xl font-bold text-neutral-text">Interview Management</h1>
          <p className="text-neutral-accent mt-2">
            Internship: {internship.title} ({company.name})
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Panel - Students for Interview */}
          <div className="bg-neutral-glass border border-glass-border p-6 rounded-2xl backdrop-blur-md">
            <h2 className="text-xl font-bold text-neutral-text mb-4">Students for Interview</h2>
            <div className="space-y-4">
              {Array.isArray(studentsForInterview) && studentsForInterview.length > 0 ? (
                studentsForInterview.map((student) => (
                  <StudentCard key={student.id} student={student} />
                ))
              ) : (
                <p className="text-neutral-accent">No students scheduled for interview.</p>
              )}
            </div>
          </div>

          {/* Right Panel - Students Under Review */}
          <div className="bg-neutral-glass border border-glass-border p-6 rounded-2xl backdrop-blur-md">
            <h2 className="text-xl font-bold text-neutral-text mb-4">Students Under Review</h2>
            <div className="space-y-4">
              {Array.isArray(studentsUnderReview) && studentsUnderReview.length > 0 ? (
                studentsUnderReview.map((student) => (
                  <StudentCard key={student.id} student={student} />
                ))
              ) : (
                <p className="text-neutral-accent">No students under review.</p>
              )}
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