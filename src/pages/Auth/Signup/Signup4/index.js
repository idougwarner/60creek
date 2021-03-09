import React, { useEffect, useState } from "react";
import MorePips from "../MorePips";
import "./Signup4.scss";
import {
  Elements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  ElementsConsumer,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { API, Auth, graphqlOperation } from "aws-amplify";
import {
  createPaymentMethod,
  createStripeSubscription,
  createUser,
  validatePromoCode,
} from "../../../../graphql/mutations";
import { subscriptionInfo } from "../../../../graphql/queries";
import { Button, Form, FormText, InputGroup, Spinner } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { ACTIONS } from "../../../../redux/actionTypes";
import { messageConvert } from "../../../../helpers/messageConvert";
import InfoTooltip from "../../../../components/controls/InfoTooltip";
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
  next,
  previous,
  pipsConfig,
  stripe,
  elements,
  userInfo,
  password,
}) => {
  // const [zipCode, setZipCode] = useState('');
  // const [showZipCode, setShowZipCode] = useState(false);

  const [updating, setUpdating] = useState(false);
  const [loading, setLoading] = useState(false);

  const [monthly, setMonthly] = useState(50);
  const [cardholderName, setCardholderName] = useState("");
  const [total, setTotal] = useState(50);
  const [discountCode, setDiscountCode] = useState("");
  const [isEnableSubmit, setIsEnableSubmit] = useState(false);
  const [cardStatus, setCardStatus] = useState(false);

  const [cardNumber, setCardNumber] = useState(false);
  const [cardExpiry, setCardExpiry] = useState(false);
  const [cardCvc, setCardCvc] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [applyingCoupon, setApplyingCoupon] = useState("APPLY");
  const [couponInfo, setCouponInfo] = useState(null);

  const dispatch = useDispatch();

  useEffect(() => {
    if (cardStatus && cardholderName) {
      setIsEnableSubmit(true);
    } else {
      setIsEnableSubmit(false);
    }
  }, [cardStatus, cardholderName]);

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

  useEffect(() => {
    if (couponInfo) {
      if (couponInfo.redeem_by) {
        let dt = new Date(couponInfo.redeem_by * 1000);
        let today = new Date();
        if (dt < today) {
          setTotal(monthly);
          setErrorMsg("This promo code has been expired");
          return;
        }
      }
      if (couponInfo.max_redemptions) {
        if (couponInfo.max_redemptions <= couponInfo.times_redeemed) {
          setTotal(monthly);
          setErrorMsg("This promo code has been expired");
          return;
        }
      }
      if (couponInfo.amount_off) {
        setTotal(monthly - couponInfo.amount_off / 100);
      } else {
        setTotal(monthly - (monthly * couponInfo.percent_off) / 100);
      }
    } else {
      setTotal(monthly);
    }
  }, [monthly, couponInfo]);
  const loadMonthlyInfo = async () => {
    for (;;) {
      try {
        setLoading(true);
        const rt = await API.graphql(graphqlOperation(subscriptionInfo));
        if (rt.data.subscriptionInfo.data) {
          setMonthly(rt.data.subscriptionInfo.data.unit_amount / 100);
          setLoading(false);
          return;
        }
      } catch (err) {}
    }
  };
  useEffect(() => {
    loadMonthlyInfo();
  }, []);
  const handleSubmit = async () => {
    if (!stripe) {
      console.error("Stripejs has not loaded yet.");
      return;
    }
    setUpdating(true);
    setErrorMsg("");

    const cardElement = elements.getElement(CardNumberElement);
    try {
      const pm = await stripe.createPaymentMethod({
        type: "card",
        card: cardElement,
        billing_details: {
          address: userInfo.address,
          email: userInfo.email,
          phone: userInfo.phone,
          name: cardholderName,
        },
      });
      let rt = await API.graphql(
        graphqlOperation(createStripeSubscription, {
          input: {
            paymentMethodId: pm.paymentMethod.id,
            email: userInfo.email,
            coupon: couponInfo ? couponInfo.id : null,
          },
        })
      );
      if (rt.data.createStripeSubscription.data) {
        await API.graphql(
          graphqlOperation(createPaymentMethod, {
            input: {
              ...rt.data.createStripeSubscription.data,
              name: userInfo.name,
              address:
                userInfo.address.address1 +
                ", " +
                userInfo.address.city +
                " " +
                userInfo.address.state +
                " " +
                userInfo.address.postal_code,
              phone: userInfo.phone,
              cardType: pm.paymentMethod.card.brand,
              expMonth: pm.paymentMethod.card.exp_month,
              expYear: pm.paymentMethod.card.exp_year,
              last4: pm.paymentMethod.card.last4,
            },
          })
        );

        const signupResult = await Auth.signUp({
          username: userInfo.email,
          password: password,
          attributes: {
            email: userInfo.email,
            name: userInfo.name,
          },
        });
        const newUser = {
          firstName: userInfo.firstName,
          lastName: userInfo.lastName,
          company: userInfo.companyName,
          address1: userInfo.address.line1,
          address2: userInfo.address.line2,
          city: userInfo.address.city,
          state: userInfo.address.state,
          zip: userInfo.address.postal_code,
          phone: userInfo.phone,
          email: userInfo.email,
          signature: userInfo.signature,
          cognitoUserName: signupResult.userSub,
          receiveEmail: true,
          code: "-",
        };
        await Auth.signIn(userInfo.email, password);
        const createdUserInfo = await API.graphql(
          graphqlOperation(createUser, { input: newUser })
        );

        if (createdUserInfo?.data?.createUser) {
          dispatch({
            type: ACTIONS.SET_USER,
            user: createdUserInfo.data.createUser,
          });
        }

        dispatch({ type: ACTIONS.SET_SINGUP_STEP, step: "completed" });
        next();
      } else if (rt.data.createStripeSubscription.error) {
        setErrorMsg(
          messageConvert(rt.data.createStripeSubscription.error.message)
        );
      }
    } catch (err) {
      if (typeof err.message === "string") {
        setErrorMsg(messageConvert(err.message));
      } else {
        setErrorMsg(messageConvert(new Error(err).message));
      }
    }
    setUpdating(false);
  };

  const applyCoupon = async () => {
    setApplyingCoupon("APPLYING");
    setErrorMsg("");

    try {
      let rt = await API.graphql(
        graphqlOperation(validatePromoCode, {
          input: {
            coupon: discountCode,
          },
        })
      );
      if (rt.data.validatePromoCode.data) {
        setApplyingCoupon("APPLIED");
        setCouponInfo(rt.data.validatePromoCode.data);
        setTimeout(() => {
          setApplyingCoupon("APPLY");
        }, 7000);
      } else if (rt.data.validatePromoCode.error) {
        setCouponInfo(null);
        setErrorMsg(messageConvert(rt.data.validatePromoCode.error.message));
        setApplyingCoupon("APPLY");
      }
    } catch (err) {
      setErrorMsg(messageConvert(new Error(err).message));
      setApplyingCoupon("APPLY");
    }
  };

  return (
    <>
      <div className="item">
        <div>
          <div className="item-title">Pay As you go Subscription</div>
          {!loading && (
            <div className="item-description">
              ${monthly} per Month. Cancel any time
            </div>
          )}
        </div>
        {loading ? (
          <Spinner animation="border" variant="primary" size="sm" />
        ) : (
          <div className="item-value">${monthly}</div>
        )}
      </div>
      <div className="item">
        <div className="item-title">Discount</div>
        {couponInfo ? (
          <div className="item-value">
            $
            {couponInfo.amount_off
              ? couponInfo.amount_off / 100
              : (monthly * couponInfo.percent_off) / 100}
          </div>
        ) : (
          "-"
        )}
      </div>
      <div className="item mb-4">
        <div className="item-title">Total</div>
        {!loading && <div className="item-value">${total}</div>}
      </div>
      <Form.Group>
        <Form.Label>Discount</Form.Label>
        <div className="d-flex">
          <Form.Control
            className={discountCode ? "completed" : ""}
            value={discountCode}
            placeholder="Enter Discount Code"
            onChange={(e) => {
              setErrorMsg("");
              setDiscountCode(e.target.value);
            }}
          />
          <Button
            variant="light"
            className="ml-3"
            onClick={() => applyCoupon()}
            disabled={!discountCode || applyingCoupon === "APPLYING..."}
          >
            {applyingCoupon}
          </Button>
        </div>
      </Form.Group>
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
            <Form.Label className="required">
              Security Code{" "}
              <InfoTooltip description="Usually a 3 - or 4 - digit number found printed on the back of your credit card." />
            </Form.Label>
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
          onChange={(e) => setCardholderName(e.target.value)}
        />
      </Form.Group>

      <div>
        <Button
          className="w-100 mb-3"
          disabled={
            !isEnableSubmit || updating || applyingCoupon === "APPLYING..."
          }
          onClick={(e) => {
            handleSubmit();
          }}
        >
          {updating ? "SUBMITTING ..." : "SUBMIT"}
        </Button>
        <Button
          variant="light"
          className="w-100"
          onClick={(e) => {
            previous(false);
          }}
        >
          PREVIOUS
        </Button>
        <MorePips pipsConfig={pipsConfig} />
      </div>
    </>
  );
};

const InjectedCheckoutForm = ({
  next,
  previous,
  pipsConfig,
  userInfo,
  password,
}) => {
  return (
    <ElementsConsumer>
      {({ elements, stripe }) => {
        return (
          <CheckOutForm
            elements={elements}
            stripe={stripe}
            password={password}
            next={next}
            previous={previous}
            pipsConfig={pipsConfig}
            userInfo={userInfo}
          />
        );
      }}
    </ElementsConsumer>
  );
};

const Singup4 = ({ next, previous, pipsConfig, userInfo, password }) => {
  return (
    <div className="signup4-container">
      <Elements stripe={stripePromise}>
        <InjectedCheckoutForm
          next={next}
          previous={previous}
          pipsConfig={pipsConfig}
          userInfo={userInfo}
          password={password}
        />
      </Elements>
    </div>
  );
};

export default Singup4;
