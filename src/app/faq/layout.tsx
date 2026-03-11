/**
 * Public FAQ view uses its own full-page layout (no dashboard shell).
 */
export default function FaqLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
