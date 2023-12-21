import {
  Avatar,
  Box,
  Card,
  Icon,
  styled,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  useTheme,
} from "@mui/material";
import { Paragraph } from "../../components/Typography";
import "flatpickr/dist/themes/material_green.css"; // Import a Flatpickr theme
import "flatpickr/dist/flatpickr.css"; // Import the default Flatpickr styles
import DateRangePicker from "../../components/UI/DatePicker";
import Textinput from "../../components/UI/TextInput";
import { useCallback } from "react";
import ReactSelect from "../../components/UI/ReactSelect";

const CardHeader = styled(Box)(() => ({
  display: "flex",
  paddingLeft: "24px",
  paddingRight: "24px",
  marginBottom: "12px",
  alignItems: "center",
  justifyContent: "space-between",
}));

const Title = styled("span")(() => ({
  fontSize: "1rem",
  fontWeight: "500",
  textTransform: "capitalize",
  marginBottom: "5px",
}));

const ProductTable = styled(Table)(() => ({
  minWidth: 400,
  whiteSpace: "pre",
  "& small": {
    width: 50,
    height: 15,
    borderRadius: 500,
    boxShadow: "0 0 2px 0 rgba(0, 0, 0, 0.12), 0 2px 2px 0 rgba(0, 0, 0, 0.24)",
  },
  "& td": { borderBottom: "none" },
  "& td:first-of-type": { paddingLeft: "16px !important" },
}));

const Small = styled("small")(({ bgcolor }) => ({
  width: 50,
  height: 15,
  color: "#fff",
  padding: "2px 8px",
  borderRadius: "4px",
  overflow: "hidden",
  background: bgcolor,
  boxShadow: "0 0 2px 0 rgba(0, 0, 0, 0.12), 0 2px 2px 0 rgba(0, 0, 0, 0.24)",
}));

const SubTitle = styled("span")(({ theme }) => ({
  fontSize: "0.875rem",
  color: theme.palette.text.secondary,
}));

const PendingShippment = () => {
  const { palette } = useTheme();
  const bgError = palette.error.main;
  const bgPrimary = palette.primary.main;
  const bgSecondary = palette.secondary.main;
  const handleDateRangeChange = (selectedDates) => {
    // Handle the selected date range in your parent component
    // console.log("Selected Date Range:", selectedDates);
  };

  const onChange = useCallback((e) => {
    return {
      [e.target.name]: e.target.value,
    };
  }, []);

  const optionsStatus = [
    { label: "Apporoved ", value: 0 },
    { label: "In Transit", value: 1 },
    { label: "Out For Delivery", value: 2 },
    { label: "Delivered", value: 3 },
    { label: "Delivered Failed", value: 4 },
  ];
  let _sortOptionsStatus = optionsStatus.map((option) => ({
    label: option.label,
    value: option.value,
  }));

  return (
    <Card elevation={3} sx={{ pt: "20px", mb: 3 }}>
      <CardHeader>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <Title>Pending Shipments</Title>
          <SubTitle>Summary of pending shipments of November 2023</SubTitle>
        </div>
        <div
          style={{ display: "grid", gridTemplateColumns: "400px 300px 1fr" }}
        >
          <div>
            <Textinput
              size="small"
              type="text"
              name="mLength"
              placeholder="Search by anything..."
              onChange={onChange}
              sx={{ mb: 0, width: "100%" }}
              InputProps={{
                startAdornment: (
                  <Icon position="start" style={{ marginRight: "10px" }}>
                    search
                  </Icon>
                ),
              }}
            />
          </div>
          <div style={{ marginLeft: "20px" }}>
            <DateRangePicker
              placeholder="Select Date Range"
              onChange={handleDateRangeChange}
            />
          </div>
          <div style={{ marginLeft: "20px" }}>
            <ReactSelect
              placeholder="Select status"
              onChange={onChange}
              options={_sortOptionsStatus}
            />
          </div>
        </div>
        {/* <Select size="small" defaultValue="this_month">
          <MenuItem value="this_month">This Month</MenuItem>
          <MenuItem value="last_month">Last Month</MenuItem>
        </Select> */}
      </CardHeader>

      <Box overflow="auto">
        <ProductTable>
          <TableHead style={{ background: "##75ade412" }}>
            <TableRow>
              <TableCell sx={{ px: 3 }} colSpan={4}>
                Product Name
              </TableCell>
              <TableCell sx={{ px: 0 }} colSpan={2}>
                DATE
              </TableCell>
              <TableCell sx={{ px: 0 }} colSpan={2}>
                Total Cost{" "}
              </TableCell>
              <TableCell sx={{ px: 0 }} colSpan={2}>
                PAYMENT METHOD{" "}
              </TableCell>
              <TableCell sx={{ px: 0 }} colSpan={2}>
                STATUS{" "}
              </TableCell>
              {/* <TableCell sx={{ px: 0 }} colSpan={1}>
                Action
              </TableCell> */}
            </TableRow>
          </TableHead>

          <TableBody>
            {productList.map((product, index) => (
              <TableRow key={index} hover>
                <TableCell
                  colSpan={4}
                  align="left"
                  sx={{ px: 0, textTransform: "capitalize" }}
                >
                  <Box display="flex" alignItems="center">
                    <Avatar src={product.imgUrl} />
                    <Paragraph sx={{ m: 0, ml: 4 }}>{product.name}</Paragraph>
                  </Box>
                </TableCell>
                <TableCell
                  colSpan={2}
                  sx={{ px: 0, textTransform: "capitalize" }}
                >
                  <Paragraph>17/10/2023</Paragraph>
                </TableCell>
                <TableCell
                  colSpan={2}
                  sx={{ px: 0, textTransform: "capitalize" }}
                >
                  <Paragraph>$ 981.00</Paragraph>
                </TableCell>
                <TableCell
                  colSpan={2}
                  sx={{ px: 0, textTransform: "capitalize" }}
                >
                  <Paragraph>Credit Card</Paragraph>
                </TableCell>

                <TableCell sx={{ px: 0 }} align="left" colSpan={2}>
                  {product.available ? (
                    product.available < 20 ? (
                      <Small bgcolor={bgSecondary}>
                        {product.available} In Transit
                      </Small>
                    ) : (
                      <Small bgcolor={bgPrimary}>Approved</Small>
                    )
                  ) : (
                    <Small bgcolor={bgError}>Delivery Failed</Small>
                  )}
                </TableCell>

                {/* <TableCell sx={{ px: 0 }} colSpan={1}>
                  <IconButton>
                    <Icon color="primary">edit</Icon>
                  </IconButton>
                </TableCell> */}
              </TableRow>
            ))}
          </TableBody>
        </ProductTable>
      </Box>
    </Card>
  );
};

const productList = [
  {
    imgUrl: "/assets/images/products/headphone-2.jpg",
    name: "earphone",
    price: 100,
    available: 15,
  },
  {
    imgUrl: "/assets/images/products/headphone-3.jpg",
    name: "earphone",
    price: 1500,
    available: 30,
  },
  {
    imgUrl: "/assets/images/products/iphone-2.jpg",
    name: "iPhone x",
    price: 1900,
    available: 35,
  },
  {
    imgUrl: "/assets/images/products/iphone-1.jpg",
    name: "iPhone x",
    price: 100,
    available: 0,
  },
  {
    imgUrl: "/assets/images/products/headphone-3.jpg",
    name: "Head phone",
    price: 1190,
    available: 5,
  },
];

export default PendingShippment;
