//@ts-nocheck
import React from 'react'
import {useAsyncDebounce, useFilters, useGlobalFilter, usePagination, useSortBy, useTable} from 'react-table'
import {classNames} from './shared/Utils'
import {SortDownIcon, SortIcon, SortUpIcon} from './shared/Icons'
import {useNavigate} from "react-router-dom";
import { format } from 'fecha';
import Moment from 'react-moment';
import For from '../../assets/images/wab_formation.jpg'
// Define a default UI for filtering
function GlobalFilter({
                          preGlobalFilteredRows,
                          globalFilter,
                          setGlobalFilter,
                      }) {
    const count = preGlobalFilteredRows.length
    const [value, setValue] = React.useState(globalFilter)
    const onChange = useAsyncDebounce(value => {
        setGlobalFilter(value || undefined)
    }, 200)

    return (
        <div className="col-md-12">
            <div className="form-group mb-0">
            <label
                htmlFor="product_sku"
                className="form-label"
            >
                Recherche :
            </label>
            <input
                name="recherche"
                className="form-control form_control"
                type="text"
                value={value || ""}
                onChange={e => {
                    setValue(e.target.value);
                    onChange(e.target.value);
                }}
                placeholder={`${count} au total...`}
            />
            </div>
        </div>
    )
}

// This is a custom filter UI for selecting
// a unique option from a list
export function SelectColumnFilter({
                                       column: {filterValue, setFilter, preFilteredRows, id, render},
                                   }: any) {
    // Calculate the options for filtering
    // using the preFilteredRows
    const options = React.useMemo(() => {
        const options = new Set()
        preFilteredRows.forEach((row: any) => {
            options.add(row.values[id])
        })
        return [...options.values()]
    }, [id, preFilteredRows])

    // Render a multi-select box
    return (
        <label className="flex gap-x-2 items-baseline">
            <span className="text-gray-700">{render("Header")}: </span>
            <select
                className="p-2 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                name={id}
                id={id}
                value={filterValue}
                onChange={e => {
                    setFilter(e.target.value || undefined)
                }}
            >
                <option value="">All</option>
                {options.map((option, i) => (
                    <option key={i} value={option}>
                        {option}
                    </option>
                ))}
            </select>
        </label>
    )
}

export function StatusPill({value}: any) {
    const status = value ? value.toLowerCase() : "unknown";

    return (
        <span
            className={
                classNames(
                    "badge rounded-pill font-xsssss fw-700 pl-3 pr-3 lh-24 text-uppercase rounded-3 ls-2",
                    status.startsWith("user") ? "alert-success" : null,
                    status.startsWith("emrys") ? "alert-success" : null,
                    status.startsWith("teacher") ? "alert-info" : null,
                    status.startsWith("admin") ? "alert-danger" : null,
                )
            }
        >
        {status === 'user' && 'Élève'}
        {status === 'emrys' && 'Emrys'}
        {status === 'teacher' && 'Formateur'}
        {status === 'admin' && 'Admin'}
    </span>
    );
};

export function AvatarCell({value, column, row}: any) {
    return (
        <>
                <img
                src={For}
                alt="product"
                className="w75 d-inline-block"
                />
        </>
    )
}

export function BinaryValue({value, column, row}: any) {
    const binaryValue = (typeof value !== 'undefined') ? 'OUI' : 'NON'
    return (
        <span>
            {binaryValue}
        </span>
    )
}

export function fileValue({value, column, row}: any) {
    const fileValue = (typeof value !== 'undefined') ? (
        <a href={value} target="_blank">
            <i className="feather-link font-xss"></i>
        </a>
    ) : ''
    return (
        <span>
            {fileValue}
        </span>
    )
}

export function diffCell({value, column, row}: any) {
    return (
        <>
                <p>{value}</p>
        </>
    )
}

