import React from "react";
import VirtualizedSelect from "react-select-virtualized";
import ValidationMessages from "../validations/ValidationMessages";

const ReactSelect = ({
  label,
  placeholder,
  options,
  value,
  onChange,
  name,
  optionHeight,
  error,
}) => {
  // Ensure options is an array of objects with 'value' and 'label' properties
  options = options.map((option) => {
    if (typeof option === "string") {
      return {
        label: option,
        value: option,
      };
    }
    return option;
  });

  const selectedOption = options.find((option) => option.value === value);

  return (
    <div className="mb-3">
      {label && (
        <label htmlFor={label} className="form-label">
          {label}
        </label>
      )}
      <VirtualizedSelect
        className={error ? "select-border-handle" : ""}
        label={label}
        placeholder={placeholder}
        options={options}
        value={selectedOption} // Use the selectedOption object
        onChange={(selectedOption) => {
          onChange({
            target: {
              value: selectedOption ? selectedOption.value : "", // Use selectedOption.value if it exists, otherwise set to an empty string
              name,
            },
          });
        }}
        name={name}
        optionHeight={optionHeight}
        invalid={error ? true : false}
      />
      <ValidationMessages errors={error} label={label} />
    </div>
  );
};

export default ReactSelect;
