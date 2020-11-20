import React, { useState } from 'react'
import './AddMarketingCampaignForm.scss'
import 'react-widgets/lib/scss/react-widgets.scss'
import {CardElement, useStripe, useElements} from '@stripe/react-stripe-js';
import Globalize from 'globalize';
import globalizeLocalizer from 'react-widgets-globalize';
import { Combobox, SelectList, DateTimePicker } from 'react-widgets';

const targetList = [
  { name: 'List 1', targets: ['Target 1', 'Target 2', 'Target 3', 'Target 4', 'Target 5'] },
  { name: 'List 2', targets: ['Target 1', 'Target 2', 'Target 3', 'Target 4', 'Target 5'] },
  { name: 'List 3', targets: ['Target 1', 'Target 2', 'Target 3', 'Target 4', 'Target 5'] },
  { name: 'List 4', targets: ['Target 1', 'Target 2', 'Target 3', 'Target 4', 'Target 5'] },
]

const CARD_OPTIONS = {
  iconStyle: 'solid',
  style: {
    base: {
      iconColor: '#c4f0ff',
      color: '#fff',
      fontWeight: 500,
      fontFamily: 'Roboto, Open Sans, Segoe UI, sans-serif',
      fontSize: '16px',
      fontSmoothing: 'antialiased',
      ':-webkit-autofill': {
        color: '#fce883',
      },
      '::placeholder': {
        color: '#87bbfd',
      },
    },
    invalid: {
      iconColor: '#ffc7ee',
      color: '#ffc7ee',
    },
  },
};

const CardField = ({onChange}) => (
  <div className="FormRow">
    <CardElement options={CARD_OPTIONS} onChange={onChange} />
  </div>
);

const Field = ({
  label,
  id,
  type,
  placeholder,
  required,
  autoComplete,
  value,
  onChange,
}) => 
  (
    <div className='input-box'>
      <div className="label">
        {label}
      </div>
      <div className="input-container">
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          required={required}
          autoComplete={autoComplete}
          value={value}
          onChange={onChange}
        />
      </div>
    </div>
  )

const ErrorMessage = ({children}) => (
  <div className="ErrorMessage" role="alert">
    <svg width="16" height="16" viewBox="0 0 17 17">
      <path
        fill="#FFF"
        d="M8.5,17 C3.80557963,17 0,13.1944204 0,8.5 C0,3.80557963 3.80557963,0 8.5,0 C13.1944204,0 17,3.80557963 17,8.5 C17,13.1944204 13.1944204,17 8.5,17 Z"
      />
      <path
        fill="#6772e5"
        d="M8.5,7.29791847 L6.12604076,4.92395924 C5.79409512,4.59201359 5.25590488,4.59201359 4.92395924,4.92395924 C4.59201359,5.25590488 4.59201359,5.79409512 4.92395924,6.12604076 L7.29791847,8.5 L4.92395924,10.8739592 C4.59201359,11.2059049 4.59201359,11.7440951 4.92395924,12.0760408 C5.25590488,12.4079864 5.79409512,12.4079864 6.12604076,12.0760408 L8.5,9.70208153 L10.8739592,12.0760408 C11.2059049,12.4079864 11.7440951,12.4079864 12.0760408,12.0760408 C12.4079864,11.7440951 12.4079864,11.2059049 12.0760408,10.8739592 L9.70208153,8.5 L12.0760408,6.12604076 C12.4079864,5.79409512 12.4079864,5.25590488 12.0760408,4.92395924 C11.7440951,4.59201359 11.2059049,4.59201359 10.8739592,4.92395924 L8.5,7.29791847 L8.5,7.29791847 Z"
      />
    </svg>
    {children}
  </div>
);