function Table({columns, data, urlRedirect, actionCommandes, actionFinalCommandes, cancelCommande, validateCommande, validateFinalCommande, abandonedCommand, noActions, onlyDeleteAction, success, danger}: any) {
    // Use the state and functions returned from useTable to build your UI
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        prepareRow,
        page, // Instead of using 'rows', we'll use page,
        // which has only the rows for the active page

        // The rest of these things are super handy, too ;)
        canPreviousPage,
        canNextPage,
        pageOptions,
        pageCount,
        gotoPage,
        nextPage,
        previousPage,
        setPageSize,

        state,
        preGlobalFilteredRows,
        setGlobalFilter,
    } = useTable({
            columns,
            data,
        },
        useFilters, // useFilters!
        useGlobalFilter,
        useSortBy,
        usePagination,  // new
    )
    const navigate = useNavigate();
    let dateCell = '';

    function timeConvert(n: any) {
        const num = n;
        const hours = (num / 60);
        const rhours = Math.floor(hours);
        const minutes = (hours - rhours) * 60;
        const rminutes = Math.round(minutes);
        return rhours + "h " + rminutes + "min";
    }

    // Render the UI for your table
    return (
        <>
        <div className='row'>
                <GlobalFilter
                    preGlobalFilteredRows={preGlobalFilteredRows}
                    globalFilter={state.globalFilter}
                    setGlobalFilter={setGlobalFilter}
                />
                {/*{headerGroups.map((headerGroup) =>*/}
                {/*    headerGroup.headers.map((column) =>*/}
                {/*        column.Filter ? (*/}
                {/*            <div className="mt-2 sm:mt-0" key={column.id}>*/}
                {/*                {column.render("Filter")}*/}
                {/*            </div>*/}
                {/*        ) : null*/}
                {/*    )*/}
                {/*)}*/}
        </div>


        <div className='row'>
            <div className="col-lg-12 mt-4">
                <div className="card border-0 mt-2 rounded-10">
                    <div className={`card-body p-0 border ${success && 'border-success'} ${danger && 'border-danger'}`}>
                        <div className="table-responsive">
                            <table {...getTableProps()} className="table table-admin mb-0">
                                <thead className="bg-greylight rounded-10 ovh">
                                    { headerGroups.map(headerGroup => (
                                        <tr {...headerGroup.getHeaderGroupProps()}>
                                            {headerGroup.headers.map(column => (
                                                <th
                                                    scope="col"
                                                    className="border-0"
                                                    {...column.getHeaderProps(column.getSortByToggleProps())}
                                                >
                                                    <div className="flex items-center justify-between">
                                                        {column.render('Header')}
                                                        <span>
                                                            {column.isSorted
                                                            ? column.isSortedDesc
                                                                ? <SortDownIcon className="w-4 h-4 text-gray-400"/>
                                                                : <SortUpIcon className="w-4 h-4 text-gray-400"/>
                                                            : (
                                                                <SortIcon className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100"/>
                                                            )}
                                                        </span>
                                                    </div>
                                                </th>
                                            ))}
                                            { !noActions && (
                                                <th scope="col" className="text-end border-0">
                                                    Actions
                                                </th>
                                            )}
                                        </tr>
                                    ))}
                                </thead>
                                <tbody {...getTableBodyProps()}>
                                    {page.map((row, i) => {
                                        prepareRow(row)

                                        return (
                                            <tr {...row.getRowProps()}>
                                                {row.cells.map(cell => {
                                                    return (
                                                        <td
                                                            {...cell.getCellProps()}
                                                            role="cell"
                                                        >
                                                            <b>
                                                                {(cell.column.Cell.name === "defaultRenderer" && cell.column.type !== 'date' && cell.column.type !== 'date-time' && cell.column.type !== 'time') ? (
                                                                    <div className={`text-sm ${danger && 'text-danger'} text-gray-500`}>{cell.render('Cell')}</div>
                                                                ) : (
                                                                    cell.column.type === "date" ? (
                                                                        <div className="text-sm text-gray-500">
                                                                            <Moment format='dddd DD MMMM' style={{textTransform: 'capitalize'}}>{cell.value}</Moment> 
                                                                        </div>
                                                                    ) : cell.column.type === "date-time" ? (
                                                                        <div className="text-sm text-gray-500">
                                                                            <Moment format='DD MMMM YYYY - HH:mm' style={{textTransform: 'capitalize'}}>{cell.value}</Moment> 
                                                                        </div>
                                                                    ) : cell.column.type === "time" ? (
                                                                        <div className="text-sm text-gray-500">
                                                                            {timeConvert(cell.value)}
                                                                        </div>
                                                                    ) : cell.render('Cell')
                                                                )
                                                                }
                                                            </b>
                                                        </td>
                                                    )
                                                })}
                                                    {(!noActions) && (
                                                        !actionCommandes ? (
                                                            onlyDeleteAction ? (
                                                                <td className="product-remove text-end">
                                                                    <button 
                                                                        className='bg-white border-0'
                                                                        onClick={() => onlyDeleteAction(row.original)}
                                                                    >
                                                                        <i className="feather-x-circle me-1 font-xs text-danger" style={{ verticalAlign: 'sub'}}></i>
                                                                    </button>
                                                                </td>
                                                            ) : (
                                                                <td className="product-remove text-end">
                                                                    <a href={`${urlRedirect}${row.original.id}`}>
                                                                        <i className="feather-edit me-1 font-xs text-grey-500 mr-2"></i>
                                                                        {/* 
                                                                        <i className="ti-trash  font-xs text-danger"></i>
                                                                        */}
                                                                    </a>
                                                                </td>
                                                            )
                                                    ) : (
                                                        actionFinalCommandes ? (
                                                            <td className="product-remove text-end">
                                                                <div style={{ display: 'inline-flex'}}>
                                                                    <button 
                                                                        className='btn btn-danger font-xsss mr-4'
                                                                        onClick={() => abandonedCommand(row.original)}
                                                                    >
                                                                        <i className="feather-x me-1 font-xsss"></i>
                                                                    </button>
                                                                    <button 
                                                                        className='btn btn-success font-xsss'
                                                                        onClick={() => validateFinalCommande(row.original)}
                                                                    >
                                                                        <i className="feather-check me-1 font-xsss mr-2"></i>
                                                                        Finaliser
                                                                    </button>
                                                                </div>
                                                            </td>
                                                        ) : (
                                                            <td className="product-remove text-end">
                                                                <button 
                                                                    className='bg-white border-danger rounded-xl p-1 pr-2 pl-2 mr-3 mb-2'
                                                                    onClick={() => cancelCommande(row.original, row.id)}
                                                                >
                                                                    <i className="feather-x-circle me-1 font-xs text-danger" style={{ verticalAlign: 'sub'}}></i>
                                                                </button>
                                                                <button 
                                                                    className='bg-white border-success rounded-xl p-1 pr-2 pl-2'
                                                                    onClick={() => validateCommande(row.original)}
                                                                >
                                                                    <i className="feather-check-circle me-1 font-xs text-success" style={{ verticalAlign: 'sub'}}></i> 
                                                                </button>
                                                            </td>
                                                        )
                                                        
                                                    ))}
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>


            <ul className="pagination justify-content-center mt-4">
                <li className="page-item m-1">
                    <button
                        className="page-link rounded-lg btn-round-md-custom pt-0 pb-0 fw-500 font-xssss shadow-xss bg-white text-grey-900 border-0"
                        onClick={() => gotoPage(0)}
                        disabled={!canPreviousPage}
                    >
                        <i className="ti-angle-double-left mr-2"></i> Première Page
                    </button>
                    </li>
                    <li className="page-item m-1">
                    <button
                        className="page-link rounded-lg btn-round-md-custom pt-0 pb-0 fw-600 font-xsss shadow-xss bg-white text-grey-900 border-0"
                        onClick={() => previousPage()}
                        disabled={!canPreviousPage}
                    >
                        <i className="ti-angle-left mr-2"></i> Précèdente
                    </button>
                    </li>
                    <li className="page-item m-1">
                    <button
                        className="page-link rounded-lg btn-round-md-custom w200 pt-0 pb-0 fw-600 font-xssss shadow-xss bg-skype text-white border-0"
                    >
                        Page {state.pageIndex + 1} sur {pageOptions.length}
                    </button>
                    </li>
                    <li className="page-item m-1">
                    <button
                        className="page-link rounded-lg btn-round-md-custom pt-0 pb-0 fw-600 font-xsss shadow-xss bg-white text-grey-900 border-0"
                        onClick={() => nextPage()}
                        disabled={!canNextPage}
                    >
                        Suivante <i className="ti-angle-right ml-2"></i>
                    </button>
                    </li>
                    <li className="page-item m-1">
                    <button
                        className="page-link rounded-lg btn-round-md-custom pt-0 pb-0 fw-500 font-xssss shadow-xss bg-white text-grey-900 border-0"
                        onClick={() => gotoPage(pageCount - 1)}
                        disabled={!canNextPage}
                    >
                        Dernière Page <i className="ti-angle-double-right ml-2"></i>
                    </button>
                </li>
            </ul>


            <ul className="pagination justify-content-center">
                <li className="page-item">
                    <div className="form-group icon-input">
                        <select
                                className="style1-select bg-transparent border-0"
                                value={state.pageSize}
                                onChange={e => {
                                    setPageSize(Number(e.target.value))
                                }}
                            >
                                {[10, 20, 30, 50].map(pageSize => (
                                    <option key={pageSize} value={pageSize}>
                                        Afficher {pageSize} par Page
                                    </option>
                                ))}
                            </select>
                    </div>
                </li>
            </ul>
        </>
    )
}

export default Table;
