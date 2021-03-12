import React, { useEffect, useState } from "react";
import { DropdownButton, FormCheck } from "react-bootstrap";
import { useSelector } from "react-redux";
import "./FilterDropdown.scss";

export const INTEREST_STATUS = {
  ALL: "all",
  INTERESTED: "Interested/Engaged",
  NEGOTIATING: "Negotiating",
  DO_NOT_CONTACT: "Do Not Call",
  CLOSED: "Closed",
  FOLLOW_UP: "Follow Up",
  NOT_INTERESTED: "Not Interested",
  NO_RESPONSE: "No Response",
  NURTURE: "Nurture",
  UNKNOWN: "Unknown",
};

export const INTEREST_STATUSES = [
  INTEREST_STATUS.INTERESTED,
  INTEREST_STATUS.NEGOTIATING,
  INTEREST_STATUS.DO_NOT_CONTACT,
  INTEREST_STATUS.CLOSED,
  INTEREST_STATUS.FOLLOW_UP,
  INTEREST_STATUS.NOT_INTERESTED,
  INTEREST_STATUS.NO_RESPONSE,
  INTEREST_STATUS.NURTURE,
  INTEREST_STATUS.UNKNOWN,
];

const FilterDropdown = ({ changeFilterEvent }) => {
  const [filterList, setFilterList] = useState(["all"]);
  const [filterStatus, setFilterStatus] = useState(["all"]);

  const [filter, setFilter] = useState({
    list: [],
    status: [],
  });

  const [filterFieldOptions, setFilterFieldOptions] = useState([
    { label: "All Prospects", value: "all" },
  ]);
  const prospectList = useSelector((state) => state.prospectStore.prospectList);
  const changeEvent = (status) => {
    if (status === INTEREST_STATUS.ALL) {
      setFilterStatus(["all"]);
    } else {
      const newList = [...filterStatus.filter((item) => item !== "all")];
      const i = filterStatus.indexOf(status);
      if (i < 0) {
        newList.push(status);
      } else {
        newList.splice(i, 1);
      }
      if (newList.length === 0) {
        setFilterStatus(["all"]);
      } else {
        setFilterStatus(newList);
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
    setFilter({
      list:
        filterList.length === 0 || filterList[0] === "all" ? [] : filterList,
      status:
        filterStatus.length === 0 || filterStatus[0] === "all"
          ? []
          : filterStatus,
    });
  }, [filterList, filterStatus]);
  useEffect(() => {
    changeFilterEvent(filter);
    // eslint-disable-next-line
  }, [filter]);
  return (
    <>
      <DropdownButton
        variant="outline-primary"
        title={
          <>
            <img src="/assets/icons/filter.svg" className="mr-3" alt="filter" />
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
          checked={filterStatus.includes(INTEREST_STATUS.ALL)}
          onChange={() => changeEvent(INTEREST_STATUS.ALL)}
        />
        {INTEREST_STATUSES.map((item, idx) => (
          <FormCheck
            key={idx}
            custom
            type="checkbox"
            id={"checkbox-intesete-status-" + idx}
            label={item}
            className="mb-3"
            checked={filterStatus.includes(item)}
            onChange={(event) => changeEvent(item, event.target.checked)}
          />
        ))}
      </DropdownButton>
    </>
  );
};

export default FilterDropdown;
