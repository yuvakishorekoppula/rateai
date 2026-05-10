export default function Loading() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black flex flex-col animate-pulse">
      {/* Fake Nav */}
      <div className="h-20 w-full border-b border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-black/50" />
      
      <main className="flex-grow pt-32 pb-12 flex flex-col items-center px-4">
        {/* Fake Header */}
        <div className="h-8 w-48 bg-zinc-200 dark:bg-zinc-800 rounded-full mb-6" />
        <div className="h-12 w-80 md:w-[600px] bg-zinc-200 dark:bg-zinc-800 rounded-full mb-4" />
        <div className="h-4 w-40 bg-zinc-200 dark:bg-zinc-800 rounded-full mb-12" />

        {/* Fake AI Summary */}
        <div className="w-full max-w-4xl h-64 bg-zinc-200 dark:bg-zinc-800 rounded-[2rem] mb-12" />
        
        {/* Fake Dashboard */}
        <div className="w-full max-w-6xl space-y-12">
          <div className="h-[400px] bg-zinc-200 dark:bg-zinc-800 rounded-[3rem]" />
          <div className="flex items-center justify-between">
            <div className="h-8 w-64 bg-zinc-200 dark:bg-zinc-800 rounded-full" />
            <div className="h-6 w-32 bg-zinc-200 dark:bg-zinc-800 rounded-full" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="h-80 bg-zinc-200 dark:bg-zinc-800 rounded-[2.5rem]" />
            <div className="h-80 bg-zinc-200 dark:bg-zinc-800 rounded-[2.5rem]" />
          </div>
        </div>
      </main>
    </div>
  );
}
