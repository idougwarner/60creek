import React, { useEffect, useState } from 'react';
import { DropdownButton, FormCheck } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router';
import {
  INTEREST_STATUS,
  INTEREST_STATUSES,
} from '../../helpers/interestStatus';
import './FilterDropdown.scss';

const FilterDropdown = ({ changeFilterEvent }) => {
  const [filterList, setFilterList] = useState([]);
  const [filterStatus, setFilterStatus] = useState([]);
  const history = useHistory();
  const location = useLocation();

  const [filterFieldOptions, setFilterFieldOptions] = useState([]);
  const prospectList = useSelector((state) => state.prospectStore.prospectList);
  const completedProspectedListId =
    useSelector((state) => state.uploadWorkerStore.prospectListId) || '';

  useEffect(() => {
    if (completedProspectedListId) {
      setFilterList([completedProspectedListId]);
    }
  }, [completedProspectedListId]);
  const changeStatusFilter = (status) => {
    if (status === INTEREST_STATUS.ALL) {
      setFilterStatus([]);
    } else {
      const newList = [...filterStatus];
      const i = filterStatus.indexOf(status);
      if (i < 0) {
        newList.push(status);
      } else {
        newList.splice(i, 1);
      }
      setFilterStatus(newList);
    }
  };
  const changeProspectListFilter = (value) => {
    if (value === 'all') {
      setFilterList([]);
    } else {
      let oldList = [...filterList];
      const idx = oldList.indexOf(value);
      if (idx >= 0) {
        oldList.splice(idx, 1);
      } else {
        oldList.push(value);
      }
      setFilterList(oldList);
    }
  };

  useEffect(() => {
    if (prospectList) {
      setFilterFieldOptions(
        prospectList.map((item) => ({ label: item.name, value: item.id }))
      );
    }
  }, [prospectList]);
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    queryParams.delete('prospectList');
    queryParams.delete('status');
    for (let i = 0; i < filterList.length; i++) {
      queryParams.append('prospectList', filterList[i]);
    }
    for (let i = 0; i < filterStatus.length; i++) {
      queryParams.append('status', filterStatus[i]);
    }
    history.push({ search: queryParams.toString() });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterList, filterStatus]);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const prospectListIds = queryParams.getAll('prospectList');
    const status = queryParams.getAll('status');
    setFilterList(prospectListIds);
    setFilterStatus(status);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
      <DropdownButton
        variant='outline-primary'
        title={
          <>
            <img src='/assets/icons/filter.svg' className='mr-3' alt='filter' />
            {filterList.length === 0 && filterStatus.length === 0 ? (
              'Filter Prospects'
            ) : filterList.length === 0 && filterStatus.length !== 0 ? (
              filterStatus[0]
            ) : filterList.length !== 0 && filterStatus.length === 0 ? (
              'Prospect List' +
              (filterList.length > 1 ? '(' + filterList.length + ')' : '')
            ) : (
              <>
                {'Prospect List' +
                  (filterList.length > 1 ? '(' + filterList.length + ')' : '')}
                <span className='sub-option'>{filterStatus[0]}</span>
              </>
            )}
          </>
        }
        className='filter-dropdown'
      >
        <h5>Filters</h5>
        <div className='label'>Prospect Lists</div>
        <DropdownButton
          variant='outline-primary'
          className='prospect-list'
          title={
            filterList.length === 0
              ? 'All Prospects'
              : 'Prospects (' + filterList.length + ')'
          }
        >
          <div
            className={
              (filterList.length === 0 ? 'active ' : '') + 'prospect-list-item'
            }
            onClick={() => changeProspectListFilter('all')}
          >
            All Prospects
          </div>
          {filterFieldOptions.map((item, idx) => (
            <div
              key={idx}
              className={
                (filterList.findIndex((it) => it === item.value) >= 0
                  ? 'active '
                  : '') + 'prospect-list-item'
              }
              onClick={() => changeProspectListFilter(item.value)}
            >
              {item.label}
            </div>
          ))}
        </DropdownButton>
        <div className='label'>Status</div>
        <FormCheck
          custom
          type='checkbox'
          id='all'
          label='All'
          className='mb-3'
          checked={filterStatus.length === 0}
          onChange={() => changeStatusFilter(INTEREST_STATUS.ALL)}
        />
        {INTEREST_STATUSES.map((item, idx) => (
          <FormCheck
            key={idx}
            custom
            type='checkbox'
            id={'checkbox-intesete-status-' + idx}
            label={item}
            className='mb-3'
            checked={filterStatus.includes(item)}
            onChange={(event) => changeStatusFilter(item, event.target.checked)}
          />
        ))}
      </DropdownButton>
    </>
  );
};

export default FilterDropdown;
