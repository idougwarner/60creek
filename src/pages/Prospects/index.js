import React, { useEffect, useState } from "react";
import "./Prospects.scss";
import {
  DropdownButton,
  Dropdown,
  Table,
  InputGroup,
  FormControl,
  FormCheck,
  Spinner,
  SplitButton,
} from "react-bootstrap";
import AddSingleProspectModal from "../../components/Prospects/AddSingleProspectModal";
import NewProspectListModal from "../../components/Prospects/NewProspectListModal";
import { API, graphqlOperation } from "aws-amplify";
import { listProspectLists, listProspects } from "../../graphql/queries";
import {
  downloadCSVFromJSON,
  downloadXlsxFromJSON,
} from "../../helpers/CSVFileHelper";
import { useDispatch, useSelector } from "react-redux";
import FilterDropdown from "../../components/Prospects/FilterDropdown";
import { ACTIONS } from "../../redux/actionTypes";
import { useIndexedDB } from "react-indexed-db";
import { IndexDBStores } from "../../helpers/DBConfig";
import { NavLink, useHistory } from "react-router-dom";
import { APP_URLS } from "../../helpers/routers";

const tableFields = [
  { title: "STATUS", field: "status", sortable: false },
  { title: "FIRST", field: "firstName", sortable: true },
  { title: "LAST", field: "lastName", sortable: true },
  { title: "COMPANY", field: "company", sortable: true },
  { title: "STREET", field: "address1", sortable: true },
  { title: "CITY", field: "city", sortable: true },
  { title: "STATE", field: "state", sortable: true },
  { title: "ZIP", field: "zip", sortable: true },
  { title: "CONTACT INFO", field: "contactInfo", sortable: false },
];

