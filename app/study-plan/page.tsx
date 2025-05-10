"use client"
import { StudyPlan } from "@/components/StudyPlan";
import { AddStudyPlan } from "@/components/AddStudyPlan";
import { useState } from "react";

export default function StudyPlanPage() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handlePlanAdded = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Навчальні плани</h1>
          <AddStudyPlan onPlanAdded={handlePlanAdded} />
        </div>
        <StudyPlan key={refreshKey} />
      </div>
    </main>
  );
} 