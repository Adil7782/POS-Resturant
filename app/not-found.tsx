// app/not-found.tsx
import Link from 'next/link'

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen text-center">
            <h1 className="text-6xl font-bold">404</h1>
            <h2 className="text-2xl mt-4">Oops! Page not found</h2>
            {/* <h2 className="text-2xl mt-4">පලයන් හුත්තො ගෙදර</h2> */}
            <p className="mt-2 text-gray-500">
                The page you are looking for doesn't exist or has been moved.
            </p>
            <Link
                href="/dashboard"
                className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
                Return Home
            </Link>
        </div>
    )
}