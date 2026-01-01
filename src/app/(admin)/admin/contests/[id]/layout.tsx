'use client';

export default function AdminContestDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen w-full flex-col">
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
