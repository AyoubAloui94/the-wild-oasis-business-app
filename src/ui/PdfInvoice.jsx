import { Page, Text, View, Document, StyleSheet, Image } from "@react-pdf/renderer"
import { format } from "date-fns"
import { formatCurrency } from "../utils/helpers"

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    paddingTop: 35,
    paddingBottom: 65,
    paddingHorizontal: 35
  },
  header: {
    marginTop: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  section: {
    margin: 10,
    marginTop: 100,
    padding: 10,
    fontSize: 12
  },
  logo: {
    height: 80,

    aspectRatio: 1.4,
    margin: 10
  },
  info: {
    flexDirection: "column",
    gap: 5
  },
  bookingId: {
    fontSize: 15
  },
  bookingInfo: {
    fontSize: 10
  },
  table: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    backgroundColor: "#E4E4E4",
    padding: 15
  },
  tableItem: {
    flexDirection: "column",
    gap: 10
  },
  total: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: 60,
    marginTop: 30,
    marginRight: 20,
    fontSize: 15
  },
  totalPrice: {
    flexDirection: "column",
    gap: 10,
    fontSize: 13,
    backgroundColor: "#E4E4E4",
    padding: 10
  }
})

function PdfInvoice({ booking, breakfastPrice }) {
  const { guests, cabinPrice, extrasPrice, hasBreakfast, totalPrice, numNights, numGuests, startDate, endDate, id, created_at, cabins } = booking
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Image style={styles.logo} src="/logo-light.png" alt={"logo"} />
          <View style={styles.info}>
            <Text style={styles.bookingId}>Booking #{id}</Text>
            <Text style={styles.bookingInfo}>Customer: {guests.fullName}</Text>
            <Text style={styles.bookingInfo}>Number of guests: {numGuests}</Text>
            <Text style={styles.bookingInfo}>Email: {guests.email}</Text>
            <Text style={styles.bookingInfo}>
              From {format(new Date(startDate), "dd-MM-yyyy")} to {format(new Date(endDate), "dd-MM-yyyy")}
            </Text>
            <Text style={styles.bookingInfo}>Booking date: {format(new Date(created_at), "dd-MM-yyyy, p")}</Text>
          </View>
        </View>
        <View style={styles.section}>
          <View style={styles.table}>
            <View style={styles.tableItem}>
              <Text>Item</Text>
              <Text>Cabin {cabins.name}</Text>
              <Text>Breakfast</Text>
            </View>
            <View style={styles.tableItem}>
              <Text>Price</Text>
              <Text>{formatCurrency(cabins.regularPrice)}</Text>
              <Text>{hasBreakfast ? formatCurrency(breakfastPrice) : "--"}</Text>
            </View>
            <View style={styles.tableItem}>
              <Text>Quantity</Text>
              <Text>{numNights}</Text>
              <Text>{hasBreakfast ? numGuests * numNights : "--"}</Text>
            </View>
            <View style={styles.tableItem}>
              <Text>Subtotal</Text>
              <Text>{formatCurrency(cabinPrice)}</Text>
              <Text>{hasBreakfast ? formatCurrency(extrasPrice) : "--"}</Text>
            </View>
          </View>
        </View>
        <View style={styles.total}>
          <Text>Amount paid by customer</Text>
          <View style={styles.totalPrice}>
            <Text>Total</Text>
            <Text>{formatCurrency(totalPrice)}</Text>
          </View>
        </View>
      </Page>
    </Document>
  )
}

export default PdfInvoice
