import React, { useEffect, useRef, useState } from 'react';
import { Button, Form, Modal, Table } from 'react-bootstrap';
import { prospectListTemplate } from '../../helpers/ProspectListTemplate';
import './NewProspectListModal.scss';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { downloadCSVFromJSON, getJsonFromFile } from '../../helpers/CSVFileHelper';
import { API, Auth, graphqlOperation } from 'aws-amplify';
import { createProspect, createProspectList } from '../../graphql/mutations';
import { useSelector } from 'react-redux';
import Select from 'react-select';
import { listProspectLists } from '../../graphql/queries';
import { customSelectStyles } from '../../assets/styles/select-style';
const STEP1 = 0;
const STEP2 = 1;
const STEP3 = 2;
const STEP4 = 3;
const AddToExistingListModal = ({ show, close }) => {
  const [step, setStep] = useState(STEP1);
  const [percentage, setPercentage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [prospectList, setProspectList] = useState([]);
  const [selectedList, setSelectedList] = useState(null);
  const [fileName, setFileName] = useState('');
  const [enhance, setEnhance] = useState(false);
  const [list, setList] = useState([]);
  const [isNext, setIsNext] = useState(false);
  const [errors, setErrors] = useState(0);
  const [estimate, setEstimate] = useState('');
  const [completed, setCompleted] = useState(false);
  const [totalNumber, setTotalNumber] = useState('');
  const [fileData, setFileData] = useState([]);

  const fileInputRef = useRef();
  const user = useSelector(state => state.userStore);
  const list1 = useSelector(state => state.prospectStore.prospectList)

  const prev = () => {
    if (step > STEP1) {
      setStep(step - 1);
    }
  }
  const timeConversion = (millisec) => {
    const seconds = (millisec / 1000).toFixed(1);
    const minutes = (millisec / (1000 * 60)).toFixed(1);
    const hours = (millisec / (1000 * 60 * 60)).toFixed(1);
    const days = (millisec / (1000 * 60 * 60 * 24)).toFixed(1);
    if (seconds < 60) {
      return seconds + " secondes";
    } else if (minutes < 60) {
      return minutes + " minutes";
    } else if (hours < 24) {
      return hours + " hours";
    } else {
      return days + " days"
    }
  }
  const pushData = async () => {
    try {
      setCompleted(false);
      for (let i = 0; i < prospectList.length; i++) {
        const start = new Date().getTime();
        const rt = await API.graphql(graphqlOperation(createProspect, {
          input: {
            userId: user.id,
            prospectListId: selectedList.value,
            ...prospectList[i]
          }
        }));
        const end = new Date().getTime();
        const delta = end - start;
        setEstimate(timeConversion(delta * (prospectList.length - i)));
        setPercentage(Math.round((i + 1) / prospectList.length * 100));
        if (!show) {
          return
        }
      }
      setCompleted(true);
    } catch (err) {
    }
  }

  useEffect(() => {
    if (step === STEP4) {
      pushData();
    }
  }, [step])
  const next = async () => {
    if (step < STEP4) {
      setStep(step + 1);
    }
  }
  useEffect(() => {
    if (show) {
      setCompleted(false);
      setStep(STEP1)
    }
  }, [show]);
  useEffect(() => {
    if (!loading && selectedList && prospectList.length > 0) {
      setIsNext(true);
    } else {
      setIsNext(false);
    }
  }, [loading, selectedList, prospectList]);
  useEffect(() => {
    let errCounts = 0;
    prospectList.forEach(item => {
      if (!item.firstName) errCounts++;
      if (!item.lastName) errCounts++;
      if (!item.email) errCounts++;
      if (!item.phone) errCounts++;
      if (!item.company) errCounts++;
    });
    setErrors(errCounts);
  }, [prospectList]);
  const downloadTemplate = () => {
    downloadCSVFromJSON(prospectListTemplate);
  }
  const uploadCsvFile = () => {
    fileInputRef.current.click();
  }
  useEffect(() => {
    if (totalNumber) {
      const n = parseInt(totalNumber);
      if (n > 0) {
        setProspectList(fileData.slice(0, n));
      } else {
        setProspectList(fileData);
      }
    } else {
      setProspectList(fileData);
    }
  }, [fileData, totalNumber])
  const onChangeFile = async (event) => {
    event.stopPropagation();
    event.preventDefault();
    setLoading(true);
    try {
      const fData = await getJsonFromFile(event.target.files[0]);
      setFileData(fData)
      setFileName(event.target.files[0].name);
    } catch (err) {

    } finally {
      setLoading(false);
    }
  }
  const clearFile = () => {
    setProspectList([]);
    setFileName('');
  }
  const missingInfo = () => {
    return <div className="missing-info">
      <div className="missing-field"></div>
      <span>Enter missing info</span>
    </div>
  }
  const loadData = async () => {
    if (list1) {
      setList(list1.map(item => ({ value: item.id, label: item.name })));
    }
  }
  useEffect(() => {
    loadData()
  }, [list1])
  return (
    <>
      <Modal show={show} onHide={() => close({ data: completed })} size={step === STEP2 ? "xl" : "md"}>
        <Modal.Header >
          <img src="/assets/icons/close.svg" className="modal-close-btn" onClick={() => close({ data: completed })} />
          <Modal.Title>
            {step === STEP1 ? "Add To Existing List" : step === STEP2 ? "Prospect Created" : step === STEP3 ? "Confirmation" :
              <>
                {completed ? 'Completed' : <>  Uploading<br /> {prospectList.length} Prospects</>}
              </>
            }</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {step === STEP1 && <div className="step-1">
            <Form.Group >
              <Form.Label className="required">Select Prospect List</Form.Label>
              <Select options={list} value={selectedList}
                styles={customSelectStyles("40px")}
                onChange={value => setSelectedList(value)}
              />
            </Form.Group>
            <Form.Group >
              <Form.Label >Total Number of Prospects</Form.Label>
              <Form.Control type="text" placeholder="Enter Number of Prospects. (optional)"
                value={totalNumber} onChange={e => setTotalNumber(e.target.value)} />
            </Form.Group>
            <Form.Group >
              <Form.Label className="d-flex align-items-center">
                Template Download
                <img src="/assets/icons/information-circle.svg" className="ml-1" />
              </Form.Label>
              <Form.Text className="text-muted mb-3">This template must be used for upload</Form.Text>
              <Button variant="outline-primary" onClick={() => downloadTemplate()}>DOWNLOAD</Button>
            </Form.Group>
            <Form.Group >
              <Form.Label className="required">Upload Prospect List</Form.Label>
              <Form.Text className="text-muted mb-2 d-flex align-items-center">
                {fileName ? fileName : "No file selected"}
                {fileName && <Button variant="link" className="text-muted ml-4" onClick={clearFile}>
                  <img src="/assets/icons/close-small.svg" className="mr-1" /> CLEAR
                </Button>}
              </Form.Text>
              <input ref={fileInputRef} type="file" accept=".csv" name="name" hidden onChange={onChangeFile} />
              <Button variant="outline-primary" onClick={uploadCsvFile}
                disabled={loading}>{loading ? 'UPLOADING' : 'UPLOAD'}</Button>
            </Form.Group>

            <Form.Group >
              <Form.Label className="required d-flex align-items-center">
                Enhance Data
                <img src="/assets/icons/information-circle.svg" className="ml-1" />
              </Form.Label>
              <Form.Check checked={enhance} name="enhance" className="mb-3" custom type="radio" id="enhance-yes" label="Yes"
                onChange={() => setEnhance(true)} />
              <Form.Check checked={!enhance} name="enhance" custom type="radio" id="enhance-no" label="No"
                onChange={() => setEnhance(false)} />
            </Form.Group>

          </div>}
          {step === STEP2 && <div className="step-2 mb-3">
            <div className="d-flex justify-content-between">
              <div className="summary">We detected {prospectList.length} contacts
               {errors ? <>, and <span>{errors} errors</span></> : null}
              . Please check before confirming.</div>
              <div>
                <Button variant="outline-primary" onClick={prev} className="mr-2">BACK</Button>
                <Button variant="primary" onClick={next} disabled={errors}>CONFIRM</Button>
              </div>
            </div>
            <Table responsive="md" className="data-table">
              <thead>
                <tr>
                  <th>FIRST<span className="sort-icon"></span></th>
                  <th>LAST<span className="sort-icon"></span></th>
                  <th>COMPANY<span className="sort-icon"></span></th>
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
                {prospectList.map((item, idx) =>
                  <tr key={idx}>
                    <td>{item.firstName ? item.firstName : missingInfo()}</td>
                    <td>{item.lastName ? item.lastName : missingInfo()}</td>
                    <td>{item.company ? item.company : missingInfo()}</td>
                    <td>{item.address1}</td>
                    <td>{item.city}</td>
                    <td>{item.state}</td>
                    <td>{item.zip}</td>
                    <td>{item.email ? item.email : missingInfo()}</td>
                    <td>{item.phone ? item.phone : missingInfo()}</td>
                    <td>{item.facebook}</td>
                  </tr>
                )}
              </tbody>
            </Table>

          </div>}
          {step === STEP3 && <div className="step-3 mb-3">
            <div className="are-you-sure">Are you sure you want to close this window</div>
            <div className="text-muted text-center mb-4">All Prospect List creation progress will be lost</div>
            <div className="d-flex justify-content-around">
              <Button variant="light" className="text-muted" onClick={prev}>CANCEL</Button>
              <Button variant="light" onClick={next}>CLOSE</Button>
            </div>
          </div>}
          {step === STEP4 && <div className="step-4 d-flex flex-column align-items-center mb-3">
            {!completed && <div className="text-muted mb-3">
              est. time remaining {estimate}
            </div>}
            <div className="progress">
              <CircularProgressbar value={percentage} text={`${percentage}%`} strokeWidth={6} />
            </div>
          </div>}
        </Modal.Body>
        {step === STEP1 && <Modal.Footer>
          <Button variant="primary" disabled={!isNext} onClick={() => next()}>NEXT</Button>
        </Modal.Footer>}
      </Modal>
    </>
  )
}

export default AddToExistingListModal;