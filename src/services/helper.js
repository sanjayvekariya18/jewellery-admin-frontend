import { isArray } from "lodash";
import moment from "moment";
import { toast } from "react-hot-toast";
import Swal from "sweetalert2";
import noImage from "../assets/noimag.jpg";


import "sweetalert2/dist/sweetalert2.css";
// import "react-toastify/dist/ReactToastify.css";
import { apiConfig, appConfig } from "../config";

export const isEmpty = (value) => {
  if (value === null || value === "null") {
    return true;
  }
  if (typeof value === "object") {
    return Object.keys(value).length === 0;
  }
  return (
    (isArray(value) && value.length === 0) ||
    value === undefined ||
    value === "undefined" ||
    value === null ||
    value === ""
  );
};

export const toaster = {
  error: (message, config = {}) => {
    if (!isEmpty(message?.message) || !isEmpty(message)) {
      toast.error(typeof message == 'object' ? message?.message : message, {
        position: "top-center",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        style: {
          zIndex: 99999,
        },
        theme: "light",
        ...config,
      })
    }
  },
  success: (message, config = {}) =>
    toast.success(message, {
      position: "top-center",
      autoClose: 1500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      // progressStyle: { background: '#F1F5F9' },
      // theme: 'colored',
      // style: { background: '#50C793' },
      ...config,
    }),
  warning: (message, config = {}) =>
    toast.warning(message, {
      position: "top-right",
      autoClose: 1500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      ...config,
    }),
  info: (message, config = {}) =>
    toast.info(message, {
      position: "top-right",
      autoClose: 1500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      ...config,
    }),
};

export const sweetAlert = {
  delete: () => {
    return new Promise((resolve) => {
      Swal.fire({
        title: "Are you sure?",
        text: `Are you sure you want to delete this record?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Delete",
        customClass: {
          container: "contained buttons",
          popup: "custom-popup",
          title: "custom-title",
          htmlContainer: "custom-html",
          confirmButton: "custom-confirm",
          cancelButton: "custom-cancel",
        },
      }).then((result) => {
        if (result.isConfirmed) {
          resolve(result);
        }
      });
    });
  },

  success: (message = "Your work has been saved") => {
    Swal.fire({
      position: "top-end",
      text: message,
      showConfirmButton: false,
      width: "300px",
      timer: 1500,
    });
  },

  deleted: (message = "Record deleted") => {
    Swal.fire("Deleted!", message, "success");
  },
};

export const formatDate = (date, format = "YYYY-MM-DD HH:mm:ss") => {
  return date ? moment(date, "YYYY-MM-DD HH:mm:ss").format(format) : "";
};

export const prepateSelectDropdown = (array, field1 = null, field2) => {
  if (isEmpty(array)) {
    return [];
  }
  return array
    .map((item) => {
      return {
        label: isEmpty(field1) ? item : item[field1],
        value: isEmpty(field2) ? item : item[field2],
      };
    })
    .filter((e) => !isEmpty(e.label));
};

export const getImageUrl = (url) => {
  if (isEmpty(url)) {
    return noImage;
  }
  const isAbsoluteUrl = /^(?:\w+:)\/\//.test(url);
  if (isAbsoluteUrl) {
    return url;
  } else {
    return `${appConfig.host}${url}`.replace(/([^:]\/)\/+/g, "$1");
  }
};

export const GetFormatedAmount = (amount, withCrDr = false, abs = true) => {
  let formatedAmount = withCrDr ? "" : "";
  if (!Number.isNaN(amount)) {
    amount = Number(amount).toFixed(2);

    if (abs) {
      formatedAmount = new Intl.NumberFormat("en-IN", {
        style: "decimal",
        currency: "INR",
        minimumFractionDigits: 2,
      }).format(Math.abs(amount));
    } else {
      formatedAmount = new Intl.NumberFormat("en-IN", {
        style: "decimal",
        currency: "INR",
        minimumFractionDigits: 2,
      }).format(amount);
    }
  }

  if (withCrDr) {
    amount < 0 ? (formatedAmount += " Cr.") : (formatedAmount += " Dr.");
  }

  return formatedAmount;
};

export const  checkFileType = (url) => {
  // Get the file extension from the URL
  const fileExtension = url.split('.').pop().toLowerCase();

  // List of common image file extensions
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg'];

  // List of common video file extensions
  const videoExtensions = ['mp4', 'avi', 'mov', 'wmv', 'mkv', 'flv', 'webm', 'mpeg'];

  // Check if the file extension matches with an image extension
  if (imageExtensions.includes(fileExtension)) {
      return 'image';
  }

  // Check if the file extension matches with a video extension
  if (videoExtensions.includes(fileExtension)) {
      return 'video';
  }

  // If the file extension doesn't match either, it might be an unknown type or not supported
  return 'unknown';
}

export const setImageSrc = (imageUrl) => {
  if (imageUrl?.startsWith("https://")) {
    return imageUrl;
  } else {
    return apiConfig.publicURL + imageUrl;
  }
};

export const downloadFile = (url, data = {}) => {
  return new Promise((resolve, reject) => {
    if (!data?.file_name) {
      reject("file name is required");
      return;
    }
    var xhr = new XMLHttpRequest();
    xhr.open("GET", `${apiConfig.baseURL}${url}`, true);
    xhr.responseType = "arraybuffer";
    xhr.setRequestHeader(
      "Authorization",
      "Bearer " + sessionStorage.getItem(appConfig.localStorage.token)
    );
    xhr.onload = function (e) {
      if (this.status === 200) {
        var blob = new Blob([this.response], { type: "application/pdf" });
        var link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.download = data?.file_name;
        link.click();
        resolve();
      } else {
        reject();
      }
    };
    xhr.send();
  });
};

export function _bool(val) {
  return (!isEmpty(val) && (val === true || val === "true")) ? true : false
};
