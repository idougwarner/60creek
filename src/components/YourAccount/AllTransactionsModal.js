import { API, graphqlOperation } from "aws-amplify";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  FormControl,
  InputGroup,
  Modal,
  Spinner,
  Table,
} from "react-bootstrap";
import { useSelector } from "react-redux";
import { campaignsByUserId } from "../../graphql/queries";
import ViewCampaignModal from "./ViewCampaignModal";

const ASC = 1;
const tableFields = [
  { title: "DATE", field: "date", sortable: true, width: 94 },
  { title: "CAMPAIN", field: "campaign", sortable: true },
  { title: "QTY", field: "qty", sortable: true, width: 80 },
  { title: "OPTIONS", field: "options", sortable: true },
  { title: "TOTAL", field: "total", sortable: true, width: 100 },
];
const AllTransactionsModal = ({ show, close }) => {
  const user = useSelector((state) => state.userStore);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [sortType, setSortType] = useState({ sort: ASC, field: "date" });

  const [filteredData, setFilteredData] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [nextToken, setNextToken] = useState(null);
  const [oldScrollPos, setOldScrollPos] = useState(0);
  const scrollParentRef = useRef();
  const loadData = async () => {
    if (user && nextToken !== "") {
      setLoading(true);
      try {
        const rt = await API.graphql(
          graphqlOperation(campaignsByUserId, {
            userId: user.id,
            limit: 10,
            sortDirection: "DESC",
            nextToken: nextToken,
          })
        );
        if (nextToken === null) {
          setTransactions(rt.data.campaignsByUserId.items);
        } else {
          setTransactions([
            ...transactions,
            ...rt.data.campaignsByUserId.items,
          ]);
        }
        setNextToken(rt.data.campaignsByUserId.nextToken);
      } catch (err) {}
      setLoading(false);
    }
  };
  const sortData = useCallback(() => {
    let newData = transactions.map((item) => {
      let option =
        (item.automatedEmail ? "Automated Email, " : "") +
        (item.automatedText ? "Automated Text, " : "") +
        (item.automatedRinglessVoiceMail
          ? "Automated Ringless Voicemail, "
          : "") +
        (item.automatedPostcard ? "Automated Postcard, " : "") +
        (item.automatedSocialPost ? "Automated SocialPost, " : "");
      option = option.substr(0, option.length - 2);
      if (option.length > 50) {
        option = option.substr(0, 50) + "...";
      }
      return {
        date: new Date(item.createdAt).toLocaleDateString(),
        campaign: item.title,
        qty:
          (item.automatedEmail?.prospects || 0) +
          (item.automatedText?.prospects || 0) +
          (item.automatedRinglessVoiceMail?.prospects || 0) +
          (item.automatedPostcard?.prospects || 0) +
          (item.automatedSocialPost?.prospects || 0),
        options: option,
        total: item.checkout.total,
        data: item,
      };
    });
    if (search.length > 0) {
      newData = newData.filter((item) =>
        item.campaign.toLowerCase().includes(search.toLowerCase())
      );
    }
    newData = newData.sort((a, b) => {
      return a[sortType.field] < b[sortType.field]
        ? 0 - sortType.sort
        : 0 + sortType.sort;
    });
    setFilteredData(newData);
  }, [sortType, transactions, search]);
  useEffect(() => {
    setTransactions([]);
    loadData();
    // eslint-disable-next-line   react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    sortData();
  }, [sortData]);

  const changeSort = (field) => {
    if (field === sortType.field) {
      setSortType({ sort: 0 - sortType.sort, field: field });
    } else {
      setSortType({ sort: ASC, field: field });
    }
  };

  const viewDetail = (item) => {
    setShowModal(true);
    setSelectedCampaign(item.data);
  };
  const scrollEvent = (event) => {
    const target = event.target;
    const delta = 60;
    if (
      target.clientHeight + target.scrollTop + delta >= target.scrollHeight &&
      !loading &&
      target.scrollTop > oldScrollPos &&
      nextToken
    ) {
      loadData();
    }

    setOldScrollPos(target.scrollTop);
  };
  return (
    <>
      <Modal
        show={show}
        onHide={close}
        size="lg"
        className={showModal ? "d-none" : ""}
      >
        <Modal.Header className="justify-content-start" closeButton>
          <Modal.Title>Transactions</Modal.Title>
        </Modal.Header>

        <Modal.Body className="mb-5">
          <InputGroup className="mb-4" style={{ width: 320 }}>
            <InputGroup.Prepend>
              <img src="/assets/icons/search.svg" alt="search" />
            </InputGroup.Prepend>
            <FormControl
              id="search-list"
              type="text"
              placeholder="Search list"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </InputGroup>
          <div
            style={{ height: 600, overflow: "auto" }}
            ref={scrollParentRef}
            onScroll={(e) => scrollEvent(e)}
          >
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
                            (sortType.field === item.field
                              ? "sorted-field"
                              : "")
                          : ""
                      }
                      onClick={() =>
                        item.sortable ? changeSort(item.field) : null
                      }
                      width={item.width}
                    >
                      {item.title}
                      {item.sortable && (
                        <span
                          className={
                            (sortType.field === item.field &&
                            sortType.sort === ASC
                              ? "desc "
                              : "") + "sort-icon"
                          }
                        ></span>
                      )}
                    </th>
                  ))}
                  <th width="10"></th>
                </tr>
              </thead>
              <tbody>
                {filteredData &&
                  filteredData.map((item, idx) => (
                    <tr key={idx} className="clickable">
                      <td>{idx + 1}</td>
                      {tableFields.map((field, col) => (
                        <td key={col} onClick={() => viewDetail(item)}>
                          {item[field.field]}
                        </td>
                      ))}
                      <td>
                        <img
                          src="/assets/icons/chevron-right-blue.svg"
                          className="link mr-3"
                          alt="email"
                        />
                      </td>
                    </tr>
                  ))}
                {loading && filteredData.length < 10 && (
                  <tr>
                    <td colSpan={7}>
                      <div className="d-flex justify-content-center">
                        <Spinner animation="border" role="status" />
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
          {loading && filteredData.length >= 10 && (
            <div className="d-flex justify-content-center">
              <Spinner animation="border" role="status" />
            </div>
          )}
        </Modal.Body>
      </Modal>
      <ViewCampaignModal
        close={() => setShowModal(false)}
        show={showModal}
        data={selectedCampaign}
      />
    </>
  );
};

export default AllTransactionsModal;
