import React, { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import { customSelectStyles } from "../../../assets/styles/select-style";
import { CREATE_CAMPAIGN_ACTIONS } from "../../../redux/actionTypes";
import { _Days, _HOURS, _Minutes, _Months, _Years } from "./WizardConstants";
import "./TimelineStep.scss";

const TimelineStep = () => {
  const [day, setDay] = useState(null);
  const [month, setMonth] = useState(null);
  const [year, setYear] = useState(null);
  const [hour, setHour] = useState(null);
  const [minute, setMinute] = useState(null);
  const [am, setAm] = useState(null);
  const [consent, setConsent] = useState(false);

  const timelineInfo = useSelector(
    (state) => state.createCampaignStore.timeline
  );
  const dispatch = useDispatch();
  const gotoStep = (step) => {
    dispatch({
      type: CREATE_CAMPAIGN_ACTIONS.UPDATE_TIMELINE,
      data: {
        day: day,
        month: month,
        year: year,
        hour: hour,
        minute: minute,
        am: am,
        consent: consent,
      },
    });
    dispatch({ type: CREATE_CAMPAIGN_ACTIONS.UPDATE_STEP, data: step });
  };
  useEffect(() => {
    if (timelineInfo) {
      setDay(timelineInfo.day);
      setMonth(timelineInfo.month);
      setYear(timelineInfo.year);
      setHour(timelineInfo.hour);
      setMinute(timelineInfo.minute);
      setAm(timelineInfo.am);
      setConsent(timelineInfo.consent);
    }
  }, [timelineInfo]);

  return (
    <div>
      <Form.Group>
        <Form.Label className="required">Date to Start Campaign</Form.Label>
        <div className="row">
          <div className="col-4">
            <Select
              placeholder="Day"
              options={_Days.map((item) => ({
                label: item,
                value: item,
              }))}
              value={day}
              styles={customSelectStyles("40px", day ? true : false)}
              onChange={(value) => setDay(value)}
            />
          </div>
          <div className="col-4">
            <Select
              placeholder="Month"
              options={_Months.map((item, idx) => ({
                label: item,
                value: idx + 1,
              }))}
              value={month}
              styles={customSelectStyles("40px", month ? true : false)}
              onChange={(value) => setMonth(value)}
            />
          </div>
          <div className="col-4">
            <Select
              placeholder="Year"
              options={_Years.map((item) => ({
                label: item,
                value: item,
              }))}
              value={year}
              styles={customSelectStyles("40px", year ? true : false)}
              onChange={(value) => setYear(value)}
            />
          </div>
        </div>
      </Form.Group>
      <Form.Group>
        <Form.Label className="required">Time to Start Campaign</Form.Label>
        <div className="row">
          <div className="col-4">
            <Select
              placeholder="Hour"
              options={_HOURS.map((item) => ({
                label: item,
                value: item,
              }))}
              value={hour}
              styles={customSelectStyles("40px", hour ? true : false)}
              onChange={(value) => setHour(value)}
            />
          </div>
          <div className="col-4">
            <Select
              placeholder="Minute"
              options={_Minutes}
              value={minute}
              styles={customSelectStyles("40px", minute ? true : false)}
              onChange={(value) => setMinute(value)}
            />
          </div>
          <div className="col-4">
            <Select
              placeholder="AM"
              options={[
                { label: "AM", value: "AM" },
                { label: "PM", value: "PM" },
              ]}
              value={am}
              styles={customSelectStyles("40px", am ? true : false)}
              onChange={(value) => setAm(value)}
            />
          </div>
        </div>

        <Form.Text className="text-muted font-italic pl-3">
          All times are in the Mountain Time Zone
        </Form.Text>
      </Form.Group>

      <Form.Group>
        <Form.Label className="required mb-4">Consent</Form.Label>
        <Form.Check
          checked={consent}
          className="consent-checkbox"
          name="consent"
          custom
          id="consent"
          type="checkbox"
          label="I have consent to text, email, and/or call my targets"
          onChange={() => setConsent(true)}
        />
      </Form.Group>

      <Button
        variant="primary"
        size="lg"
        className="w-100 mb-3"
        disabled={
          !day || !month || !year || !hour || !minute || !am || !consent
        }
        onClick={() => gotoStep(3)}
      >
        NEXT
      </Button>
      <Button
        variant="light"
        size="lg"
        className="w-100"
        onClick={() => gotoStep(1)}
      >
        PREVIOUS
      </Button>
    </div>
  );
};

export default TimelineStep;
