import { AppBar,  ThemeProvider, Toolbar, styled, useTheme } from "@mui/material";
import useSettings from "../hooks/useSettings";
import { topBarHeight } from "../utils/constant";
import { Paragraph, Span } from "./Typography";

const AppFooter = styled(Toolbar)(() => ({
	display: "flex",
	alignItems: "center",
	minHeight: topBarHeight,
	"@media (max-width: 499px)": {
		display: "table",
		width: "100%",
		minHeight: "auto",
		padding: "1rem 0",
		"& .container": {
			flexDirection: "column !important",
			"& a": { margin: "0 0 16px !important" },
		},
	},
	"@media (min-width: 600px)": {
		minHeight: "45px",
	},
}));

const FooterContent = styled("div")(() => ({
	width: "100%",
	display: "flex",
	alignItems: "center",
	padding: "0px 0.5rem",
	//   maxWidth: '1170px',
	margin: "0 auto",
}));

const Footer = () => {
	const theme = useTheme();
	const { settings } = useSettings();

	const footerTheme = settings.themes[settings.footer.theme] || theme;

	return (
		<ThemeProvider theme={footerTheme}>
			<AppBar color="primary" position="static" sx={{ zIndex: 96 }}>
				<AppFooter>
					<FooterContent>
						{/* <a href="https://ui-lib.com/downloads/matx-pro-react-admin/">
              <Button variant="contained" color="secondary">
                Get MatX Pro
              </Button>
            </a> */}
						{/* <Span sx={{ m: "auto" }}></Span>
						<Paragraph sx={{ m: 0 }}>
							Design and Developed by{" "}
							<a href="http://karmadhi.com" target="_blank" rel="noreferrer">
								Karmadhi
							</a>
						</Paragraph> */}
					</FooterContent>
				</AppFooter>
			</AppBar>
		</ThemeProvider>
	);
};

export default Footer;
