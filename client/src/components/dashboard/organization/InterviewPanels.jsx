import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";

const StudentCard = ({ student, type }) => (
  <div className="bg-white/5 border border-glass-border p-4 rounded-xl backdrop-blur-sm relative group overflow-hidden mb-4">
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
  </div>
);

export default function InterviewPanels() {
  const [interviewStudents, setInterviewStudents] = useState([]);
  const [reviewStudents, setReviewStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { data: session } = useSession();

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:8000/api/user', {
          headers: {
            'Authorization': `Bearer ${session?.user?.accessToken}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Raw API Response:', data);

        // Navigate through the nested structure to get the students data
        if (data?.companies?.[0]?.internships?.[0]) {
          const internship = data.companies[0].internships[0];
          console.log('Found internship:', internship);
          setInterviewStudents(internship.students_for_interview || []);
          setReviewStudents(internship.students_under_review || []);
        } else {
          console.log('Data structure:', {
            hasCompanies: Boolean(data?.companies),
            companiesLength: data?.companies?.length,
            firstCompany: data?.companies?.[0],
            internships: data?.companies?.[0]?.internships
          });
          setError('No internship data found');
        }
      } catch (error) {
        console.error('Error fetching students:', error);
        setError('Failed to fetch student data');
      } finally {
        setLoading(false);
      }
    };

    if (session?.user?.accessToken) {
      fetchStudents();
    }
  }, [session]);

  if (!session) {
    return (
      <div className="grid grid-cols-2 gap-6 mt-6">
        <div className="bg-neutral-glass border border-glass-border p-6 rounded-2xl backdrop-blur-md">
          <p className="text-neutral-accent">Please log in to view student data.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-6 mt-6">
        <div className="bg-neutral-glass border border-glass-border p-6 rounded-2xl backdrop-blur-md">
          <p className="text-neutral-accent">Loading students data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="grid grid-cols-2 gap-6 mt-6">
        <div className="bg-neutral-glass border border-glass-border p-6 rounded-2xl backdrop-blur-md">
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-6 mt-6">
      {/* Left Panel - Students for Interview */}
      <div className="bg-neutral-glass border border-glass-border p-6 rounded-2xl backdrop-blur-md">
        <h2 className="text-xl font-bold text-neutral-text mb-4">Students for Interview</h2>
        <div className="space-y-4">
          {interviewStudents && interviewStudents.length > 0 ? (
            interviewStudents.map((student) => (
              <motion.div
                key={student.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <StudentCard student={student} type="interview" />
              </motion.div>
            ))
          ) : (
            <p className="text-neutral-accent">No students scheduled for interview</p>
          )}
        </div>
      </div>

      {/* Right Panel - Students Under Review */}
      <div className="bg-neutral-glass border border-glass-border p-6 rounded-2xl backdrop-blur-md">
        <h2 className="text-xl font-bold text-neutral-text mb-4">Students Under Review</h2>
        <div className="space-y-4">
          {reviewStudents && reviewStudents.length > 0 ? (
            reviewStudents.map((student) => (
              <motion.div
                key={student.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <StudentCard student={student} type="review" />
              </motion.div>
            ))
          ) : (
            <p className="text-neutral-accent">No students under review</p>
          )}
        </div>
      </div>
    </div>
  );
} 