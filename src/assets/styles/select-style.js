
export const customSelectStyles = (height = "48px", multi = false) => {
  return {
    control: styles => ({
      ...styles,
      backgroundColor: 'white',
      border: '1px solid #A7D8FA',
      borderRadius: '10px',
    }),
    indicatorSeparator: styles => ({ ...styles, backgroundColor: 'transparent' }),
    menu: styles => ({ ...styles, zIndex: 1000 }),
    input: styles => ({ ...styles, height: Number(height) - 10 }),
    placeholder: styles => ({ ...styles }),
    singleValue: (styles) => ({ ...styles }),
    indicatorContainer: (styles) => ({ ...styles, color: "#366EE7" })
  }
}
