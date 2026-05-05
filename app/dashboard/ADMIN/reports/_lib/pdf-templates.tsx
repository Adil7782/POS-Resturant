import React from 'react';
import { Document, Page, Text, View } from '@react-pdf/renderer';
import { styles } from './pdf-styles';

export type SalesRow = { category: string; revenue: number; count: number };
export type DeductionRow = { item: string; deducted: number; unit: string; costPerUnit: number };
export type InventoryRow = { item: string; currentStock: number; unit: string; status: string; value: number };

const ReportHeader = ({ title, startDate, endDate }: { title: string; startDate: string; endDate?: string | null }) => (
    <View style={styles.header}>
        <View style={styles.headerLeft}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.subtitle}>
                Reporting Period: {startDate || 'Not Selected'}{endDate ? ` to ${endDate}` : ''}
            </Text>
        </View>
        <Text style={styles.headerRight}>Generated: {new Date().toLocaleDateString()}</Text>
    </View>
);

export const SalesReportPDF = ({ startDate, endDate, data }: { startDate: string; endDate?: string | null; data: SalesRow[] }) => {
    const totalRevenue = data.reduce((acc, curr) => acc + curr.revenue, 0);
    const totalCount = data.reduce((acc, curr) => acc + curr.count, 0);

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <ReportHeader title="Enterprise Sales Report" startDate={startDate} endDate={endDate} />

                <View style={styles.summaryContainer}>
                    <View style={styles.summaryItem}>
                        <Text style={styles.summaryLabel}>Total Gross Revenue</Text>
                        <Text style={styles.summaryValue}>Rs.{totalRevenue.toFixed(2)}</Text>
                    </View>
                    <View style={styles.summaryItem}>
                        <Text style={styles.summaryLabel}>Total Transactions</Text>
                        <Text style={styles.summaryValue}>{totalCount}</Text>
                    </View>
                    <View style={styles.summaryItem}>
                        <Text style={styles.summaryLabel}>Average Order Value</Text>
                        <Text style={styles.summaryValue}>Rs.{totalCount > 0 ? (totalRevenue / totalCount).toFixed(2) : '0.00'}</Text>
                    </View>
                </View>

                <View style={styles.table}>
                    <View style={[styles.tableRow, styles.tableHeader]}>
                        <View style={styles.tableColWide}><Text style={styles.tableCellHeader}>Category</Text></View>
                        <View style={styles.tableCol}><Text style={styles.tableCellHeader}>Transactions</Text></View>
                        <View style={styles.tableCol}><Text style={styles.tableCellHeader}>Gross Revenue</Text></View>
                        <View style={styles.tableColLast}><Text style={styles.tableCellHeader}>% of Total</Text></View>
                    </View>
                    {data.map((row, i) => (
                        <View key={i} style={i === data.length - 1 ? styles.tableRowLast : styles.tableRow}>
                            <View style={styles.tableColWide}><Text style={styles.tableCell}>{row.category}</Text></View>
                            <View style={styles.tableCol}><Text style={styles.tableCell}>{row.count}</Text></View>
                            <View style={styles.tableCol}><Text style={styles.tableCell}>Rs.{row.revenue.toFixed(2)}</Text></View>
                            <View style={styles.tableColLast}>
                                <Text style={styles.tableCell}>{totalRevenue > 0 ? ((row.revenue / totalRevenue) * 100).toFixed(1) : '0.0'}%</Text>
                            </View>
                        </View>
                    ))}
                </View>
            </Page>
        </Document>
    );
};

