import React from 'react'

interface IProps {
  page: number
  limit: number
  total_prods: number
  handlePageClick: (pg: number) => void
}

const Pagination = ({ page, limit, total_prods, handlePageClick }: IProps) => {
  const fillProductItems = (): JSX.Element[] => {
    const productItems = []
    // PS first page === 0, reason is because we start using 0 as offset on the db query

    productItems.push(
      <li key='first' onClick={() => handlePageClick(0)}>
        First
      </li>
    )

    let i = page + 1 > 5 ? page + 1 - 4 : 1
    if (i !== 1) productItems.push(<li className='page-disabled'>...</li>)

    for (i; i <= page + 1 + 4 && i <= Math.ceil(total_prods / limit); ++i) {
      const val = i

      productItems.push(
        <li
          className={`${page + 1 === i ? 'adm-cur-page' : ''}`}
          key={i}
          onClick={() => handlePageClick(val - 1)}
        >
          {i}
        </li>
      )

      if (i === page + 1 + 4 && i < Math.ceil(total_prods / limit))
        productItems.push(<li className='page-disabled'>...</li>)
    }

    productItems.push(
      <li
        key='last'
        onClick={() => handlePageClick(Math.ceil(total_prods / limit) - 1)}
      >
        Last
      </li>
    )

    return productItems
  }

  return <ul>{fillProductItems()}</ul>
}

export default Pagination
