import React, { useEffect, useMemo, useState } from "react";
import error400cover from "../../assets/no-data-found-page.png";
import PaginationTable, {
  usePaginationTable,
} from "../../components/UI/Pagination/PaginationTable";
import { API, HELPER } from "../../services";
import { apiConfig } from "../../config";
import _ from "lodash";
import { useParams } from "react-router-dom";
import { Breadcrumb, Container } from "../../components";
import { Box, IconButton, Icon } from "@mui/material";
import { pageRoutes } from "../../constants/routesList";
import { useNavigate } from "react-router-dom/dist";
import MaxHeightMenu from "../../components/MaxHeightMenu";
import ThemeSwitch from "../../components/UI/ThemeSwitch";

const FindProductVariant = () => {
  const { productId } = useParams();
  const [loading, setLoading] = useState(false);
  const { state, setState, changeState, ...otherTableActionProps } = usePaginationTable();
  const navigate = useNavigate();
  // paginate
  const paginate = () => {
    changeState("loader", true);

    let updatedFilter = {
      page: state.page,
      rowsPerPage: state.rowsPerPage,
    };

    API.get(
      apiConfig.findProduct.replace(":productId", productId),
      updatedFilter
    )
      .then((res) => {
        setLoading(true);
        setState({
          ...state,
          total_items: res.count,
          data: res.rows,
          loader: false,
        });
      })
      .catch((err) => {
        if (
          err.status === 400 ||
          err.status === 401 ||
          err.status === 409 ||
          err.status === 403
        ) {
          HELPER.toaster.error(err.errors.message);
        } else {
          HELPER.toaster.error(err)
        }
      })
      .finally(() => {
        setLoading(false);
      })
  };

  // addToFeature in Post api
  const addToFeature = (id) => {
    API.post(`${apiConfig.featureProduct.replace(':id', id)}`)
      .then((res) => {
        HELPER.toaster.success(res.message)
      })
      .catch((error) => {
        HELPER.toaster.error(error.errors.productVariant[0])
      });
  };

  // addToOurProduct in Post api
  const addToOurProduct = (id) => {
    API.post(`${apiConfig.ourProduct.replace(':id', id)}`)
      .then((res) => {
        HELPER.toaster.success(res.message)
      })
      .catch((error) => {
        HELPER.toaster.error(error.errors.productVariant[0])
      });
  };

  // addToWedding in post api
  const addToWedding = (id) => {
    API.post(`${apiConfig.popularWedding.replace(':id', id)}`)
      .then((res) => {
        HELPER.toaster.success(res.message)
      })
      .catch((error) => {
        HELPER.toaster.error(error.errors.productVariant[0])
      });
  };

  // addToGift in post APi
  const addToGift = (id) => {
    API.post(`${apiConfig.popularGift.replace(':id', id)}`)
      .then((res) => {
        HELPER.toaster.success(res.message)
      })
      .catch((error) => {
        HELPER.toaster.error(error.errors.productVariant[0])
      });
  };

  // addToEngagement in post api
  const addToEngagement = (id) => {
    API.post(`${apiConfig.popularEngagement.replace(':id', id)}`)
      .then((res) => {
        HELPER.toaster.success(res.message)
      })
      .catch((error) => {
        HELPER.toaster.error(error.errors.productVariant[0])
      });
  };

  const COLUMNS = [
    { title: "Index", classNameWidth: "thead-second-width-action-index" },
    { title: "Title", classNameWidth: "thead-second-width-title2" },
    { title: "SKU", classNameWidth: "thead-second-width-title-email" },
    { title: "Total Carat", classNameWidth: "thead-second-width-address-100" },
    { title: "Metal Weight", classNameWidth: "thead-second-width-address-100" },
    { title: "Metal Price", classNameWidth: "thead-second-width-address-100" },
    { title: "Making Price", classNameWidth: "thead-second-width-address-100" },
    {
      title: "Diamond Price",
      classNameWidth: "thead-second-width-address-100",
    },
    { title: "Total Price", classNameWidth: "thead-second-width-address-100" },
    { title: "Is Visible", classNameWidth: "thead-second-width-discount" },
    { title: "Action", classNameWidth: "thead-second-width-discount" },
  ];


  // ---------------Visibility Product Api----------------------

  const hiddenVisibleProductVariant = (Id) => {
    API.put(apiConfig.visibility_productVariant.replace(":id", Id))
      .then((res) => {
        HELPER.toaster.success(res.message);
        paginate();
        setLoading(false);
      })
      .catch((err) => {
        HELPER.toaster.error(err);
      })
  };

  const rows = useMemo(() => {
    return state.data.map((item, i) => {
      let optionsArray = [
        {
          key: "Add to Features",
          color: "rgba(52, 49, 76, 1)",
          icon: "control_point_icon",
          fontSize: "12px",
          iconSize: "14px",
          onClick: () => addToFeature(item.id),
        },
        {
          key: "Add to Our Products",
          color: "rgba(52, 49, 76, 1)",
          icon: "control_point_icon",
          fontSize: "12px",
          iconSize: "14px",
          onClick: () => addToOurProduct(item.id),
        },
        {
          key: "Popular Wedding",
          color: "rgba(52, 49, 76, 1)",
          icon: "control_point_icon",
          fontSize: "12px",
          iconSize: "14px",
          onClick: () => addToWedding(item.id),
        },
        {
          key: "Popular Gift",
          color: "rgba(52, 49, 76, 1)",
          icon: "control_point_icon",
          fontSize: "12px",
          iconSize: "14px",
          onClick: () => addToGift(item.id),
        },
        {
          key: "Popular Engagement",
          color: "rgba(52, 49, 76, 1)",
          icon: "control_point_icon",
          fontSize: "12px",
          iconSize: "14px",
          onClick: () => addToEngagement(item.id),
        },
      ];


      return {
        item: item,
        columns: [
          <span>{i + 1}</span>,
          <div className="common-thead-second-width-title-blog   span-permision">
            <span>{item.title}</span>
          </div>,
          <span>{item.sku}</span>,
          <span>{item.totalCarat}</span>,
          <span>${item.makingPrice}</span>,
          <span>{item.metalWeight}</span>,
          <span>${item.metalPrice}</span>,
          <span>${item.diamondPrice}</span>,
          <span>${item.totalPrice}</span>,
          <span>
            <ThemeSwitch
              checked={item.isVisible}
              color="warning"
              onChange={() => {
                hiddenVisibleProductVariant(item.id);
              }}
            />
          </span>,
          <span style={{ display: "flex" }}>
            <IconButton onClick={(e) => handleButtonClick(item.id)}>
              <Icon color="primary">remove_red_eye</Icon>
            </IconButton>
            <MaxHeightMenu optionsMenu={optionsArray} />
          </span>,

        ],
      };
    });
  }, [state.data]);

  useEffect(() => {
    paginate();
  }, [state.page, state.rowsPerPage]);

  const handleButtonClick = (id) => {
    navigate(`${pageRoutes.productVariantId}/${id}`);
  };
  return (
    <div>
      <Container>
        <Box
          className="breadcrumb"
          sx={{ display: "flex", justifyContent: "space-between" }}
        >
          <Breadcrumb
            routeSegments={[
              { name: "Masters", path: pageRoutes.diamond },
              { name: "Product", path: pageRoutes.product },
              { name: "Product Variant" },
            ]}
          />
        </Box>
        <PaginationTable
          header={COLUMNS}
          rows={rows}
          totalItems={state.total_items || 0}
          perPage={state.rowsPerPage}
          activePage={state.page}
          checkboxColumn={false}
          selectedRows={state.selectedRows}
          enableOrder={true}
          isLoader={loading}
          emptyTableImg={<img src={error400cover} width="400px" />}
          {...otherTableActionProps}
          orderBy={state.orderby}
          order={state.order}
        ></PaginationTable>
      </Container>
    </div>
  );
};

export default FindProductVariant;
