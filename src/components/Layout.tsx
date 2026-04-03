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
    <div className="relative min-h-[100dvh] bg-[#FDFDFB] text-[#0a0a0a]">
      <Sidebar />
      <div className="md:pl-72">
        <main className="min-h-[100dvh] overflow-y-auto bg-[radial-gradient(at_0%_0%,rgba(234,179,8,0.02)_0%,transparent_50%)] px-10 pb-10 pt-[4.5rem] md:pt-10">
          {children}
        </main>
      </div>
    </div>
  );
}
