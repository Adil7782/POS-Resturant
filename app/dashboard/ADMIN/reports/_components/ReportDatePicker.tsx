"use client";

interface ReportDatePickerProps {
    dateMode: 'single' | 'range';
    startDate: string;
    endDate: string;
    onDateModeChange: (mode: 'single' | 'range') => void;
    onStartDateChange: (date: string) => void;
    onEndDateChange: (date: string) => void;
}

export function ReportDatePicker({
    dateMode,
    startDate,
    endDate,
    onDateModeChange,
    onStartDateChange,
    onEndDateChange,
}: ReportDatePickerProps) {
    return (
        <section>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
                1. Select Reporting Period
            </h3>
            <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center p-5 bg-gray-50 rounded-xl border border-gray-100">
                <div className="flex bg-white rounded-lg p-1 border border-gray-200 shadow-sm shrink-0">
                    <button
                        onClick={() => { onDateModeChange('single'); onEndDateChange(''); }}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                            dateMode === 'single' ? 'bg-blue-600 text-white shadow' : 'text-gray-600 hover:bg-gray-50'
                        }`}
                    >
                        Single Date
                    </button>
                    <button
                        onClick={() => onDateModeChange('range')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                            dateMode === 'range' ? 'bg-blue-600 text-white shadow' : 'text-gray-600 hover:bg-gray-50'
                        }`}
                    >
                        Date Range
                    </button>
                </div>

                <div className="flex items-center gap-3 w-full max-w-lg">
                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => onStartDateChange(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-700"
                    />
                    {dateMode === 'range' && (
                        <>
                            <span className="text-gray-400 font-medium">to</span>
                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => onEndDateChange(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-700"
                            />
                        </>
                    )}
                </div>
            </div>
        </section>
    );
}
