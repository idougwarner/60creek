import react, { useState } from 'react'
import './AddMarketingCampaignForm.scss'
import 'react-widgets/lib/scss/react-widgets.scss'
import { Combobox, SelectList } from 'react-widgets';

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
  const [startTimeValue, setStartTimeValue] = useState()
  const [startDateValue, setStartDateValue] = useState()

  // Globalize.locale('en')

  // globalizeLocalizer()

  if (marketingCampaignToUpdate && titleValue !== marketingCampaignToUpdate.title) {
    setIdValue(marketingCampaignToUpdate.id)
    setChangedValue(false)
    setTitleValue(marketingCampaignToUpdate.title)
    setTargetListValue(marketingCampaignToUpdate.targetList)
    setAutomatedEmailValue(marketingCampaignToUpdate.automatedEmail)
    setAutomatedPostcardValue(marketingCampaignToUpdate.automatedPostCard)
    setAutomatedTextValue(marketingCampaignToUpdate.automatedText)
    setAutomatedRinglessVoicemailValue(marketingCampaignToUpdate.automatedRinglessVoicemail)
    setStartTimeValue(marketingCampaignToUpdate.startTime)
    setStartDateValue(marketingCampaignToUpdate.startDate)
}
  else if (!idValue) {
    setChangedValue(false)
    setIdValue(Math.ceil(Math.random() * 100000000))
  }

  return (
    <div className='add-campaign-form'>
      Add a Marketing Campaign
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
            <div className='label'>Start Date</div>
            <div className='input-container'>
              {/* <DateTimePicker
                date={true}
                value={startDateValue}
                onChange={(value) => {
                  setStartDateValue(value)
                  setChangedValue(true)
                }}
              /> */}
            </div>
          </div>
          <div className='input-box'>
            <div className='label'>Start Time</div>
            <div className='input-container'>
              {/* <DateTimePicker
                time={true}
                value={startTimeValue}
                onChange={(value) => {
                  setStartTimeValue(value)
                  setChangedValue(true)
                }}
              /> */}
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
          startDate: startDateValue,
          startTime: startTimeValue,
        })
        setIdValue('')
        setChangedValue(false)
        setTitleValue('')
        setTargetListValue('')
        setAutomatedEmailValue(false)
        setAutomatedPostcardValue(false)
        setAutomatedTextValue(false)
        setAutomatedRinglessVoicemailValue(false)
        setStartTimeValue()
        setStartDateValue()
    
      } : null}>{marketingCampaignToUpdate ? 'Update Campaign' : 'Add Campaign'}</div>
    </div>
  )
}

export default AddMarketingCampaignForm