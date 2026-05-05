"use client";

const REPORTS = [
    { id: 'sales', title: 'Sales Report', desc: 'Revenue & transaction category breakdown' },
    { id: 'deductions', title: 'Daily Deductions', desc: 'Detailed stock deducted/sold metrics' },
    { id: 'inventory', title: 'Inventory Summary', desc: 'Current stock levels & total valuations' },
];

interface ReportTypeSelectorProps {
    selectedReport: string;
    onSelect: (id: string) => void;
}

export function ReportTypeSelector({ selectedReport, onSelect }: ReportTypeSelectorProps) {
    return (
        <section>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
                2. Select Report Type
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {REPORTS.map((report) => (
                    <div
                        key={report.id}
                        onClick={() => onSelect(report.id)}
                        className={`cursor-pointer p-5 rounded-xl border-2 transition-all ${
                            selectedReport === report.id
                                ? 'border-blue-600 bg-blue-50/40 shadow-sm'
                                : 'border-gray-200 hover:border-blue-300 bg-white'
                        }`}
                    >
                        <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold text-gray-900">{report.title}</h4>
                            <div
                                className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                                    selectedReport === report.id ? 'border-blue-600 bg-blue-600' : 'border-gray-300'
                                }`}
                            >
                                {selectedReport === report.id && <div className="w-2 h-2 bg-white rounded-full" />}
                            </div>
                        </div>
                        <p className="text-sm text-gray-500">{report.desc}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}

export { REPORTS };
