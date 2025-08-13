// app/not-found.tsx
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center px-4">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">
        Page Not Found
      </h1>
      <p className="text-lg text-gray-600 mb-6">
        Please check the URL and try again.
      </p>
      <Link
        href="/"
        className="inline-block rounded-lg bg-black text-white px-6 py-3 text-sm font-medium hover:bg-gray-800 transition-colors"
      >
        Back to Home
      </Link>
    </div>
  );
}
