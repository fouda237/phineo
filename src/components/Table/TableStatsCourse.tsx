//@ts-nocheck
import React from 'react'
import {useAsyncDebounce, useFilters, useGlobalFilter, usePagination, useSortBy, useTable} from 'react-table'
import {classNames} from './shared/Utils'
import {SortDownIcon, SortIcon, SortUpIcon} from './shared/Icons'
import {useNavigate} from "react-router-dom";
import { format } from 'fecha';
import ReactApexChart from "react-apexcharts";
import For from '../../assets/images/wab_formation.jpg'

import Moment from 'react-moment';

const options: ApexOptions = {
    chart: {
      type: 'radialBar',
      height: 240
    },
    plotOptions: {
      radialBar: {
        dataLabels: {
          name: {
            fontSize: '20px',
            offsetY: -5,
          },
          value: {
            fontSize: '16px',
            show: true,
            offsetY: 5,
          },
          total: {
            show: false,
            label: 'Progession',
          }
        }
      }
    },
    labels: ['Vidéos', 'Quiz', 'Articles', 'Docs', 'Exercices'],
};

const optionsPercent: ApexOptions = {
    chart: {
      height: 100,
      type: 'radialBar',
      toolbar: {
        show: false
      }
    },
    plotOptions: {
      radialBar: {
        startAngle: -135,
        endAngle: 225,
         hollow: {
          margin: 0,
          size: '70%',
          background: '#fff',
          image: undefined,
          imageOffsetX: 0,
          imageOffsetY: 0,
          position: 'front',
        },

        track: {
          background: '#fff',
          strokeWidth: '67%',
          margin: 0,
        },
    
        dataLabels: {
          show: true,
          name: {
            show: false,
          },
          value: {
            offsetY: 5,
            color: '#111',
            fontSize: '12px',
            show: true,
          }
        }
      }
    },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'dark',
        type: 'horizontal',
        shadeIntensity: 0.5,
        gradientToColors: ['#2726f9'],
        inverseColors: true,
        opacityFrom: 1,
        opacityTo: 1,
        stops: [0, 100]
      }
    },
    stroke: {
      lineCap: 'round'
    },
};

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

