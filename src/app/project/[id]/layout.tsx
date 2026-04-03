import StudioLayoutClient from "@/components/studio/StudioLayoutClient";

export default function ProjectStudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <StudioLayoutClient>{children}</StudioLayoutClient>;
}
