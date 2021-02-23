import React, { useState, useEffect } from "react";
import SignatureCanvas from "react-signature-canvas";
import MorePips from "../MorePips";
import "./Signup3.scss";
import PrivacyPolicy from "./PrivacyPolicy";
import SubscriptionAgreement from "./Subscription";
import { Button, FormCheck, FormLabel, Modal } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { ACTIONS } from "../../../../redux/actionTypes";

//******************************************************************
//*
//* Signup3: function component
//*
//******************************************************************

const Signup3 = ({
  subscriptionAgreement,
  privacyPolicy,
  signature,
  next,
  previous,
  pipsConfig,
}) => {
  let sigCanvas = null;
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [isPrivacy, setIsPrivacy] = useState(true);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch({ type: ACTIONS.SET_SINGUP_STEP, step: "step-1" });
    // eslint-disable-next-line
  }, []);
  const showSubscriptionAgreementModal = (event) => {
    event.stopPropagation();
    event.preventDefault();
    setModalIsOpen(true);
    setIsPrivacy(false);
  };
  const showPrivacyModal = (event) => {
    event.stopPropagation();
    event.preventDefault();
    setModalIsOpen(true);
    setIsPrivacy(true);
  };
  const [nextButtonEnabledValue, setNextButtonEnabledValue] = useState(false);
  const [subscriptionAgreementValue, setSubscriptionAgreementValue] = useState(
    subscriptionAgreement
  );
  const [privacyPolicyValue, setPrivacyPolicyValue] = useState(privacyPolicy);
  const [signatureValue, setSignatureValue] = useState(signature);

  useEffect(() => {
    if (subscriptionAgreementValue && privacyPolicyValue && signatureValue) {
      setNextButtonEnabledValue(true);
    } else {
      setNextButtonEnabledValue(false);
    }
  }, [subscriptionAgreementValue, privacyPolicyValue, signatureValue]);

  return (
    <>
      <div className="checkbox-container mb-4">
        <FormCheck
          custom
          id="subscription-agreement"
          type="checkbox"
          checked={subscriptionAgreementValue}
          onClick={(event) => event.preventDefault()}
          label="I agree to the "
        />
        <span className="agree-item" onClick={showSubscriptionAgreementModal}>
          Subscription Agreement
        </span>
      </div>
      <div className="checkbox-container mb-5">
        <FormCheck
          custom
          id="privacy-policy"
          type="checkbox"
          checked={privacyPolicyValue}
          onClick={(event) => event.preventDefault()}
          label="I agree to the "
        />
        <span className="agree-item" onClick={showPrivacyModal}>
          Privacy Policy and Terms of Service
        </span>
      </div>
      <div className="signature-label">
        <FormLabel className="required mb-0">Signature</FormLabel>
        <span
          className="clear"
          onClick={(e) => {
            sigCanvas.clear();
            setSignatureValue(null);
          }}
        >
          Clear
        </span>
      </div>
      <div className="signature-box">
        <SignatureCanvas
          canvasProps={{
            width: "400px",
            height: "100px",
            className: "sigCanvas",
          }}
          onEnd={() => {
            setSignatureValue(sigCanvas.toDataURL());
          }}
          ref={(ref) => {
            if (!sigCanvas) {
              sigCanvas = ref;
              if (signatureValue) {
                sigCanvas.fromDataURL(signatureValue);
              }
            }
          }}
        />
      </div>
      <div>
        <Button
          disabled={!nextButtonEnabledValue}
          onClick={(e) => {
            const signature = sigCanvas.toDataURL();
            next(
              true,
              subscriptionAgreementValue,
              privacyPolicyValue,
              signature
            );
          }}
          className="mb-3 w-100"
        >
          NEXT
        </Button>
        <Button
          variant="light"
          className="w-100"
          onClick={(e) => {
            const signature = sigCanvas.toDataURL();
            previous(
              false,
              subscriptionAgreementValue,
              privacyPolicyValue,
              signature
            );
          }}
        >
          PREVIOUS
        </Button>
        <MorePips pipsConfig={pipsConfig} />
      </div>
      <Modal show={modalIsOpen} onHide={() => setModalIsOpen(false)} size="lg">
        <Modal.Header>
          <img
            src="/assets/icons/close.svg"
            className="modal-close-btn"
            alt="close"
            onClick={() => setModalIsOpen(false)}
          />
          <Modal.Title>
            {isPrivacy ? "Privacy Policy" : "Subscription Agreement"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {isPrivacy ? <PrivacyPolicy /> : <SubscriptionAgreement />}
          <Button
            className="agree-btn"
            onClick={() => {
              if (isPrivacy) {
                setPrivacyPolicyValue(true);
              } else {
                setSubscriptionAgreementValue(true);
              }
              setModalIsOpen(false);
            }}
          >
            I AGREE
          </Button>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default Signup3;
