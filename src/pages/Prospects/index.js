import React, { useEffect, useState } from 'react';
import './Prospects.scss';
import {
  DropdownButton,
  Dropdown,
  Table,
  InputGroup,
  FormControl,
  FormCheck,
  Spinner,
  SplitButton,
} from 'react-bootstrap';
import AddSingleProspectModal from '../../components/Prospects/AddSingleProspectModal';
import NewProspectListModal from '../../components/Prospects/NewProspectListModal';
import { API, graphqlOperation } from 'aws-amplify';
import { prospectListsByUserId } from '../../graphql/queries';
import {
  downloadCSVFromJSON,
  downloadXlsxFromJSON,
  formatProspects,
} from '../../helpers/CSVFileHelper';
import { useDispatch, useSelector } from 'react-redux';
import InfiniteScroll from 'react-infinite-scroll-component';
import FilterDropdown from '../../components/Prospects/FilterDropdown';
import { ACTIONS } from '../../redux/actionTypes';
import { useHistory, useLocation } from 'react-router-dom';
import { APP_URLS } from '../../helpers/routers';
import { QUERY_LIMIT } from '../../helpers/constants';
import { deleteProspect } from '../../graphql/mutations';
import ConfirmDeleteModal from '../../components/Prospects/ConfirmDeleteModal';
import { onUpdateProspectList } from '../../graphql/subscriptions';
import { customSearchProspects } from '../../graphql/custom-queries';

const tableFields = [
  { title: 'STATUS', field: 'status', sortable: false },
  { title: 'FIRST', field: 'firstName', sortable: true },
  { title: 'LAST', field: 'lastName', sortable: true },
  { title: 'EMAIL', field: 'email', sortable: true },
  { title: 'PHONE', field: 'phone', sortable: true },
  { title: 'COMPANY', field: 'company', sortable: true },
  // { title: "STREET", field: "address1", sortable: true },
  { title: 'CITY', field: 'city', sortable: true },
  { title: 'STATE', field: 'state', sortable: true },
  // { title: "ZIP", field: "zip", sortable: true },
  // { title: "CONTACT INFO", field: "contactInfo", sortable: false },
];

const ASC = 'asc';
const DESC = 'desc';

var timer = null;
var oldParams = '-';
var from = 0;

