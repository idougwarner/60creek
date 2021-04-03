import { API, graphqlOperation } from 'aws-amplify';
import React, { useEffect, useState } from 'react';
import { Button, Dropdown, DropdownButton, Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { prospectsCountsByProspectListId } from '../../../graphql/custom-queries';
import { QUERY_LIMIT } from '../../../helpers/constants';
import { APP_URLS } from '../../../helpers/routers';
import { CREATE_CAMPAIGN_ACTIONS } from '../../../redux/actionTypes';
import InfoTooltip from '../../controls/InfoTooltip';

const WizardDetailsStep = () => {
  const [campaignTitle, setCampaignTitle] = useState('');
  const [selectedList, setSelectedList] = useState(null);
  const [loading, setLoading] = useState(false);

  const list = useSelector((state) => state.prospectStore.prospectList) || [];
  const detailsInfo = useSelector((state) => state.createCampaignStore.details);
  const dispatch = useDispatch();
  const gotoNextStep = () => {
    dispatch({
      type: CREATE_CAMPAIGN_ACTIONS.UPDATE_DETAILS,
      data: {
        campaignTitle: campaignTitle,
        targetList: selectedList,
      },
    });
    dispatch({ type: CREATE_CAMPAIGN_ACTIONS.UPDATE_STEP, data: 1 });
  };
  useEffect(() => {
    if (detailsInfo) {
      setCampaignTitle(detailsInfo.campaignTitle);
      setSelectedList(detailsInfo.targetList);
    }
  }, [detailsInfo]);
  const changeProspectList = async (value) => {
    setSelectedList(value);
    try {
      setLoading(true);
      const rt = await API.graphql(
        graphqlOperation(prospectsCountsByProspectListId, {
          limit: QUERY_LIMIT,
          prospectListId: value.value,
        })
      );
      dispatch({
        type: CREATE_CAMPAIGN_ACTIONS.UPDATE_DEFAULT_PROSPECTS,
        data: rt.data.prospectsByProspectListId.scannedCount,
      });
      setLoading(false);
    } catch (err) {}
  };
  return (
    <div>
      <Form.Group>
        <Form.Label className='required'>Marketing Campaign Title</Form.Label>
        <Form.Control
          type='text'
          placeholder='Enter Campaign Name'
          value={campaignTitle}
          className={campaignTitle ? 'completed' : ''}
          onChange={(e) => setCampaignTitle(e.target.value)}
        />
      </Form.Group>
      <Form.Group>
        <Form.Label className='required'>
          Target List
          <InfoTooltip description='Select a prospect list that would be the target of a new campaign' />
        </Form.Label>
        {list && list.length > 0 ? (
          <DropdownButton
            variant='outline-primary'
            className={
              'custom-dropdown ' + (selectedList ? 'completed' : 'uncompleted')
            }
            title={selectedList ? selectedList.label : 'Select Prospect List'}
          >
            {list.map((item, idx) => (
              <Dropdown.Item
                key={idx}
                className={
                  selectedList && item.id === selectedList.value
                    ? 'active '
                    : ''
                }
                onClick={() =>
                  changeProspectList({ label: item.name, value: item.id })
                }
              >
                {item.name}
              </Dropdown.Item>
            ))}
          </DropdownButton>
        ) : (
          <NavLink to={APP_URLS.PROSPECTS} className='d-block'>
            No Prospect Lists found. Create one now!
          </NavLink>
        )}
      </Form.Group>
      <Button
        variant='primary'
        size='lg'
        className='w-100 mb-3'
        disabled={!campaignTitle || !selectedList || loading}
        onClick={() => gotoNextStep()}
      >
        NEXT
      </Button>

      <NavLink className='btn btn-lg btn-light w-100' to={APP_URLS.MARKETING}>
        CANCEL
      </NavLink>
    </div>
  );
};

export default WizardDetailsStep;
