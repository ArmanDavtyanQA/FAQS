import StudioHubLayoutClient from "@/components/studio/StudioHubLayoutClient";

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <StudioHubLayoutClient>{children}</StudioHubLayoutClient>;
}