const ResetButton = ({onClick}) => (
  <button type="button" className="ResetButton" onClick={onClick} style={{position: 'absolute', bottom: 20, left: 20}}>
    <svg width="32px" height="32px" viewBox="0 0 32 32">
      <path
        fill="#FFF"
        d="M15,7.05492878 C10.5000495,7.55237307 7,11.3674463 7,16 C7,20.9705627 11.0294373,25 16,25 C20.9705627,25 25,20.9705627 25,16 C25,15.3627484 24.4834055,14.8461538 23.8461538,14.8461538 C23.2089022,14.8461538 22.6923077,15.3627484 22.6923077,16 C22.6923077,19.6960595 19.6960595,22.6923077 16,22.6923077 C12.3039405,22.6923077 9.30769231,19.6960595 9.30769231,16 C9.30769231,12.3039405 12.3039405,9.30769231 16,9.30769231 L16,12.0841673 C16,12.1800431 16.0275652,12.2738974 16.0794108,12.354546 C16.2287368,12.5868311 16.5380938,12.6540826 16.7703788,12.5047565 L22.3457501,8.92058924 L22.3457501,8.92058924 C22.4060014,8.88185624 22.4572275,8.83063012 22.4959605,8.7703788 C22.6452866,8.53809377 22.5780351,8.22873685 22.3457501,8.07941076 L22.3457501,8.07941076 L16.7703788,4.49524351 C16.6897301,4.44339794 16.5958758,4.41583275 16.5,4.41583275 C16.2238576,4.41583275 16,4.63969037 16,4.91583275 L16,7 L15,7 L15,7.05492878 Z M16,32 C7.163444,32 0,24.836556 0,16 C0,7.163444 7.163444,0 16,0 C24.836556,0 32,7.163444 32,16 C32,24.836556 24.836556,32 16,32 Z"
      />
    </svg>
  </button>
);


