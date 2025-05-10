import { ViewStudyPlan } from "@/components/ViewStudyPlan";

interface PlanPageProps {
  params: {
    id: string;
  };
}

export default function PlanPage({ params }: PlanPageProps) {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto p-4">
        <ViewStudyPlan planId={params.id} />
      </div>
    </main>
  );
} 