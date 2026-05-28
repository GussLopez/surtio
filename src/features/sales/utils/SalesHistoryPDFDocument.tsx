import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import type { Sale } from "@/shared/types";

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
  headerDateRange: {
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
  // Summary section
  summaryBox: {
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 6,
    padding: 16,
    flexDirection: "row",
    marginBottom: 20,
  },
  summaryItem: {
    flex: 1,
    alignItems: "center",
  },
  summaryLabel: {
    fontSize: 7,
    fontFamily: "Helvetica-Bold",
    color: MUTED,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  summaryValue: {
    fontFamily: "Helvetica-Bold",
    fontSize: 16,
    color: DARK,
  },
  summaryValueGreen: {
    fontFamily: "Helvetica-Bold",
    fontSize: 16,
    color: GREEN,
  },
  summaryValueOrange: {
    fontFamily: "Helvetica-Bold",
    fontSize: 16,
    color: ORANGE,
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
  thSaleNumber: {
    flex: 2,
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: MUTED,
  },
  thDate: {
    flex: 2,
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: MUTED,
  },
  thSeller: {
    flex: 2,
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: MUTED,
  },
  thProducts: {
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
  thProfit: {
    flex: 2,
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: MUTED,
    textAlign: "right",
  },
  tdSaleNumber: {
    flex: 2,
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: DARK,
  },
  tdDate: {
    flex: 2,
    fontSize: 9,
    color: DARK,
  },
  tdSeller: {
    flex: 2,
    fontSize: 9,
    color: DARK,
  },
  tdProducts: {
    flex: 2,
    fontSize: 9,
    color: DARK,
    textAlign: "center",
  },
  tdProductsSub: {
    flex: 2,
    fontSize: 7,
    color: MUTED,
    textAlign: "center",
  },
  tdTotal: {
    flex: 2,
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: DARK,
    textAlign: "right",
  },
  tdProfit: {
    flex: 2,
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: GREEN,
    textAlign: "right",
  },
  // Totals section
  totalsWrapper: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  totalsBox: {
    width: 260,
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
    right: 40,
    fontSize: 8,
    color: MUTED,
  },
});

function formatCurrency(value: number) {
  return value.toLocaleString("es-MX", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

interface SalesHistoryPDFProps {
  sales: Sale[];
  dateRange?: {
    from?: Date;
    to?: Date;
  };
}

export default function SalesHistoryPDFDocument({ sales, dateRange }: SalesHistoryPDFProps) {
  const generatedDate = new Date().toLocaleDateString("es-MX", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  const dateRangeText = dateRange?.from && dateRange?.to
    ? `${dateRange.from.toLocaleDateString("es-MX", { day: "2-digit", month: "short", year: "numeric" })} - ${dateRange.to.toLocaleDateString("es-MX", { day: "2-digit", month: "short", year: "numeric" })}`
    : "Todas las ventas";

  // Calculate totals
  const totalSales = sales.length;
  const totalRevenue = sales.reduce((sum, sale) => sum + sale.total, 0);
  const totalCost = sales.reduce((sum, sale) => 
    sum + sale.sale_items.reduce((itemSum, item) => itemSum + item.products.cost * item.quantity, 0), 0
  );
  const totalProfit = sales.reduce((sum, sale) => 
    sum + sale.sale_items.reduce((itemSum, item) => itemSum + (item.price - item.products.cost) * item.quantity, 0), 0
  );
  const totalItems = sales.reduce((sum, sale) => 
    sum + sale.sale_items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0
  );

  // Split sales into pages (around 20 per page for readability)
  const ITEMS_PER_PAGE = 20;
  const pages: Sale[][] = [];
  for (let i = 0; i < sales.length; i += ITEMS_PER_PAGE) {
    pages.push(sales.slice(i, i + ITEMS_PER_PAGE));
  }

  return (
    <Document>
      {pages.map((pageSales, pageIndex) => (
        <Page key={pageIndex} size="A4" style={styles.page}>
          {/* Header - only on first page or simplified on other pages */}
          <View style={styles.header}>
            <View>
              <Text style={styles.storeName}>Tienda Demo</Text>
              <Text style={styles.headerSubtitle}>Historial de Ventas</Text>
            </View>
            <View style={styles.headerRight}>
              <Text style={styles.headerDate}>{generatedDate}</Text>
              <Text style={styles.headerDateRange}>{dateRangeText}</Text>
            </View>
          </View>

          <View style={styles.content}>
            {/* Summary - only on first page */}
            {pageIndex === 0 && (
              <View style={styles.summaryBox}>
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryLabel}>Total Ventas</Text>
                  <Text style={styles.summaryValue}>{totalSales}</Text>
                </View>
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryLabel}>Items Vendidos</Text>
                  <Text style={styles.summaryValue}>{totalItems}</Text>
                </View>
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryLabel}>Ingresos</Text>
                  <Text style={styles.summaryValueOrange}>$ {formatCurrency(totalRevenue)}</Text>
                </View>
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryLabel}>Ganancia</Text>
                  <Text style={styles.summaryValueGreen}>$ {formatCurrency(totalProfit)}</Text>
                </View>
              </View>
            )}

            {/* Table */}
            <View style={styles.table}>
              <View style={styles.tableHeader}>
                <Text style={styles.thSaleNumber}>Venta</Text>
                <Text style={styles.thDate}>Fecha</Text>
                <Text style={styles.thSeller}>Vendedor</Text>
                <Text style={styles.thProducts}>Productos</Text>
                <Text style={styles.thTotal}>Total</Text>
                <Text style={styles.thProfit}>Ganancia</Text>
              </View>
              {pageSales.map((sale, index) => {
                const formatDate = new Date(sale.created_at!).toLocaleDateString("es-MX", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                });
                const totalItemsInSale = sale.sale_items.reduce((acc, item) => acc + item.quantity, 0);
                const profitInSale = sale.sale_items.reduce((acc, item) => {
                  const profitPerItem = (item.price - item.products.cost) * item.quantity;
                  return acc + profitPerItem;
                }, 0);

                return (
                  <View
                    key={sale.id}
                    style={index === pageSales.length - 1 ? styles.tableRowLast : styles.tableRow}
                  >
                    <Text style={styles.tdSaleNumber}>#{sale.sale_number}</Text>
                    <Text style={styles.tdDate}>{formatDate}</Text>
                    <Text style={styles.tdSeller}>{sale.seller_name}</Text>
                    <View style={{ flex: 2, alignItems: "center" }}>
                      <Text style={{ fontSize: 9, color: DARK }}>{sale.sale_items.length} prod.</Text>
                      <Text style={{ fontSize: 7, color: MUTED }}>({totalItemsInSale} items)</Text>
                    </View>
                    <Text style={styles.tdTotal}>$ {formatCurrency(sale.total)}</Text>
                    <Text style={styles.tdProfit}>$ {formatCurrency(profitInSale)}</Text>
                  </View>
                );
              })}
            </View>

            {/* Totals - only on last page */}
            {pageIndex === pages.length - 1 && (
              <View style={styles.totalsWrapper}>
                <View style={styles.totalsBox}>
                  <View style={styles.totalsRow}>
                    <Text style={styles.totalsLabel}>Total ventas:</Text>
                    <Text style={styles.totalsValue}>{totalSales} ventas</Text>
                  </View>
                  <View style={styles.totalsRow}>
                    <Text style={styles.totalsLabel}>Costo total:</Text>
                    <Text style={styles.totalsValue}>$ {formatCurrency(totalCost)} MXN</Text>
                  </View>
                  <View style={styles.separator} />
                  <View style={styles.totalMainRow}>
                    <Text style={styles.totalMainLabel}>Ingresos</Text>
                    <Text style={styles.totalMainValue}>$ {formatCurrency(totalRevenue)} MXN</Text>
                  </View>
                  <View style={styles.separator} />
                  <View style={styles.profitRow}>
                    <Text style={styles.profitLabel}>Ganancia neta</Text>
                    <Text style={styles.profitValue}>$ {formatCurrency(totalProfit)} MXN</Text>
                  </View>
                </View>
              </View>
            )}
          </View>

          {/* Footer */}
          <Text style={styles.footer}>
            Documento generado automaticamente - Tienda Demo
          </Text>
          <Text style={styles.pageNumber}>
            Pagina {pageIndex + 1} de {pages.length}
          </Text>
        </Page>
      ))}
    </Document>
  );
}