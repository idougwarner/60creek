import React, { useState, useEffect } from "react";
import SignatureCanvas from "react-signature-canvas";
import MorePips from "../MorePips";
import "./Signup3.scss";

import BasicButton from "../../../components/controls/BasicButton";

import Modal from "react-modal";
import PrivacyPolicy from "./PrivacyPolicy";
import SubscriptionAgreement from "./Subscription";
import { FormCheck, FormLabel } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { ACTIONS } from "../../../redux/actionTypes";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    padding: 0,
    width: "calc(100% - 40px)",
    maxWidth: "930px",
  },
  overlay: {
    zIndex: 1000,
    background: "rgba(19, 22, 36, 0.6)",
    backdropFilter: "blur(4px)",
  },
};

Modal.setAppElement("#modal-container");

//******************************************************************
//*
//* Signup3: function component
//*
//******************************************************************

const Signup3 = (props) => {
  let sigCanvas = null;
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [isPrivacy, setIsPrivacy] = useState(true);
  const [visitedSubscription, setVisitedSubscription] = useState(false);
  const [visitedPrivacy, setVisitedPrivacy] = useState(false);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch({ type: ACTIONS.SET_SINGUP_STEP, step: "step-1" });
  }, []);
  const showSubscriptionAgreementModal = (event) => {
    event.stopPropagation();
    event.preventDefault();
    setModalIsOpen(true);
    setIsPrivacy(false);
    setVisitedSubscription(true);
  };
  const showPrivacyModal = (event) => {
    event.stopPropagation();
    event.preventDefault();
    setModalIsOpen(true);
    setIsPrivacy(true);
    setVisitedPrivacy(true);
  };
  const [nextButtonEnabledValue, setNextButtonEnabledValue] = useState(false);
  const [subscriptionAgreementValue, setSubscriptionAgreementValue] = useState(
    props.subscriptionAgreement
  );
  const [privacyPolicyValue, setPrivacyPolicyValue] = useState(
    props.privacyPolicy
  );
  const [signatureValue, setSignatureValue] = useState(props.signature);

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
          onChange={(event) =>
            setSubscriptionAgreementValue(event.target.checked)
          }
          disabled={!visitedSubscription}
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
          disabled={!visitedPrivacy}
          onChange={(event) => setPrivacyPolicyValue(event.target.checked)}
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
        <BasicButton
          title="next"
          additionalClass="next-button"
          enabled={nextButtonEnabledValue}
          buttonPushed={(e) => {
            const signature = sigCanvas.toDataURL();
            props.next(
              true,
              subscriptionAgreementValue,
              privacyPolicyValue,
              signature
            );
          }}
        />
        <BasicButton
          title="Previous"
          additionalClass="previous-button"
          enabled={true}
          buttonPushed={(e) => {
            const signature = sigCanvas.toDataURL();
            props.previous(
              false,
              subscriptionAgreementValue,
              privacyPolicyValue,
              signature
            );
          }}
        />
        <MorePips pipsConfig={props.pipsConfig} />
      </div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        style={customStyles}
        contentLabel="Example Modal"
      >
        {isPrivacy ? <PrivacyPolicy /> : <SubscriptionAgreement />}
      </Modal>
    </>
  );
};

export default Signup3;
