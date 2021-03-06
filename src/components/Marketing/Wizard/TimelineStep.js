import React, { useEffect, useState } from "react";
import { Button, Dropdown, DropdownButton, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { CREATE_CAMPAIGN_ACTIONS } from "../../../redux/actionTypes";
import {
  _Days,
  _HOURS,
  _LongMonths,
  _MidMonths,
  _Minutes,
  _Months,
  _Years,
} from "./WizardConstants";
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
          <div className="col-4 ">
            <DropdownButton
              variant="outline-primary"
              className={
                "custom-dropdown " + (day ? "completed" : "uncompleted")
              }
              title={day ? day.label : "Day"}
            >
              {_Days.map((item, idx) => (
                <Dropdown.Item
                  key={idx}
                  className={day && item === day.value ? "active " : ""}
                  onClick={() => {
                    setDay({ label: item, value: item });
                    setMonth(null);
                  }}
                >
                  {item}
                </Dropdown.Item>
              ))}
            </DropdownButton>
          </div>
          <div className="col-4 px-1">
            <DropdownButton
              variant="outline-primary"
              className={
                "custom-dropdown " + (month ? "completed" : "uncompleted")
              }
              title={month ? month.label : "Month"}
            >
              {(day && day.value === 31
                ? _LongMonths
                : day && day.value === 30
                ? _MidMonths
                : _Months
              ).map((item, idx) => (
                <Dropdown.Item
                  key={idx}
                  className={
                    month && item.value === month.value ? "active " : ""
                  }
                  onClick={() => setMonth(item)}
                >
                  {item.label}
                </Dropdown.Item>
              ))}
            </DropdownButton>
          </div>
          <div className="col-4">
            <DropdownButton
              variant="outline-primary"
              className={
                "custom-dropdown " + (year ? "completed" : "uncompleted")
              }
              title={year ? year.label : "Year"}
            >
              {(day && day.value === 29 && month && month.value === 2
                ? _Years.filter((item) => item % 4 === 0)
                : _Years
              ).map((item, idx) => (
                <Dropdown.Item
                  key={idx}
                  className={year && item === year.value ? "active " : ""}
                  onClick={() => setYear({ label: item, value: item })}
                >
                  {item}
                </Dropdown.Item>
              ))}
            </DropdownButton>
          </div>
        </div>
      </Form.Group>
      <Form.Group>
        <Form.Label className="required">Time to Start Campaign</Form.Label>
        <div className="row">
          <div className="col-4">
            <DropdownButton
              variant="outline-primary"
              className={
                "custom-dropdown " + (hour ? "completed" : "uncompleted")
              }
              title={hour ? hour.label : "Hour"}
            >
              {_HOURS.map((item, idx) => (
                <Dropdown.Item
                  key={idx}
                  className={hour && item === hour.value ? "active " : ""}
                  onClick={() => setHour({ label: item, value: item })}
                >
                  {item}
                </Dropdown.Item>
              ))}
            </DropdownButton>
          </div>
          <div className="col-4 px-1">
            <DropdownButton
              variant="outline-primary"
              className={
                "custom-dropdown " + (minute ? "completed" : "uncompleted")
              }
              title={minute ? minute.label : "Minute"}
            >
              {_Minutes.map((item, idx) => (
                <Dropdown.Item
                  key={idx}
                  className={
                    minute && item.value === minute.value ? "active " : ""
                  }
                  onClick={() => setMinute(item)}
                >
                  {item.label}
                </Dropdown.Item>
              ))}
            </DropdownButton>
          </div>
          <div className="col-4">
            <DropdownButton
              variant="outline-primary"
              className={
                "custom-dropdown " + (am ? "completed" : "uncompleted")
              }
              title={am ? am.label : "AM"}
            >
              {["AM", "PM"].map((item, idx) => (
                <Dropdown.Item
                  key={idx}
                  className={am && item === am.value ? "active " : ""}
                  onClick={() => setAm({ label: item, value: item })}
                >
                  {item}
                </Dropdown.Item>
              ))}
            </DropdownButton>
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
          onChange={(e) => setConsent(e.target.checked)}
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
