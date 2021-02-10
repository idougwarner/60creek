import React, { useEffect, useRef, useState } from "react";
import {
  Button,
  Form,
  Modal,
  OverlayTrigger,
  Spinner,
  Table,
  Tooltip,
} from "react-bootstrap";
import "./NewProspectListModal.scss";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { getJsonFromFile } from "../../helpers/CSVFileHelper";
import { API, graphqlOperation } from "aws-amplify";
import {
  checkout,
  createProspect,
  createProspectList,
  getConsumerContactInfo,
} from "../../graphql/mutations";
import { useSelector } from "react-redux";
import ConfirmModal from "./ConfirmModal";
import Select from "react-select";
import { customSelectStyles } from "../../assets/styles/select-style";
import { useIndexedDB } from "react-indexed-db";
import { IndexDBStores } from "../../helpers/DBConfig";
import CheckoutForm from "./CheckoutForm";
import { messageConvert } from "../../helpers/messageConvert";
const STEP1 = 0;
const STEP2 = 1;
const STEP3 = 2;
const tableFields = [
  { fieldName: "firstName", required: true },
  { fieldName: "lastName", required: true },
  { fieldName: "company", required: true },
  { fieldName: "address1", required: true },
  { fieldName: "city", required: true },
  { fieldName: "state", required: true },
  { fieldName: "zip", required: true },
  { fieldName: "email", required: true },
  { fieldName: "phone", required: true },
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
  const [enhance, setEnhance] = useState(false);
  const [prospectList, setProspectList] = useState([]);
  const [isNext, setIsNext] = useState(false);
  const [errors, setErrors] = useState(0);
  const [estimate, setEstimate] = useState("");
  const [completed, setCompleted] = useState(false);
  const [totalNumber, setTotalNumber] = useState("");
  const [fileData, setFileData] = useState([]);

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

  const [showCloseConfirm, setShowCloseConfirm] = useState(false);

  const fileInputRef = useRef();
  const user = useSelector((state) => state.userStore);

  const [list, setList] = useState([]);
  const [selectedList, setSelectedList] = useState(null);
  const list1 = useSelector((state) => state.prospectStore.prospectList);

  const prospectsDb = useIndexedDB(IndexDBStores.PROSPECT);
  const prospectListDb = useIndexedDB(IndexDBStores.PROSPECT_LIST);
  const prospectUploadStepDb = useIndexedDB(IndexDBStores.PROSPECT_UPLOAD_STEP);
  const loadData = async () => {
    if (list1) {
      setList(list1.map((item) => ({ value: item.id, label: item.name })));
    }
  };
  useEffect(() => {
    loadData();
  }, [list1]);

  const prev = () => {
    if (step > STEP1) {
      setStep(step - 1);
    }
  };

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
      return days + " days";
    }
  };
  const pushData = async () => {
    try {
      setCompleted(false);
      let prospectListId;
      let storedProspects = await prospectsDb.getAll();
      let storedProspectList = await prospectListDb.getAll();
      if (storedProspectList[0].prospectId) {
        prospectListId = storedProspectList[0].prospectId;
      } else {
        const start = new Date().getTime();
        const listInfo = await API.graphql(
          graphqlOperation(createProspectList, {
            input: {
              userId: user.id,
              name: storedProspectList[0].prospectName,
              enhance: enhance,
            },
          })
        );
        const end = new Date().getTime();
        const delta = end - start;
        prospectListId = listInfo.data.createProspectList.id;
        setEstimate(timeConversion(delta * prospectList.length));
        setPercentage(Math.round((1 / (prospectList.length + 1)) * 100));
      }

      await prospectListDb.clear();
      await prospectListDb.add({
        prospectName: storedProspectList[0].prospectName,
        prospectId: prospectListId,
      });

      for (let i = 0; i < storedProspects.length; i++) {
        const start = new Date().getTime();
        const rt = await API.graphql(
          graphqlOperation(createProspect, {
            input: {
              userId: user.id,
              prospectListId: prospectListId,
              firstName: storedProspects[i].firstName,
              lastName: storedProspects[i].lastName,
              address1: storedProspects[i].address1,
              city: storedProspects[i].city,
              state: storedProspects[i].state,
              zip: storedProspects[i].zip,
              company: storedProspects[i].company,
              phone: storedProspects[i].phone,
              email: storedProspects[i].email,
              facebook: storedProspects[i].facebook,
              status: storedProspects[i].status,
            },
          })
        );
        await prospectsDb.deleteRecord(storedProspects[i].id);
        const end = new Date().getTime();
        const delta = end - start;
        setEstimate(timeConversion(delta * (prospectList.length - i + 1)));
        setPercentage(
          Math.round(
            ((i + 1 + (existingList ? 0 : 1)) /
              (prospectList.length + (existingList ? 0 : 1))) *
              100
          )
        );
      }
      setCompleted(true);
      setPercentage(100);

      await prospectListDb.clear();
      await prospectsDb.clear();

      setTimeout(() => {
        close({ data: true });
      }, 3000);
    } catch (err) {}
  };

  useEffect(() => {
    setCompleted(false);
    setPercentage(0);
  }, []);
  useEffect(async () => {
    if (originUpload) {
      let storedProspects = await prospectsDb.getAll();
      let storedUploadStep = await prospectUploadStepDb.getAll();
      setStep(storedUploadStep[0].step || STEP1);
      setProspectList(storedProspects);
    }
  }, [originUpload]);
  useEffect(() => {
    if (step === STEP3) {
      pushData();
    }
  }, [step]);
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
  useEffect(async () => {
    let errCounts = 0;
    prospectList.forEach((item) => {
      tableFields.forEach((field) => {
        if (field.required && !item[field.fieldName]) errCounts++;
      });
    });
    await prospectsDb.clear();
    for (let i = 0; i < prospectList.length; i++) {
      const item = prospectList[i];
      const rt = await prospectsDb.add(item);
    }
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
    setLoading(true);
    try {
      const fData = await getJsonFromFile(event.target.files[0]);
      await prospectsDb.clear();
      for (let i = 0; i < fData.length; i++) {
        const item = fData[i];
        const rt = await prospectsDb.add(item);
      }
      setFileData(fData);
      setFileName(event.target.files[0].name);
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };
  const clearFile = () => {
    setProspectList([]);
    setFileName("");
  };

  useEffect(async () => {
    if (!token) return;
    try {
      await prospectListDb.clear();
      await prospectListDb.add({
        prospectName: listName,
        prospectId: selectedList?.value || "",
      });
      await prospectUploadStepDb.clear();
      await prospectUploadStepDb.add({
        step: STEP2,
      });
    } catch (err) {}

    if (enhance) {
      let newProspects = [...prospectList];
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
        for (let i = 0; i < newProspects.length; i++) {
          if (newProspects[i].email) {
            let rt = await API.graphql(
              graphqlOperation(getConsumerContactInfo, {
                input: {
                  email: newProspects[i].email,
                },
              })
            );
            if (rt.data.getConsumerContactInfo.data) {
              const d = rt.data.getConsumerContactInfo.data;
              newProspects[i] = { ...newProspects[i], ...d };
            }
          }
        }
        setProspectList(newProspects);
        next();
      } catch (err) {}
      setLoadingEnhanceData(false);
    }
  }, [token]);

  const gotoSecondStep = async () => {
    setGenerateToken(!generateToken);
  };
  const gotoThirdStep = async () => {
    await prospectUploadStepDb.add({
      step: STEP3,
    });
    next();
  };

  const toggleEditing = (idx, fieldName) => {
    if (
      // (selectedField.fieldName !== fieldName || idx !== selectedField.idx) &&
      editing
    ) {
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
    } else {
      setSelectedField({
        idx: idx,
        fieldName: fieldName,
      });
      setEditField(prospectList[idx][fieldName]);
      setEditing(true);
    }
  };
  const fieldComponent = (idx, fieldName, required = true) => {
    return (
      <>
        {editing &&
        idx == selectedField.idx &&
        fieldName === selectedField.fieldName ? (
          <>
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
            <Form.Text className="text-primary font-italic mt-1">
              Enter info
            </Form.Text>
          </>
        ) : prospectList[idx][fieldName] || !required ? (
          prospectList[idx][fieldName]
        ) : (
          <div className="missing-info">
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
          prospectList[y][tableFields[x].fieldName] === "" &&
          tableFields[x].required
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
  const renderTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      Data Enhancement is a systematic process that will search and locate
      corresponding phone, email, demographic, and relational data variables
      specific to the uploaded prospects.
    </Tooltip>
  );
  return (
    <>
      <Modal
        show={show}
        className={showCloseConfirm ? "d-none" : ""}
        onHide={() => {
          if (step === STEP2) {
            setShowCloseConfirm(true);
          } else if (step === STEP1) {
            close({ data: false });
          } else if (step === STEP3) {
            close({ data: true });
          }
        }}
        size={step === STEP2 ? "xl" : "md"}
      >
        <Modal.Header>
          <img
            src="/assets/icons/close.svg"
            className="modal-close-btn"
            onClick={() => {
              if (step === STEP2) {
                setShowCloseConfirm(true);
              } else if (step === STEP1) {
                close({ data: false });
              } else if (step === STEP3) {
                close({ data: true });
              }
            }}
          />
          <Modal.Title>
            {step === STEP1 ? (
              existingList ? (
                "Add To Existing List"
              ) : (
                "New Prospect List"
              )
            ) : step === STEP2 ? (
              "Prospect Created"
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
                    options={list}
                    value={selectedList}
                    styles={customSelectStyles("40px")}
                    onChange={(value) => setSelectedList(value)}
                  />
                </Form.Group>
              ) : (
                <Form.Group>
                  <Form.Label className="required">
                    Prospect List Name
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter Prospect List Name"
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
                  placeholder="Enter Number of Prospects. (optional)"
                  value={totalNumber}
                  onChange={(e) => setTotalNumber(e.target.value)}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label className="d-flex align-items-center">
                  Template Download
                  <img
                    src="/assets/icons/information-circle.svg"
                    className="ml-1"
                  />
                </Form.Label>
                <Form.Text className="text-muted mb-3">
                  This template must be used for upload
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
                <Form.Label className="required">
                  Upload Prospect List
                </Form.Label>
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
                  <OverlayTrigger
                    placement="right"
                    delay={{ show: 250, hide: 400 }}
                    overlay={renderTooltip}
                  >
                    <img
                      src="/assets/icons/information-circle.svg"
                      className="ml-1"
                    />
                  </OverlayTrigger>
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
                    variant="outline-primary"
                    onClick={prev}
                    disabled={originUpload}
                    className="mr-2"
                  >
                    BACK
                  </Button>
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
                    {prospectList.map((item, idx) => (
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
              ) : (
                "NEXT"
              )}
            </Button>
          </Modal.Footer>
        )}
      </Modal>
      {step === STEP2 && (
        <ConfirmModal
          show={showCloseConfirm}
          close={async (rt) => {
            if (rt.data) {
              await prospectListDb.clear();
              await prospectsDb.clear();
              close({ data: false });
            }
            setShowCloseConfirm(false);
          }}
        ></ConfirmModal>
      )}
    </>
  );
};

export default NewProspectListModal;
