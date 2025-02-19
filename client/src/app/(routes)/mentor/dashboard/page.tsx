"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { mentorNavItems } from "../../routes";
import MentorStats from "@/components/dashboard/mentor/MentorStats";
import MenteeList from "@/components/dashboard/mentor/MenteeList";
import SessionCalendar from "@/components/dashboard/mentor/SessionCalendar";
import ResourceCenter from "@/components/dashboard/mentor/ResourceCenter";
import PerformanceMetrics from "@/components/dashboard/mentor/PerformanceMetrics";
import { useSession } from "next-auth/react";

export default function MentorDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const { data: session } = useSession();
  const mentorName = session?.user?.name || "Mentor";

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "mentees", label: "Mentees" },
    { id: "sessions", label: "Sessions" },
    { id: "resources", label: "Resources" },
    { id: "performance", label: "Performance" },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return <MentorStats />;
      case "mentees":
        return <MenteeList />;
      case "sessions":
        return <SessionCalendar />;
      case "resources":
        return <ResourceCenter />;
      case "performance":
        return <PerformanceMetrics />;
      default:
        return null;
    }
  };

  return (
    <DashboardShell
      title="Mentor Dashboard"
      subtitle={`Welcome back, ${mentorName}`}
      navItems={mentorNavItems}
    >
      <div className="space-y-6">
        <div className="flex space-x-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg transition-all ${
                activeTab === tab.id
                  ? "neon-btn"
                  : "hover:bg-deep-indigo/20"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {renderContent()}
        </motion.div>
      </div>
    </DashboardShell>
  );
} 