import React, { useEffect, useState } from "react";
import { Button, FormControl, FormGroup, FormLabel } from "react-bootstrap";
import { validateEmail } from "../../helpers/validations";
import InputMask from "react-input-mask";

var g_data = null;
const ProspectListTab = ({ data, changeData }) => {
  const [company, setCompany] = useState("");
  const [address1, setAddress1] = useState("");
  const [facebook, setFacebook] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [companyEditable, setCompanyEditable] = useState(false);
  const [address1Editable, setAddress1Editable] = useState(false);
  const [facebookEditable, setFacebookEditable] = useState(false);
  const [emailEditable, setEmailEditable] = useState(false);
  const [phoneEditable, setPhoneEditable] = useState(false);
  const [notesEditable, setNotesEditable] = useState(false);
  useEffect(() => {
    if (data) {
      g_data = { ...data };
      setCompany(data.company);
      setAddress1(data.address1);
      setFacebook(data.facebook);
      setEmail(data.email);
      setPhone(data.phone);
      setNotes(data.notes || "");
    }
  }, [data]);

  const handleClickEvent = (event) => {
    if (
      (event.target.className.indexOf("save-btn") >= 0 &&
        event.target.innerText === "Save") ||
      (event.target.className.indexOf("form-control") >= 0 &&
        !event.target.readOnly)
    ) {
    } else {
      setCompanyEditable(false);
      setAddress1Editable(false);
      setFacebookEditable(false);
      setEmailEditable(false);
      setPhoneEditable(false);
      setNotesEditable(false);
      if (g_data) {
        setCompany(g_data.company);
        setAddress1(g_data.address1);
        setFacebook(g_data.facebook);
        setEmail(g_data.email);
        setPhone(g_data.phone);
        setNotes(g_data.notes || "");
      }
    }
  };
  useEffect(() => {
    document.addEventListener("mousedown", handleClickEvent);
    return () => {
      document.removeEventListener("mousedown", handleClickEvent);
    };
    // eslint-disable-next-line
  }, []);
  const change = (flag) => {
    if (flag) {
      if (changeData) {
        changeData({
          company: company,
          address1: address1,
          facebook: facebook,
          email: email,
          phone: phone,
          notes: notes || "",
        });
      }
    }
  };

  const isValidPhone = () => {
    if (phone.indexOf("_") < 0) {
      return true;
    }
    return false;
  };
  return (
    <>
      <FormGroup controlId="company">
        <FormLabel>Company</FormLabel>
        <div className="d-flex">
          <FormControl
            type="text"
            placeholder="Enter Company"
            value={company}
            className="mr-3"
            readOnly={!companyEditable}
            onChange={(e) => setCompany(e.target.value)}
          />
          <Button
            variant="outline-primary"
            className="save-btn"
            onClick={() => {
              change(companyEditable);
              setCompanyEditable(!companyEditable);
            }}
          >
            {companyEditable ? "Save" : "Edit"}
          </Button>
        </div>
      </FormGroup>
      <FormGroup controlId="address1">
        <FormLabel>Address</FormLabel>
        <div className="d-flex">
          <FormControl
            type="text"
            placeholder="Enter Address"
            value={address1}
            readOnly={!address1Editable}
            className="mr-3"
            onChange={(e) => setAddress1(e.target.value)}
          />
          <Button
            variant="outline-primary"
            className="save-btn"
            onClick={() => {
              change(address1Editable);
              setAddress1Editable(!address1Editable);
            }}
          >
            {address1Editable ? "Save" : "Edit"}
          </Button>
        </div>
      </FormGroup>
      <FormGroup controlId="facebook">
        <FormLabel>Facebook</FormLabel>
        <div className="d-flex">
          <FormControl
            type="text"
            placeholder="Enter Facebook"
            value={facebook}
            readOnly={!facebookEditable}
            className="mr-3"
            onChange={(e) => setFacebook(e.target.value)}
          />
          <Button
            variant="outline-primary"
            className="save-btn"
            onClick={() => {
              change(facebookEditable);
              setFacebookEditable(!facebookEditable);
            }}
          >
            {facebookEditable ? "Save" : "Edit"}
          </Button>
        </div>
      </FormGroup>
      <FormGroup controlId="email">
        <FormLabel>Email</FormLabel>
        <div className="d-flex">
          <div className="flex-grow-1 mr-3">
            <FormControl
              type="text"
              placeholder="Enter Email"
              value={email}
              readOnly={!emailEditable}
              onChange={(e) => setEmail(e.target.value)}
              isInvalid={!validateEmail(email) && email}
            />
            <FormControl.Feedback type="invalid">
              Invalid Email Address
            </FormControl.Feedback>
          </div>
          <Button
            variant="outline-primary"
            className="save-btn"
            onClick={() => {
              change(emailEditable);
              setEmailEditable(!emailEditable);
            }}
            disabled={!validateEmail(email) && email && emailEditable}
          >
            {emailEditable ? "Save" : "Edit"}
          </Button>
        </div>
      </FormGroup>
      <FormGroup controlId="phone">
        <FormLabel>Phone</FormLabel>
        <div className="d-flex">
          <div className="flex-grow-1 mr-3">
            <InputMask
              mask="(999) 999 - 9999"
              value={phone}
              type="tel"
              placeholder="Enter Phone"
              readOnly={!phoneEditable}
              onChange={(e) => setPhone(e.target.value)}
            >
              {(inputProps) => (
                <FormControl
                  {...inputProps}
                  isInvalid={phone && !isValidPhone()}
                />
              )}
            </InputMask>

            <FormControl.Feedback type="invalid">
              Invalid Email Address
            </FormControl.Feedback>
          </div>
          <Button
            variant="outline-primary"
            className="save-btn"
            onClick={() => {
              change(phoneEditable);
              setPhoneEditable(!phoneEditable);
            }}
            disabled={phone && !isValidPhone()}
          >
            {phoneEditable ? "Save" : "Edit"}
          </Button>
        </div>
      </FormGroup>
      <FormGroup controlId="firstName">
        <FormLabel>Notes</FormLabel>
        <FormControl
          as="textarea"
          rows={5}
          className="mb-2"
          readOnly={!notesEditable}
          placeholder="Type to enter notes about this prospect"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
        <div className="d-flex justify-content-end">
          <Button
            variant="outline-primary"
            className="save-btn"
            onClick={() => {
              change(notesEditable);
              setNotesEditable(!notesEditable);
            }}
          >
            {notesEditable ? "Save" : "Edit"}
          </Button>
        </div>
      </FormGroup>
    </>
  );
};

export default ProspectListTab;
