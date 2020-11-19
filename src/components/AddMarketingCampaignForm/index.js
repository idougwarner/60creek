import React, { useState } from 'react'
import './AddMarketingCampaignForm.scss'
import 'react-widgets/lib/scss/react-widgets.scss'
import Globalize from 'globalize';
import globalizeLocalizer from 'react-widgets-globalize';
import { Combobox, SelectList, DateTimePicker } from 'react-widgets';


const targetList = [
  { name: 'List 1', targets: ['Target 1', 'Target 2', 'Target 3', 'Target 4', 'Target 5'] },
  { name: 'List 2', targets: ['Target 1', 'Target 2', 'Target 3', 'Target 4', 'Target 5'] },
  { name: 'List 3', targets: ['Target 1', 'Target 2', 'Target 3', 'Target 4', 'Target 5'] },
  { name: 'List 4', targets: ['Target 1', 'Target 2', 'Target 3', 'Target 4', 'Target 5'] },
]

const AddMarketingCampaignForm = (props) => {
  const { marketingCampaignToUpdate } = props
  const [changedValue, setChangedValue] = useState(false)
  const [idValue, setIdValue] = useState('')
  const [titleValue, setTitleValue] = useState('')
  const [targetListValue, setTargetListValue] = useState('')
  const [automatedEmailValue, setAutomatedEmailValue] = useState(false)
  const [automatedTextValue, setAutomatedTextValue] = useState(false)
  const [automatedRinglessVoicemailValue, setAutomatedRinglessVoicemailValue] = useState(false)
  const [automatedPostcardValue, setAutomatedPostcardValue] = useState(false)
  const [startDateTimeValue, setStartDateTimeValue] = useState()

  Globalize.load({
    "main": {
    "en-US": {
      "identity": {
        "version": {
          "_cldrVersion": "25",
          "_number": "$Revision: 91 $"
        },
        "generation": {
          "_date": "$Date: 2014-03-13 22:27:12 -0500 (Thu, 13 Mar 2014) $"
        },
        "language": "en"
      },
      "dates": {
        "calendars": {
          "gregorian": {
            "months": {
              "format": {
                "wide": {
                  "1": "January",
                  "2": "February",
                  "3": "March",
                  "4": "April",
                  "5": "May",
                  "6": "June",
                  "7": "July",
                  "8": "August",
                  "9": "September",
                  "10": "October",
                  "11": "November",
                  "12": "December"
                },
                "abbreviated": {
                  "1": "Jan",
                  "2": "Feb",
                  "3": "Mar",
                  "4": "Apr",
                  "5": "May",
                  "6": "Jun",
                  "7": "Jul",
                  "8": "Aug",
                  "9": "Sep",
                  "10": "Oct",
                  "11": "Nov",
                  "12": "Dec"
                }
              }
            },
            "days": {
              "format": {
                "abbreviated": {
                  "1": "Sun",
                  "2": "Mon",
                  "3": "Tue",
                  "4": "Wed",
                  "5": "Thu",
                  "6": "Fri",
                  "7": "Sat",
                }
              }
            },
            "dayPeriods": {
              "format": {
                "wide": {
                  "am": "AM",
                  "am-alt-variant": "am",
                  "noon": "noon",
                  "pm": "PM",
                  "pm-alt-variant": "pm"
                }
              }
            },
            "dateFormats": {
              "short": "MM/dd/yyyy",
              "medium": "MMM d, y",
              "full": "MMM d, YYYY"
            },
            "timeFormats": {
              "medium": "h:mm:ss a",
              "short": "hh:mm a",
            },
            "dateTimeFormats": {
              "medium": "{1}, {0}"
            }
          }
        }
      },
      "numbers": {
        "defaultNumberingSystem": "latn",
        "symbols-numberSystem-latn": {
          "group": ",",
          "timeSeparator": ":",
          "infinity": "0",
          "nan": "nan",
          "decimal": ".",
          "percentSign": "%",
          "plusSign": "+",
          "minusSign": "-",
          "exponential": "e",
          "perMille": "?",
        },
        "decimalFormats-numberSystem-latn": {
          "standard": "#,##0.###"
        }
      }
    }
  },
    "supplemental": {
      "version": {
        "_cldrVersion": "25",
        "_number": "$Revision: 91 $"
      },
      "likelySubtags": {
        "en": "en-Latn-US",
      }
    }
  });
  
  Globalize.locale('en-US')
  globalizeLocalizer()

  if (marketingCampaignToUpdate && titleValue !== marketingCampaignToUpdate.title) {
    setIdValue(marketingCampaignToUpdate.id)
    setChangedValue(false)
    setTitleValue(marketingCampaignToUpdate.title)
    setTargetListValue(marketingCampaignToUpdate.targetList)
    setAutomatedEmailValue(marketingCampaignToUpdate.automatedEmail)
    setAutomatedPostcardValue(marketingCampaignToUpdate.automatedPostCard)
    setAutomatedTextValue(marketingCampaignToUpdate.automatedText)
    setAutomatedRinglessVoicemailValue(marketingCampaignToUpdate.automatedRinglessVoicemail)
    setStartDateTimeValue(marketingCampaignToUpdate.startTime)
    setStartDateTimeValue(marketingCampaignToUpdate.startDate)
}
  else if (!idValue) {
    setChangedValue(false)
    setIdValue(Math.ceil(Math.random() * 100000000))
  }

  return (
    <div className='add-campaign-form'>
      <div className='title-box'>
        Add a Marketing Campaign
      </div>
      <div className='campaign-sides-container'>
        <div className="left-side">
    
          <div className='input-box'>
            <div className='label'>Title</div>
            <div className='input-container'>
              <input
                value={titleValue}
                onChange={(e) => {
                  setTitleValue(e.target.value)
                  setChangedValue(true)
                }}
                type='text'
                name='title'
              />
            </div>
          </div>
          <div className='input-box'>
            <div className='label'>Target List</div>
            <div className='input-container'>
            <Combobox
                value={targetListValue ? targetListValue.name : ''}
                onChange={(value) => {
                  setTargetListValue(targetList.find(target => {return target.name === value}))
                  setChangedValue(true)
                }}
                data={targetList.map(target => { return target.name })}
              />
            </div>
          </div>
          <div className='input-box'>
            <div className='label'>Start Date/Time</div>
            <div className='input-container'>
              <DateTimePicker
                date={true}
                time={true}
                dropUp={true}
                value={startDateTimeValue}
                onChange={(value) => {
                  setStartDateTimeValue(new Date(value))
                  setChangedValue(true)
                }}
              />
            </div>
          </div>
        </div>
        <div className='right-side'>
          <div className='input-box'>
            <div className='label'>Automated Email</div>
            <div className='input-container'>
              <SelectList
                value={automatedEmailValue ? 'Yes - $.25 a Target' : 'No'}
                data={['Yes - $.25 a Target', 'No']}
                defaultValue={['No']}
                onChange={(value) => {
                  setAutomatedEmailValue(value !== 'No' ? true : false)
                  setChangedValue(true)
                }}
              />
            </div>
          </div>
          <div className='input-box'>
            <div className='label'>Automated Text</div>
            <div className='input-container'>
              <SelectList
                value={automatedTextValue ? 'Yes - $.25 a Target': 'No'}
                data={['Yes - $.25 a Target', 'No']}
                defaultValue={['No']}
                onChange={(value) => {
                  setAutomatedTextValue(value !== 'No' ? true : false)
                  setChangedValue(true)
                }}
              />
            </div>
          </div>
          <div className='input-box'>
            <div className='label'>Automated Ringless Voicemail</div>
            <div className='input-container'>
              <SelectList
                value={automatedRinglessVoicemailValue ? 'Yes - $.25 a Target': 'No'}
                data={['Yes - $.25 a Target', 'No']}
                defaultValue={['No']}
                onChange={(value) => {
                  setAutomatedRinglessVoicemailValue(value !== 'No' ? true : false)
                  setChangedValue(true)
                }}
              />
            </div>
          </div>
          <div className='input-box'>
            <div className='label'>Automated Postcard</div>
            <div className='input-container'>
              <SelectList
                value={automatedPostcardValue ? 'Yes 4X6 $1.25 a Target': 'No'}
                data={['Yes 4X6 $1.25 a Target', 'No']}
                defaultValue={['No']}
                onChange={(value) => {
                  setAutomatedPostcardValue(value !== 'No' ? true : false)
                  setChangedValue(true)
                }}
              />
            </div>
          </div>
        </div>
      </div>
      <div className={'add-button' + (changedValue ? ' enabled' : '')} onClick={changedValue ? (e) => {

        let totalAmount = 0
        if (automatedEmailValue) {
          totalAmount += (.25 * (targetListValue ? targetListValue.targets.length : 0))
        }
        if (automatedPostcardValue) {
          totalAmount += (1.25 * (targetListValue ? targetListValue.targets.length : 0))
        }
        if (automatedTextValue) {
          totalAmount += (.25 * (targetListValue ? targetListValue.targets.length : 0))
        }
        if (automatedRinglessVoicemailValue) {
          totalAmount += (.25 * (targetListValue ? targetListValue.targets.length : 0))
        }
        props.addMarketingCampaign({
          id: marketingCampaignToUpdate ? marketingCampaignToUpdate.id : idValue,
          title: titleValue,
          targetList: targetListValue,
          automatedEmail: automatedEmailValue,
          automatedPostCard: automatedPostcardValue,
          automatedText: automatedTextValue,
          automatedRinglessVoicemail: automatedRinglessVoicemailValue,
          total: totalAmount,
          startDateTime: startDateTimeValue,
        })
        setIdValue('')
        setChangedValue(false)
        setTitleValue('')
        setTargetListValue('')
        setAutomatedEmailValue(false)
        setAutomatedPostcardValue(false)
        setAutomatedTextValue(false)
        setAutomatedRinglessVoicemailValue(false)
        setStartDateTimeValue("")
    
      } : null}>{marketingCampaignToUpdate ? 'Update Campaign' : 'Add Campaign'}</div>
    </div>
  )
}

export default AddMarketingCampaignForm