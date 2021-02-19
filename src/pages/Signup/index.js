import React, { useState, useEffect } from "react";
import "./Signup.scss";

import Header from "../../components/Header";
import Signup1 from "./Signup1";
import Signup2 from "./Signup2";
import Signup3 from "./Signup3";

import Singup4 from "./Signup4";
import AccountCreated from "./AccountCreated";

//******************************************************************
//*
//* Signup: function component
//*
//******************************************************************

export const Signup = (props) => {
  const pipsConfig = [
    { current: false, completed: false },
    { current: false, completed: false },
    { current: false, completed: false },
    { current: false, completed: false },
  ];

  function handleCancel() {
    props.history.replace("/login");
  }

  const [pipsConfigValue, setPipsConfigValue] = useState(pipsConfig);
  const [whichPageValue, setWhichPageValue] = useState(1);
  const [firstNameValue, setFirstNameValue] = useState("");
  const [lastNameValue, setLastNameValue] = useState("");
  const [emailAddressValue, setEmailAddressValue] = useState(null);
  const [passwordValue, setPasswordValue] = useState(null);
  const [companyNameValue, setCompanyNameValue] = useState(null);
  const [phoneValue, setPhoneValue] = useState(null);
  const [address1Value, setAddress1Value] = useState(null);
  const [address2Value, setAddress2Value] = useState(null);
  const [cityValue, setCityValue] = useState(null);
  const [stateValue, setStateValue] = useState(null);
  const [zipValue, setZipValue] = useState(null);
  const [subscriptionAgreementValue, setSubscriptionAgreementValue] = useState(
    null
  );
  const [privacyPolicyValue, setPrivacyPolicyValue] = useState(null);
  const [signatureValue, setSignatureValue] = useState(null);

  const handleFirstPage = (
    isNext,
    firstName,
    lastName,
    emailAddress,
    password
  ) => {
    setFirstNameValue(firstName);
    setLastNameValue(lastName);
    setPasswordValue(password);
    setEmailAddressValue(emailAddress);
    if (isNext) {
      setWhichPageValue(whichPageValue + 1);
    }
    pipsConfigValue[0].completed = true;
    pipsConfigValue[0].current = false;
    setPipsConfigValue(pipsConfigValue);
  };

  const handleSecondPage = (
    isNext,
    companyName,
    phone,
    address1,
    address2,
    city,
    state,
    zip
  ) => {
    setCompanyNameValue(companyName);
    setPhoneValue(phone);
    setAddress1Value(address1);
    setAddress2Value(address2);
    setCityValue(city);
    setStateValue(state);
    setZipValue(zip);
    if (isNext) {
      setWhichPageValue(whichPageValue + 1);
    } else {
      setWhichPageValue(whichPageValue - 1);
    }
    pipsConfigValue[1].completed =
      companyName && phone && address1 && city && state && zip;
    pipsConfigValue[1].current = false;
    setPipsConfigValue(pipsConfigValue);
  };

  const handleThirdPage = (
    isNext,
    subscriptionAgreement,
    privacyPolicy,
    signature
  ) => {
    setSubscriptionAgreementValue(subscriptionAgreement);
    setPrivacyPolicyValue(privacyPolicy);
    setSignatureValue(signature);
    pipsConfigValue[2].completed =
      signature && subscriptionAgreement && privacyPolicy;
    pipsConfigValue[2].current = false;
    if (!isNext) {
      setWhichPageValue(whichPageValue - 1);
    } else {
      setWhichPageValue(whichPageValue + 1);
    }
  };

  const handleFourthPage = async (isNext) => {
    if (isNext) {
      setWhichPageValue(whichPageValue + 1);
      pipsConfigValue[3].completed = true;
      pipsConfigValue[3].current = false;
    } else {
      setWhichPageValue(whichPageValue - 1);
    }
    setPipsConfigValue(pipsConfigValue);
  };
  const handleGotoDashboard = () => {};

  const defaultPage = (
    <Signup1
      firstName={firstNameValue}
      lastName={lastNameValue}
      emailAddress={emailAddressValue}
      password={passwordValue}
      next={handleFirstPage}
      cancel={handleCancel}
      pipsConfig={pipsConfig}
    />
  );

  const [currentPageValue, setCurrentPageValue] = useState(defaultPage);

  useEffect(() => {
    let currentPage = null;
    switch (whichPageValue) {
      case 1:
        pipsConfigValue[0].current = true;
        setPipsConfigValue(pipsConfigValue);
        currentPage = (
          <Signup1
            firstName={firstNameValue}
            lastName={lastNameValue}
            emailAddress={emailAddressValue}
            password={passwordValue}
            defaultPasswordConfirm={passwordValue}
            next={handleFirstPage}
            cancel={handleCancel}
            pipsConfig={pipsConfigValue}
          />
        );
        break;
      case 2:
        pipsConfigValue[1].current = true;
        setPipsConfigValue(pipsConfigValue);
        currentPage = (
          <Signup2
            companyName={companyNameValue}
            phone={phoneValue}
            address1={address1Value}
            address2={address2Value}
            city={cityValue}
            state={stateValue}
            zip={zipValue}
            next={handleSecondPage}
            previous={handleSecondPage}
            pipsConfig={pipsConfigValue}
          />
        );
        break;
      case 3:
        pipsConfigValue[2].current = true;
        setPipsConfigValue(pipsConfigValue);
        currentPage = (
          <Signup3
            subscriptionAgreement={subscriptionAgreementValue}
            privacyPolicy={privacyPolicyValue}
            signature={signatureValue}
            next={handleThirdPage}
            previous={handleThirdPage}
            pipsConfig={pipsConfigValue}
          />
        );
        break;
      case 4:
        pipsConfigValue[3].current = true;
        setPipsConfigValue(pipsConfigValue);
        currentPage = (
          <Singup4
            next={() => handleFourthPage(true)}
            previous={() => {
              pipsConfigValue[3].current = false;
              handleFourthPage(false);
            }}
            pipsConfig={pipsConfigValue}
            userInfo={{
              address: {
                city: cityValue,
                country: "US",
                line1: address1Value,
                line2: address2Value,
                postal_code: zipValue,
                state: stateValue,
              },
              email: emailAddressValue,
              name: firstNameValue + " " + lastNameValue,
              phone: phoneValue,
              firstName: firstNameValue,
              lastName: lastNameValue,
              companyName: companyNameValue,
              signature: signatureValue,
            }}
            password={passwordValue}
          />
        );
        break;
      case 5:
        currentPage = (
          <AccountCreated
            gotoDashboard={handleGotoDashboard}
            email={emailAddressValue}
            password={passwordValue}
          />
        );
        break;
      default:
        currentPage = null;
    }
    setCurrentPageValue(currentPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    whichPageValue,
    firstNameValue,
    lastNameValue,
    emailAddressValue,
    passwordValue,
    address1Value,
    address2Value,
    cityValue,
    companyNameValue,
    phoneValue,
    pipsConfigValue,
    privacyPolicyValue,
    signatureValue,
    stateValue,
    subscriptionAgreementValue,
    zipValue,
  ]);

  return (
    <div className="sixty-creek-signup g-page-background">
      <Header />
      <div className="auth-background">
        <div className="g-centered-form-with-header">
          {whichPageValue < 4 && <div className="sign-up-title">Sign Up</div>}
          <div className="g-form-container">{currentPageValue}</div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
