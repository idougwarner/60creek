import React, { useEffect, useState } from 'react';
import BasicButton from '../../../components/controls/BasicButton';
import MorePips from '../MorePips';
import './Signup4.scss';
import {
  Elements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  ElementsConsumer
} from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { STRIPE_PUBLIC_KEY } from './config';
import infoIcon from '../../../assets/images/information-circle.svg';
import { API, graphqlOperation } from 'aws-amplify';
import { createPaymentMethod, createStripeSubscription, applyCouponCode } from '../../../graphql/mutations';
const stripePromise = loadStripe(STRIPE_PUBLIC_KEY);

const createOptions = () => {
  return {
    style: {
      base: {
        fontSize: '14px',
        color: '#131624',
        '::placeholder': {
          color: 'rgba(#131624, 0.6)'
        }

      },
      invalid: {
        color: '#c23d4b'
      }
    }
  };
};


const CheckOutForm = ({
  next, previous, pipsConfig,
  email,
  stripe,
  elements,
  userInfo
}) => {
  // const [zipCode, setZipCode] = useState('');
  // const [showZipCode, setShowZipCode] = useState(false);

  const [updating, setUpdating] = useState(false);

  const [monthly, setMonthly] = useState(50);
  const [discount, setDiscount] = useState(0);
  const [cardholderName, setCardholderName] = useState('');
  const [total, setTotal] = useState(50);
  const [discountCode, setDiscountCode] = useState('');
  const [isEnableSubmit, setIsEnableSubmit] = useState(false);
  const [cardStatus, setCardStatus] = useState(false);

  const [cardNumber, setCardNumber] = useState(false);
  const [cardExpiry, setCardExpiry] = useState(false);
  const [cardCvc, setCardCvc] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [createdSubscription, setCreatedSubscription] = useState(false);
  const [applyingCoupon, setApplyingCoupon] = useState('APPLY');

  useEffect(() => {
    if (cardStatus && cardholderName) {
      setIsEnableSubmit(true);
    } else {
      setIsEnableSubmit(false);
    }
  }, [cardStatus, cardholderName])


  const handleChange = (event) => {
    console.log(event);
    if (event.elementType === 'cardNumber') {
      setCardNumber(event.complete);
    } else if (event.elementType === 'cardExpiry') {
      setCardExpiry(event.complete);
    } else if (event.elementType === 'cardCvc') {
      setCardCvc(event.complete);
    }
    if (event.error) {
      setErrorMsg(event.error.message)
    } else {
      setErrorMsg('')
    }
  };

  useEffect(() => {
    if (cardNumber && cardExpiry && cardCvc) {
      setCardStatus(true);
    } else {
      setCardStatus(false);
    }
  }, [cardNumber, cardExpiry, cardCvc])

  useEffect(() => {
    setTotal(monthly - discount)
  }, [monthly, discount])

  const handleSubmit = async () => {
    if (!createdSubscription) {
      if (!stripe) {
        console.error('Stripejs has not loaded yet.');
        return;
      }
      setUpdating(true);
      setErrorMsg('');

      const cardElement = elements.getElement(CardNumberElement);
      try {
        const pm = await stripe.createPaymentMethod({
          type: 'card',
          card: cardElement,
          billing_details: {
            ...userInfo,
            name: cardholderName
          }
        })
        let rt = await API.graphql(graphqlOperation(createStripeSubscription, {
          input: {
            paymentMethodId: pm.paymentMethod.id,
            email: userInfo.email
          }
        }))
        if (rt.data.createStripeSubscription.data) {
          setMonthly(rt.data.createStripeSubscription.data.unitAmount);
          let paymentMethod = await API.graphql(graphqlOperation(createPaymentMethod, {
            input: {
              ...rt.data.createStripeSubscription.data,
              name: userInfo.name,
              address: userInfo.address.address1 + ', ' + userInfo.address.city + ' ' + userInfo.address.state + ' ' + userInfo.address.postal_code,
              phone: userInfo.phone,
              cardType: pm.paymentMethod.card.brand,
              expMonth: pm.paymentMethod.card.exp_month,
              expYear: pm.paymentMethod.card.exp_year,
              last4: pm.paymentMethod.card.last4,
            }
          }))
          setCreatedSubscription(true);
          next();
        } else if (rt.data.createStripeSubscription.error) {
          setErrorMsg(rt.data.createStripeSubscription.error.message);
        }
      } catch (err) {
        setErrorMsg(new Error(err).message)
      }
      setUpdating(false);
    } else {
      next();
    }
  };

  const applyCoupon = async () => {

    if (!stripe) {
      console.error('Stripejs has not loaded yet.');
      return;
    }
    setApplyingCoupon('APPLYING');
    setErrorMsg('');

    const cardElement = elements.getElement(CardNumberElement);
    let pm;
    try {
      const pm = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
        billing_details: {
          ...userInfo,
          name: cardholderName
        }
      })
      let rt = await API.graphql(graphqlOperation(applyCouponCode, {
        input: {
          paymentMethodId: pm.paymentMethod.id,
          email: userInfo.email,
          coupon: discountCode,
        }
      }))
      console.log(rt);
      if (rt.data.applyCouponCode.data) {
        setMonthly(rt.data.applyCouponCode.data.unitAmount);
        setDiscount(rt.data.applyCouponCode.data.discount)
        await API.graphql(graphqlOperation(createPaymentMethod, {
          input: {
            ...rt.data.applyCouponCode.data,
            name: userInfo.name,
            address: userInfo.address.address1 + ', ' + userInfo.address.city + ' ' + userInfo.address.state + ' ' + userInfo.address.postal_code,
            phone: userInfo.phone,
            cardType: pm.paymentMethod.card.brand,
            expMonth: pm.paymentMethod.card.exp_month,
            expYear: pm.paymentMethod.card.exp_year,
            last4: pm.paymentMethod.card.last4,
          }
        }))
        setApplyingCoupon('APPLIED');
        setTimeout(() => {
          setApplyingCoupon('APPLY');
        }, 7000)
        setCreatedSubscription(true);
      } else if (rt.data.applyCouponCode.error) {
        setErrorMsg(rt.data.applyCouponCode.error.message);
        setApplyingCoupon('APPLY');
      }

    } catch (err) {
      setErrorMsg(new Error(err).message);
      setApplyingCoupon('APPLY');
    }

  }

  return (
    <>
      <div className="item">
        <div>
          <div className="item-title">Pay As you go Subscription</div>
          <div className="item-description">${monthly} per Month. Cancel any time</div>
        </div>
        <div className="item-value">${monthly}</div>
      </div>
      <div className="item">
        <div className="item-title">Discount</div>
        <div className="item-value">{discount ? '$' + discount : '-'}</div>
      </div>
      <div className="item mb-4">
        <div className="item-title">Total</div>
        <div className="item-value">${total}</div>
      </div>
      <div className="d-flex align-items-center w-100">
        <div className='g-input-box flex-grow'>
          <div className='g-input-label'>Discount</div>
          <input className='g-input-container'
            type='text'
            placeholder='Enter Discount Code'
            value={discountCode}
            onChange={(e) => {
              setDiscountCode(e.target.value)
            }} />
        </div>
        <button className="g-link-item mx-2 apply-btn" onClick={() => applyCoupon()}
          disabled={!discountCode || !isEnableSubmit || applyingCoupon == 'APPLYING...'}>
          {applyingCoupon}</button>
      </div>
      <div className="g-error-label" style={{ fontSize: 14, marginBottom: 24 }}>{errorMsg}</div>
      <div className='g-input-box'>
        <div className='g-input-label required'>Credit Card Number</div>
        <CardNumberElement
          className={"g-input-container card-number " + (cardNumber ? 'completed' : '')}
          options={{ ...createOptions(), placeholder: "Card Number" }}
          onChange={handleChange}
        />
      </div>
      <div className='g-form-line'>
        <div className='g-input-box g-half-input-box'>
          <div className='g-input-label required '>Expires</div>
          <CardExpiryElement
            className={"g-input-container " + (cardExpiry ? 'completed' : '')}
            options={createOptions()}
            onChange={handleChange}
          />
        </div>
        <div className='g-input-box g-half-input-box'>
          <div className='g-input-label required d-flex align-items-center'>
            Security Code
            <img src={infoIcon} className="ml-2" />
          </div>
          <CardCvcElement
            className={"g-input-container " + (cardCvc ? 'completed' : '')}
            options={{ ...createOptions(), placeholder: "Enter Code" }} onChange={handleChange} />
        </div>
      </div>

      <div className='g-input-box'>
        <div className='g-input-label required'>Cardholder Name</div>
        <input
          className={"g-input-container " + (cardholderName ? 'completed' : '')}
          type='text'
          placeholder='Enter Full Name'
          value={cardholderName}
          onChange={(e) => {
            setCardholderName(e.target.value)
          }} />
      </div>
      <div>
        <BasicButton title={updating ? 'SUBMITTING ...' : 'SUBMIT'} additionalClass='next-button' enabled={isEnableSubmit && !updating && applyingCoupon !== 'APPLYING...'}
          buttonPushed={(e) => { handleSubmit() }}
        />
        <BasicButton title='Previous' additionalClass='previous-button' enabled={true} buttonPushed={(e) => {
          previous(false)
        }}
        />
        <MorePips pipsConfig={pipsConfig} />
      </div>
    </>
  );
};

const InjectedCheckoutForm = ({ next, previous, pipsConfig, userInfo }) => {
  return (
    <ElementsConsumer>
      {({ elements, stripe }) => {
        return (
          <CheckOutForm elements={elements} stripe={stripe}
            next={next} previous={previous} pipsConfig={pipsConfig} userInfo={userInfo} />
        );
      }}
    </ElementsConsumer>
  );
};

const Singup4 = ({ next, previous, pipsConfig, userInfo }) => {
  return <div className="signup4-container">

    <Elements stripe={stripePromise}>
      <InjectedCheckoutForm next={next} previous={previous} pipsConfig={pipsConfig} userInfo={userInfo} />
    </Elements>
  </div>
}

export default Singup4;