import {
  CardCvcElement,
  CardExpiryElement,
  CardNumberElement,
  Elements,
  ElementsConsumer,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { API, graphqlOperation } from "aws-amplify";
import React, { useEffect, useState } from "react";
import { Button, Form, FormText, InputGroup } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  checkout,
  createMarketingCampaign,
  validatePromoCode,
  sendCampaignConfirmEmail,
} from "../../../graphql/mutations";
import { prospectsByProspectListId } from "../../../graphql/queries";
import { QUERY_LIMIT } from "../../../helpers/constants";
import usdCurrencyFormat from "../../../helpers/currencyFormat";
import { messageConvert } from "../../../helpers/messageConvert";
import { APP_URLS } from "../../../helpers/routers";
import { CREATE_CAMPAIGN_ACTIONS } from "../../../redux/actionTypes";
import "./CheckoutStep.scss";
import { SUBSTEP_COMPLETED, _Prices, _Substeps } from "./WizardConstants";
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

const CheckOutForm = ({ stripe, elements }) => {
  const [cardholderName, setCardholderName] = useState("");
  const [coupon, setCoupon] = useState("");
  const [total, setTotal] = useState(0);
  const [cardStatus, setCardStatus] = useState(false);
  const [applyingCoupon, setApplyingCoupon] = useState("APPLY");
  const [submitting, setSubmitting] = useState(false);
  const [couponInfo, setCouponInfo] = useState(null);
  const [discountPrice, setDiscountPrice] = useState(0);

  const [cardNumber, setCardNumber] = useState(false);
  const [cardExpiry, setCardExpiry] = useState(false);
  const [cardCvc, setCardCvc] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const user = useSelector((state) => state.userStore);
  const outreach = useSelector((state) => state.createCampaignStore.outreach);
  const campaignInfo = useSelector((state) => state.createCampaignStore);

  const dispatch = useDispatch();
  const gotoStep = (step) => {
    dispatch({ type: CREATE_CAMPAIGN_ACTIONS.UPDATE_STEP, data: step });
  };

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
    if (outreach) {
      let sum = 0;
      _Substeps.forEach((item) => {
        if (outreach[item.step].status === SUBSTEP_COMPLETED) {
          sum += outreach[item.step].prospects * item.price;
        }
      });
      if (couponInfo) {
        if (couponInfo.redeem_by) {
          let dt = new Date(couponInfo.redeem_by * 1000);
          let today = new Date();
          if (dt < today) {
            setTotal(sum);
            setDiscountPrice(0);
            setErrorMsg("This coupon code has been expired");
            return;
          }
        }
        if (couponInfo.max_redemptions) {
          if (couponInfo.max_redemptions <= couponInfo.times_redeemed) {
            setTotal(sum);
            setDiscountPrice(0);
            setErrorMsg("This coupon code has been expired");
            return;
          }
        }
        if (couponInfo.amount_off) {
          setDiscountPrice(couponInfo.amount_off / 100);
          setTotal(sum - couponInfo.amount_off / 100);
        } else {
          setDiscountPrice((sum * couponInfo.percent_off) / 100);
          setTotal(sum - (sum * couponInfo.percent_off) / 100);
        }
      } else {
        setDiscountPrice(0);
        setTotal(sum);
      }
    }
  }, [outreach, couponInfo]);

  useEffect(() => {
    if (cardNumber && cardExpiry && cardCvc) {
      setCardStatus(true);
    } else {
      setCardStatus(false);
    }
  }, [cardNumber, cardExpiry, cardCvc]);

  const applyCoupon = async () => {
    setApplyingCoupon("APPLYING...");
    setErrorMsg("");
    try {
      let rt = await API.graphql(
        graphqlOperation(validatePromoCode, {
          input: {
            coupon: coupon,
          },
        })
      );
      if (rt.data.validatePromoCode.data) {
        setApplyingCoupon("APPLIED");
        setCouponInfo(rt.data.validatePromoCode.data);
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
  const submit = async () => {
    if (!stripe) {
      return;
    }
    setErrorMsg("");
    setSubmitting(true);
    try {
      const cardElement = elements.getElement(CardNumberElement);

      const { token } = await stripe.createToken(cardElement, {
        name: cardholderName,
      });
      const rt = await API.graphql(
        graphqlOperation(checkout, {
          input: {
            email: user.email,
            token: token.id,
            // amount: total,
            amount: 0,
            description: "Create Campaign",
          },
        })
      );
      if (rt.data.checkout.error) {
        setErrorMsg(messageConvert(rt.data.checkout.error.message));
      } else {
        let data = {
          userId: user.id,
          title: campaignInfo.details.campaignTitle,
          prospectListId: campaignInfo.details.targetList.value,
          startDateTime: {
            day: campaignInfo.timeline.day.value,
            month: campaignInfo.timeline.month.value,
            year: campaignInfo.timeline.year.value,
            hour: campaignInfo.timeline.hour.value,
            minute: campaignInfo.timeline.minute.value,
            am: campaignInfo.timeline.am.value,
          },
          checkout: {
            brand: token.card.brand,
            last4: token.card.last4,
            total: total,
            discount: discountPrice,
            email: user.email,
          },
        };
        let items = [];
        if (outreach.email.status === SUBSTEP_COMPLETED) {
          data["automatedEmail"] = {
            prospects: outreach.email.prospects,
            message: outreach.email.message,
          };
          items.push({
            title: "Automated Email",
            total: (_Prices.email * outreach.email.prospects).toFixed(2),
            price: _Prices.email.toFixed(2),
            prospects: outreach.email.prospects,
          });
        }
        if (outreach.text.status === SUBSTEP_COMPLETED) {
          data["automatedText"] = {
            prospects: outreach.text.prospects,
            text: outreach.text.text,
            phone: outreach.text.phone,
          };
          items.push({
            title: "Automated Text",
            total: (_Prices.text * outreach.text.prospects).toFixed(2),
            price: _Prices.text.toFixed(2),
            prospects: outreach.text.prospects,
          });
        }
        if (outreach.ringlessVoicemail.status === SUBSTEP_COMPLETED) {
          data["automatedRinglessVoiceMail"] = {
            prospects: outreach.ringlessVoicemail.prospects,
            file: outreach.ringlessVoicemail.file,
            phone: outreach.ringlessVoicemail.phone,
          };
          items.push({
            title: "Automated RinglessVoiceMail",
            total: (
              _Prices.ringlessVoicemail * outreach.ringlessVoicemail.prospects
            ).toFixed(2),
            price: _Prices.ringlessVoicemail.toFixed(2),
            prospects: outreach.ringlessVoicemail.prospects,
          });
        }
        if (outreach.postcard.status === SUBSTEP_COMPLETED) {
          data["automatedPostcard"] = {
            prospects: outreach.postcard.prospects,
            file: outreach.postcard.file,
          };
          items.push({
            title: "Automated Postcard",
            total: (_Prices.postcard * outreach.postcard.prospects).toFixed(2),
            price: _Prices.postcard.toFixed(2),
            prospects: outreach.postcard.prospects,
          });
        }
        if (outreach.socialPost.status === SUBSTEP_COMPLETED) {
          data["automatedSocialPost"] = {
            prospects: 0,
            image: outreach.socialPost.image,
            content: outreach.socialPost.content,
          };
          items.push({
            title: "Automated SocialPost",
            total: (_Prices.socialPost * outreach.socialPost.prospects).toFixed(
              2
            ),
            price: _Prices.socialPost.toFixed(2),
            prospects: outreach.socialPost.prospects,
          });
        }

        const createdCampaign = await API.graphql(
          graphqlOperation(createMarketingCampaign, {
            input: data,
          })
        );
        const prospectsInfo = await API.graphql(
          graphqlOperation(prospectsByProspectListId, {
            prospectListId: campaignInfo.details.targetList.value,
            limit: QUERY_LIMIT,
          })
        );
        const emailData = {
          email: user.email,
          name: user.firstName + " " + user.lastName,
          campaignId: createdCampaign.data.createMarketingCampaign.id,
          emailData: {
            prospectList: campaignInfo.details.targetList.label,
            startDate:
              campaignInfo.timeline.day.value +
              "/" +
              campaignInfo.timeline.month.value +
              "/" +
              campaignInfo.timeline.year.value,
            startTime:
              campaignInfo.timeline.hour.value +
              ":" +
              campaignInfo.timeline.minute.value +
              " " +
              campaignInfo.timeline.am.value +
              " MT",
            brand: token.card.brand,
            last4: token.card.last4,
            total: total.toFixed(2),
            link: `${window.location.protocol}//${window.location.host}${APP_URLS.MARKETING}`,
            items: items,
          },
          prospects: (
            prospectsInfo?.data?.prospectsByProspectListId?.items || []
          ).map((item) => ({
            firstName: item.firstName,
            lastName: item.lastName,
            address1: item.address1,
            city: item.city,
            state: item.state,
            zip: item.zip,
            company: item.company,
            phone: item.phone,
            email: item.email,
            facebook: item.facebook,
            status: item.status,
          })),
        };
        const emailInfo = await API.graphql(
          graphqlOperation(sendCampaignConfirmEmail, { input: emailData })
        );
        if (emailInfo.data.sendCampaignConfirmEmail.data) {
          dispatch({
            type: CREATE_CAMPAIGN_ACTIONS.UPDATE_CHECKOUT,
            data: {
              brand: token.card.brand,
              last4: token.card.last4,
              total: total,
              discount: discountPrice,
              email: user.email,
            },
          });
          gotoStep(4);
        } else {
          setErrorMsg(
            messageConvert(emailInfo.data.sendCampaignConfirmEmail.data.message)
          );
        }
      }
    } catch (err) {
      if (typeof err.message === "string") {
        setErrorMsg(messageConvert(err.message));
      } else {
        setErrorMsg(messageConvert(new Error(err).message));
      }
    }
    setSubmitting(false);
  };
  return (
    <>
      <Form.Group>
        <Form.Label className="pl-0">Total</Form.Label>
        {outreach &&
          _Substeps.map(
            (item, idx) =>
              outreach[item.step].status === SUBSTEP_COMPLETED && (
                <div className="total-summary" key={idx}>
                  <div className="automated-type">{item.label}</div>
                  <div className="counts">{outreach[item.step].prospects}</div>
                  <div className="price">
                    {usdCurrencyFormat(
                      outreach[item.step].prospects * item.price
                    )}
                  </div>
                </div>
              )
          )}
        {discountPrice !== 0 && (
          <>
            <hr />
            <div className="total-summary justify-content-between">
              <div className="automated-type">Discount</div>
              <div className="price font-weight-bold">
                {usdCurrencyFormat(discountPrice)}
              </div>
            </div>
          </>
        )}
        <hr />
        <div className="total-summary justify-content-between">
          <div className="automated-type">Total</div>
          <div className="price font-weight-bold">
            {usdCurrencyFormat(total)}
          </div>
        </div>
      </Form.Group>
      <Form.Group>
        <Form.Label>Discount</Form.Label>
        <div className="d-flex">
          <Form.Control
            className={(coupon ? "completed" : "") + " flex-grow-1"}
            value={coupon}
            placeholder="Enter Discount Code"
            onChange={(e) => {
              setErrorMsg("");
              setDiscountPrice(0);
              setCoupon(e.target.value);
            }}
          />
          <Button
            variant="primary"
            className="ml-3"
            onClick={() => applyCoupon()}
            disabled={!coupon || applyingCoupon === "APPLYING..."}
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
          onChange={(e) => setCardholderName(e.target.value)}
        />
      </Form.Group>

      <Button
        variant="primary"
        size="lg"
        className="w-100 mb-3"
        disabled={submitting || !cardholderName || !cardStatus}
        onClick={() => submit()}
      >
        {submitting ? "SUBMITTING..." : "SUBMIT"}
      </Button>
      <Button
        variant="light"
        size="lg"
        className="w-100"
        onClick={() => gotoStep(2)}
      >
        PREVIOUS
      </Button>
    </>
  );
};

const CheckoutStep = () => {
  return (
    <div>
      <Elements stripe={stripePromise}>
        <ElementsConsumer>
          {({ elements, stripe }) => {
            return <CheckOutForm elements={elements} stripe={stripe} />;
          }}
        </ElementsConsumer>
      </Elements>
    </div>
  );
};

export default CheckoutStep;