export const DailyInventoryDeductionPDF = ({ startDate, endDate, data }: { startDate: string; endDate?: string | null; data: DeductionRow[] }) => {
    const totalDeductionValue = data.reduce((acc, curr) => acc + curr.deducted * curr.costPerUnit, 0);

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <ReportHeader title="Daily Inventory Deductions" startDate={startDate} endDate={endDate} />

                <View style={styles.summaryContainer}>
                    <View style={styles.summaryItem}>
                        <Text style={styles.summaryLabel}>Total Items Deducted</Text>
                        <Text style={styles.summaryValue}>{data.length} Items</Text>
                    </View>
                    <View style={styles.summaryItem}>
                        <Text style={styles.summaryLabel}>Estimated Deduction Value</Text>
                        <Text style={styles.summaryValue}>Rs.{totalDeductionValue.toFixed(2)}</Text>
                    </View>
                </View>

                <View style={styles.table}>
                    <View style={[styles.tableRow, styles.tableHeader]}>
                        <View style={styles.tableColWide}><Text style={styles.tableCellHeader}>Inventory Item</Text></View>
                        <View style={styles.tableCol}><Text style={styles.tableCellHeader}>Qty Deducted</Text></View>
                        <View style={styles.tableCol}><Text style={styles.tableCellHeader}>Unit Measure</Text></View>
                        <View style={styles.tableColLast}><Text style={styles.tableCellHeader}>Est. COGS</Text></View>
                    </View>
                    {data.map((row, i) => (
                        <View key={i} style={i === data.length - 1 ? styles.tableRowLast : styles.tableRow}>
                            <View style={styles.tableColWide}><Text style={styles.tableCell}>{row.item}</Text></View>
                            <View style={styles.tableCol}><Text style={styles.tableCell}>{row.deducted}</Text></View>
                            <View style={styles.tableCol}><Text style={styles.tableCell}>{row.unit}</Text></View>
                            <View style={styles.tableColLast}>
                                <Text style={styles.tableCell}>Rs.{(row.deducted * row.costPerUnit).toFixed(2)}</Text>
                            </View>
                        </View>
                    ))}
                </View>
            </Page>
        </Document>
    );
};

export const InventorySummaryPDF = ({ startDate, endDate, data }: { startDate: string; endDate?: string | null; data: InventoryRow[] }) => {
    const totalValuation = data.reduce((acc, curr) => acc + curr.value, 0);
    const lowStockCount = data.filter((d) => d.status !== 'Healthy').length;

    const getStatusStyle = (status: string) => {
        if (status === 'Critical') return styles.statusCritical;
        if (status === 'Low Stock') return styles.statusLow;
        return styles.statusHealthy;
    };

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <ReportHeader title="Global Inventory Summary" startDate={startDate} endDate={endDate} />

                <View style={styles.summaryContainer}>
                    <View style={styles.summaryItem}>
                        <Text style={styles.summaryLabel}>Tracked Items</Text>
                        <Text style={styles.summaryValue}>{data.length}</Text>
                    </View>
                    <View style={styles.summaryItem}>
                        <Text style={styles.summaryLabel}>Items Requiring Attention</Text>
                        <Text style={[styles.summaryValue, { color: lowStockCount > 0 ? '#ef4444' : '#10b981' }]}>
                            {lowStockCount}
                        </Text>
                    </View>
                    <View style={styles.summaryItem}>
                        <Text style={styles.summaryLabel}>Total Inventory Valuation</Text>
                        <Text style={styles.summaryValue}>Rs.{totalValuation.toFixed(2)}</Text>
                    </View>
                </View>

                <View style={styles.table}>
                    <View style={[styles.tableRow, styles.tableHeader]}>
                        <View style={styles.tableColWide}><Text style={styles.tableCellHeader}>Inventory Item</Text></View>
                        <View style={styles.tableCol}><Text style={styles.tableCellHeader}>Current Stock</Text></View>
                        <View style={styles.tableCol}><Text style={styles.tableCellHeader}>System Status</Text></View>
                        <View style={styles.tableColLast}><Text style={styles.tableCellHeader}>Total Valuation</Text></View>
                    </View>
                    {data.map((row, i) => (
                        <View key={i} style={i === data.length - 1 ? styles.tableRowLast : styles.tableRow}>
                            <View style={styles.tableColWide}><Text style={styles.tableCell}>{row.item}</Text></View>
                            <View style={styles.tableCol}>
                                <Text style={styles.tableCell}>{row.currentStock} {row.unit}</Text>
                            </View>
                            <View style={styles.tableCol}>
                                <Text style={getStatusStyle(row.status)}>{row.status}</Text>
                            </View>
                            <View style={styles.tableColLast}>
                                <Text style={styles.tableCell}>Rs.{row.value.toFixed(2)}</Text>
                            </View>
                        </View>
                    ))}
                </View>
            </Page>
        </Document>
    );
};
