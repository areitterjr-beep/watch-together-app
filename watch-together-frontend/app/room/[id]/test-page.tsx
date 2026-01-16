'use client';

// Simple test page to verify routing works
export default function TestRoomPage() {
  console.log('🧪 Test room page loaded!');
  
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center">
      <div className="text-white text-2xl">
        <h1>Test Room Page</h1>
        <p>If you see this, routing works!</p>
      </div>
    </div>
  );
}
