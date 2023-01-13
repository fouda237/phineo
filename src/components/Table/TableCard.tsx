//@ts-nocheck
import React from 'react'
import {useAsyncDebounce, useFilters, useGlobalFilter, usePagination, useSortBy, useTable} from 'react-table'
import {classNames} from './shared/Utils'
import {SortDownIcon, SortIcon, SortUpIcon} from './shared/Icons'
import {useNavigate} from "react-router-dom";
import { format } from 'fecha';
import Moment from 'react-moment';

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
    const status = value ? row.original.user.toLowerCase() : "unknown";

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
                src={row.original[column.imgAccessor]}
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

function TableCard({columns, data, urlRedirect, actionCommandes, actionFinalCommandes, cancelCommande, courseId, validateCommande, validateFinalCommande, abandonedCommand, noActions, onlyDeleteAction, responses, nbModules}: any) {
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
            <div className="col-lg-12 mt-1">
                <div className="card border-0 mt-0 rounded-10">




                    <div className="row">

                            { headerGroups.map(headerGroup => (
                                <div className='col-md-12 mb-5' {...headerGroup.getHeaderGroupProps()} style={{ display: 'inline-flex'}}>
                                    <strong className='pr-3'>
                                        Trier par: 
                                    </strong>
                                    {headerGroup.headers.map(column => (
                                        <div
                                            scope="col"
                                            {...column.getHeaderProps(column.getSortByToggleProps())}
                                        >
                                            <div className="items-center justify-between mr-4">
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
                                        </div>
                                    ))}
                                </div>
                            ))}

                            {page.map((row, i) => {
                                prepareRow(row)

                                return (
                                    <div
                                    key={i}
                                    className="col-md-3 col-sm-6"
                                    >
                                    <div className="card mb-4 d-block w-100 shadow-xss rounded-lg p-4 border-0 text-center">
                                        <button
                                            className="position-absolute right-0 mr-4 top-0 mt-3 bg-white border-0"
                                            onClick={() => onlyDeleteAction(row.original)}
                                        >
                                            <i className="feather feather-x-circle font-md text-danger"></i>
                                        </button>

                                        <h4 className="fw-700 font-xs mt-4 mb-1">
                                            {row.original.user.firstName} {row.original.user.lastName}
                                        </h4>
                                        <p className="fw-600 font-xssss text-grey-500 mt-0 mb-2">
                                            {row.original.user.email}
                                        </p>

                                        <div className="clearfix"></div>

                                        <span className="font-xssss fw-600 text-grey-500 d-inline-block ml-1">
                                            Date d'Entrée en Formation :
                                        </span>
                                        <h4 className="fw-700 font-xsss mt-0 mb-2">
                                            <Moment format='dddd DD MMMM' style={{textTransform: 'capitalize'}}>{row.original.beginDate}</Moment> 
                                        </h4>
                
                                        <ul className="list-inline border-0 mt-4">
                                            <li className="list-inline-item text-center">
                                                <h4 className="fw-700 font-xl">
                                                    {row.original.progression ? (
                                                        row.original.progression > 100 ? (
                                                            '100%'
                                                        ) : (
                                                            <>
                                                                {row.original.progression}%
                                                            </>
                                                        )
                                                    ) : '0%'
                                                    }
                                                    <span className="font-xsssss fw-500 mt-1 text-grey-500 d-block">
                                                        Progression
                                                    </span>
                                                </h4>
                                            </li>
                                        </ul>

                                        <a
                                            href={`/admin/course/${courseId}/logs/${row.original.user.id}`}
                                            className="mt-3 btn p-2 pr-3 pl-3 lh-24 mr-2 ls-3 d-inline-block rounded-xl bg-skype font-xsssss fw-700 ls-lg text-white"
                                        >
                                            <i className='feather feather-file-text mr-1'></i> Logs de Connexion
                                        </a> 

                                        <a
                                            href="#" 
                                            className="mt-3 btn p-2 pr-3 pl-3 lh-24 ml-1 ls-3 d-inline-block rounded-xl bg-skype font-xsssss fw-700 ls-lg text-white"
                                        >
                                            Stats - SOON
                                        </a>

                                    </div>
                                    </div>
                                )
                            })}
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
                                {[12, 24, 32, 52].map(pageSize => (
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

export default TableCard;
