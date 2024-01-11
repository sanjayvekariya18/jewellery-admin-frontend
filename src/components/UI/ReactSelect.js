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
  styles,
  isDisabled,
  className,
  variant
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

  const selectedOption = options.find((option) => option.value === value) || null;

  return (
    <div>
      {label && (
        <div style={{ marginBottom: "5px" }}>
          {" "}
          <label htmlFor={label} className="label-class">
            {label}
          </label>
        </div>
      )}
      <VirtualizedSelect
        className={error ? "select-border-handle " + className : className}
        label={label}
        placeholder={placeholder}
        options={options}
        isDisabled={isDisabled}
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
        styles={styles}
        variant={variant}
      // className={className}
      />
      <ValidationMessages errors={error} label={label} />
    </div>
  );
};

export default ReactSelect;
