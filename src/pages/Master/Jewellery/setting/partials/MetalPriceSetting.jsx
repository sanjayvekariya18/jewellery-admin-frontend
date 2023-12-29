import React, { useEffect, useState } from 'react';
import { apiConfig } from '../../../../../config';
import Validators from '../../../../../components/validations/Validator';
import Textinput from '../../../../../components/UI/TextInput';
import { API, HELPER } from '../../../../../services';
import { Button } from "@mui/material"

const MetalPriceSetting = ({ metalProduct, callback }) => {
    const [formState, setFormState] = useState({
        silver_price: "",
        platinum_price: "",
        gold_price: "",
        ...metalProduct
    });

    useEffect(() => {
        setFormState(metalProduct)
    }, [metalProduct])

    const onChange = ({ target: { name, value } }) => {
        setFormState((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };
    const handleSubmit = (data) => {    
        const fd = new FormData();
        for (const field in data) {
          fd.append(field, data[field]);
        }
        const apiUrl =
          data.id === ""
            ? apiConfig.metalPrice
            : `${apiConfig.metalPrice}/${data.id}`;
    
        API[data.id === "" ? "post" : "put"](apiUrl, fd)
          .then(() => {
            HELPER.toaster.success(
              data.id === "" ? "Record created" : "Record saved"
            );
            callback();
          })
          .catch((e) => HELPER.toaster.error(e.errors.message))
      };

    return (
        <Validators formData={formState}>
            {({ onSubmit, errors }) => {
                return (
                    <>
                        <Textinput
                            size="medium"
                            label="Gold Price (per 10 gms)"
                            value={formState?.gold_price || ""}
                            onChange={onChange}
                            type="text"
                            name="gold_price"
                            fullWidth
                            error={errors?.gold_price}
                            sx={{ mb: 2, mt: 1, width: "100%" }}
                        />
                        <Textinput
                            size="medium"
                            label="Platinum Price (per 10 gms)"
                            value={formState?.platinum_price || ""}
                            onChange={onChange}
                            type="text"
                            name="platinum_price"
                            fullWidth
                            error={errors?.platinum_price}
                            sx={{ mb: 2, mt: 1, width: "100%" }}
                        />

                        <Textinput
                            size="medium"
                            label="Silver Price (per 10 gms)"
                            value={formState?.silver_price || ""}
                            onChange={onChange}
                            type="text"
                            name="silver_price"
                            fullWidth
                            error={errors?.silver_price}
                            sx={{ mb: 2, mt: 1, width: "100%" }}
                        />
                        <br />
                        <Button
                            type="button"
                            variant="contained"
                            color="primary"
                            onClick={() => {
                                onSubmit(handleSubmit)
                            }}
                        >
                            Save
                        </Button>
                    </>
                );
            }}
        </Validators>

    );
}

export default MetalPriceSetting;
