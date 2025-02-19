"use client";

import { useState } from "react";
import { motion } from "framer-motion";

// You'll need to create these components
import OrgStats from "@/components/dashboard/organization/OrgStats";
import MentorManagement from "@/components/dashboard/organization/MentorManagement";
import MenteeProgress from "@/components/dashboard/organization/MenteeProgress";
import ResourceLibrary from "@/components/dashboard/organization/ResourceLibrary";
import Communications from "@/components/dashboard/organization/Communications";
import FinanceOverview from "@/components/dashboard/organization/FinanceOverview";

export default function OrganizationDashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "mentors", label: "Mentors" },
    { id: "mentees", label: "Mentee Progress" },
    { id: "resources", label: "Resources" },
    { id: "communications", label: "Communications" },
    { id: "finance", label: "Finance" },
  ];

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="glass p-6 rounded-xl mb-6">
          <h1 className="text-3xl font-bold text-electric-blue">Organization Dashboard</h1>
          <p className="text-neon-cyan mt-2">Welcome back, [Organization Name]</p>
        </div>

        {/* Navigation Tabs */}
        <div className="glass p-4 rounded-xl mb-6">
          <div className="flex flex-wrap gap-4">
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
        </div>

        {/* Main Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="glass p-6 rounded-xl"
        >
          {activeTab === "overview" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <OrgStats />
            </div>
          )}

          {activeTab === "mentors" && (
            <div className="space-y-6">
              <MentorManagement />
            </div>
          )}

          {activeTab === "mentees" && (
            <div className="space-y-6">
              <MenteeProgress />
            </div>
          )}

          {activeTab === "resources" && (
            <div className="space-y-6">
              <ResourceLibrary />
            </div>
          )}

          {activeTab === "communications" && (
            <div className="space-y-6">
              <Communications />
            </div>
          )}

          {activeTab === "finance" && (
            <div className="space-y-6">
              <FinanceOverview />
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
} 