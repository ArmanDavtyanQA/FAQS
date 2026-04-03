import StudioLayoutClient from "@/components/studio/StudioLayoutClient";

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <StudioLayoutClient>{children}</StudioLayoutClient>;
}
