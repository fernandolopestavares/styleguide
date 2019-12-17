import { useMemo, useCallback, useEffect, useReducer } from 'react'
import PropTypes from 'prop-types'
import isEmpty from 'lodash/isEmpty'

import { getFlat } from './util'
import { defaultComparatorCurry, ROOT_KEY, ROOT_VALUE } from './constants'
import { useChecboxesInput, Tree } from './types'
import reducer, { ActionType } from './reducer'

export default function useCheckboxTree<T>({
  items,
  onToggle,
  nodesKey = 'children',
  checked = [],
  comparator = defaultComparatorCurry,
  isDisabled = () => false,
}: useChecboxesInput<T>) {
  const [checkedItems, dispatch] = useReducer(reducer, checked)

  const itemTree = useMemo(() => {
    return { [ROOT_KEY]: ROOT_VALUE, [nodesKey]: items }
  }, [items])

  /**
   * Atatch disabled items
   * what should i do ?
   */
  const disabledItems = useMemo(() => {
    return items.filter(isDisabled)
  }, [itemTree])

  const toggle = useCallback(
    (item: T): void => {
      dispatch({
        type: ActionType.Toggle,
        itemToToggle: { item, nodesKey, comparator },
        isDisabled,
      })
    },
    [checkedItems]
  )

  useEffect(() => {
    onToggle && onToggle({ checkedItems })
  }, [toggle])

  useEffect(() => {
    const shake = (tree: Tree<T>) => {
      const childNodes = tree[nodesKey] as Array<T>

      if (!childNodes || isEmpty(childNodes)) return

      const areChildsChecked = childNodes.every(child =>
        checkedItems.some(comparator(child))
      )
      const isRootChecked = checkedItems.some(comparator(tree))

      if (areChildsChecked && !isRootChecked)
        dispatch({ type: ActionType.Check, item: tree })

      if (!areChildsChecked && isRootChecked)
        dispatch({
          type: ActionType.Uncheck,
          itemToToggle: { item: tree, comparator },
        })

      childNodes.forEach(shake)
    }
    shake(itemTree)
  }, [checkedItems])

  const isChecked = useCallback(
    (item: T | Tree<T>) => {
      const children = item[nodesKey]
      const toggleableChildren =
        children && children.filter((item: T | Tree<T>) => !isDisabled(item))
      return toggleableChildren && !isEmpty(toggleableChildren)
        ? toggleableChildren.every(child =>
            checkedItems.some(comparator(child))
          )
        : checkedItems.some(comparator(item))
    },
    [checkedItems]
  )

  const isPartiallyChecked = useCallback(
    (item: T | Tree<T>) => {
      return (
        item[nodesKey] &&
        getFlat(item, [], nodesKey)
          .slice(1)
          .some(child => checkedItems.some(comparator(child)))
      )
    },
    [checkedItems]
  )

  const allChecked = useMemo(() => {
    return isChecked(itemTree)
  }, [checkedItems])

  const someChecked = useMemo(() => {
    return checkedItems.length > 0
  }, [checkedItems])

  const check = useCallback(
    (item: T | Tree<T>) => {
      dispatch({
        type: ActionType.BulkCheck,
        itemToToggle: { item, comparator, nodesKey },
        isDisabled,
      })
    },
    [checkedItems]
  )

  const checkAll = useCallback(() => {
    check(itemTree)
  }, [checkedItems])

  const uncheck = useCallback(
    (item: T | Tree<T>) => {
      dispatch({
        type: ActionType.BulkUncheck,
        itemToToggle: { item, comparator, nodesKey },
      })
    },
    [checkedItems]
  )

  const uncheckAll = useCallback(() => {
    uncheck(itemTree)
  }, [checkedItems])

  return {
    checkedItems,
    isChecked,
    allChecked,
    someChecked,
    isPartiallyChecked,
    itemTree,
    toggle,
    check,
    checkAll,
    uncheck,
    uncheckAll,
    isDisabled,
    disabledItems,
  }
}

export const checkboxesPropTypes = {
  checkboxes: PropTypes.shape({
    checkedItems: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string,
      })
    ),
    itemTree: PropTypes.shape({
      id: PropTypes.string,
    }),
    toggle: PropTypes.func,
    isChecked: PropTypes.func,
    isPartiallyChecked: PropTypes.func,
  }),
}
