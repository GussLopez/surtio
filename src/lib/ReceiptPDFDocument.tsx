import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import type { Sale } from "@/types";

const ORANGE = "#F97316";
const GREEN = "#10B981";
const DARK = "#1a1a1a";
const MUTED = "#6b7280";
const LIGHT_BG = "#f9fafb";
const BORDER = "#e5e7eb";
const WHITE = "#ffffff";

const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 9,
    color: DARK,
    padding: 0,
  },
  // Header
  header: {
    backgroundColor: ORANGE,
    paddingHorizontal: 40,
    paddingVertical: 24,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  storeName: {
    fontFamily: "Helvetica-Bold",
    fontSize: 22,
    color: WHITE,
  },
  headerSubtitle: {
    fontSize: 10,
    color: WHITE,
    marginTop: 4,
    opacity: 0.9,
  },
  headerRight: {
    alignItems: "flex-end",
  },
  headerDate: {
    fontSize: 10,
    color: WHITE,
  },
  headerSaleNumber: {
    fontSize: 8,
    color: WHITE,
    marginTop: 3,
    opacity: 0.85,
  },
  // Content wrapper
  content: {
    paddingHorizontal: 40,
    paddingTop: 24,
  },
  // Info section
  infoBox: {
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 6,
    padding: 16,
    flexDirection: "row",
    marginBottom: 20,
  },
  infoLeft: {
    flex: 1,
  },
  infoRight: {
    flex: 1,
    paddingLeft: 20,
  },
  infoSectionLabel: {
    fontSize: 7,
    fontFamily: "Helvetica-Bold",
    color: MUTED,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  clientName: {
    fontFamily: "Helvetica-Bold",
    fontSize: 14,
    color: DARK,
    marginTop: 4,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  infoLabel: {
    fontSize: 8,
    color: MUTED,
  },
  infoValue: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: DARK,
  },
  infoValueGreen: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: GREEN,
  },
  // Table
  table: {
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 6,
    overflow: "hidden",
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: LIGHT_BG,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
  },
  tableRowLast: {
    flexDirection: "row",
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  thProduct: {
    flex: 3,
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: MUTED,
  },
  thQty: {
    flex: 1,
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: MUTED,
    textAlign: "center",
  },
  thPrice: {
    flex: 2,
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: MUTED,
    textAlign: "center",
  },
  thCost: {
    flex: 2,
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: MUTED,
    textAlign: "center",
  },
  thTotal: {
    flex: 2,
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: MUTED,
    textAlign: "right",
  },
  tdProduct: {
    flex: 3,
    fontSize: 9,
    color: DARK,
  },
  tdQty: {
    flex: 1,
    fontSize: 9,
    color: DARK,
    textAlign: "center",
  },
  tdPrice: {
    flex: 2,
    fontSize: 9,
    color: DARK,
    textAlign: "center",
  },
  tdCost: {
    flex: 2,
    fontSize: 9,
    color: DARK,
    textAlign: "center",
  },
  tdTotal: {
    flex: 2,
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: DARK,
    textAlign: "right",
  },
  // Totals section
  totalsWrapper: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  totalsBox: {
    width: 240,
    backgroundColor: LIGHT_BG,
    borderRadius: 8,
    padding: 16,
  },
  totalsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  totalsLabel: {
    fontSize: 9,
    color: MUTED,
  },
  totalsValue: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: DARK,
  },
  separator: {
    height: 1,
    backgroundColor: BORDER,
    marginVertical: 8,
  },
  totalMainRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  totalMainLabel: {
    fontSize: 14,
    fontFamily: "Helvetica-Bold",
    color: DARK,
    textTransform: "uppercase",
  },
  totalMainValue: {
    fontSize: 18,
    fontFamily: "Helvetica-Bold",
    color: ORANGE,
  },
  profitRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  profitLabel: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: GREEN,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  profitValue: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: GREEN,
  },
  // Footer
  footer: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: "center",
    fontSize: 7,
    color: "#a3a3a3",
  },
  pageNumber: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: "left",
    fontSize: 7,
    color: "#a3a3a3",
  }
});

