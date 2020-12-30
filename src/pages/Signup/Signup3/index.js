import React, { useState, useEffect } from 'react'
import SignatureCanvas from 'react-signature-canvas'
import MorePips from '../MorePips'
import CheckBox from '../../../components/controls/CheckBox'
import './Signup3.scss'

import BasicButton from '../../../components/controls/BasicButton'

//******************************************************************
//*
//* Signup3: function component
//*
//******************************************************************

const Signup3 = (props) => {

  let sigCanvas = null

  const handleSubscriptionAgreementClick = () => {

  }

  const handlePrivatePolicyClick= () => {

  }

  const [nextButtonEnabledValue, setNextButtonEnabledValue] = useState(false)
  const [subscriptionAgreementValue, setSubscriptionAgreementValue] = useState(props.subscriptionAgreement)
  const [privacyPolicyValue, setPrivacyPolicyValue] = useState(props.privacyPolicy)
  const [signatureValue, setSignatureValue] = useState(props.signature)

  useEffect(() => {
    if (subscriptionAgreementValue && privacyPolicyValue &&  signatureValue) {
      setNextButtonEnabledValue(true)
    }
    else {
      setNextButtonEnabledValue(false)
    }
  }, [subscriptionAgreementValue, privacyPolicyValue, signatureValue]);


  return <div className='sixty-creek-signup g-page-background'>
    <div className='g-form-container'>
      <div className='g-caption'>Sign Up</div>
      <div className='g-linear-input-box'>
      </div>
      <div className='g-linear-input-box'>
        <CheckBox marginTop={10} checked={subscriptionAgreementValue} onSelectCheckBox={(checked) => {
          setSubscriptionAgreementValue(checked)
        }}/>
        <div className='g-link-item small underlined g-linear-input-item' onClick={handleSubscriptionAgreementClick}>I agree to the subscription agreement</div>
      </div>
      <div className='g-linear-input-box'>
        <CheckBox marginTop={10} checked={privacyPolicyValue} onSelectCheckBox={(checked) => {
          setPrivacyPolicyValue(checked)
        }} />
        <div className='g-link-item small underlined g-linear-input-item' onClick={handlePrivatePolicyClick}>I agree to the Privacy Policy and Terms of Service</div>
      </div>
      <div className='signature-label'><span className='signature'>Signature</span><span className='clear' onClick={e => {
        sigCanvas.clear()
        setSignatureValue(null)
      }}>Clear</span></div>
      <div className='signature-box'>
        <SignatureCanvas canvasProps={{ width: '400px', height: '100px', className: 'sigCanvas' }}
          onEnd={() => {
            setSignatureValue(sigCanvas.toDataURL())
          }}
          ref={(ref) => {
          if (!sigCanvas) {
            sigCanvas = ref
            if (signatureValue) {
              sigCanvas.fromDataURL(signatureValue)
            }
          }
        }} />
      </div>
      <BasicButton title='Previous' additionalClass='previous-button' enabled={true} buttonPushed={(e) => {
        const signature = sigCanvas.toDataURL()
        props.previous(false, subscriptionAgreementValue, privacyPolicyValue, signature)
      }}
      />
      <BasicButton title='next' additionalClass='next-button' enabled={nextButtonEnabledValue} buttonPushed={(e) => {
        const signature = sigCanvas.toDataURL()
        props.next(true, subscriptionAgreementValue, privacyPolicyValue, signature)
      }}
      />
      <MorePips pipsConfig={props.pipsConfig}/>
    </div>
  </div>
}

export default Signup3