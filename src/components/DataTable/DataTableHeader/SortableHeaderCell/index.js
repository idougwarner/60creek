import React from 'react'
import sortButton from '../../../../assets/images/sort-down.svg'
import './SortableHeaderCell.scss'

export default class SortableHeaderCell extends React.Component {

  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    const { headerCellTitle, handleOnSort, sortDirection, width, lineHeight } = this.props
    return (
      <div className={'sixty-creek-sortable-header-cell' + (headerCellTitle === '' ? ' no-margin' : '')
      } style={{ width: width, lineHeight: lineHeight }}>
        <span className='header-cell-title'>{headerCellTitle}</span>
        {
          sortDirection ?
            <img className={'header-cell-sort-button' +
              (sortDirection === 'asc' ? ' sort-ascending' : sortDirection === 'desc' ? ' sort-descending' : '')
            }
              onClick={() => handleOnSort(sortDirection === 'asc' ? 'desc' : 'asc')} alt='sort-button'
              src={sortButton} />
            :
            null}
      </div >
    )
  }
}
