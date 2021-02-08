import { API, graphqlOperation } from "aws-amplify";
import React, { useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { useSelector } from "react-redux";
import Select from "react-select";
import "./AddSingleProspectModal.scss";
import { customSelectStyles } from "../../assets/styles/select-style";
import { createProspect } from "../../graphql/mutations";
import { INTERESTE_STATUS } from "./FilterDropdown";
const STEP1 = 0;
const STEP2 = 1;
const STEP3 = 2;
const AddSingleProspectModal = ({ show, close }) => {
  const [prospectList, setProspectList] = useState(["Al"]);
  const [selectedList, setSelectedList] = useState(null);
  const [step, setStep] = useState(STEP1);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zip, setZip] = useState("");
  const [company, setCompany] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [facebook, setFacebook] = useState("");
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(null);
  const user = useSelector((state) => state.userStore);
  const list = useSelector((state) => state.prospectStore.prospectList);
  const prev = () => {
    if (step > STEP1) {
      setStep(step - 1);
    }
  };
  const edit = () => {
    setStep(STEP1);
  };
  const next = async () => {
    if (step === STEP3) {
      try {
        setLoading(true);
        let rt = await API.graphql(
          graphqlOperation(createProspect, {
            input: {
              userId: user.id,
              prospectListId: selectedList.value,
              firstName: firstName,
              lastName: lastName,
              address1: address1,
              address2: address2,
              city: city,
              state: state,
              zip: zip,
              company: company,
              phone: phone,
              email: email,
              facebook: facebook,
              status: status.value,
            },
          })
        );
        close({ data: true });
      } catch (err) {}
      setLoading(false);
    } else if (step < STEP3) {
      setStep(step + 1);
    }
  };
  const loadData = async () => {
    if (list) {
      setProspectList(
        list.map((item) => ({ value: item.id, label: item.name }))
      );
    }
  };
  useEffect(() => {
    loadData();
  }, [list]);
  return (
    <>
      <Modal show={show} onHide={close}>
        <Modal.Header>
          <Modal.Title>
            {step === STEP3 ? "Prospect Created" : "Add Single Prospect"}
          </Modal.Title>
          <img
            src="/assets/icons/close.svg"
            className="modal-close-btn"
            onClick={close}
          />
        </Modal.Header>
        <Modal.Body>
          {step === STEP1 && (
            <div className="step-1">
              <Form.Group>
                <Form.Label className="required">
                  Select Prospect List
                </Form.Label>
                <Select
                  options={prospectList}
                  value={selectedList}
                  styles={customSelectStyles("40px")}
                  onChange={(value) => setSelectedList(value)}
                />
              </Form.Group>
              <div className="row">
                <div className="col-6 pr-2">
                  <Form.Group>
                    <Form.Label className="required">Frist Name</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter First"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                  </Form.Group>
                </div>
                <div className="col-6 pl-2">
                  <Form.Group>
                    <Form.Label className="required">Last Name</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter Last"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                    />
                  </Form.Group>
                </div>
              </div>
              <Form.Group>
                <Form.Label>Street Address</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Street Address"
                  value={address1}
                  onChange={(e) => setAddress1(e.target.value)}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Address Line 2</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Apartment, Suite, Etc. (optional)"
                  value={address2}
                  onChange={(e) => setAddress2(e.target.value)}
                />
              </Form.Group>

              <div className="row">
                <div className="col-6 pr-2">
                  <Form.Group>
                    <Form.Label>City</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter City"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                    />
                  </Form.Group>
                </div>
                <div className="col-6 pl-2">
                  <Form.Group>
                    <Form.Label>State</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter State"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                    />
                  </Form.Group>
                </div>
              </div>

              <div className="row">
                <div className="col-6 pr-2">
                  <Form.Group>
                    <Form.Label>Zip</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter Zip"
                      value={zip}
                      onChange={(e) => setZip(e.target.value)}
                    />
                  </Form.Group>
                </div>
                <div className="col-6 pl-2">
                  <Form.Group>
                    <Form.Label>Company</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter Company"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                    />
                  </Form.Group>
                </div>
              </div>
            </div>
          )}
          {step === STEP2 && (
            <div className="step-2">
              <Form.Group>
                <Form.Label className="required">Phone Number</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="(555) 555 - 5555"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Facebook</Form.Label>
                <div className="d-flex align-items-center">
                  <div className="text-muted mr-2">facebook.com/</div>
                  <Form.Control
                    type="text"
                    placeholder=""
                    value={facebook}
                    onChange={(e) => setFacebook(e.target.value)}
                  />
                </div>
              </Form.Group>

              <Form.Group>
                <Form.Label className="required">Email Address</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter email Adress"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label className="required">Select Status</Form.Label>
                <Select
                  options={[
                    { label: "Interested", value: INTERESTE_STATUS.INTERESTE },
                    {
                      label: "Negotiating",
                      value: INTERESTE_STATUS.NEGOTIATING,
                    },
                    {
                      label: "Do not Call",
                      value: INTERESTE_STATUS.DO_NOT_CALL,
                    },
                    { label: "Closed", value: INTERESTE_STATUS.CLOSED },
                  ]}
                  value={status}
                  styles={customSelectStyles("40px")}
                  onChange={(value) => setStatus(value)}
                />
              </Form.Group>
            </div>
          )}
          {step === STEP3 && (
            <div className="step-3">
              <div className="description">
                You successfully added the prospect below to
              </div>
              <div className="list-name">
                Prospect List: {selectedList.label}
              </div>
              <div className="prospect-info">
                <div className="item-info">
                  Name: <span>{firstName + " " + lastName}</span>{" "}
                  <i>{status.label}</i>
                </div>
                <div className="item-info">Company: {company}</div>
                <div className="item-info">Street Address: {address1}</div>
                <div className="item-info">Address 2: {address2}</div>
                <div className="item-info">
                  City, State, Zip: {city}, {state}, {zip}
                </div>
                <div className="item-info">Phone: {phone}</div>
                <div className="item-info">Email: {email}</div>
                <div className="item-info">facebook.com/{facebook}</div>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          {step === STEP1 && (
            <>
              <Button
                variant="primary"
                disabled={!selectedList || !firstName || !lastName}
                onClick={() => next()}
              >
                NEXT
              </Button>
            </>
          )}
          {step === STEP2 && (
            <>
              <Button
                variant="primary"
                disabled={!phone || !email || !status || loading}
                onClick={() => next()}
              >
                Next
              </Button>
              <Button variant="light" onClick={() => prev()}>
                PREVIOUS
              </Button>
            </>
          )}
          {step === STEP3 && (
            <>
              <Button
                variant="outline-primary"
                disabled={false}
                onClick={() => next()}
              >
                {loading ? "CREATING ..." : "CLOSE"}
              </Button>
              <Button variant="light" onClick={() => edit()}>
                EDIT
              </Button>
            </>
          )}
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AddSingleProspectModal;
