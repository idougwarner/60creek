import React from "react";
import { Button, Modal } from "react-bootstrap";
import { _Prices } from "../Marketing/Wizard/WizardConstants";

const ViewCampaignModal = ({ show, close, data }) => {
  const downloadPdf = () => {};
  return (
    <>
      <Modal show={show} onHide={close}>
        <Modal.Header closeButton>
          <Modal.Title>{data?.title}</Modal.Title>
        </Modal.Header>
        {data && (
          <Modal.Body>
            <div className="text-muted">
              Order Placed on <br />
              {new Date(data.createdAt).toLocaleDateString() + " @ "}
              {new Date(data.createdAt).toLocaleTimeString()}
            </div>
            <hr />
            <div className="d-flex justify-content-between mb-3">
              <div className="text-muted">Prospect List</div>
              <div className="font-weight-bold">{data.prospectList.name}</div>
            </div>
            <div className="d-flex justify-content-between mb-3">
              <div className="text-muted">Start Date</div>
              <div className="font-weight-bold">
                {data.startDateTime.month}/{data.startDateTime.day}/
                {data.startDateTime.year}
              </div>
            </div>
            <div className="d-flex justify-content-between mb-3">
              <div className="text-muted">Start Time</div>
              <div className="font-weight-bold">
                {data.startDateTime.hour}:{data.startDateTime.minute + " "}
                {data.startDateTime.am + " MST"}
              </div>
            </div>
            <hr />

            {data.automatedEmail && (
              <div className="d-flex justify-content-between mb-3">
                <div className="text-muted">Automated Email</div>
                <div>
                  <div className="font-weight-bold text-right">
                    ${data.automatedEmail.prospects * _Prices.email}
                  </div>
                  <div className="text-muted text-right">
                    (${_Prices.email}x{data.automatedEmail.prospects})
                  </div>
                </div>
              </div>
            )}
            {data.automatedText && (
              <div className="d-flex justify-content-between mb-3">
                <div className="text-muted">Automated Text</div>
                <div>
                  <div className="font-weight-bold text-right">
                    ${data.automatedText.prospects * _Prices.text}
                  </div>
                  <div className="text-muted text-right">
                    (${_Prices.text}x{data.automatedText.prospects})
                  </div>
                </div>
              </div>
            )}
            {data.automatedRinglessVoiceMail && (
              <div className="d-flex justify-content-between mb-3">
                <div className="text-muted">Automated Ringless Voicemail</div>
                <div>
                  <div className="font-weight-bold text-right">
                    $
                    {data.automatedRinglessVoiceMail.prospects *
                      _Prices.ringlessVoicemail}
                  </div>
                  <div className="text-muted text-right">
                    (${_Prices.ringlessVoicemail}x
                    {data.automatedRinglessVoiceMail.prospects})
                  </div>
                </div>
              </div>
            )}
            {data.automatedPostcard && (
              <div className="d-flex justify-content-between mb-3">
                <div className="text-muted">Automated Postcard</div>
                <div>
                  <div className="font-weight-bold text-right">
                    ${data.automatedPostcard.prospects * _Prices.postcard}
                  </div>
                  <div className="text-muted text-right">
                    (${_Prices.postcard}x{data.automatedPostcard.prospects})
                  </div>
                </div>
              </div>
            )}
            {data.automatedSocialPost && (
              <div className="d-flex justify-content-between mb-3">
                <div className="text-muted">Automated SocialPost</div>
                <div>
                  <div className="font-weight-bold text-right">
                    ${data.automatedSocialPost.prospects * _Prices.socialPost}
                  </div>
                  <div className="text-muted text-right">
                    (${_Prices.socialPost}x{data.automatedSocialPost.prospects})
                  </div>
                </div>
              </div>
            )}
            <hr />
            <div className="d-flex justify-content-between mb-3">
              <div className="text-muted">Total</div>
              <div className="h6">${data.checkout.total}</div>
            </div>
            <hr />
            <div className="d-flex justify-content-between mb-3">
              <div className="text-muted">Payment Method</div>
              <div className="">
                {data.checkout.brand}.....{data.checkout.last4}
              </div>
            </div>
          </Modal.Body>
        )}
        <Modal.Footer>
          <Button variant="link" onClick={() => downloadPdf()}>
            <img
              src="/assets/icons/download.svg"
              className="mr-2"
              alt="download"
            />
            DOWNLOAD PDF
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ViewCampaignModal;
