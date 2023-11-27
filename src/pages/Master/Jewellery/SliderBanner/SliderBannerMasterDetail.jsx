
import React, { useCallback, useEffect, useState } from 'react';
import Validators from '../../../../components/validations/Validator';
import ThemeDialog from '../../../../components/UI/Dialog/ThemeDialog';
import { API, HELPER } from '../../../../services';
import { apiConfig, appConfig } from '../../../../config';
import { Box, Button, Icon, IconButton, Tooltip, Checkbox } from "@mui/material";
import CommonButton from '../../../../components/UI/CommonButton';
import ReactSelect from '../../../../components/UI/ReactSelect';
import SliderBannerMaster from './SliderBannerMaster';



const SliderBannerMasterDetail = ({ modal, setModal, selectedCheckboxes, updateSelectedCheckboxes, toggle, callBack, togglePopup }) => {
  const [isLoader, setIsLoader] = useState(false);
  const [sliderData, setSliderData] = useState([]);
  const [bannerModal, setBannerModal] = useState(false);
  const [formState, setFormState] = useState({
    slider_id: "",
    slider_banner: []
  });
  //  -------------Validation --------------
  const rules = {
    slider_id: "required",
    slider_banner: "required"
  };

  const bannerToggle = useCallback(() => {
    setBannerModal(false);
    setModal(false)
  }, [bannerModal]);

  const handleSubmit = (data) => {
    setIsLoader(true);
    API.post(apiConfig.sliderBanner, data)
      .then((res) => {
        HELPER.toaster.success("Slider Banner added successfully")
        setBannerModal(true);
        updateSelectedCheckboxes([]);
      })
      .catch((err) => {
        if (
          err.status == 400 ||
          err.status == 401 ||
          err.status == 409 ||
          err.status == 403
        ) {
          HELPER.toaster.error(err.errors.message);
        } else {
          console.error(err);
        }
      })
      .finally(() => {
        setIsLoader(false);
      });
  };

  useEffect(() => {
    API.get(apiConfig.slider, {
      rowsPerPage: appConfig.defaultPerPage,
      page: 0,
    })
      .then((res) => {
        setSliderData(res.rows);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  const onChangeSlider = (selectedOption) => {
    const sliderId = selectedOption.target.value;
    fetchSliderBannerData(sliderId);
    setFormState(prev => ({
      ...prev,
      slider_id: sliderId,
    }));
  };

  const fetchSliderBannerData = async (slider_id) => {
    try {
      const res = await API.get(`${apiConfig.SlideBanner}?sliderId=${slider_id}`);
      const bannerDataFromAPI = res.rows.map(item => ({
        banner_id: item.banner_id,
        position: item.position,
      }));

      const maxPositionFromAPI = bannerDataFromAPI.reduce((max, item) => Math.max(max, item.position || 0), 0);
      let positionCounter = maxPositionFromAPI + 1;

      const selectedCheckboxesWithPosition = selectedCheckboxes.map(item => ({
        ...item,
        position: positionCounter++
      }));

      const mergedData = [
        ...selectedCheckboxesWithPosition,
        ...bannerDataFromAPI
      ];

      setFormState(prev => ({
        ...prev,
        slider_banner: mergedData,
      }));
    } catch (err) {
      console.error(err);
    }
  };

  const _sortOptions = sliderData.map((option) => ({
    label: option.name,
    value: option.slider_id,
  }));

  return (
    <>

      <Validators formData={formState} rules={rules}>
        {({ onSubmit, errors, resetValidation }) => (
          <ThemeDialog
            title={`${formState?.banner_id === "" ? "Add" : "Edit"} Banner`}
            isOpen={modal}
            maxWidth='sm'
            onClose={() => {
              togglePopup();
              resetValidation();
            }}
            actionBtns={
              <Box>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => {
                    togglePopup();
                    resetValidation();
                  }}
                >
                  Cancel
                </Button>
                <CommonButton
                  style={{ marginLeft: "20px" }}
                  loader={isLoader}
                  type="submit"
                  variant="contained"
                  color="success"
                  onClick={() => onSubmit(handleSubmit)}
                >
                  Save
                </CommonButton>
              </Box>
            }
          >


            <ReactSelect
              label={"Slider"}
              placeholder="Select Slider"
              options={_sortOptions}
              value={formState.slider_id}
              onChange={onChangeSlider}
              name="slider_id"
              error={errors?.slider_id}
            />
            <div>
              {bannerModal && (
                <SliderBannerMaster
                  modal={bannerModal}
                  setModal={setBannerModal}
                  togglePopup={bannerToggle}
                  sliderId={formState.slider_id}
                  callBack={() => callBack(true)}
                />
              )}
            </div>
          </ThemeDialog>

        )}
      </Validators>
    </>
  );
}

export default SliderBannerMasterDetail;

