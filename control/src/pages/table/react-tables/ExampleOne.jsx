import React, { useState, useMemo } from "react";
import { serviceTable } from "../../../constant/table-data";
import Card from "@/components/ui/Card";
import Icon from "@/components/ui/Icon";
import Dropdown from "@/components/ui/Dropdown";
import { Menu } from "@headlessui/react";

import {
  useTable,
  useRowSelect,
  useSortBy,
  useGlobalFilter,
  usePagination,
} from "react-table";
import GlobalFilter from "./GlobalFilter";

const IndeterminateCheckbox = React.forwardRef(
  ({ indeterminate, ...rest }, ref) => {
    const defaultRef = React.useRef();
    const resolvedRef = ref || defaultRef;

    React.useEffect(() => {
      resolvedRef.current.indeterminate = indeterminate;
    }, [resolvedRef, indeterminate]);

    return (
      <>
        <input
          type="checkbox"
          ref={resolvedRef}
          {...rest}
          className="table-checkbox"
        />
      </>
    );
  }
);

const ExamapleOne = ({ columnsData, columnsDataChild, table }) => {
  // console.log(columnsDataChild);

  const columns = useMemo(() => columnsData, []);
  const columnsChild = useMemo(() => columnsDataChild, []);
  const data = useMemo(() => table, []);

  // Function to create the table instance for each set of columns
  const createTableInstance = (columns, data) => {
    return useTable(
      {
        columns,
        data,
      },
      useGlobalFilter,
      useSortBy,
      usePagination,
      useRowSelect,
      (hooks) => {
        hooks.visibleColumns.push((columns) => [
          {
            id: "selection",
            Header: ({ getToggleAllRowsSelectedProps }) => (
              <div>
                <IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />
              </div>
            ),
            Cell: ({ row }) => (
              <div>
                <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
              </div>
            ),
          },
          ...columns,
        ]);
      }
    );
  };

  // Get the table instances
  const tableInstance = createTableInstance(columns, data);
  const tableInstanceChild =
    columnsDataChild && createTableInstance(columnsDataChild, data);

  const {
    getTableProps: getTablePropsParent,
    getTableBodyProps: getTableBodyPropsParent,
    headerGroups: headerGroupsParent,
    footerGroups: footerGroupsParent,
    page: pageParent,
    nextPage: nextPageParent,
    previousPage: previousPageParent,
    canNextPage: canNextPageParent,
    canPreviousPage: canPreviousPageParent,
    pageOptions: pageOptionsParent,
    state: stateParent,
    gotoPage: gotoPageParent,
    pageCount: pageCountParent,
    setPageSize: setPageSizeParent,
    setGlobalFilter: setGlobalFilterParent,
    prepareRow: prepareRowParent,
  } = tableInstance;

  const {
    getTableProps: getTablePropsChild,
    getTableBodyProps: getTableBodyPropsChild,
    headerGroups: headerGroupsChild,
    footerGroups: footerGroupsChild,
    page: pageChild,
    nextPage: nextPageChild,
    previousPage: previousPageChild,
    canNextPage: canNextPageChild,
    canPreviousPage: canPreviousPageChild,
    pageOptions: pageOptionsChild,
    state: stateChild,
    gotoPage: gotoPageChild,
    pageCount: pageCountChild,
    setPageSize: setPageSizeChild,
    setGlobalFilter: setGlobalFilterChild,
    prepareRow: prepareRowChild,
  } = tableInstanceChild || {};

  const { globalFilter: globalFilterParent, pageIndex: pageIndexParent, pageSize: pageSizeParent } =
    stateParent;

  const { globalFilter: globalFilterChild, pageIndex: pageIndexChild, pageSize: pageSizeChild } =
    stateChild || {};

  return (
    <>
      {/* Parent Table */}
      <Card noborder>
        <div className="md:flex justify-between items-center mb-6">
          <h4 className="card-title"></h4>
          <div>
            <GlobalFilter
              filter={globalFilterParent}
              setFilter={setGlobalFilterParent}
            />
          </div>
        </div>
        <div className="overflow-x-auto -mx-6">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden ">
              <table
                className="min-w-full divide-y divide-slate-100 table-fixed dark:divide-slate-700"
                {...getTablePropsParent}
              >
                <thead className=" border-t border-slate-100 dark:border-slate-800">
                  {headerGroupsParent.map((headerGroup) => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                      {headerGroup.headers.map((column) => (
                        <th
                          {...column.getHeaderProps(
                            column.getSortByToggleProps()
                          )}
                          scope="col"
                          className=" table-th "
                        >
                          {column.render("Header")}
                          <span>
                            {column.isSorted
                              ? column.isSortedDesc
                                ? " 🔽"
                                : " 🔼"
                              : ""}
                          </span>
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody
                  className="bg-white divide-y divide-slate-100 dark:bg-slate-800 dark:divide-slate-700"
                  {...getTableBodyPropsParent}
                >
                  {pageParent.length > 0 ? (
                    pageParent.map((row) => {
                      prepareRowParent(row);
                      return (
                        <tr {...row.getRowProps()}>
                          {row.cells.map((cell) => (
                            <td {...cell.getCellProps()} className="table-td">
                              {cell.render("Cell")}
                            </td>
                          ))}
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td
                        colSpan={columns.length}
                        className="table-td text-center"
                      >
                        No hay datos
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="md:flex md:space-y-0 space-y-5 justify-between mt-6 items-center">
          <div className=" flex items-center space-x-3 rtl:space-x-reverse">
            <span className=" flex space-x-2  rtl:space-x-reverse items-center">
              <span className=" text-sm font-medium text-slate-600 dark:text-slate-300">
                Go
              </span>
              <span>
                <input
                  type="number"
                  className=" form-control py-2"
                  defaultValue={pageIndexParent + 1}
                  onChange={(e) => {
                    const pageNumber = e.target.value
                      ? Number(e.target.value) - 1
                      : 0;
                    gotoPageParent(pageNumber);
                  }}
                  style={{ width: "50px" }}
                />
              </span>
            </span>
            <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
              Page{" "}
              <span>
                {pageIndexParent + 1} of {pageOptionsParent.length}
              </span>
            </span>
          </div>
          <ul className="flex items-center  space-x-3  rtl:space-x-reverse">
            <li className="text-xl leading-4 text-slate-900 dark:text-white rtl:rotate-180">
              <button
                className={` ${!canPreviousPageParent ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                onClick={() => previousPageParent()}
                disabled={!canPreviousPageParent}
              >
                <Icon icon="heroicons-outline:chevron-left" />
              </button>
            </li>
            {pageOptionsParent.map((page, pageIdx) => (
              <li key={pageIdx}>
                <button
                  href="#"
                  aria-current="page"
                  className={` ${pageIdx === pageIndexParent
                    ? "bg-slate-900 dark:bg-slate-600  dark:text-slate-200 text-white font-medium "
                    : "bg-slate-100 dark:bg-slate-700 dark:text-slate-400 text-slate-900  font-normal  "
                    }    text-sm rounded leading-[16px] flex h-6 w-6 items-center justify-center transition-all duration-150`}
                  onClick={() => gotoPageParent(pageIdx)}
                >
                  {page + 1}
                </button>
              </li>
            ))}
            <li className="text-xl leading-4 text-slate-900 dark:text-white rtl:rotate-180">
              <button
                className={` ${!canNextPageParent ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                onClick={() => nextPageParent()}
                disabled={!canNextPageParent}
              >
                <Icon icon="heroicons-outline:chevron-right" />
              </button>
            </li>
          </ul>
        </div>
      </Card>
      <>
      <hr className="my-10" />
      </>
      {/* Child Table (if columnsDataChild is provided) */}
      {columnsDataChild && (
        <Card noborder>
          <div className="md:flex justify-between items-center mb-6 mt-6">
            <h4 className="card-title">Variantes</h4>
            <div>
              <GlobalFilter
                filter={globalFilterChild}
                setFilter={setGlobalFilterChild}
              />
            </div>
          </div>
          <div className="overflow-x-auto -mx-6">
            <div className="inline-block min-w-full align-middle">
              <div className="overflow-hidden ">
                <table
                  className="min-w-full divide-y divide-slate-100 table-fixed dark:divide-slate-700"
                  {...getTablePropsChild}
                >
                  <thead className=" border-t border-slate-100 dark:border-slate-800">
                    {headerGroupsChild.map((headerGroup) => (
                      <tr {...headerGroup.getHeaderGroupProps()}>
                        {headerGroup.headers.map((column) => (
                          <th
                            {...column.getHeaderProps(
                              column.getSortByToggleProps()
                            )}
                            scope="col"
                            className=" table-th "
                          >
                            {column.render("Header")}
                            <span>
                              {column.isSorted
                                ? column.isSortedDesc
                                  ? " 🔽"
                                  : " 🔼"
                                : ""}
                            </span>
                          </th>
                        ))}
                      </tr>
                    ))}
                  </thead>
                  <tbody
                    className="bg-white divide-y divide-slate-100 dark:bg-slate-800 dark:divide-slate-700"
                    {...getTableBodyPropsChild}
                  >
                    {pageChild.length > 0 ? (
                      pageChild.map((row) => {
                        prepareRowChild(row);
                        return (
                          <tr {...row.getRowProps()}>
                            {row.cells.map((cell) => (
                              <td {...cell.getCellProps()} className="table-td">
                                {cell.render("Cell")}
                              </td>
                            ))}
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td
                          colSpan={columnsDataChild.length}
                          className="table-td text-center"
                        >
                          No hay datos
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div className="md:flex md:space-y-0 space-y-5 justify-between mt-6 items-center">
            <div className=" flex items-center space-x-3 rtl:space-x-reverse">
              <span className=" flex space-x-2  rtl:space-x-reverse items-center">
                <span className=" text-sm font-medium text-slate-600 dark:text-slate-300">
                  Go
                </span>
                <span>
                  <input
                    type="number"
                    className=" form-control py-2"
                    defaultValue={pageIndexChild + 1}
                    onChange={(e) => {
                      const pageNumber = e.target.value
                        ? Number(e.target.value) - 1
                        : 0;
                      gotoPageChild(pageNumber);
                    }}
                    style={{ width: "50px" }}
                  />
                </span>
              </span>
              <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
                Page{" "}
                <span>
                  {pageIndexChild + 1} of {pageOptionsChild.length}
                </span>
              </span>
            </div>
            <ul className="flex items-center  space-x-3  rtl:space-x-reverse">
              <li className="text-xl leading-4 text-slate-900 dark:text-white rtl:rotate-180">
                <button
                  className={` ${!canPreviousPageChild ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  onClick={() => previousPageChild()}
                  disabled={!canPreviousPageChild}
                >
                  <Icon icon="heroicons-outline:chevron-left" />
                </button>
              </li>
              {pageOptionsChild.map((page, pageIdx) => (
                <li key={pageIdx}>
                  <button
                    href="#"
                    aria-current="page"
                    className={` ${pageIdx === pageIndexChild
                      ? "bg-slate-900 dark:bg-slate-600  dark:text-slate-200 text-white font-medium "
                      : "bg-slate-100 dark:bg-slate-700 dark:text-slate-400 text-slate-900  font-normal  "
                      }    text-sm rounded leading-[16px] flex h-6 w-6 items-center justify-center transition-all duration-150`}
                    onClick={() => gotoPageChild(pageIdx)}
                  >
                    {page + 1}
                  </button>
                </li>
              ))}
              <li className="text-xl leading-4 text-slate-900 dark:text-white rtl:rotate-180">
                <button
                  className={` ${!canNextPageChild ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  onClick={() => nextPageChild()}
                  disabled={!canNextPageChild}
                >
                  <Icon icon="heroicons-outline:chevron-right" />
                </button>
              </li>
            </ul>
          </div>
        </Card>
      )}
    </>
  );
};

export default ExamapleOne;