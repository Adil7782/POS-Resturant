"use client";

interface GenerateButtonProps {
    isGenerating: boolean;
    reportTitle: string;
    onClick: () => void;
}

export function GenerateButton({ isGenerating, reportTitle, onClick }: GenerateButtonProps) {
    return (
        <section className="pt-6 border-t border-gray-100 flex justify-end">
            <button
                onClick={onClick}
                disabled={isGenerating}
                className={`w-full md:w-auto px-8 py-3.5 rounded-xl font-medium text-white shadow-sm transition-all flex items-center justify-center gap-2 ${
                    isGenerating ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 hover:shadow-md'
                }`}
            >
                {isGenerating ? (
                    <>
                        <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Processing Document...
                    </>
                ) : (
                    <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Generate {reportTitle} PDF
                    </>
                )}
            </button>
        </section>
    );
}
