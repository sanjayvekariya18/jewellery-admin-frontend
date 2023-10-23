import React from "react";
import { HELPER } from "./../../services";

export default function ValidationMessages({ errors, label = "" }) {
  return (
    <>
      {!HELPER.isEmpty(errors) && !HELPER.isEmpty(errors.message) && (
        <div className="invalid-input">{errors.message}</div>
      )}

      {!HELPER.isEmpty(errors) &&
        Array.isArray(errors) &&
        errors.map((error, i) => (
          <div key={i} className={`invalid-input text-error`}>
            {error.replace(":attribute", label).replace("*", "")}
          </div>
        ))}
    </>
  );
}