const ASC = 1;
const DESC = -1;
const ProspectsPage = () => {
  const [data, setData] = useState([]);

  const [filteredData, setFilteredData] = useState([]);
  const [strFilter, setStrFilter] = useState("");

  const [statusFilter, setStatusFilter] = useState([]);
  const [listFilter, setListFilter] = useState([]);

  const [sortType, setSortType] = useState({ sort: ASC, field: "lastName" });

  const [showAddExistingModal, setShowAddExistingModal] = useState(false);
  const [showSingleModal, setShowSingleModal] = useState(false);
  const [showNewListModal, setShowNewListModal] = useState(false);
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showOriginUpload, setShowOriginUpload] = useState(false);

  const user = useSelector((state) => state.userStore);
  const prospectsDb = useIndexedDB(IndexDBStores.PROSPECT);
  const history = useHistory();

  const dispatch = useDispatch();

  const loadData = async () => {
    setLoading(true);
    try {
      const rt = await API.graphql(
        graphqlOperation(listProspects, { filter: { userId: { eq: user.id } } })
      );
      if (rt?.data?.listProspects?.items) {
        setData(rt.data.listProspects.items);
      }
      const rtList = await API.graphql(
        graphqlOperation(listProspectLists, {
          filter: { userId: { eq: user.id } },
        })
      );
      if (rtList?.data?.listProspectLists?.items) {
        dispatch({
          type: ACTIONS.SET_PROSPECT_LIST,
          prospectList: rtList.data.listProspectLists.items,
        });
      }
    } catch (err) {}
    setLoading(false);
  };

  const toggleItem = (id) => {
    let newSelected = [...selected];
    let idx = newSelected.findIndex((item) => item === id);
    if (idx >= 0) {
      newSelected.splice(idx, 1);
    } else {
      newSelected.push(id);
    }
    setSelected(newSelected);
  };
  const downloadCSV = () => {
    downloadCSVFromJSON(
      filteredData.map((item) => ({
        firstName: item.firstName,
        lastName: item.lastName,
        address1: item.address1,
        address2: item.address2,
        city: item.city,
        state: item.state,
        zip: item.zip,
        company: item.company,
        phone: item.phone,
        email: item.email,
        facebook: item.facebook,
        status: item.status,
      })),
      "Prospects.csv"
    );
  };
  const downloadExcel = () => {
    downloadXlsxFromJSON(
      filteredData.map((item) => ({
        firstName: item.firstName,
        lastName: item.lastName,
        address1: item.address1,
        address2: item.address2,
        city: item.city,
        state: item.state,
        zip: item.zip,
        company: item.company,
        phone: item.phone,
        email: item.email,
        facebook: item.facebook,
        status: item.status,
      })),
      "Prospects.xlsx"
    );
  };
  const changeSort = (field) => {
    if (field === sortType.field) {
      setSortType({ sort: 0 - sortType.sort, field: field });
    } else {
      setSortType({ sort: ASC, field: field });
    }
  };
  const changeFilterEvent = (filter) => {
    setListFilter(filter.list);
    setStatusFilter(filter.status);
  };
  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);
  const sortData = () => {
    let newData = [];
    if (strFilter) {
      newData = data.filter((item) => {
        if (
          item["firstName"].toLowerCase().indexOf(strFilter.toLowerCase()) >= 0
        ) {
          return true;
        }
        if (
          item["lastName"].toLowerCase().indexOf(strFilter.toLowerCase()) >= 0
        ) {
          return true;
        }
        if (item["email"].toLowerCase().indexOf(strFilter.toLowerCase()) >= 0) {
          return true;
        }
        if (item["phone"].toLowerCase().indexOf(strFilter.toLowerCase()) >= 0) {
          return true;
        }
        return false;
      });
    } else {
      newData = [...data];
    }
    if (statusFilter.length > 0) {
      newData = newData.filter(
        (item) =>
          statusFilter.findIndex(
            (it) => it.toLowerCase() === (item.status?.toLowerCase() || "")
          ) >= 0
      );
    }
    if (listFilter.length > 0) {
      newData = newData.filter(
        (item) => listFilter.indexOf(item.prospectList.id) >= 0
      );
    }
    newData = newData.sort((a, b) => {
      return a[sortType.field] < b[sortType.field]
        ? 0 - sortType.sort
        : 0 + sortType.sort;
    });
    setFilteredData(newData);
  };
  useEffect(() => {
    sortData();
  }, [strFilter, statusFilter, listFilter, data, sortType]);
  const checkLocalStorage = async () => {
    const localProspects = await prospectsDb.getAll();
    if (localProspects && localProspects.length > 0) {
      setShowOriginUpload(true);
    }
  };
  useEffect(() => {
    checkLocalStorage();
  }, []);
  const gotoDetailPage = (id) => {
    history.push(APP_URLS.PROSPECTS + "/" + id);
  };
  return (
    <>
      <h4>Prospect List</h4>
      <div className="mb-4">
        <SplitButton
          variant="primary"
          title="ADD PROSPECT(S)"
          className="add-prospects-btn"
        >
          <Dropdown.Item
            eventKey="1"
            onClick={() => {
              setShowNewListModal(true);
            }}
          >
            <img src="/assets/icons/new-list.svg" className="item-icon" />
            CREATE NEW LIST
          </Dropdown.Item>
          <Dropdown.Item
            eventKey="2"
            onClick={() => {
              setShowAddExistingModal(true);
            }}
          >
            <img
              src="/assets/icons/add-to-existing-list.svg"
              className="item-icon"
            />
            ADD TO EXISTING LIST
          </Dropdown.Item>
          <Dropdown.Item eventKey="3" onClick={() => setShowSingleModal(true)}>
            <img src="/assets/icons/new-list.svg" className="item-icon" />
            ADD SINGLE PROSPECT
          </Dropdown.Item>
        </SplitButton>
      </div>
      <div className="card">
        <div className="d-flex justify-content-between mb-4">
          <div className="d-flex">
            <InputGroup className="search-input">
              <InputGroup.Prepend>
                <img src="/assets/icons/search.svg" />
              </InputGroup.Prepend>
              <FormControl
                id=""
                placeholder="Search List ..."
                value={strFilter}
                onChange={(e) => setStrFilter(e.target.value)}
              />
            </InputGroup>
            <FilterDropdown changeFilterEvent={changeFilterEvent} />
          </div>
          <DropdownButton
            variant="light"
            className="more-menu-btn"
            title={<img src="/assets/icons/more.svg" />}
          >
            <Dropdown.Item href="#/action-1" onClick={downloadExcel}>
              <img
                src="/assets/icons/excel.svg"
                className="item-icon"
                onClick={downloadExcel}
              />{" "}
              Excel
            </Dropdown.Item>
            <Dropdown.Item href="#/action-2" onClick={downloadCSV}>
              <img src="/assets/icons/csv.svg" className="item-icon" /> CSV
            </Dropdown.Item>
          </DropdownButton>
        </div>
        <div className="d-flex justify-content-between mb-4">
          <div className="selected">{selected.length} selected</div>
          <div className="showing">
            Showing<span>{filteredData.length}</span>of
            <span>{data.length}</span>prospects
          </div>
        </div>
        <Table responsive="xl" className="data-table">
          <thead>
            <tr>
              <th width="30"></th>
              {tableFields.map((item, id) => (
                <th
                  key={id}
                  className={
                    item.sortable
                      ? "sort-field " +
                        (sortType.field === item.field ? "sorted-field" : "")
                      : ""
                  }
                  onClick={() =>
                    item.sortable ? changeSort(item.field) : null
                  }
                >
                  {item.title}
                  {item.sortable && (
                    <span
                      className={
                        (sortType.field === item.field && sortType.sort === ASC
                          ? "desc "
                          : "") + "sort-icon"
                      }
                    ></span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan="10" align="center">
                  <Spinner animation="border" role="status" />
                </td>
              </tr>
            )}
            {!loading &&
              filteredData &&
              filteredData.map((item, idx) => (
                <tr key={idx} className="clickable">
                  <td>
                    <FormCheck
                      custom
                      checked={
                        selected.findIndex((it) => it === item.id) >= 0
                          ? true
                          : false
                      }
                      type="checkbox"
                      id={"checkbox-" + idx}
                      onChange={(event) => {
                        toggleItem(item.id);
                      }}
                    />
                  </td>
                  {tableFields.map((field, col) => (
                    <td key={col} onClick={() => gotoDetailPage(item.id)}>
                      {item[field.field]}
                    </td>
                  ))}
                  <td>
                    <div className="contact-info">
                      <img
                        src="/assets/icons/email.svg"
                        className="link mr-3"
                      />
                      <img src="/assets/icons/phone.svg" className="link" />
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </Table>
        <div className="d-flex justify-content-center">
          {/* <Pagination>
            <Pagination.First />
            <Pagination.Prev />
            <Pagination.Item>{1}</Pagination.Item>
            <Pagination.Ellipsis />

            <Pagination.Item>{10}</Pagination.Item>
            <Pagination.Item>{11}</Pagination.Item>
            <Pagination.Item active>{12}</Pagination.Item>
            <Pagination.Item>{13}</Pagination.Item>
            <Pagination.Item>{14}</Pagination.Item>

            <Pagination.Ellipsis />
            <Pagination.Item>{20}</Pagination.Item>
            <Pagination.Next />
            <Pagination.Last />
          </Pagination> */}
        </div>
        {showAddExistingModal && (
          <NewProspectListModal
            show={showAddExistingModal}
            close={(event) => {
              setShowAddExistingModal(false);
              if (event && event.data) {
                loadData();
              }
            }}
            existingList={true}
          />
        )}
        {showSingleModal && (
          <AddSingleProspectModal
            show={showSingleModal}
            close={(event) => {
              setShowSingleModal(false);
              if (event && event.data) {
                loadData();
              }
            }}
          />
        )}
        {showNewListModal && (
          <NewProspectListModal
            show={showNewListModal}
            close={(event) => {
              setShowNewListModal(false);
              if (event && event.data) {
                loadData();
              }
            }}
          />
        )}
        {showOriginUpload && (
          <NewProspectListModal
            show={showOriginUpload}
            close={(event) => {
              setShowOriginUpload(false);
              if (event && event.data) {
                loadData();
              }
            }}
            originUpload={true}
          />
        )}
      </div>
    </>
  );
};

export default ProspectsPage;
