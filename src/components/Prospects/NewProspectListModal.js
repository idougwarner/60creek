import React, { useEffect, useRef, useState } from 'react';
import { Button, Form, Modal, Spinner, Table } from 'react-bootstrap';
import './NewProspectListModal.scss';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { getJsonFromFile } from '../../helpers/CSVFileHelper';
import { API, graphqlOperation, Storage } from 'aws-amplify';
import {
  createProspectList,
  createStripeCustomer,
  updateProspectList,
} from '../../graphql/mutations';
import { useSelector } from 'react-redux';
import ConfirmModal from './ConfirmModal';
import Select from 'react-select';
import { customSelectStyles } from '../../assets/styles/select-style';
import CheckoutForm from './CheckoutForm';
import { messageConvert } from '../../helpers/messageConvert';
import { v4 as uuidv4 } from 'uuid';
import { usStates } from '../../helpers/us-states';
import {
  validateEmail,
  validateZip,
  validateField,
} from '../../helpers/validations';
import InputMask from 'react-input-mask';
import InfoTooltip from '../controls/InfoTooltip';
import { INTEREST_STATUS } from '../../helpers/interestStatus';
import { timeConversion } from '../../helpers/utils';

const STEP1 = 0;
const STEP2 = 1;
const STEP3 = 2;
const STEP4 = 3;
const tableFields = [
  { fieldName: 'firstName', required: false, width: '93px' },
  { fieldName: 'lastName', required: true, width: '100px' },
  { fieldName: 'company', required: true, width: '140px' },
  { fieldName: 'address1', required: false, width: '180px' },
  { fieldName: 'city', required: false, width: '110px' },
  { fieldName: 'state', required: false, width: '95px' },
  { fieldName: 'zip', required: false, width: '80px' },
  { fieldName: 'phone', required: false, width: '160px' },
  { fieldName: 'email', required: false, width: 'auto' },
  { fieldName: 'facebook', required: false, width: '140px' },
];
const NewProspectListModal = ({ show, close, existingList = false }) => {
  const [step, setStep] = useState(STEP1);
  const [percentage, setPercentage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadingEnhanceData, setLoadingEnhanceData] = useState(false);
  const [listName, setListName] = useState('');
  const [fileName, setFileName] = useState('');
  const [enhance, setEnhance] = useState(true);
  const [prospects, setProspects] = useState([]);
  const [isNext, setIsNext] = useState(false);
  const [errors, setErrors] = useState(0);
  const [estimate, setEstimate] = useState('');
  const [completed, setCompleted] = useState(false);
  const [totalNumber, setTotalNumber] = useState('');
  const [fileData, setFileData] = useState([]);
  const [fileErrMsg, setFileErrMsg] = useState('');
  const [customerId, setCustomerId] = useState('');
  const [paymentMethodId, setPaymentMethodId] = useState('');

  const [tmpState, setTmpState] = useState(null);

  const [editField, setEditField] = useState('');
  const [editing, setEditing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [generateToken, setGenerateToken] = useState(false);
  const [cardStatus, setCardStatus] = useState(false);

  const [stripeErrMsg, setStripeErrMsg] = useState('');
  const [selectedField, setSelectedField] = useState({
    idx: -1,
    fieldName: '',
  });

  const [showCloseConfirm, setShowCloseConfirm] = useState(false);

  const fileInputRef = useRef();
  const user = useSelector((state) => state.userStore);

  const [list, setList] = useState([]);
  const [selectedProspectList, setSelectedProspectList] = useState(null);
  const list1 = useSelector((state) => state.prospectStore.prospectList);

  useEffect(() => {
    if (list1) {
      setList(list1.map((item) => ({ value: item.id, label: item.name })));
    }
  }, [list1]);

  const updateUploadingStatus = (percentage = 0, estimate = '') => {
    setPercentage(percentage);
    setEstimate(estimate);
  };

  // const prev = () => {
  //   if (step > STEP1) {
  //     setStep(step - 1);
  //   }
  // };

  const pushData = async () => {
    try {
      let prospectListId = selectedProspectList?.value || '';

      const userId = user.id;

      updateUploadingStatus(0);

      updateUploadingStatus(15, timeConversion(3500));

      if (prospectListId) {
        await API.graphql(
          graphqlOperation(updateProspectList, {
            input: {
              id: prospectListId,
              enhance: enhance,
              uploadStatus: 'upload-start',
            },
          })
        );
      } else {
        const listInfo = await API.graphql(
          graphqlOperation(createProspectList, {
            input: {
              userId: userId,
              name: listName,
              enhance: enhance,
              uploadStatus: 'upload-start',
            },
          })
        );
        prospectListId = listInfo.data.createProspectList.id;
      }
      updateUploadingStatus(50, timeConversion(3000));

      const completedProspects = prospects.map((item) => ({
        userId: userId,
        prospectListId: prospectListId,
        firstName: item.firstName,
        lastName: item.lastName,
        address1: item.address1,
        city: item.city,
        state: item.state,
        zip: item.zip,
        company: item.company,
        phone: item.phone,
        email: item.email,
        facebook: item.facebook,
        status: item.status || INTEREST_STATUS.INTERESTED,
        enhance: enhance ? true : false,
        enhanced: false,
        fetched: false,
        demographic: null,
        lifestyle: null,
      }));
      const completedProspectList = {
        id: prospectListId,
        customerId: customerId,
        customerEmail: user.email,
        paymentMethodId: paymentMethodId,
        enhance: enhance,
        uploadStatus: enhance ? 'need-enhance' : 'completed',
      };

      const blob = new Blob(
        [
          JSON.stringify({
            prospects: completedProspects,
            prospectList: completedProspectList,
          }),
        ],
        {
          type: 'text/csv',
        }
      );
      const file = new File([blob], uuidv4() + '.pst');
      await Storage.put('prospects/' + uuidv4() + '-' + file.name, file);

      updateUploadingStatus(100);
      setCompleted(true);
      setTimeout(() => {
        setStep(STEP4);
      }, 1000);
    } catch (err) {}
  };

  useEffect(() => {
    setCompleted(false);
    setPercentage(0);
  }, []);
  const next = () => {
    if (step < STEP3) {
      setStep(step + 1);
    }
  };
  useEffect(() => {
    if (show) {
      setStep(STEP1);
      setCompleted(false);
    }
  }, [show]);
  useEffect(() => {
    if (
      !loading &&
      !fileErrMsg &&
      (existingList ? selectedProspectList : listName) &&
      prospects.length > 0 &&
      (enhance ? cardStatus : true)
    ) {
      setIsNext(true);
    } else {
      setIsNext(false);
    }
  }, [
    loading,
    fileErrMsg,
    listName,
    selectedProspectList,
    prospects,
    existingList,
    enhance,
    cardStatus,
  ]);
  useEffect(() => {
    let errCounts = 0;
    prospects.forEach((item) => {
      if (!item.lastName && !item.company) errCounts++;
      if (item.phone && !validateField('phone', item.phone)) errCounts++;
      if (item.email && !validateField('email', item.email)) errCounts++;
      if (item.zip && !validateField('zip', item.zip)) errCounts++;
    });
    setErrors(errCounts);
  }, [prospects]);
  const uploadCsvFile = () => {
    fileInputRef.current.click();
  };
  useEffect(() => {
    if (totalNumber) {
      const n = parseInt(totalNumber);
      if (n > 0) {
        setProspects(fileData.slice(0, n));
      } else {
        setProspects(fileData);
      }
    } else {
      setProspects(fileData);
    }
  }, [fileData, totalNumber]);
  const onChangeFile = async (event) => {
    event.stopPropagation();
    event.preventDefault();
    if (event.target.files.length > 0) {
      setLoading(true);
      setFileErrMsg('');
      setFileName('');
      setFileData([]);
      try {
        const fData = await getJsonFromFile(event.target.files[0]);
        if (fData.length > 0) {
          setFileData(fData);
          setFileName(event.target.files[0].name);
        } else {
          setFileErrMsg(
            'Your CSV file is not supported. Please download the template to see the supported CSV file.'
          );
        }
        event.target.value = null;
      } catch (err) {
      } finally {
        setLoading(false);
      }
    }
  };
  const clearFile = () => {
    setProspects([]);
    setFileName('');
  };

  useEffect(() => {
    const f = async () => {
      if (!paymentMethod) return;
      if (enhance) {
        setLoadingEnhanceData(true);
        setStripeErrMsg('');
        try {
          const rt = await API.graphql(
            graphqlOperation(createStripeCustomer, {
              input: {
                email: user.email,
                paymentMethodId: paymentMethod,
              },
            })
          );
          if (rt.data.createStripeCustomer.error) {
            setStripeErrMsg(
              messageConvert(rt.data.createStripeCustomer.error.message)
            );
            setLoadingEnhanceData(false);
            return;
          }
          setCustomerId(rt.data.createStripeCustomer.data.customerId);
          setPaymentMethodId(rt.data.createStripeCustomer.data.paymentMethodId);
          next();
        } catch (err) {}
        setLoadingEnhanceData(false);
      }
    };
    f();
    // eslint-disable-next-line
  }, [paymentMethod]);

  const gotoSecondStep = async () => {
    if (enhance) {
      setLoadingEnhanceData(true);
      setGenerateToken(!generateToken);
    } else {
      next();
    }
  };
  const gotoThirdStep = async () => {
    pushData();
    setStep(STEP3);
  };
  const updateField = (value) => {
    let newList = [...prospects];
    if (selectedField.idx !== -1 && selectedField.fieldName !== '') {
      newList[selectedField.idx][selectedField.fieldName] = value;
    }
    setProspects(newList);
  };

  const toggleEditing = (idx, fieldName) => {
    if (
      // (selectedField.fieldName !== fieldName || idx !== selectedField.idx) &&
      editing
    ) {
      if (selectedField.idx === idx && selectedField.fieldName === fieldName) {
      } else {
        let newList = [...prospects];
        if (selectedField.idx !== -1 && selectedField.fieldName !== '') {
          newList[selectedField.idx][selectedField.fieldName] = editField;
        }
        setProspects(newList);
        if (newList[idx][fieldName] === '') {
          setSelectedField({
            idx: idx,
            fieldName: fieldName,
          });
          setEditField('');
          setEditing(true);
        } else {
          setSelectedField({
            idx: -1,
            fieldName: '',
          });
          setEditField('');
          setEditing(false);
        }
      }
    } else {
      setSelectedField({
        idx: idx,
        fieldName: fieldName,
      });
      if (fieldName === 'state') {
        const id = usStates.indexOf(prospects[idx][fieldName]);
        if (id < 0) {
          setTmpState(null);
        } else {
          setTmpState({ value: usStates[id], label: usStates[id] });
        }
      } else {
        setEditField(prospects[idx][fieldName]);
      }
      setEditing(true);
    }
  };

  const downloadTemplate = () => {
    const tmplateFileName = 'Prospect Template.csv';
    const data =
      'Status,First name,Last Name,Company,Street,City,State,Zip,Phone,Email,Facebook';
    const blob = new Blob([data], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = tmplateFileName;
    link.click();
  };
  const fieldComponent = (idx, fieldName, required = true) => {
    return (
      <>
        {editing &&
        idx === selectedField.idx &&
        fieldName === selectedField.fieldName ? (
          <>
            {fieldName === 'state' ? (
              <Select
                value={tmpState}
                onChange={(value) => {
                  setTmpState(value);
                  setEditField(value.value);
                  updateField(value.value);
                }}
                placeholder='State'
                styles={customSelectStyles(28)}
                options={usStates.map((item) => ({
                  value: item,
                  label: item,
                }))}
              />
            ) : fieldName === 'zip' ? (
              <Form.Control
                type='text'
                className='edit-field'
                placeholder='Enter Zip'
                autoFocus
                value={editField}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    toggleEditing(idx, fieldName);
                  } else if (event.key === 'Tab') {
                    event.preventDefault();
                    gotoNextField();
                  }
                }}
                isInvalid={editField && !validateZip(editField)}
                onChange={(event) => {
                  event.stopPropagation();
                  setEditField(event.target.value);
                  updateField(event.target.value);
                }}
              />
            ) : fieldName === 'phone' ? (
              <InputMask
                mask='(999) 999 - 9999'
                type='tel'
                placeholder='(555) 555 - 5555'
                value={editField}
                onChange={(event) => {
                  event.stopPropagation();
                  setEditField(event.target.value);
                  updateField(event.target.value);
                }}
              >
                {(inputProps) => (
                  <Form.Control
                    {...inputProps}
                    className='edit-field'
                    autoFocus
                    isInvalid={editField && editField.indexOf('_') >= 0}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') {
                        toggleEditing(idx, fieldName);
                      } else if (event.key === 'Tab') {
                        event.preventDefault();
                        gotoNextField();
                      }
                    }}
                  />
                )}
              </InputMask>
            ) : fieldName === 'email' ? (
              <Form.Control
                type='text'
                className='edit-field'
                placeholder='Enter Email Address'
                autoFocus
                value={editField}
                isInvalid={editField && !validateEmail(editField)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    toggleEditing(idx, fieldName);
                  } else if (event.key === 'Tab') {
                    event.preventDefault();
                    gotoNextField();
                  }
                }}
                onChange={(event) => {
                  event.stopPropagation();
                  setEditField(event.target.value);
                  updateField(event.target.value);
                }}
              />
            ) : (
              <Form.Control
                type='text'
                className='edit-field'
                placeholder=''
                autoFocus
                value={editField}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    toggleEditing(idx, fieldName);
                  } else if (event.key === 'Tab') {
                    event.preventDefault();
                    gotoNextField();
                  }
                }}
                onChange={(event) => {
                  event.stopPropagation();
                  setEditField(event.target.value);
                  updateField(event.target.value);
                }}
              />
            )}
            <Form.Text className='text-primary enter-info'>
              Enter info
            </Form.Text>
          </>
        ) : prospects[idx][fieldName].length > 0 ? (
          validateField(fieldName, prospects[idx][fieldName]) ? (
            prospects[idx][fieldName]
          ) : (
            <div className={'missing-info'}>
              <div className='missing-field'>{prospects[idx][fieldName]}</div>
              <span>Invalid field</span>
            </div>
          )
        ) : (
          <div
            className={
              'missing-info' +
              (required &&
              ((fieldName === 'lastName' && !prospects[idx].company) ||
                (fieldName === 'company' && !prospects[idx].lastName))
                ? ''
                : ' not-required')
            }
          >
            <div className='missing-field'></div>
            <span>Enter missing info</span>
          </div>
        )}
      </>
    );
  };
  const gotoNextField = () => {
    let row = -1;
    let fieldName = '';
    if (selectedField.idx === -1 || selectedField.fieldName === '') return;
    let idx = tableFields.findIndex(
      (item) => item.fieldName === selectedField.fieldName
    );
    let start = selectedField.idx * tableFields.length + idx;
    for (
      let i = start;
      i < start + prospects.length * tableFields.length;
      i++
    ) {
      const j = i % (prospects.length * tableFields.length);
      const x = j % tableFields.length,
        y = Math.floor(j / tableFields.length);
      if (
        y !== selectedField.idx ||
        tableFields[x].fieldName !== selectedField.fieldName
      ) {
        if (
          (prospects[y][tableFields[x].fieldName] === '' &&
            tableFields[x].required) ||
          (prospects[y][tableFields[x].fieldName] &&
            !validateField(
              tableFields[x].fieldName,
              prospects[y][tableFields[x].fieldName]
            ))
        ) {
          row = y;
          fieldName = tableFields[x].fieldName;
          break;
        }
      }
    }

    let newList = [...prospects];
    if (selectedField.idx !== -1 && selectedField.fieldName !== '') {
      newList[selectedField.idx][selectedField.fieldName] = editField;
    }
    setProspects(newList);
    setSelectedField({
      idx: row,
      fieldName: fieldName,
    });
    setEditField('');
  };
  return (
    <Modal
      show={show}
      className={showCloseConfirm ? 'd-none' : ''}
      onHide={() => {
        if (step === STEP2) {
          setShowCloseConfirm(true);
        } else if (step === STEP1) {
          close({ data: false });
        } else if (step === STEP3 || step === STEP4) {
          close({ data: true });
        }
      }}
      size={step === STEP2 ? 'xl' : 'md'}
    >
      <Modal.Header closeButton>
        <Modal.Title>
          {step === STEP1 ? (
            existingList ? (
              'Add To Existing List'
            ) : (
              'New Prospect List'
            )
          ) : step === STEP2 ? (
            existingList ? (
              'Prospects Added to ' + selectedProspectList.label
            ) : (
              'Prospects Created'
            )
          ) : (
            <>
              {completed ? (
                'Completed'
              ) : (
                <>
                  {' '}
                  Uploading
                  <br /> {prospects.length} Prospects
                </>
              )}
            </>
          )}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {step === STEP1 && (
          <div className='step-1'>
            {existingList ? (
              <Form.Group>
                <Form.Label className='required'>
                  Select Prospect List
                </Form.Label>
                <Select
                  placeholder='Select Prospect List'
                  options={list}
                  value={selectedProspectList}
                  styles={customSelectStyles('40px')}
                  onChange={(value) => setSelectedProspectList(value)}
                />
              </Form.Group>
            ) : (
              <Form.Group>
                <Form.Label className='required'>Prospect List Name</Form.Label>
                <Form.Control
                  type='text'
                  placeholder='List name'
                  value={listName}
                  onChange={(event) => {
                    setListName(event.target.value);
                  }}
                />
              </Form.Group>
            )}
            <Form.Group>
              <Form.Label>Total Number of Prospects</Form.Label>
              <Form.Control
                type='text'
                placeholder='Number of records'
                value={totalNumber}
                onChange={(e) => setTotalNumber(e.target.value)}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label className='d-flex align-items-center'>
                Template Download
              </Form.Label>
              <Form.Text className='text-muted mb-3'>
                This template must be used for upload as a csv file
              </Form.Text>
              <Button variant='outline-primary' onClick={downloadTemplate}>
                DOWNLOAD
              </Button>
            </Form.Group>
            <Form.Group>
              <Form.Label className='required'>Upload Prospect List</Form.Label>
              <Form.Text
                className='text-muted mb-2 d-flex flex-wrap align-items-center'
                style={{ overflowWrap: 'anywhere' }}
              >
                {fileErrMsg
                  ? fileErrMsg
                  : fileName
                  ? fileName
                  : 'No file selected'}
                {fileName && (
                  <Button
                    variant='link'
                    className='text-muted ml-4'
                    onClick={clearFile}
                  >
                    <img
                      src='/assets/icons/close-small.svg'
                      className='mr-1'
                      alt='close-small'
                    />
                    CLEAR
                  </Button>
                )}
              </Form.Text>
              <input
                ref={fileInputRef}
                type='file'
                accept='.csv'
                name='name'
                hidden
                onChange={onChangeFile}
              />
              <Button
                variant='outline-primary'
                onClick={uploadCsvFile}
                disabled={loading}
              >
                {loading ? 'UPLOADING' : 'UPLOAD'}
              </Button>
            </Form.Group>

            <Form.Group>
              <Form.Label className='required d-flex align-items-center'>
                Enhance Data
                <InfoTooltip description='Data Enhancement is a systematic process that will search and locate corresponding phone, email, demographic, and relational data variables specific to the uploaded prospects.' />
              </Form.Label>
              <Form.Check
                checked={enhance}
                name='enhance'
                className='mb-3'
                custom
                type='radio'
                id='enhance-yes'
                label='Yes'
                onChange={() => setEnhance(true)}
              />
              <Form.Check
                checked={!enhance}
                name='enhance'
                custom
                type='radio'
                id='enhance-no'
                label='No'
                onChange={() => setEnhance(false)}
              />
            </Form.Group>
            {enhance && (
              <CheckoutForm
                itemCounts={prospects.length}
                generateToken={generateToken}
                changePaymentMethod={(event) => setPaymentMethod(event)}
                changeCardStatus={(event) => setCardStatus(event)}
              />
            )}
            {stripeErrMsg && (
              <Form.Text className='text-danger'>{stripeErrMsg}</Form.Text>
            )}
          </div>
        )}
        {step === STEP2 && (
          <div className='step-2 mb-3'>
            <div className='d-flex justify-content-between mb-3'>
              <div className='summary'>
                We detected {prospects.length} contacts
                {errors ? (
                  <>
                    , and <span>{errors} errors</span>
                  </>
                ) : null}
                . Please check before confirming.
              </div>
              <div>
                <Button
                  variant='primary'
                  onClick={gotoThirdStep}
                  disabled={errors}
                >
                  CONFIRM
                </Button>
              </div>
            </div>
            <div className='table-container'>
              <Table responsive='xl' className='data-table'>
                <thead>
                  <tr>
                    <th>
                      FIRST<span className='sort-icon'></span>
                    </th>
                    <th>
                      LAST<span className='sort-icon'></span>
                    </th>
                    <th>
                      COMPANY<span className='sort-icon'></span>
                    </th>
                    <th>STREET</th>
                    <th>CITY</th>
                    <th>STATE</th>
                    <th>ZIP</th>
                    <th>PHONE</th>
                    <th>EMAIL</th>
                    <th>FACEBOOK</th>
                  </tr>
                </thead>
                <tbody>
                  {prospects.map((a, idx) => (
                    <tr key={idx}>
                      {tableFields.map((item, id) => (
                        <td
                          key={id}
                          onClick={() => toggleEditing(idx, item.fieldName)}
                          style={{ width: item.width }}
                        >
                          {fieldComponent(idx, item.fieldName, item.required)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </div>
        )}
        {step === STEP3 && (
          <div className='step-3 d-flex flex-column align-items-center mb-3'>
            {!completed && (
              <div className='text-muted mb-3'>
                est. time remaining {estimate}
              </div>
            )}
            <div className='progress'>
              <CircularProgressbar
                value={percentage}
                text={`${percentage}%`}
                strokeWidth={6}
              />
            </div>
          </div>
        )}
        {step === STEP4 && (
          <div className='step-4 d-flex flex-column align-items-center mb-3'>
            <div className='text-muted mb-3'>
              We will upload your prospects and notify you once they are
              completed!
            </div>
          </div>
        )}
      </Modal.Body>
      {step === STEP1 && (
        <Modal.Footer>
          <Button
            variant='primary'
            disabled={!isNext || loadingEnhanceData}
            onClick={() => gotoSecondStep()}
          >
            {loadingEnhanceData ? (
              <>
                <Spinner /> LOADING ...
              </>
            ) : enhance ? (
              'SUBMIT'
            ) : (
              'NEXT'
            )}
          </Button>
        </Modal.Footer>
      )}
      {step === STEP4 && (
        <Modal.Footer>
          <Button variant='primary' onClick={() => close({ data: true })}>
            GOT IT!
          </Button>
        </Modal.Footer>
      )}
      {step === STEP2 && (
        <ConfirmModal
          prospectsCount={prospects.length}
          show={showCloseConfirm}
          close={async (rt) => {
            if (rt.data) {
              close({ data: false });
            }
            setShowCloseConfirm(false);
          }}
        ></ConfirmModal>
      )}
    </Modal>
  );
};

export default NewProspectListModal;