const ProspectsPage = () => {
  const [prospects, setProspects] = useState([]);
  const [total, setTotal] = useState(0);

  const [strFilter, setStrFilter] = useState('');

  const [sortType, setSortType] = useState({
    direction: ASC,
    field: 'lastName',
  });

  const [showAddExistingModal, setShowAddExistingModal] = useState(false);
  const [showSingleModal, setShowSingleModal] = useState(false);
  const [showNewListModal, setShowNewListModal] = useState(false);
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showOriginUpload, setShowOriginUpload] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const user = useSelector((state) => state.userStore);
  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch();

  const loadData = async () => {
    setLoading(true);
    try {
      const rtList = await API.graphql(
        graphqlOperation(prospectListsByUserId, {
          userId: user.id,
          limit: QUERY_LIMIT,
        })
      );
      if (rtList?.data?.prospectListsByUserId?.items) {
        dispatch({
          type: ACTIONS.SET_PROSPECT_LIST,
          prospectList: rtList.data.prospectListsByUserId.items,
        });
      }

      let filters = [{ userId: { eq: user.id } }];
      const queryParams = new URLSearchParams(location.search);
      const prospectListIds = queryParams.getAll('prospectList');
      if (prospectListIds.length > 0) {
        filters.push({
          or: prospectListIds.map((item) => ({ prospectListId: { eq: item } })),
        });
      }
      const status = queryParams.getAll('status');
      if (status.length > 0) {
        filters.push({
          or: status.map((item) => ({ status: { eq: item } })),
        });
      }
      const strSearch = queryParams.get('search');
      if (strSearch) {
        filters.push({
          or: [
            { firstName: { wildcard: `*${strSearch}*` } },
            { lastName: { wildcard: `*${strSearch}*` } },
            { email: { wildcard: `*${strSearch}*` } },
            { phone: { wildcard: `*${strSearch}*` } },
          ],
        });
      }

      const sortField = queryParams.get('field') || 'lastName';
      const direction = queryParams.get('direction') || ASC;
      const rt = await API.graphql(
        graphqlOperation(customSearchProspects, {
          sort: {
            direction: direction,
            field: sortField,
          },
          limit: 15,
          from: from,
          filter: {
            and: filters,
          },
        })
      );
      if (rt?.data?.searchProspects?.items) {
        if (from === 0) {
          setProspects([...rt.data.searchProspects.items]);
        } else {
          setProspects([...prospects, ...rt.data.searchProspects.items]);
        }
        from += rt.data.searchProspects.items.length;

        setTotal(rt.data.searchProspects.total);
      }
    } catch (err) {}
    setLoading(false);
  };

  useEffect(() => {
    if (user && oldParams !== location.search) {
      oldParams = location.search;
      from = 0;
      setSelected([]);
      setProspects([]);
      loadData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location, user]);

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
  const getExportData = () => {
    let rtVal = [...prospects];
    if (selected.length > 0) {
      rtVal = rtVal.filter((item) => selected.includes(item.id));
    }
    return formatProspects(rtVal);
  };
  const downloadCSV = () => {
    downloadCSVFromJSON(getExportData(), 'Prospects.csv');
  };
  const downloadExcel = () => {
    downloadXlsxFromJSON(getExportData(), 'Prospects.xlsx');
  };
  const changeSort = (field) => {
    let newDirection = ASC;
    if (field === sortType.field) {
      newDirection = sortType.direction === ASC ? DESC : ASC;
    }

    const queryParams = new URLSearchParams(location.search);
    queryParams.delete('field');
    queryParams.delete('direction');
    queryParams.append('field', field);
    queryParams.append('direction', newDirection);
    history.push({ search: queryParams.toString() });

    setSortType({ direction: newDirection, field: field });
  };
  const keyUpEvent = () => {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      const queryParams = new URLSearchParams(location.search);
      queryParams.delete('search');
      if (strFilter) {
        queryParams.append('search', strFilter);
      }
      history.push({ search: queryParams.toString() });
    }, 800);
  };
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const search = queryParams.get('search');
    const sortField = queryParams.get('field') || 'lastName';
    const direction = queryParams.get('direction') || ASC;
    setSortType({
      direction: direction,
      field: sortField,
    });
    if (search) {
      setStrFilter(search);
    }
    // eslint-disable-next-line
  }, []);

  const onUpdateProspectListSubscription = (data) => {
    const prospectList = data.value.data.onUpdateProspectList;
    if (
      user &&
      prospectList &&
      user.id === prospectList.userId &&
      prospectList.uploadStatus === 'completed'
    ) {
      loadData();
    }
  };
  useEffect(() => {
    const updateProspectListSubscription = API.graphql(
      graphqlOperation(onUpdateProspectList)
    ).subscribe({
      next: onUpdateProspectListSubscription,
    });
    oldParams = '-';
    return () => {
      updateProspectListSubscription.unsubscribe();
      oldParams = '-';
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const selectAll = () => {
    if (selected.length < prospects.length) {
      setSelected(prospects.map((item) => item.id));
    } else {
      setSelected([]);
    }
  };
  const gotoDetailPage = (id) => {
    history.push({
      pathname: APP_URLS.PROSPECTS + '/' + id,
      search: location.search,
    });
  };

  const deleteProspects = async () => {
    setDeleting(true);
    try {
      const newData = [...prospects];
      for (let i = 0; i < selected.length; i++) {
        await API.graphql(
          graphqlOperation(deleteProspect, {
            input: { id: selected[i] },
          })
        );
        const idx = newData.findIndex((item) => item.id === selected[i]);
        newData.splice(idx, 1);
      }
      from = 0;
      setProspects([]);
      setSelected([]);
      loadData();
    } catch (err) {}
    setDeleting(false);
  };
  return (
    <>
      <h4>Prospect List</h4>
      <div className='mb-4'>
        <SplitButton
          variant='primary'
          title='ADD PROSPECT(S)'
          className='add-prospects-btn'
        >
          <Dropdown.Item
            eventKey='1'
            onClick={() => {
              setShowNewListModal(true);
            }}
          >
            <img
              src='/assets/icons/new-list.svg'
              className='item-icon'
              alt='new-list'
            />
            CREATE NEW LIST
          </Dropdown.Item>
          <Dropdown.Item
            eventKey='2'
            onClick={() => {
              setShowAddExistingModal(true);
            }}
          >
            <img
              src='/assets/icons/add-to-existing-list.svg'
              className='item-icon'
              alt='add-new-to-existing-list'
            />
            ADD TO EXISTING LIST
          </Dropdown.Item>
          <Dropdown.Item eventKey='3' onClick={() => setShowSingleModal(true)}>
            <img
              src='/assets/icons/new-list.svg'
              className='item-icon'
              alt='add-single'
            />
            ADD SINGLE PROSPECT
          </Dropdown.Item>
        </SplitButton>
      </div>
      <div className='card'>
        <div className='d-flex justify-content-between mb-4'>
          <div className='d-flex'>
            <InputGroup className='search-input'>
              <InputGroup.Prepend>
                <img src='/assets/icons/search.svg' alt='search' />
              </InputGroup.Prepend>
              <FormControl
                id=''
                placeholder='Search List ...'
                value={strFilter}
                onChange={(e) => setStrFilter(e.target.value)}
                onKeyUp={() => keyUpEvent()}
              />
            </InputGroup>
            <FilterDropdown />
          </div>
          <DropdownButton
            variant='light'
            className='more-menu-btn'
            title={<img src='/assets/icons/more.svg' alt='search' />}
          >
            <Dropdown.Item onClick={downloadExcel}>
              <img
                src='/assets/icons/excel.svg'
                className='item-icon'
                alt='excel'
                onClick={downloadExcel}
              />
              Excel
            </Dropdown.Item>
            <Dropdown.Item onClick={downloadCSV}>
              <img
                src='/assets/icons/csv.svg'
                className='item-icon'
                alt='csv'
              />
              CSV
            </Dropdown.Item>
            <Dropdown.Item
              onClick={() => setShowConfirmModal(true)}
              disabled={selected.length === 0}
            >
              <img
                src='/assets/icons/delete.svg'
                className='item-icon'
                alt='csv'
              />
              Delete
            </Dropdown.Item>
          </DropdownButton>
        </div>
        <div className='d-flex justify-content-between mb-4'>
          <div className='selected d-flex align-items-center'>
            {!deleting ? (
              <>{selected.length} selected</>
            ) : (
              <>
                <Spinner
                  size='sm'
                  animation='border'
                  role='status'
                  style={{ marginRight: 10 }}
                />{' '}
                deleting ...
              </>
            )}
          </div>
          <div className='showing'>
            Showing<span>{prospects.length}</span>of
            <span>{total}</span>prospects
          </div>
        </div>

        <InfiniteScroll
          dataLength={prospects.length}
          scrollThreshold='50px'
          next={loadData}
          hasMore={prospects.length < total}
        >
          <Table responsive='xl' className='data-table'>
            <thead>
              <tr>
                <th width='30'>
                  <FormCheck
                    custom
                    checked={selected.length > 0}
                    className={
                      selected.length > 0 &&
                      selected.length !== prospects.length
                        ? 'indeterminate'
                        : ''
                    }
                    onChange={() => selectAll()}
                    type='checkbox'
                    id={'checkbox-all'}
                  />
                </th>
                {tableFields.map((item, id) => (
                  <th
                    key={id}
                    className={
                      item.sortable
                        ? 'sort-field ' +
                          (sortType.field === item.field ? 'sorted-field' : '')
                        : ''
                    }
                    onClick={() =>
                      item.sortable ? changeSort(item.field) : null
                    }
                  >
                    {item.title}
                    {item.sortable && (
                      <span
                        className={
                          (sortType.field === item.field &&
                          sortType.direction === ASC
                            ? 'desc '
                            : '') + 'sort-icon'
                        }
                      ></span>
                    )}
                  </th>
                ))}
                {/* <th width="120">CONTACT INFO</th> */}
              </tr>
            </thead>
            <tbody>
              {prospects &&
                prospects.map((item, idx) => (
                  <tr key={idx} className='clickable'>
                    <td>
                      <FormCheck
                        custom
                        checked={
                          selected.findIndex((it) => it === item.id) >= 0
                            ? true
                            : false
                        }
                        type='checkbox'
                        id={'checkbox-' + idx}
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
                  </tr>
                ))}

              {loading && (
                <tr>
                  <td colSpan='10' align='center'>
                    <Spinner animation='border' role='status' />
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </InfiniteScroll>
        {showAddExistingModal && (
          <NewProspectListModal
            show={showAddExistingModal}
            close={() => {
              setShowAddExistingModal(false);
              setShowNewListModal(false);
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
            close={() => {
              setShowAddExistingModal(false);
              setShowOriginUpload(false);
              setShowNewListModal(false);
            }}
          />
        )}
        {showOriginUpload && (
          <NewProspectListModal
            show={showOriginUpload}
            close={() => {
              setShowAddExistingModal(false);
              setShowOriginUpload(false);
              setShowNewListModal(false);
            }}
            originUpload={true}
          />
        )}
      </div>
      <ConfirmDeleteModal
        show={showConfirmModal}
        close={({ data }) => {
          setShowConfirmModal(false);
          if (data) {
            deleteProspects();
          }
        }}
        prospectsCount={selected.length}
      />
    </>
  );
};

export default ProspectsPage;
