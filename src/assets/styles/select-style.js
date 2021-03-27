export const customSelectStyles = (
  height = "48px",
  completed = false,
  multi = false
) => {
  return {
    container: (styles) => ({
      ...styles,
    }),
    control: (styles) => ({
      ...styles,
      backgroundColor: completed ? "#f5f7fa" : "white",
      border: completed ? "1px solid #245372" : "1px solid #A7D8FA",
      borderRadius: "10px",
    }),
    indicatorSeparator: (styles) => ({
      ...styles,
      backgroundColor: "transparent",
    }),
    menu: (styles) => ({ ...styles, zIndex: 10000 }),
    input: (styles) => ({ ...styles, height: Number(height) - 10 }),
    placeholder: (styles) => ({ ...styles }),
    singleValue: (styles) => ({ ...styles }),
    indicatorContainer: (styles) => ({ ...styles, color: "#366EE7" }),
  };
};
