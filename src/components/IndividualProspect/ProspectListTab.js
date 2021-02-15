import React, { useCallback, useEffect, useState } from "react";
import { Button, FormControl, FormGroup, FormLabel } from "react-bootstrap";

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
    console.log(data);
    if (data) {
      setCompany(data.company);
      setAddress1(data.address1);
      setFacebook(data.facebook);
      setEmail(data.email);
      setPhone(data.phone);
      setNotes(data.notes);
    }
  }, [data]);

  const change = (flag) => {
    if (flag) {
      if (changeData) {
        changeData({
          company: company,
          address1: address1,
          facebook: facebook,
          email: email,
          phone: phone,
          notes: notes,
        });
      }
    }
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
          <FormControl
            type="text"
            placeholder="Enter Company"
            value={email}
            readOnly={!emailEditable}
            className="mr-3"
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button
            variant="outline-primary"
            onClick={() => {
              change(emailEditable);
              setEmailEditable(!emailEditable);
            }}
          >
            {emailEditable ? "Save" : "Edit"}
          </Button>
        </div>
      </FormGroup>
      <FormGroup controlId="phone">
        <FormLabel>Phone</FormLabel>
        <div className="d-flex">
          <FormControl
            type="text"
            placeholder="Enter phone"
            value={phone}
            className="mr-3"
            readOnly={!phoneEditable}
            onChange={(e) => setPhone(e.target.value)}
          />
          <Button
            variant="outline-primary"
            onClick={() => {
              change(phoneEditable);
              setPhoneEditable(!phoneEditable);
            }}
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
