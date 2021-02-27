import React, { useEffect, useRef, useState } from "react";
import { Button, Form, Modal, Spinner, Table } from "react-bootstrap";
import "./NewProspectListModal.scss";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { getJsonFromFile } from "../../helpers/CSVFileHelper";
import { API, graphqlOperation } from "aws-amplify";
import { checkout } from "../../graphql/mutations";
import { useDispatch, useSelector } from "react-redux";
import ConfirmModal from "./ConfirmModal";
import Select from "react-select";
import { customSelectStyles } from "../../assets/styles/select-style";
import { useIndexedDB } from "react-indexed-db";
import { IndexDBStores } from "../../helpers/DBConfig";
import CheckoutForm from "./CheckoutForm";
import { messageConvert } from "../../helpers/messageConvert";
import { ACTIONS } from "../../redux/actionTypes";
import { WORKER_STATUS } from "../../redux/uploadWorkerReducer";
import { usStates } from "../../helpers/us-states";
import {
  validateEmail,
  validateZip,
  validateField,
} from "../../helpers/validations";
import InputMask from "react-input-mask";
import InfoTooltip from "../controls/InfoTooltip";

const STEP1 = 0;
const STEP2 = 1;
const STEP3 = 2;
const tableFields = [
  { fieldName: "firstName", required: false },
  { fieldName: "lastName", required: true },
  { fieldName: "company", required: true },
  { fieldName: "address1", required: false },
  { fieldName: "city", required: false },
  { fieldName: "state", required: false },
  { fieldName: "zip", required: false },
  { fieldName: "phone", required: false },
  { fieldName: "email", required: false },
  { fieldName: "facebook", required: false },
];
const NewProspectListModal = ({
  show,
  close,
  originUpload = false,
  existingList = false,
}) => {
  const [step, setStep] = useState(STEP1);
  const [percentage, setPercentage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadingEnhanceData, setLoadingEnhanceData] = useState(false);
  const [listName, setListName] = useState("");
  const [fileName, setFileName] = useState("");
  const [enhance, setEnhance] = useState(true);
  const [prospectList, setProspectList] = useState([]);
  const [isNext, setIsNext] = useState(false);
  const [errors, setErrors] = useState(0);
  const [estimate, setEstimate] = useState("");
  const [completed, setCompleted] = useState(false);
  const [totalNumber, setTotalNumber] = useState("");
  const [fileData, setFileData] = useState([]);

  const [tmpState, setTmpState] = useState(null);

  const [editField, setEditField] = useState("");
  const [editing, setEditing] = useState(false);
  const [token, setToken] = useState(null);
  const [generateToken, setGenerateToken] = useState(false);
  const [cardStatus, setCardStatus] = useState(false);

  const [errMsg, setErrMsg] = useState("");
  const [selectedField, setSelectedField] = useState({
    idx: -1,
    fieldName: "",
  });

  const uploadStatus = useSelector((state) => state.uploadWorkerStore);

  const [showCloseConfirm, setShowCloseConfirm] = useState(false);

  const fileInputRef = useRef();
  const user = useSelector((state) => state.userStore);

  const [list, setList] = useState([]);
  const [selectedList, setSelectedList] = useState(null);
  const list1 = useSelector((state) => state.prospectStore.prospectList);

  const prospectsDb = useIndexedDB(IndexDBStores.PROSPECT);
  const prospectListDb = useIndexedDB(IndexDBStores.PROSPECT_LIST);
  const prospectUploadStepDb = useIndexedDB(IndexDBStores.PROSPECT_UPLOAD_STEP);

  const dispatch = useDispatch();

  useEffect(() => {
    if (list1) {
      setList(list1.map((item) => ({ value: item.id, label: item.name })));
    }
  }, [list1]);

  useEffect(() => {
    if (uploadStatus.status === WORKER_STATUS.IDLE) {
    } else if (uploadStatus.status === WORKER_STATUS.START) {
      setCompleted(false);
      setPercentage(uploadStatus.percentage);
      setEstimate(uploadStatus.estimate);
    } else if (uploadStatus.status === WORKER_STATUS.CHANGE) {
      setPercentage(uploadStatus.percentage);
      setEstimate(uploadStatus.estimate);
    } else if (uploadStatus.status === WORKER_STATUS.COMPLETED) {
      setPercentage(uploadStatus.percentage);
      setEstimate(uploadStatus.estimate);
      setCompleted(true);
      setTimeout(() => {
        close({ data: true });
      }, 3000);
    } else if (uploadStatus.status === WORKER_STATUS.ERROR) {
    } else {
    }
    // eslint-disable-next-line
  }, [uploadStatus]);

  // const prev = () => {
  //   if (step > STEP1) {
  //     setStep(step - 1);
  //   }
  // };

  const pushData = async () => {
    dispatch({
      type: ACTIONS.START_UPLOADE_WORKER,
    });
  };

  useEffect(() => {
    setCompleted(false);
    setPercentage(0);
  }, []);
  useEffect(() => {
    const f = async () => {
      if (originUpload) {
        let storedProspects = await prospectsDb.getAll();
        let storedUploadStep = await prospectUploadStepDb.getAll();
        if (storedUploadStep.length > 0 && storedProspects.length > 0) {
          setStep(STEP2);
          setProspectList(storedProspects);
        }
      }
    };
    f();
  }, [originUpload, prospectsDb, prospectUploadStepDb]);
  const next = async () => {
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
      (existingList ? selectedList : listName) &&
      prospectList.length > 0 &&
      (enhance ? cardStatus : true)
    ) {
      setIsNext(true);
    } else {
      setIsNext(false);
    }
  }, [
    loading,
    listName,
    selectedList,
    prospectList,
    existingList,
    enhance,
    cardStatus,
  ]);
  useEffect(() => {
    let errCounts = 0;
    prospectList.forEach((item) => {
      if (!item.lastName && !item.company) errCounts++;
      if (item.phone && !validateField("phone", item.phone)) errCounts++;
      if (item.email && !validateField("email", item.email)) errCounts++;
      if (item.zip && !validateField("zip", item.zip)) errCounts++;
    });
    setErrors(errCounts);
  }, [prospectList]);
  const uploadCsvFile = () => {
    fileInputRef.current.click();
  };
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
  }, [fileData, totalNumber]);
  const onChangeFile = async (event) => {
    event.stopPropagation();
    event.preventDefault();
    if (event.target.files.length > 0) {
      setLoading(true);
      try {
        const fData = await getJsonFromFile(event.target.files[0]);
        setFileData(fData);
        setFileName(event.target.files[0].name);
        event.target.value = null;
      } catch (err) {
      } finally {
        setLoading(false);
      }
    }
  };
  const clearFile = () => {
    setProspectList([]);
    setFileName("");
  };

  useEffect(() => {
    const f = async () => {
      if (!token) return;
      if (enhance) {
        setLoadingEnhanceData(true);
        setErrMsg("");
        try {
          const rt = await API.graphql(
            graphqlOperation(checkout, {
              input: {
                email: user.email,
                token: token.id,
                amount: prospectList.length,
              },
            })
          );
          if (rt.data.checkout.error) {
            setErrMsg(messageConvert(rt.data.checkout.error.message));
            setLoadingEnhanceData(false);
            return;
          }
          next();
        } catch (err) {}
        setLoadingEnhanceData(false);
      }
    };
    f();
    // eslint-disable-next-line
  }, [token]);

  const gotoSecondStep = async () => {
    try {
      await prospectListDb.clear();
      await prospectListDb.add({
        prospectName: listName,
        prospectId: selectedList?.value || "",
        enhance: enhance,
      });
      // await prospectUploadStepDb.clear();
      // await prospectUploadStepDb.add({
      //   step: STEP2,
      // });

      await prospectsDb.clear();
      for (let i = 0; i < prospectList.length; i++) {
        const item = prospectList[i];
        await prospectsDb.add(item);
      }
    } catch (err) {}
    if (enhance) {
      setGenerateToken(!generateToken);
    } else {
      next();
    }
  };
  const gotoThirdStep = async () => {
    await prospectUploadStepDb.clear();
    await prospectUploadStepDb.add({
      step: STEP3,
    });

    await prospectsDb.clear();
    for (let i = 0; i < prospectList.length; i++) {
      const item = prospectList[i];
      await prospectsDb.add(item);
    }
    pushData();
    next();
  };

  const toggleEditing = (idx, fieldName) => {
    if (
      // (selectedField.fieldName !== fieldName || idx !== selectedField.idx) &&
      editing
    ) {
      if (selectedField.idx === idx && selectedField.fieldName === fieldName) {
      } else {
        let newList = [...prospectList];
        if (selectedField.idx !== -1 && selectedField.fieldName !== "") {
          newList[selectedField.idx][selectedField.fieldName] = editField;
        }
        setProspectList(newList);
        setSelectedField({
          idx: -1,
          fieldName: "",
        });
        setEditField("");
        setEditing(false);
      }
    } else {
      setSelectedField({
        idx: idx,
        fieldName: fieldName,
      });
      if (fieldName === "state") {
        const id = usStates.indexOf(prospectList[idx][fieldName]);
        if (id < 0) {
          setTmpState(null);
        } else {
          setTmpState({ value: usStates[id], label: usStates[id] });
        }
      } else {
        setEditField(prospectList[idx][fieldName]);
      }
      setEditing(true);
    }
  };

  const fieldComponent = (idx, fieldName, required = true) => {
    return (
      <>
        {editing &&
        idx === selectedField.idx &&
        fieldName === selectedField.fieldName ? (
          <>
            {fieldName === "state" ? (
              <Select
                value={tmpState}
                onChange={(value) => {
                  setTmpState(value);
                  setEditField(value.value);
                }}
                placeholder="State"
                styles={customSelectStyles(28)}
                options={usStates.map((item) => ({
                  value: item,
                  label: item,
                }))}
              />
            ) : fieldName === "zip" ? (
              <Form.Control
                type="text"
                className="edit-field"
                placeholder="Enter Zip"
                autoFocus
                value={editField}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    toggleEditing(idx, fieldName);
                  } else if (event.key === "Tab") {
                    event.preventDefault();
                    gotoNextField();
                  }
                }}
                isInvalid={editField && !validateZip(editField)}
                onChange={(event) => {
                  event.stopPropagation();
                  setEditField(event.target.value);
                }}
              />
            ) : fieldName === "phone" ? (
              <InputMask
                mask="(999) 999 - 9999"
                type="tel"
                placeholder="(555) 555 - 5555"
                value={editField}
                onChange={(event) => {
                  event.stopPropagation();
                  setEditField(event.target.value);
                }}
              >
                {(inputProps) => (
                  <Form.Control
                    {...inputProps}
                    className="edit-field"
                    autoFocus
                    isInvalid={editField && editField.indexOf("_") >= 0}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        toggleEditing(idx, fieldName);
                      } else if (event.key === "Tab") {
                        event.preventDefault();
                        gotoNextField();
                      }
                    }}
                  />
                )}
              </InputMask>
            ) : fieldName === "email" ? (
              <Form.Control
                type="text"
                className="edit-field"
                placeholder="Enter Email Address"
                autoFocus
                value={editField}
                isInvalid={editField && !validateEmail(editField)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    toggleEditing(idx, fieldName);
                  } else if (event.key === "Tab") {
                    event.preventDefault();
                    gotoNextField();
                  }
                }}
                onChange={(event) => {
                  event.stopPropagation();
                  setEditField(event.target.value);
                }}
              />
            ) : (
              <Form.Control
                type="text"
                className="edit-field"
                placeholder=""
                autoFocus
                value={editField}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    toggleEditing(idx, fieldName);
                  } else if (event.key === "Tab") {
                    event.preventDefault();
                    gotoNextField();
                  }
                }}
                onChange={(event) => {
                  event.stopPropagation();
                  setEditField(event.target.value);
                }}
              />
            )}
            <Form.Text className="text-primary enter-info">
              Enter info
            </Form.Text>
          </>
        ) : prospectList[idx][fieldName].length > 0 ? (
          validateField(fieldName, prospectList[idx][fieldName]) ? (
            prospectList[idx][fieldName]
          ) : (
            <div className={"missing-info"}>
              <div className="missing-field">
                {prospectList[idx][fieldName]}
              </div>
              <span>Invalid field</span>
            </div>
          )
        ) : (
          <div
            className={
              "missing-info" +
              (required &&
              ((fieldName === "lastName" && !prospectList[idx].company) ||
                (fieldName === "company" && !prospectList[idx].lastName))
                ? ""
                : " not-required")
            }
          >
            <div className="missing-field"></div>
            <span>Enter missing info</span>
          </div>
        )}
      </>
    );
  };
  const gotoNextField = () => {
    let row = -1;
    let fieldName = "";
    if (selectedField.idx === -1 || selectedField.fieldName === "") return;
    let idx = tableFields.findIndex(
      (item) => item.fieldName === selectedField.fieldName
    );
    let start = selectedField.idx * tableFields.length + idx;
    for (
      let i = start;
      i < start + prospectList.length * tableFields.length;
      i++
    ) {
      const j = i % (prospectList.length * tableFields.length);
      const x = j % tableFields.length,
        y = Math.floor(j / tableFields.length);
      if (
        y !== selectedField.idx ||
        tableFields[x].fieldName !== selectedField.fieldName
      ) {
        if (
          (prospectList[y][tableFields[x].fieldName] === "" &&
            tableFields[x].required) ||
          (prospectList[y][tableFields[x].fieldName] &&
            !validateField(
              tableFields[x].fieldName,
              prospectList[y][tableFields[x].fieldName]
            ))
        ) {
          row = y;
          fieldName = tableFields[x].fieldName;
          break;
        }
      }
    }

    let newList = [...prospectList];
    if (selectedField.idx !== -1 && selectedField.fieldName !== "") {
      newList[selectedField.idx][selectedField.fieldName] = editField;
    }
    setProspectList(newList);
    setSelectedField({
      idx: row,
      fieldName: fieldName,
    });
    setEditField("");
  };
  return (
    <Modal
      show={show}
      className={showCloseConfirm ? "d-none" : ""}
      onHide={() => {
        if (step === STEP2) {
          setShowCloseConfirm(true);
        } else if (step === STEP1) {
          prospectListDb.clear();
          prospectsDb.clear();
          prospectUploadStepDb.clear();
          close({ data: false });
        } else if (step === STEP3) {
          close({ data: true });
        }
      }}
      size={step === STEP2 ? "xl" : "md"}
    >
      <Modal.Header closeButton>
        <Modal.Title>
          {step === STEP1 ? (
            existingList ? (
              "Add To Existing List"
            ) : (
              "New Prospect List"
            )
          ) : step === STEP2 ? (
            existingList ? (
              "Prospects Added to " + selectedList.label
            ) : (
              "Prospects Created"
            )
          ) : (
            <>
              {completed ? (
                "Completed"
              ) : (
                <>
                  {" "}
                  Uploading
                  <br /> {prospectList.length} Prospects
                </>
              )}
            </>
          )}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {step === STEP1 && (
          <div className="step-1">
            {existingList ? (
              <Form.Group>
                <Form.Label className="required">
                  Select Prospect List
                </Form.Label>
                <Select
                  placeholder="Select Prospect List"
                  options={list}
                  value={selectedList}
                  styles={customSelectStyles("40px")}
                  onChange={(value) => setSelectedList(value)}
                />
              </Form.Group>
            ) : (
              <Form.Group>
                <Form.Label className="required">Prospect List Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="List name"
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
                type="text"
                placeholder="Number of records"
                value={totalNumber}
                onChange={(e) => setTotalNumber(e.target.value)}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label className="d-flex align-items-center">
                Template Download
              </Form.Label>
              <Form.Text className="text-muted mb-3">
                This template must be used for upload as a csv file
              </Form.Text>
              <Button
                variant="outline-primary"
                href="/assets/template/Prospect_Template.csv"
                download
              >
                DOWNLOAD
              </Button>
            </Form.Group>
            <Form.Group>
              <Form.Label className="required">Upload Prospect List</Form.Label>
              <Form.Text className="text-muted mb-2 d-flex align-items-center">
                {fileName ? fileName : "No file selected"}
                {fileName && (
                  <Button
                    variant="link"
                    className="text-muted ml-4"
                    onClick={clearFile}
                  >
                    <img
                      src="/assets/icons/close-small.svg"
                      className="mr-1"
                      alt="close-small"
                    />
                    CLEAR
                  </Button>
                )}
              </Form.Text>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                name="name"
                hidden
                onChange={onChangeFile}
              />
              <Button
                variant="outline-primary"
                onClick={uploadCsvFile}
                disabled={loading}
              >
                {loading ? "UPLOADING" : "UPLOAD"}
              </Button>
            </Form.Group>

            <Form.Group>
              <Form.Label className="required d-flex align-items-center">
                Enhance Data
                <InfoTooltip description="Data Enhancement is a systematic process that will search and locate corresponding phone, email, demographic, and relational data variables specific to the uploaded prospects." />
              </Form.Label>
              <Form.Check
                checked={enhance}
                name="enhance"
                className="mb-3"
                custom
                type="radio"
                id="enhance-yes"
                label="Yes"
                onChange={() => setEnhance(true)}
              />
              <Form.Check
                checked={!enhance}
                name="enhance"
                custom
                type="radio"
                id="enhance-no"
                label="No"
                onChange={() => setEnhance(false)}
              />
            </Form.Group>
            {enhance && (
              <CheckoutForm
                itemCounts={prospectList.length}
                generateToken={generateToken}
                changeToken={(event) => setToken(event)}
                changeCardStatus={(event) => setCardStatus(event)}
              />
            )}
          </div>
        )}
        {step === STEP2 && (
          <div className="step-2 mb-3">
            <div className="d-flex justify-content-between mb-3">
              <div className="summary">
                We detected {prospectList.length} contacts
                {errors ? (
                  <>
                    , and <span>{errors} errors</span>
                  </>
                ) : null}
                . Please check before confirming.
              </div>
              <div>
                <Button
                  variant="primary"
                  onClick={gotoThirdStep}
                  disabled={errors}
                >
                  CONFIRM
                </Button>
              </div>
            </div>
            <div className="table-container">
              <Table responsive="xl" className="data-table">
                <thead>
                  <tr>
                    <th>
                      FIRST<span className="sort-icon"></span>
                    </th>
                    <th>
                      LAST<span className="sort-icon"></span>
                    </th>
                    <th>
                      COMPANY<span className="sort-icon"></span>
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
                  {prospectList.map((a, idx) => (
                    <tr key={idx}>
                      {tableFields.map((item, id) => (
                        <td
                          key={id}
                          onClick={() => toggleEditing(idx, item.fieldName)}
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
          <div className="step-4 d-flex flex-column align-items-center mb-3">
            {!completed && (
              <div className="text-muted mb-3">
                est. time remaining {estimate}
              </div>
            )}
            <div className="progress">
              <CircularProgressbar
                value={percentage}
                text={`${percentage}%`}
                strokeWidth={6}
              />
            </div>
          </div>
        )}
        {errMsg && <Form.Text className="text-danger">{errMsg}</Form.Text>}
      </Modal.Body>
      {step === STEP1 && (
        <Modal.Footer>
          <Button
            variant="primary"
            disabled={!isNext || loadingEnhanceData}
            onClick={() => gotoSecondStep()}
          >
            {loadingEnhanceData ? (
              <>
                <Spinner /> LOADING ...
              </>
            ) : enhance ? (
              "SUBMIT"
            ) : (
              "NEXT"
            )}
          </Button>
        </Modal.Footer>
      )}
      {step === STEP2 && (
        <ConfirmModal
          show={showCloseConfirm}
          close={async (rt) => {
            if (rt.data) {
              await prospectListDb.clear();
              await prospectsDb.clear();
              await prospectUploadStepDb.clear();
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