function formatCurrency(value: number) {
  return value.toLocaleString("es-MX", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export default function ReceiptPDFDocument({ sale }: { sale: Sale }) {
  const formatDate = new Date(sale.created_at!).toLocaleDateString("es-MX", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const formatTime = new Date(sale.created_at!).toLocaleTimeString("es-MX", {
    hour: "numeric",
    minute: "numeric",
  });

  const totalCost = sale.sale_items.reduce(
    (sum, item) => sum + item.products.cost * item.quantity,
    0
  );

  const totalRevenue = sale.sale_items.reduce(
    (sum, item) => sum + (item.price - item.products.cost) * item.quantity,
    0
  );

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.storeName}>Tienda Demo</Text>
            <Text style={styles.headerSubtitle}>Recibo de venta</Text>
          </View>
          <View style={styles.headerRight}>
            <Text style={styles.headerDate}>{formatDate}</Text>
            <Text style={styles.headerSaleNumber}>{sale.sale_number}</Text>
          </View>
        </View>

        <View style={styles.content}>
          {/* Info section */}
          <View style={styles.infoBox}>
            <View style={styles.infoRight}>
              <Text style={styles.infoSectionLabel}>Detalles</Text>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Recibo #:</Text>
                <Text style={styles.infoValue}>{sale.sale_number}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Fecha:</Text>
                <Text style={styles.infoValue}>{formatDate}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Cleinte:</Text>
                <Text style={styles.infoValue}>Cleinte Anónimo</Text>
              </View>
            </View>
            <View style={styles.infoRight}>
              <Text style={styles.infoSectionLabel}>Detalles</Text>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Vendedor:</Text>
                <Text style={styles.infoValue}>{sale.seller_name}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Metodo de Pago:</Text>
                <Text style={styles.infoValue}>
                  {sale.payment_method === "cash" ? "Efectivo" : sale.payment_method}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Estado:</Text>
                <Text style={styles.infoValueGreen}>Completada</Text>
              </View>
            </View>
          </View>

          {/* Table */}
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={styles.thProduct}>Producto</Text>
              <Text style={styles.thQty}>Cant.</Text>
              <Text style={styles.thPrice}>Precio</Text>
              <Text style={styles.thCost}>Costo</Text>
              <Text style={styles.thTotal}>Total</Text>
            </View>
            {sale.sale_items.map((item, index) => (
              <View
                key={item.id}
                style={
                  index === sale.sale_items.length - 1
                    ? styles.tableRowLast
                    : styles.tableRow
                }
              >
                <Text style={styles.tdProduct}>{item.products.name}</Text>
                <Text style={styles.tdQty}>{item.quantity}</Text>
                <Text style={styles.tdPrice}>
                  {formatCurrency(item.price)} MXN
                </Text>
                <Text style={styles.tdCost}>
                  {formatCurrency(item.products.cost)} MXN
                </Text>
                <Text style={styles.tdTotal}>
                  {formatCurrency(item.quantity * item.price)} MXN
                </Text>
              </View>
            ))}
          </View>

          {/* Totals */}
          <View style={styles.totalsWrapper}>
            <View style={styles.totalsBox}>
              <View style={styles.totalsRow}>
                <Text style={styles.totalsLabel}>Costo total:</Text>
                <Text style={styles.totalsValue}>
                  {formatCurrency(totalCost)} MXN
                </Text>
              </View>
              <View style={styles.separator} />
              <View style={styles.totalMainRow}>
                <Text style={styles.totalMainLabel}>Total</Text>
                <Text style={styles.totalMainValue}>
                  $ {formatCurrency(sale.total)} MXN
                </Text>
              </View>
              <View style={styles.separator} />
              <View style={styles.profitRow}>
                <Text style={styles.profitLabel}>Ganancia neta</Text>
                <Text style={styles.profitValue}>
                  $ {formatCurrency(totalRevenue)} MXN
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Footer */}
        <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => (
          `${pageNumber} / ${totalPages}`
        )} fixed />
        <Text style={styles.footer}>
          Documento generado automaticamente - Tienda Demo
        </Text>
      </Page>
    </Document>
  );
}
