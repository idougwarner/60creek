import { API, graphqlOperation } from "aws-amplify";
import React, { useCallback, useEffect, useState } from "react";
import { Button, Spinner, Table } from "react-bootstrap";
import { useSelector } from "react-redux";
import { campaignsByUserId } from "../../graphql/queries";
import AllTransactionsModal from "./AllTransactionsModal";
import ViewCampaignModal from "./ViewCampaignModal";

const ASC = 1;
const tableFields = [
  { title: "DATE", field: "date", sortable: true },
  { title: "CAMPAIN", field: "campaign", sortable: true },
  { title: "QTY", field: "qty", sortable: true },
  { title: "OPTIONS", field: "options", sortable: true },
  { title: "TOTAL", field: "total", sortable: true },
];
const Transactions = () => {
  const user = useSelector((state) => state.userStore);
  const [showModal, setShowModal] = useState(false);
  const [showAllModal, setShowAllModal] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [sortType, setSortType] = useState({ sort: ASC, field: "lastName" });

  const [filteredData, setFilteredData] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const loadData = useCallback(async () => {
    if (user) {
      setLoading(true);
      try {
        const rt = await API.graphql(
          graphqlOperation(campaignsByUserId, {
            userId: user.id,
            limit: 4,
            sortDirection: "DESC",
          })
        );
        setTransactions(rt.data.campaignsByUserId.items);
      } catch (err) {}
      setLoading(false);
    }
  }, [user]);
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
    newData = newData.sort((a, b) => {
      return a[sortType.field] < b[sortType.field]
        ? 0 - sortType.sort
        : 0 + sortType.sort;
    });
    setFilteredData(newData);
  }, [sortType, transactions]);
  useEffect(() => {
    loadData();
  }, [loadData]);
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
  return (
    <div>
      <h4>Transactions</h4>
      <div className="card p-5">
        <Table responsive="xl" className="data-table">
          <thead>
            <tr>
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
              <th width="30"></th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan="5" align="center">
                  <Spinner animation="border" role="status" />
                </td>
              </tr>
            )}
            {!loading &&
              filteredData &&
              filteredData.map((item, idx) => (
                <tr key={idx} className="clickable">
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
          </tbody>
        </Table>
        {!loading && filteredData && (
          <div className="d-flex justify-content-center">
            <Button variant="link" onClick={() => setShowAllModal(true)}>
              VIEW ALL
            </Button>
          </div>
        )}
        <ViewCampaignModal
          close={() => setShowModal(false)}
          show={showModal}
          data={selectedCampaign}
        />
        <AllTransactionsModal
          close={() => setShowAllModal(false)}
          show={showAllModal}
        />
      </div>
    </div>
  );
};

export default Transactions;
