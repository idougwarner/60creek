import React, { useState, useEffect, useCallback } from "react";
import MorePips from "../MorePips";
import "./Signup2.scss";
import Select from "react-select";
import { usStates } from "../../../../helpers/us-states";
import { customSelectStyles } from "../../../../assets/styles/select-style";
import { Button, FormControl, FormGroup, FormLabel } from "react-bootstrap";

import InputMask from "react-input-mask";
import { useDispatch } from "react-redux";
import { ACTIONS } from "../../../../redux/actionTypes";
import { validateZip } from "../../../../helpers/validations";

//******************************************************************
//*
//* Signup2: function component
//*
//******************************************************************

const Signup2 = (props) => {
  const [companyNameValue, setCompanyNameValue] = useState(props.companyName);
  const [phoneValue, setPhoneValue] = useState(props.phone);
  const [address1Value, setAddress1Value] = useState(props.address1);
  const [address2Value, setAddress2Value] = useState(props.address2);
  const [cityValue, setCityValue] = useState(props.city);
  const [stateValue, setStateValue] = useState(
    props?.state
      ? {
          value: props.state,
          label: props.state,
        }
      : null
  );
  const [zipValue, setZipValue] = useState(props.zip);
  const [nextButtonEnabledValue, setNextButtonEnabledValue] = useState(false);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch({ type: ACTIONS.SET_SINGUP_STEP, step: "step-2" });
    // eslint-disable-next-line
  }, []);
  const isValidZip = useCallback(() => {
    return validateZip(zipValue);
  }, [zipValue]);
  const isValidPhone = () => {
    if (phoneValue.indexOf("_") < 0) {
      return true;
    }
    return false;
  };
  useEffect(() => {
    if (
      companyNameValue &&
      phoneValue &&
      isValidPhone() &&
      address1Value &&
      cityValue &&
      stateValue &&
      zipValue &&
      isValidZip()
    ) {
      setNextButtonEnabledValue(true);
    } else {
      setNextButtonEnabledValue(false);
    }
    // eslint-disable-next-line
  }, [
    companyNameValue,
    phoneValue,
    address1Value,
    address2Value,
    cityValue,
    stateValue,
    zipValue,
  ]);

  return (
    <>
      <FormGroup controlId="companyName">
        <FormLabel className="required">Company Name</FormLabel>
        <FormControl
          type="text"
          placeholder="Enter Company Name"
          value={companyNameValue}
          className={companyNameValue ? "completed" : ""}
          onChange={(e) => setCompanyNameValue(e.target.value)}
        />
      </FormGroup>
      <FormGroup controlId="phoneNumber">
        <FormLabel className="required">Phone Number</FormLabel>

        <InputMask
          mask="(999) 999 - 9999"
          value={phoneValue}
          type="tel"
          placeholder="Enter Phone Number"
          onChange={(e) => setPhoneValue(e.target.value)}
        >
          {(inputProps) => (
            <FormControl
              {...inputProps}
              className={phoneValue ? "completed" : ""}
              isInvalid={phoneValue && !isValidPhone()}
            />
          )}
        </InputMask>
      </FormGroup>
      <FormGroup controlId="streetAddress">
        <FormLabel className="required">Street Address</FormLabel>
        <FormControl
          type="text"
          placeholder="Enter Street Address"
          value={address1Value}
          className={address1Value ? "completed" : ""}
          onChange={(e) => setAddress1Value(e.target.value)}
        />
      </FormGroup>
      <FormGroup controlId="address2">
        <FormLabel>Address Line 2</FormLabel>
        <FormControl
          type="text"
          placeholder="Enter Apt, Suite, Etc"
          value={address2Value}
          className={address2Value ? "completed" : ""}
          onChange={(e) => setAddress2Value(e.target.value)}
        />
      </FormGroup>
      <div className="row">
        <div className="col-6 pr-2">
          <FormGroup controlId="city">
            <FormLabel className="required">City</FormLabel>
            <FormControl
              type="text"
              placeholder="Enter City"
              value={cityValue}
              className={cityValue ? "completed" : ""}
              onChange={(e) => setCityValue(e.target.value)}
            />
          </FormGroup>
        </div>
        <div className="col-3 pr-2 pl-2">
          <FormGroup controlId="state">
            <FormLabel className="required">State</FormLabel>
            <Select
              value={stateValue}
              onChange={(value) => {
                setStateValue(value);
              }}
              placeholder="State"
              styles={customSelectStyles(40, stateValue?.value ? true : false)}
              options={usStates.map((item) => ({ value: item, label: item }))}
            />
          </FormGroup>
        </div>
        <div className="col-3 pl-2">
          <FormGroup controlId="zip">
            <FormLabel className="required">Zip</FormLabel>
            <FormControl
              type="text"
              placeholder="Zip"
              value={zipValue}
              className={zipValue ? "completed" : ""}
              onChange={(e) => setZipValue(e.target.value)}
              isInvalid={zipValue && !isValidZip()}
            />
          </FormGroup>
        </div>
      </div>
      <Button
        onClick={(e) => {
          props.next(
            true,
            companyNameValue,
            phoneValue,
            address1Value,
            address2Value,
            cityValue,
            stateValue?.value,
            zipValue
          );
        }}
        className="mb-3"
        disabled={!nextButtonEnabledValue}
      >
        NEXT
      </Button>
      <Button
        variant="light"
        onClick={(e) => {
          props.previous(
            false,
            companyNameValue,
            phoneValue,
            address1Value,
            address2Value,
            cityValue,
            stateValue?.value,
            zipValue
          );
        }}
      >
        PREVIOUS
      </Button>
      <MorePips pipsConfig={props.pipsConfig} />
    </>
  );
};

export default Signup2;
