import React, { useEffect, useState } from "react";
import {
  Elements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  ElementsConsumer,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { Form, FormText, InputGroup } from "react-bootstrap";
import { messageConvert } from "../../helpers/messageConvert";
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

const createOptions = () => {
  return {
    style: {
      base: {
        fontSize: "14px",
        color: "#131624",
        "::placeholder": {
          color: "rgba(#131624, 0.6)",
        },
      },
      invalid: {
        color: "#c23d4b",
      },
    },
  };
};

const CheckOutForm = ({
  stripe,
  elements,
  changePaymentMethod,
  itemCounts,
  generateToken,
  changeCardStatus,
}) => {
  const [cardholderName, setCardholderName] = useState("");
  const [total, setTotal] = useState(0);
  const [cardStatus, setCardStatus] = useState(false);

  const [cardNumber, setCardNumber] = useState(false);
  const [cardExpiry, setCardExpiry] = useState(false);
  const [cardCvc, setCardCvc] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    setTotal(1 * itemCounts);
  }, [itemCounts]);
  const handleChange = (event) => {
    if (event.elementType === "cardNumber") {
      setCardNumber(event.complete);
    } else if (event.elementType === "cardExpiry") {
      setCardExpiry(event.complete);
    } else if (event.elementType === "cardCvc") {
      setCardCvc(event.complete);
    }
    if (event.error) {
      setErrorMsg(event.error.message);
    } else {
      setErrorMsg("");
    }
  };

  useEffect(() => {
    if (cardNumber && cardExpiry && cardCvc) {
      setCardStatus(true);
    } else {
      setCardStatus(false);
    }
  }, [cardNumber, cardExpiry, cardCvc]);

  const getPaymentMethod = () => {
    return new Promise(async (resolver, reject) => {
      if (!stripe) {
        changePaymentMethod(null);
        return;
      }
      setErrorMsg("");

      const cardElement = elements.getElement(CardNumberElement);
      try {
        const pm = await stripe.createPaymentMethod({
          type: "card",
          card: cardElement,
          billing_details: {
            name: cardholderName,
          },
        });
        changePaymentMethod(pm.paymentMethod.id);
        return resolver(pm.paymentMethod.id);
      } catch (err) {
        if (typeof err.message === "string") {
          setErrorMsg(messageConvert(err.message));
        } else {
          setErrorMsg(messageConvert(new Error(err).message));
        }
        changePaymentMethod(null);
        return reject(err);
      }
    });
  };

  useEffect(() => {
    getPaymentMethod();
    // eslint-disable-next-line
  }, [generateToken]);

  useEffect(() => {
    if (cardStatus && cardholderName) {
      changeCardStatus(true);
    } else {
      changeCardStatus(false);
    }

    changePaymentMethod(null);
    // eslint-disable-next-line
  }, [cardStatus, cardholderName]);

  return (
    <>
      <div className="item mb-3">
        <div className="item-title">Total</div>
        <div className="item-value">${total}</div>
      </div>
      <FormText className="text-danger mb-3">{errorMsg}</FormText>
      <Form.Group>
        <Form.Label className="required">Credit Card Number</Form.Label>
        <InputGroup>
          <InputGroup.Prepend>
            <img src="/assets/icons/credit-card.svg" alt="credit-card" />
          </InputGroup.Prepend>
          <CardNumberElement
            className={"form-control " + (cardNumber ? "completed" : "")}
            options={{ ...createOptions(), placeholder: "Card Number" }}
            onChange={handleChange}
          />
        </InputGroup>
      </Form.Group>
      <div className="row">
        <div className="col-6">
          <Form.Group>
            <Form.Label className="required">Expires</Form.Label>
            <CardExpiryElement
              className={"form-control " + (cardExpiry ? "completed" : "")}
              options={{ ...createOptions() }}
              onChange={handleChange}
            />
          </Form.Group>
        </div>
        <div className="col-6">
          <Form.Group>
            <Form.Label className="required">Security Code</Form.Label>
            <CardCvcElement
              className={"form-control " + (cardCvc ? "completed" : "")}
              options={{ ...createOptions(), placeholder: "Enter Code" }}
              onChange={handleChange}
            />
          </Form.Group>
        </div>
      </div>
      <Form.Group>
        <Form.Label className="required">Cardholder Name</Form.Label>
        <Form.Control
          className={cardholderName ? "completed" : ""}
          value={cardholderName}
          placeholder="Enter Full Name"
          onChange={(e) => {
            setCardholderName(e.target.value);
          }}
        />
      </Form.Group>
    </>
  );
};

const InjectedCheckoutForm = ({
  changeCardStatus,
  changePaymentMethod,
  itemCounts,
  generateToken,
}) => {
  return (
    <ElementsConsumer>
      {({ elements, stripe }) => {
        return (
          <CheckOutForm
            elements={elements}
            generateToken={generateToken}
            stripe={stripe}
            itemCounts={itemCounts}
            changePaymentMethod={changePaymentMethod}
            changeCardStatus={changeCardStatus}
          />
        );
      }}
    </ElementsConsumer>
  );
};

const CheckoutForm = ({
  changePaymentMethod,
  itemCounts,
  generateToken,
  changeCardStatus,
}) => {
  return (
    <div className="signup4-container">
      <Elements stripe={stripePromise}>
        <InjectedCheckoutForm
          generateToken={generateToken}
          itemCounts={itemCounts}
          changePaymentMethod={changePaymentMethod}
          changeCardStatus={changeCardStatus}
        />
      </Elements>
    </div>
  );
};

export default CheckoutForm;
