import React, { useEffect, useState } from "react";
import { DropdownButton, FormCheck } from "react-bootstrap";
import { useSelector } from "react-redux";
import "./FilterDropdown.scss";

export const INTERESTE_STATUS = {
  ALL: "all",
  INTERESTED: "Interested",
  NEGOTIATING: "Negotiating",
  DO_NOT_CALL: "Do Not Call",
  CLOSED: "Closed",
  NOT_INTERESTED: "Not Interested",
  UNKNOWN: "Unknown",
};

const FilterDropdown = ({ changeFilterEvent }) => {
  const [filterList, setFilterList] = useState(["all"]);
  const [all, setAll] = useState(true);
  const [interested, setInterested] = useState(false);
  const [notInterested, setNotInterested] = useState(false);

  const [filter, setFilter] = useState({
    list: [],
    status: [],
  });

  const [filterFieldOptions, setFilterFieldOptions] = useState([
    { label: "All Prospects", value: "all" },
  ]);
  const prospectList = useSelector((state) => state.prospectStore.prospectList);
  const changeEvent = (type, checked) => {
    if (type === INTERESTE_STATUS.ALL) {
      setAll(checked);
      if (checked) {
        setInterested(false);
        setNotInterested(false);
      }
    } else {
      setAll(false);
      if (type === INTERESTE_STATUS.INTERESTED) {
        setInterested(checked);
      } else if (type === INTERESTE_STATUS.NEGOTIATING) {
        setNotInterested(checked);
      }
    }
  };
  const changeList = (value) => {
    if (value === "all") {
      setFilterList(["all"]);
    } else {
      let oldList = filterList.filter((item) => item !== "all");
      const idx = oldList.indexOf(value);
      if (idx >= 0) {
        oldList.splice(idx, 1);
      } else {
        oldList.push(value);
      }
      if (oldList.length === 0) {
        setFilterList(["all"]);
      } else {
        setFilterList(oldList);
      }
    }
  };

  useEffect(() => {
    if (prospectList) {
      setFilterFieldOptions(
        [{ label: "All Prospects", value: "all" }].concat(
          prospectList.map((item) => ({ label: item.name, value: item.id }))
        )
      );
    }
  }, [prospectList]);
  useEffect(() => {
    if (changeFilterEvent) {
      let status = [];
      if (interested) {
        status.push(INTERESTE_STATUS.INTERESTED);
      }
      if (notInterested) {
        status.push(INTERESTE_STATUS.NEGOTIATING);
      }
      setFilter({
        list:
          filterList.length === 0 || filterList[0] === "all" ? [] : filterList,
        status: status,
      });
    }
  }, [filterList, interested, notInterested]);
  useEffect(() => {
    changeFilterEvent(filter);
  }, [filter]);
  return (
    <>
      <DropdownButton
        variant="outline-primary"
        title={
          <>
            <img src="/assets/icons/filter.svg" className="mr-3" />
            {filter.list.length === 0 && filter.status.length === 0 ? (
              "Filter Prospects"
            ) : filter.list.length === 0 && filter.status.length !== 0 ? (
              filter.status[0]
            ) : filter.list.length !== 0 && filter.status.length === 0 ? (
              "Prospect List" +
              (filter.list.length > 1 ? "(" + filter.list.length + ")" : "")
            ) : (
              <>
                {"Prospect List" +
                  (filter.list.length > 1
                    ? "(" + filter.list.length + ")"
                    : "")}
                <span className="sub-option">{filter.status[0]}</span>
              </>
            )}
          </>
        }
        className="filter-dropdown"
      >
        <h5>Filters</h5>
        <div className="label">Prospect Lists</div>
        <DropdownButton
          variant="outline-primary"
          className="prospect-list"
          title={
            filterList.length < 1 || filterList[0] === "all"
              ? "All Prospects"
              : "Prospects (" + filterList.length + ")"
          }
        >
          {filterFieldOptions.map((item, idx) => (
            <div
              key={idx}
              className={
                (filterList.findIndex((it) => it === item.value) >= 0
                  ? "active "
                  : "") + "prospect-list-item"
              }
              onClick={() => changeList(item.value)}
            >
              {item.label}
            </div>
          ))}
        </DropdownButton>
        <div className="label">Status</div>
        <FormCheck
          custom
          type="checkbox"
          id="all"
          label="All"
          className="mb-3"
          checked={all}
          onChange={(event) =>
            changeEvent(INTERESTE_STATUS.ALL, event.target.checked)
          }
        />
        <FormCheck
          custom
          type="checkbox"
          id="interested"
          label="Interested"
          className="mb-3"
          checked={interested}
          onChange={(event) =>
            changeEvent(INTERESTE_STATUS.INTERESTED, event.target.checked)
          }
        />
        <FormCheck
          custom
          type="checkbox"
          id="notinterested"
          label="Not Interested"
          checked={notInterested}
          onChange={(event) =>
            changeEvent(INTERESTE_STATUS.NEGOTIATING, event.target.checked)
          }
        />
      </DropdownButton>
    </>
  );
};

export default FilterDropdown;
