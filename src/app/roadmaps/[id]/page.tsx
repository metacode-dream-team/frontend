import { RoadmapDetailsPage } from "@/widgets/roadmap-details-page";

interface RoadmapDetailsRouteProps {
  params: Promise<{ id: string }>;
}

export default async function RoadmapDetailsRoute({ params }: RoadmapDetailsRouteProps) {
  const { id } = await params;

  return <RoadmapDetailsPage roadmapId={id} />;
}
