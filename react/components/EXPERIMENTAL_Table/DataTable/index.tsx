import React, { FC, Children } from 'react'

import EmptyState from '../../EmptyState/index.js'

import Headings from './Headings'
import Rows from './Rows'
import { NAMESPACES } from '../constants'
import useTableContext from '../hooks/useTableContext'
import Loading from './Loading'
import { HtmlAttributes } from 'csstype'

const DataTableContainer: FC = ({ children }) => {
  const {
    loading,
    isEmpty,
    tableHeight,
    containerHeight,
    emptyState,
  } = useTableContext()

  const height = isEmpty || loading ? containerHeight : tableHeight

  return (
    <div
      id={NAMESPACES.TABLE}
      style={{ minHeight: height }}
      className="order-1 mw-100 overflow-x-auto">
      {children}
      {!isEmpty && loading && (
        <Loading>
          {typeof loading !== 'boolean' &&
            loading.renderAs &&
            loading.renderAs()}
        </Loading>
      )}
      {isEmpty && emptyState && (
        <EmptyState title={emptyState.label}>{emptyState.children}</EmptyState>
      )}
    </div>
  )
}

const DataTable: FC<DataTableProps> & DataTableComposites = ({
  children,
  className,
  as: Tag,
}) => {
  const { loading, isEmpty } = useTableContext()

  const hideRows = isEmpty || loading

  const isRowsChild = (child: DataTableChild) => child.type.name === 'Rows'

  const isRowsContainer = (child: DataTableChild) =>
    child.props.children &&
    Children.toArray(child.props.children).some(isRowsChild)

  const childRenderer = (child: DataTableChild) => {
    const hasRowsChild = isRowsChild(child) || isRowsContainer(child)
    return hasRowsChild && hideRows ? null : child
  }

  return (
    <DataTableContainer>
      <Tag className={`w-100 ${className}`} style={{ borderSpacing: 0 }}>
        {Children.map(children, childRenderer)}
      </Tag>
    </DataTableContainer>
  )
}

DataTable.defaultProps = {
  as: 'table',
  className: '',
}

export type DataTableProps = {
  as?: 'table' | 'div' | 'section'
  className?: string
}

export type DataTableChild = {
  type: {
    name?: 'Headings' | 'Rows'
  }
  props: {
    children?: Array<DataTableChild>
  }
}

export type DataTableComposites = {
  Headings?: FC
  Rows?: FC
}

DataTable.Headings = Headings
DataTable.Rows = Rows

export default DataTable
