"use client";

import { useState } from 'react';
import { pdf } from '@react-pdf/renderer';
import { toast } from 'sonner';
import { ReportDatePicker } from './_components/ReportDatePicker';
import { ReportTypeSelector, REPORTS } from './_components/ReportTypeSelector';
import { GenerateButton } from './_components/GenerateButton';
import {
    SalesReportPDF,
    DailyInventoryDeductionPDF,
    InventorySummaryPDF,
    type SalesRow,
    type DeductionRow,
    type InventoryRow,
} from './_lib/pdf-templates';

async function fetchReportData(
    report: string,
    startDate: string,
    endDate: string | null
): Promise<SalesRow[] | DeductionRow[] | InventoryRow[]> {
    const params = new URLSearchParams({ startDate });
    if (endDate) params.set('endDate', endDate);

    const endpoints: Record<string, string> = {
        sales: `/api/reports/sales?${params}`,
        deductions: `/api/reports/deductions?${params}`,
        inventory: `/api/reports/inventory`,
    };

    const res = await fetch(endpoints[report]);
    if (!res.ok) throw new Error(`Failed to fetch ${report} data`);
    return res.json();
}

export default function ReportsPage() {
    const [dateMode, setDateMode] = useState<'single' | 'range'>('single');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [selectedReport, setSelectedReport] = useState('sales');
    const [isGenerating, setIsGenerating] = useState(false);

    const handleGenerate = async () => {
        if (!startDate) {
            toast.error('Please select a target date.');
            return;
        }
        if (dateMode === 'range' && !endDate) {
            toast.error('Please select both start and end dates.');
            return;
        }

        setIsGenerating(true);
        const rangeEnd = dateMode === 'range' ? endDate : null;

        try {
            const data = await fetchReportData(selectedReport, startDate, rangeEnd);

            let documentInstance;
            if (selectedReport === 'sales') {
                documentInstance = <SalesReportPDF startDate={startDate} endDate={rangeEnd} data={data as SalesRow[]} />;
            } else if (selectedReport === 'deductions') {
                documentInstance = <DailyInventoryDeductionPDF startDate={startDate} endDate={rangeEnd} data={data as DeductionRow[]} />;
            } else {
                documentInstance = <InventorySummaryPDF startDate={startDate} endDate={rangeEnd} data={data as InventoryRow[]} />;
            }

            const asPdf = pdf();
            asPdf.updateContainer(documentInstance);
            const blob = await asPdf.toBlob();

            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `POS-${selectedReport}-report-${startDate}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);

            toast.success('Report generated successfully.');
        } catch (error) {
            console.error('Error generating PDF:', error);
            toast.error('Failed to generate the PDF report.');
        } finally {
            setIsGenerating(false);
        }
    };

    const selectedTitle = REPORTS.find((r) => r.id === selectedReport)?.title ?? '';

    return (
        <div className="max-w-5xl mx-auto p-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-8 border-b border-gray-100 bg-gray-50/50">
                    <h2 className="text-2xl font-bold text-gray-800">POS Reports & Analytics</h2>
                    <p className="text-gray-500 mt-2">
                        Select a reporting period and format to generate a professional PDF document.
                    </p>
                </div>

                <div className="p-8 space-y-10">
                    <ReportDatePicker
                        dateMode={dateMode}
                        startDate={startDate}
                        endDate={endDate}
                        onDateModeChange={setDateMode}
                        onStartDateChange={setStartDate}
                        onEndDateChange={setEndDate}
                    />

                    <ReportTypeSelector selectedReport={selectedReport} onSelect={setSelectedReport} />

                    <GenerateButton
                        isGenerating={isGenerating}
                        reportTitle={selectedTitle}
                        onClick={handleGenerate}
                    />
                </div>
            </div>
        </div>
    );
}
