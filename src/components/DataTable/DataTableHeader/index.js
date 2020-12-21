import React from 'react'
import SortableHeaderCell from './SortableHeaderCell'
import CheckBox from '../../../components/controls/CheckBox'
import './DataTableHeader.scss'

//******************************************************************
//*
//* Generic Table Header
//*
//******************************************************************


const DataTableHeader = (props) => {
  const { tableColumnsDescriptor, handleTableSort, handleCheck } = props

  const headerColumns = !tableColumnsDescriptor ? null : tableColumnsDescriptor.map(desc => {
    if (desc.isCheckBox) {
      return <CheckBox key={'header-cell-' + desc.fieldName} marginTop={3} width={desc.width} checked={desc.checked}
        onSelectCheckBox={(checked) => {
        handleCheck(checked)
      }}/>
    }
    else {
      return <SortableHeaderCell key={'header-cell-' + desc.fieldName} width={desc.width} sortDirection={desc.sortDirection} handleTableSort={() =>
        handleTableSort(desc.fieldName)} headerCellTitle={desc.headerCellTitle} />
    }
  })

  return (
    <div className="prospect-list-header">
      {headerColumns}
    </div>
  )
}

export default DataTableHeader