function TableStatsCourse({columns, data, timeConvert, statsUser, actionFinalCommandes, cancelCommande, validateCommande, validateFinalCommande, abandonedCommand, noActions, onlyDeleteAction, responses, nbModules}: any) {
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


        <div>
            <div className="col-lg-12 mt-1">
                <div className="card border-0 mt-0 rounded-10">




                    <div className="row">

                            { headerGroups.map(headerGroup => (
                                <div className='col-md-12 mb-4' {...headerGroup.getHeaderGroupProps()} style={{ display: 'inline-flex'}}>
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

                            {page.map((row, key) => {
                                prepareRow(row)

                                return (
                                    <div className='border p-4 mb-5 rounded-xl shadow-lg bg-white' key={key}>
                                        <div className='row'>
                                            <div className='col-md-12'>
                                                <h2 className="fw-600 font-md ml-3 mb-4">
                                                    {row.original.title}
                                                </h2>
                                            </div>
                                        </div>
                                        
                                        <div className='row'>
                                            <div className='col-md-4'>
                                                <img src={For} style={{ width: '100%', borderRadius: '20px' }}/>
                                            </div>
                                        
                                            <div className='col-md-8'>
                                                <div className='row'>
                                                    <div className="col-md-6">
                                                        <div className="card w-100 p-1 border-0 rounded-lg bg-white shadow-md overflow-hidden mb-3">
                                                            <div className="card-body p-3 text-center">
                                                                <h2 className="text-grey-900 fw-700 font-xl mt-2 mb-2 ls-3 lh-1">
                                                                    {timeConvert(statsUser.logs[key].logCourse)}
                                                                </h2>
                                                                <h4 className="fw-700 text-grey-500 font-xsssss ls-3 text-uppercase mb-0 mt-0">
                                                                    <i className='feather feather-clock mr-2'></i>
                                                                    TEMPS SUIVI
                                                                </h4>
                                                            </div>
                                                        </div>
                                                    </div>
                                        
                                                    <div className="col-md-6">
                                                        <div className="card w-100 p-1 border-0 rounded-lg bg-white shadow-md overflow-hidden mb-3">
                                                            <div className="card-body p-3 text-center">
                                                                <h2 className="text-grey-900 fw-700 font-xl mt-2 mb-2 ls-3 lh-1">
                                                                    {((row.original.totalModulesValided/row.original.totalModules) * 100).toFixed(0)}%
                                                                </h2>
                                                                <h4 className="fw-700 text-grey-500 font-xsssss ls-3 text-uppercase mb-0 mt-0">
                                                                    <i className='feather feather-trending-up mr-2'></i>
                                                                    PROGRESSION
                                                                </h4>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="col-md-6">
                                                        <div className="card w-100 p-1 border-0 rounded-lg bg-white shadow-md overflow-hidden mb-3">
                                                            <div className="card-body p-3 text-center">
                                                                <h2 className="text-grey-900 fw-700 font-xl mt-2 mb-2 ls-3 lh-1">
                                                                    {row.original.totalModulesValided} / {row.original.totalModules}
                                                                </h2>
                                                                <h4 className="fw-700 text-grey-500 font-xsssss ls-3 text-uppercase mb-0 mt-0">
                                                                    <i className='feather feather-check mr-2'></i>
                                                                    MODULES VALIDÉS
                                                                </h4>
                                                            </div>
                                                        </div>
                                                    </div>
                                        
                                                    {row.original.exerciseModuleNb > 0 && (
                                                        <div className="col-md-6">
                                                            <div className="card w-100 p-1 border-0 rounded-lg bg-white shadow-md overflow-hidden mb-3">
                                                                <div className="card-body p-3 text-center">
                                                                    <h2 className="text-grey-900 fw-700 font-xl mt-2 mb-2 ls-3 lh-1">
                                                                        {row.original.exerciseSend} / {row.original.exerciseModuleNb}
                                                                    </h2>
                                                                    <h4 className="fw-700 text-grey-500 font-xsssss ls-3 text-uppercase mb-0 mt-0">
                                                                        <i className='feather feather-star mr-2'></i>
                                                                        Exercices Rendus
                                                                    </h4>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                        
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className='row'>
                                            <div className='col-md-4'>
                                                <div className='row'>
                                                    
                                                    {row.original.videoModuleNb > 0 && (
                                                        <div className="col-md-12">
                                                            <div className="card w-100 p-1 border-0 rounded-lg bg-white shadow-md overflow-hidden mb-3">
                                                                <div className="card-body p-0 pl-4">
                                                                    <div className="row">
                                                                        <div className="col-7">
                                                                            <h2 className="text-grey-900 fw-700 font-xl mt-2 mb-2 ls-3 lh-1 pt-3">
                                                                                {row.original.videoValided} / {row.original.videoModuleNb}
                                                                            </h2>
                                                                            <h4 className="fw-700 text-grey-500 font-xsssss ls-3 text-uppercase mb-0 mt-0">
                                                                                <i className='feather feather-play mr-2'></i>
                                                                                Vidéos Validées
                                                                            </h4>
                                                                        </div>
                                                                        <div className="col-5 text-left">
                                                                            <ReactApexChart className='pt-2 pb-1' options={optionsPercent} series={[Math.round((row.original.videoValided/row.original.videoModuleNb * 100) * 1e0)]} type="radialBar" height={100} />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                        
                                                    {row.original.quizzModuleNb > 0 && (
                                                        <div className="col-md-12">
                                                            <div className="card w-100 p-1 border-0 rounded-lg bg-white shadow-md overflow-hidden mb-3">
                                                                <div className="card-body p-0 pl-4">
                                                                    <div className="row">
                                                                        <div className="col-7">
                                                                            <h2 className="text-grey-900 fw-700 font-xl mt-2 mb-2 ls-3 lh-1 pt-3">
                                                                                {row.original.quizzValided} / {row.original.quizzModuleNb}
                                                                            </h2>
                                                                            <h4 className="fw-700 text-grey-500 font-xsssss ls-3 text-uppercase mb-0 mt-0">
                                                                                <i className='feather feather-help-circle mr-2'></i>
                                                                                Quiz Validés
                                                                            </h4>
                                                                        </div>
                                                                        <div className="col-5 text-left">
                                                                            <ReactApexChart className='pt-2 pb-1' options={optionsPercent} series={[Math.round((row.original.quizzValided/row.original.quizzModuleNb * 100) * 1e0)]} type="radialBar" height={100} />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                        
                                                </div>
                                            </div>
                                        
                                            <div className='col-md-4'>
                                                <div className='row'>
                                                    <div className='col-md-12 dark-mode-enable'>
                                                        <ReactApexChart
                                                        options={options}
                                                        series={[
                                                                    Math.round((row.original.videoValided/row.original.videoModuleNb) * 100),
                                                                    Math.round((row.original.quizzValided/row.original.quizzModuleNb) * 100),
                                                                    Math.round((row.original.docValided/row.original.docModuleNb) * 100),
                                                                    Math.round((row.original.articleValided/row.original.articleModuleNb) * 100),
                                                                    Math.round((row.original.exerciseSend/row.original.exerciseModuleNb) * 100),
                                                                ]}
                                                        type="radialBar"
                                                        height={240}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        
                                            <div className='col-md-4'>
                                                <div className='row'>
                                        
                                                    
                                                    {row.original.articleModuleNb > 0 && (
                                                        <div className="col-md-12">
                                                            <div className="card w-100 p-1 border-0 rounded-lg bg-white shadow-md overflow-hidden mb-3">
                                                                <div className="card-body p-0 pl-4">
                                                                    <div className="row">
                                                                        <div className="col-7">
                                                                            <h2 className="text-grey-900 fw-700 font-xl mt-2 mb-2 ls-3 lh-1 pt-3">
                                                                                {row.original.articleValided} / {row.original.articleModuleNb}
                                                                            </h2>
                                                                            <h4 className="fw-700 text-grey-500 font-xsssss ls-3 text-uppercase mb-0 mt-0">
                                                                                <i className='feather feather-file-text mr-2'></i>
                                                                                Articles Validés
                                                                            </h4>
                                                                        </div>
                                                                        <div className="col-5 text-left">
                                                                            <ReactApexChart className='pt-2 pb-1' options={optionsPercent} series={[Math.round((row.original.articleValided/row.original.articleModuleNb * 100) * 1e0)]} type="radialBar" height={100} />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                    
                                                    {row.original.docModuleNb > 0 && (
                                                        <div className="col-md-12">
                                                            <div className="card w-100 p-1 border-0 rounded-lg bg-white shadow-md overflow-hidden mb-3">
                                                                <div className="card-body p-0 pl-4">
                                                                    <div className="row">
                                                                        <div className="col-7">
                                                                            <h2 className="text-grey-900 fw-700 font-xl mt-2 mb-2 ls-3 lh-1 pt-3">
                                                                                {row.original.docValided} / {row.original.docModuleNb}
                                                                            </h2>
                                                                            <h4 className="fw-700 text-grey-500 font-xsssss ls-3 text-uppercase mb-0 mt-0">
                                                                                <i className='feather feather-file mr-2'></i>
                                                                                Docs Validés
                                                                            </h4>
                                                                        </div>
                                                                        <div className="col-5 text-left">
                                                                            <ReactApexChart className='pt-2 pb-1' options={optionsPercent} series={[Math.round((row.original.docValided/row.original.docModuleNb * 100) * 1e0)]} type="radialBar" height={100} />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                        
                                                </div>
                                            </div>
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
                                {[5, 10, 15, 20].map(pageSize => (
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

export default TableStatsCourse;