const AddMarketingCampaignForm = (props) => {
  const { marketingCampaignToUpdate } = props
  const [changedValue, setChangedValue] = useState(false)
  const [idValue, setIdValue] = useState(Math.ceil(Math.random() * 9999999))
  const [titleValue, setTitleValue] = useState('')
  const [targetListValue, setTargetListValue] = useState('')
  const [automatedEmailValue, setAutomatedEmailValue] = useState(false)
  const [automatedTextValue, setAutomatedTextValue] = useState(false)
  const [automatedRinglessVoicemailValue, setAutomatedRinglessVoicemailValue] = useState(false)
  const [automatedPostcardValue, setAutomatedPostcardValue] = useState(false)
  const [startDateTimeValue, setStartDateTimeValue] = useState(new Date())
  const [consentValue, setConsentValue] = useState()

  //stripe

  const [error, setError] = useState(null);
  const [cardComplete, setCardComplete] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [billingDetails, setBillingDetails] = useState({
    email: '',
    phone: '',
    name: '',
  });

  

  const HandleSubmit = async (event) => {
    // Block native form submission.
    event.preventDefault();

    let totalAmount = 0
    if (automatedEmailValue) {
      totalAmount += (.25 * (targetListValue ? targetListValue.targets.length : 0))
    }
    if (automatedPostcardValue) {
      totalAmount += (1.25 * (targetListValue ? targetListValue.targets.length : 0))
    }
    if (automatedTextValue) {
      totalAmount += (.25 * (targetListValue ? targetListValue.targets.length : 0))
    }
    if (automatedRinglessVoicemailValue) {
      totalAmount += (.25 * (targetListValue ? targetListValue.targets.length : 0))
    }

    let stripeError = false
    const stripe = useStripe();
    const elements = useElements();
    if (totalAmount > 0) {

      if (!stripe || !elements) {
        // Stripe.js has not loaded yet. Make sure to disable
        // form submission until Stripe.js has loaded.
        return;
      }

      // Get a reference to a mounted CardElement. Elements knows how
      // to find your CardElement because there can only ever be one of
      // each type of element.
      const cardElement = elements.getElement(CardElement);
      if (error) {
        elements.getElement('card').focus();
        return;
      }
  
      if (cardComplete) {
        setProcessing(true);
      }
  
      const payload = await stripe.createPaymentMethod({
        type: 'card',
        card: elements.getElement(CardElement),
        billing_details: billingDetails,
      });
  
      setProcessing(false);
  
      if (payload.error) {
        setError(payload.error);
        stripeError = true
      } else {
        setPaymentMethod(payload.paymentMethod);
      }
    }

    if (!stripeError) {
      props.addMarketingCampaign({
        id: marketingCampaignToUpdate ? marketingCampaignToUpdate.id : idValue,
        title: titleValue,
        targetList: targetListValue,
        automatedEmail: automatedEmailValue,
        automatedPostCard: automatedPostcardValue,
        automatedText: automatedTextValue,
        automatedRinglessVoicemail: automatedRinglessVoicemailValue,
        total: totalAmount,
        startDateTime: new Date(startDateTimeValue).getTime(),
        consent: consentValue,
      })
    }
  }

  Globalize.load({
    "main": {
      "en-US": {
        "identity": {
          "version": {
            "_cldrVersion": "25",
            "_number": "$Revision: 91 $"
          },
          "generation": {
            "_date": "$Date: 2014-03-13 22:27:12 -0500 (Thu, 13 Mar 2014) $"
          },
          "language": "en"
        },
        "dates": {
          "calendars": {
            "gregorian": {
              "months": {
                "format": {
                  "wide": {
                    "1": "January",
                    "2": "February",
                    "3": "March",
                    "4": "April",
                    "5": "May",
                    "6": "June",
                    "7": "July",
                    "8": "August",
                    "9": "September",
                    "10": "October",
                    "11": "November",
                    "12": "December"
                  },
                  "abbreviated": {
                    "1": "Jan",
                    "2": "Feb",
                    "3": "Mar",
                    "4": "Apr",
                    "5": "May",
                    "6": "Jun",
                    "7": "Jul",
                    "8": "Aug",
                    "9": "Sep",
                    "10": "Oct",
                    "11": "Nov",
                    "12": "Dec"
                  }
                }
              },
              "days": {
                "format": {
                  "abbreviated": {
                    "1": "Sun",
                    "2": "Mon",
                    "3": "Tue",
                    "4": "Wed",
                    "5": "Thu",
                    "6": "Fri",
                    "7": "Sat",
                  }
                }
              },
              "dayPeriods": {
                "format": {
                  "wide": {
                    "am": "AM",
                    "am-alt-variant": "am",
                    "noon": "noon",
                    "pm": "PM",
                    "pm-alt-variant": "pm"
                  }
                }
              },
              "dateFormats": {
                "short": "MM/dd/yyyy",
                "medium": "MMM d, y",
                "full": "MMM d, YYYY"
              },
              "timeFormats": {
                "medium": "h:mm:ss a",
                "short": "hh:mm a",
              },
              "dateTimeFormats": {
                "medium": "{1}, {0}"
              }
            }
          }
        },
        "numbers": {
          "defaultNumberingSystem": "latn",
          "symbols-numberSystem-latn": {
            "group": ",",
            "timeSeparator": ":",
            "infinity": "0",
            "nan": "nan",
            "decimal": ".",
            "percentSign": "%",
            "plusSign": "+",
            "minusSign": "-",
            "exponential": "e",
            "perMille": "?",
          },
          "decimalFormats-numberSystem-latn": {
            "standard": "#,##0.###"
          }
        }
      }
    },
    "supplemental": {
      "version": {
        "_cldrVersion": "25",
        "_number": "$Revision: 91 $"
      },
      "likelySubtags": {
        "en": "en-Latn-US",
      }
    }
  });
  
  Globalize.locale('en-US')
  globalizeLocalizer()

  if (marketingCampaignToUpdate && titleValue !== marketingCampaignToUpdate.title) {
    setIdValue(marketingCampaignToUpdate.id)
    setChangedValue(false)
    setTitleValue(marketingCampaignToUpdate.title)
    setTargetListValue(marketingCampaignToUpdate.targetList)
    setAutomatedEmailValue(marketingCampaignToUpdate.automatedEmail)
    setAutomatedPostcardValue(marketingCampaignToUpdate.automatedPostCard)
    setAutomatedTextValue(marketingCampaignToUpdate.automatedText)
    setAutomatedRinglessVoicemailValue(marketingCampaignToUpdate.automatedRinglessVoicemail)
    setStartDateTimeValue(new Date(marketingCampaignToUpdate.startDateTime))
    setConsentValue(marketingCampaignToUpdate.consent)
  }

  return (
    <div className='add-campaign-form'>
      <div className='title-box'>
        Add a Marketing Campaign
      </div>
      <div className='campaign-sides-container'>
        <div className="left-side">
    
          <div className='input-box'>
            <div className='label'>Title</div>
            <div className='input-container'>
              <input
                value={titleValue}
                onChange={(e) => {
                  setTitleValue(e.target.value)
                  setChangedValue(true)
                }}
                type='text'
                name='title'
              />
            </div>
          </div>
          <div className='input-box'>
            <div className='label'>Target List</div>
            <div className='input-container'>
              <Combobox
                value={targetListValue ? targetListValue.name : ''}
                onChange={(value) => {
                  setTargetListValue(targetList.find(target => { return target.name === value }))
                  setChangedValue(true)
                }}
                data={targetList.map(target => { return target.name })}
              />
            </div>
          </div>
          <div className='input-box'>
            <div className='label'>Start Date/Time</div>
            <div className='input-container'>
              <DateTimePicker
                date={true}
                time={true}
                dropUp={true}
                value={startDateTimeValue}
                onChange={(value) => {
                  setStartDateTimeValue(new Date(value))
                  setChangedValue(true)
                }}
              />
            </div>
          </div>
        </div>
        <div className='middle-side'>
          <div className='input-box'>
            <div className='label'>Automated Email</div>
            <div className='input-container'>
              <SelectList
                value={automatedEmailValue ? 'Yes - $.25 a Target' : 'No'}
                data={['Yes - $.25 a Target', 'No']}
                defaultValue={['No']}
                onChange={(value) => {
                  setAutomatedEmailValue(value !== 'No' ? true : false)
                  setChangedValue(true)
                }}
              />
            </div>
          </div>
          <div className='input-box'>
            <div className='label'>Automated Text</div>
            <div className='input-container'>
              <SelectList
                value={automatedTextValue ? 'Yes - $.25 a Target' : 'No'}
                data={['Yes - $.25 a Target', 'No']}
                defaultValue={['No']}
                onChange={(value) => {
                  setAutomatedTextValue(value !== 'No' ? true : false)
                  setChangedValue(true)
                }}
              />
            </div>
          </div>
          <div className='input-box'>
            <div className='label'>Automated Ringless Voicemail</div>
            <div className='input-container'>
              <SelectList
                value={automatedRinglessVoicemailValue ? 'Yes - $.25 a Target' : 'No'}
                data={['Yes - $.25 a Target', 'No']}
                defaultValue={['No']}
                onChange={(value) => {
                  setAutomatedRinglessVoicemailValue(value !== 'No' ? true : false)
                  setChangedValue(true)
                }}
              />
            </div>
          </div>
          <div className='input-box'>
            <div className='label'>Automated Postcard</div>
            <div className='input-container'>
              <SelectList
                value={automatedPostcardValue ? 'Yes 4X6 $1.25 a Target' : 'No'}
                data={['Yes 4X6 $1.25 a Target', 'No']}
                defaultValue={['No']}
                onChange={(value) => {
                  setAutomatedPostcardValue(value !== 'No' ? true : false)
                  setChangedValue(true)
                }}
              />
            </div>
          </div>
        </div>
        <div className='right-side'>
          <div className='inline-input-box'>
            <div className='label'>Consent</div>
            <div className='inline-input-container'>
              <input type='checkbox' value={consentValue} checked={consentValue} onChange={(e) => {
                setConsentValue(e.target.checked)
                setChangedValue(true)
              }} />
            </div>
          </div>
          <div className='label'>Payment Information</div>
          <Field
            label="Name"
            id="name"
            type="text"
            placeholder="Jane Doe"
            required
            autoComplete="name"
            value={billingDetails.name}
            onChange={(e) => {
              setBillingDetails({ ...billingDetails, name: e.target.value });
            }}
          />
          <Field
            label="Email"
            id="email"
            type="email"
            placeholder="janedoe@gmail.com"
            required
            autoComplete="email"
            value={billingDetails.email}
            onChange={(e) => {
              setBillingDetails({ ...billingDetails, email: e.target.value });
            }}
          />
          <Field
            label="Phone"
            id="phone"
            type="tel"
            placeholder="(941) 555-0123"
            required
            autoComplete="tel"
            value={billingDetails.phone}
            onChange={(e) => {
              setBillingDetails({ ...billingDetails, phone: e.target.value });
            }}
          />
          <div className='input-box'>
            <div className='label'>Automated Postcard</div>
            <div className='input-container'>
              <CardField
                onChange={(e) => {
                  setError(e.error);
                  setCardComplete(e.complete);
                }}
              />
            </div>
          </div>
        </div>
      </div>
      <div className={'add-button' + (changedValue ? ' enabled' : '')} onClick={changedValue ? HandleSubmit : null}>
        {marketingCampaignToUpdate ? 'Update Campaign' : 'Add Campaign'}
      </div>
    </div>
  )
}

export default AddMarketingCampaignForm