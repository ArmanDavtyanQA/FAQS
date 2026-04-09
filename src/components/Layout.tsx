"use client";

import Sidebar from "@/components/Sidebar";

type Props = {
  children: React.ReactNode;
};

/**
 * Management shell: fixed glass sidebar + scrollable main stage.
 */
export default function Layout({ children }: Props) {
  return (
    <div className="relative min-h-[100dvh] bg-[#FDFDFB] text-ui-strong">
      <Sidebar />
      <div className="md:pl-72">
        <main className="relative min-h-[100dvh] overflow-y-auto bg-[radial-gradient(at_0%_0%,rgba(234,179,8,0.02)_0%,transparent_50%)] px-6 pb-10 pt-[4.75rem] sm:px-8 md:px-10 md:pt-10">
          <div
            className="pointer-events-none absolute inset-0 -z-0 opacity-[0.24] [background-image:linear-gradient(rgba(31,41,55,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(31,41,55,0.12)_1px,transparent_1px)] [background-size:34px_34px]"
            aria-hidden
          />
          <div className="relative z-10">{children}</div>
        </main>
      </div>
    </div>
  );
}
