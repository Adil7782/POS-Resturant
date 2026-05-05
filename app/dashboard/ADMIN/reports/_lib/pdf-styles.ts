import { StyleSheet } from '@react-pdf/renderer';

export const styles = StyleSheet.create({
    page: { padding: 40, fontFamily: 'Helvetica', backgroundColor: '#ffffff' },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        borderBottomWidth: 2,
        borderBottomColor: '#2563eb',
        paddingBottom: 15,
        marginBottom: 30,
    },
    headerLeft: { flexDirection: 'column' },
    title: { fontSize: 24, fontWeight: 'bold', color: '#1e293b', marginBottom: 6 },
    subtitle: { fontSize: 11, color: '#64748b' },
    headerRight: { fontSize: 10, color: '#94a3b8' },

    table: { display: 'flex', width: 'auto', borderStyle: 'solid', borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 4 },
    tableRow: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#e2e8f0' },
    tableRowLast: { flexDirection: 'row' },
    tableHeader: { backgroundColor: '#f8fafc' },
    tableCol: { flex: 1, padding: 10, borderRightWidth: 1, borderRightColor: '#e2e8f0' },
    tableColLast: { flex: 1, padding: 10 },
    tableColWide: { flex: 2, padding: 10, borderRightWidth: 1, borderRightColor: '#e2e8f0' },
    tableCellHeader: { fontSize: 10, fontWeight: 'bold', color: '#334155' },
    tableCell: { fontSize: 10, color: '#475569' },

    statusCritical: { fontSize: 10, color: '#ef4444', fontWeight: 'bold' },
    statusLow: { fontSize: 10, color: '#f59e0b', fontWeight: 'bold' },
    statusHealthy: { fontSize: 10, color: '#10b981', fontWeight: 'bold' },

    summaryContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 30,
        padding: 16,
        backgroundColor: '#f8fafc',
        borderRadius: 6,
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    summaryItem: { flexDirection: 'column' },
    summaryLabel: { fontSize: 9, color: '#64748b', marginBottom: 4, textTransform: 'uppercase', fontWeight: 'bold' },
    summaryValue: { fontSize: 16, fontWeight: 'bold', color: '#0f172a' },
});
