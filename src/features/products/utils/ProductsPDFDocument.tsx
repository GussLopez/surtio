import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import type { Product } from "@/shared/types";

const ORANGE = "#F97316";
const GREEN = "#10B981";
const RED = "#EF4444";
const AMBER = "#F59E0B";
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
  headerInfo: {
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
  summaryValueRed: {
    fontFamily: "Helvetica-Bold",
    fontSize: 16,
    color: RED,
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
  thCategory: {
    flex: 2,
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: MUTED,
  },
  thCost: {
    flex: 1.5,
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: MUTED,
    textAlign: "right",
  },
  thPrice: {
    flex: 1.5,
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: MUTED,
    textAlign: "right",
  },
  thStock: {
    flex: 1,
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
  },
  tdProductName: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: DARK,
  },
  tdProductSku: {
    fontSize: 7,
    color: MUTED,
    marginTop: 2,
  },
  tdCategory: {
    flex: 2,
    fontSize: 9,
    color: DARK,
  },
  tdCost: {
    flex: 1.5,
    fontSize: 9,
    color: MUTED,
    textAlign: "right",
  },
  tdPrice: {
    flex: 1.5,
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: DARK,
    textAlign: "right",
  },
  tdStock: {
    flex: 1,
    fontSize: 9,
    textAlign: "center",
  },
  tdTotal: {
    flex: 2,
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: DARK,
    textAlign: "right",
  },
  stockBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    alignSelf: "center",
  },
  stockGreen: {
    backgroundColor: "#d1fae5",
  },
  stockAmber: {
    backgroundColor: "#fef3c7",
  },
  stockRed: {
    backgroundColor: "#fee2e2",
  },
  stockTextGreen: {
    color: GREEN,
    fontFamily: "Helvetica-Bold",
    fontSize: 9,
  },
  stockTextAmber: {
    color: AMBER,
    fontFamily: "Helvetica-Bold",
    fontSize: 9,
  },
  stockTextRed: {
    color: RED,
    fontFamily: "Helvetica-Bold",
    fontSize: 9,
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
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: DARK,
    textTransform: "uppercase",
  },
  totalMainValue: {
    fontSize: 14,
    fontFamily: "Helvetica-Bold",
    color: ORANGE,
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

interface ProductsPDFProps {
  products: Product[];
  businessName: string;
  categoryFilter?: string;
}

export default function ProductsPDFDocument({ products, businessName, categoryFilter }: ProductsPDFProps) {
  const generatedDate = new Date().toLocaleDateString("es-MX", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  // Calculate totals
  const totalProducts = products.length;
  const totalStock = products.reduce((sum, p) => sum + p.stock, 0);
  const totalInventoryValue = products.reduce((sum, p) => sum + p.price * p.stock, 0);
  const totalCostValue = products.reduce((sum, p) => sum + p.cost * p.stock, 0);
  const lowStockCount = products.filter((p) => p.stock <= p.min_stock).length;

  // Split products into pages
  const ITEMS_PER_PAGE = 22;
  const pages: Product[][] = [];
  for (let i = 0; i < products.length; i += ITEMS_PER_PAGE) {
    pages.push(products.slice(i, i + ITEMS_PER_PAGE));
  }

  const getStockStyle = (product: Product) => {
    if (product.stock <= product.min_stock) {
      return { badge: styles.stockRed, text: styles.stockTextRed };
    }
    if (product.stock <= product.min_stock + 5) {
      return { badge: styles.stockAmber, text: styles.stockTextAmber };
    }
    return { badge: styles.stockGreen, text: styles.stockTextGreen };
  };

  return (
    <Document>
      {pages.map((pageProducts, pageIndex) => (
        <Page key={pageIndex} size="A4" style={styles.page}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.storeName}>{businessName}</Text>
              <Text style={styles.headerSubtitle}>Inventario de Productos</Text>
            </View>
            <View style={styles.headerRight}>
              <Text style={styles.headerDate}>{generatedDate}</Text>
              <Text style={styles.headerInfo}>
                {categoryFilter && categoryFilter !== "all" ? `Categoria: ${categoryFilter}` : "Todos los productos"}
              </Text>
            </View>
          </View>

          <View style={styles.content}>
            {/* Summary - only on first page */}
            {pageIndex === 0 && (
              <View style={styles.summaryBox}>
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryLabel}>Productos</Text>
                  <Text style={styles.summaryValue}>{totalProducts}</Text>
                </View>
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryLabel}>Stock Total</Text>
                  <Text style={styles.summaryValue}>{totalStock} UN</Text>
                </View>
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryLabel}>Stock Bajo</Text>
                  <Text style={lowStockCount > 0 ? styles.summaryValueRed : styles.summaryValue}>
                    {lowStockCount}
                  </Text>
                </View>
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryLabel}>Valor Inventario</Text>
                  <Text style={styles.summaryValueOrange}>$ {formatCurrency(totalInventoryValue)}</Text>
                </View>
              </View>
            )}

            {/* Table */}
            <View style={styles.table}>
              <View style={styles.tableHeader}>
                <Text style={styles.thProduct}>Producto</Text>
                <Text style={styles.thCategory}>Categoria</Text>
                <Text style={styles.thCost}>Costo</Text>
                <Text style={styles.thPrice}>Precio</Text>
                <Text style={styles.thStock}>Stock</Text>
                <Text style={styles.thTotal}>Valor Total</Text>
              </View>
              {pageProducts.map((product, index) => {
                const stockStyle = getStockStyle(product);
                const totalValue = product.price * product.stock;

                return (
                  <View
                    key={product.id}
                    style={index === pageProducts.length - 1 ? styles.tableRowLast : styles.tableRow}
                  >
                    <View style={styles.tdProduct}>
                      <Text style={styles.tdProductName}>{product.name}</Text>
                      <Text style={styles.tdProductSku}>SKU-{product.sku || "N/A"}</Text>
                    </View>
                    <Text style={styles.tdCategory}>{product.categories?.name || "Sin categoria"}</Text>
                    <Text style={styles.tdCost}>$ {formatCurrency(product.cost)}</Text>
                    <Text style={styles.tdPrice}>$ {formatCurrency(product.price)}</Text>
                    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                      <View style={[styles.stockBadge, stockStyle.badge]}>
                        <Text style={stockStyle.text}>{product.stock}</Text>
                      </View>
                    </View>
                    <Text style={styles.tdTotal}>$ {formatCurrency(totalValue)}</Text>
                  </View>
                );
              })}
            </View>

            {/* Totals - only on last page */}
            {pageIndex === pages.length - 1 && (
              <View style={styles.totalsWrapper}>
                <View style={styles.totalsBox}>
                  <View style={styles.totalsRow}>
                    <Text style={styles.totalsLabel}>Total productos:</Text>
                    <Text style={styles.totalsValue}>{totalProducts} productos</Text>
                  </View>
                  <View style={styles.totalsRow}>
                    <Text style={styles.totalsLabel}>Stock total:</Text>
                    <Text style={styles.totalsValue}>{totalStock} unidades</Text>
                  </View>
                  <View style={styles.totalsRow}>
                    <Text style={styles.totalsLabel}>Costo total:</Text>
                    <Text style={styles.totalsValue}>$ {formatCurrency(totalCostValue)} MXN</Text>
                  </View>
                  <View style={styles.separator} />
                  <View style={styles.totalMainRow}>
                    <Text style={styles.totalMainLabel}>Total Inventario</Text>
                    <Text style={styles.totalMainValue}>$ {formatCurrency(totalInventoryValue)} MXN</Text>
                  </View>
                </View>
              </View>
            )}
          </View>

          {/* Footer */}
          <Text style={styles.footer}>Documento generado automaticamente - Tienda Demo</Text>
          <Text style={styles.pageNumber}>
            Pagina {pageIndex + 1} de {pages.length}
          </Text>
        </Page>
      ))}
    </Document>
  );
}