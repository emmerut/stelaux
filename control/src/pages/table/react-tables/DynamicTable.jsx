import React, { useState, useMemo, useEffect } from "react";
import Card from "@/components/ui/Card";
import Icon from "@/components/ui/Icon";
import Dropdown from "@/components/ui/Dropdown";
import Modal from "@/components/ui/Modal";
import Button from '@/components/ui/Button';
import { Menu } from "@headlessui/react";
import {
  useTable,
  useRowSelect,
  useSortBy,
  useGlobalFilter,
  usePagination,
} from "react-table";
import GlobalFilter from "./GlobalFilter";
import ServiceForm from "@/components/form/Inventory/Update/ServiceForm";
import ProductForm from "@/components/form/Inventory/Update/ProductForm";
import ServiceVariantForm from "@/components/form/Inventory/Update/VariantServiceForm";
import ProductVariantForm from '@/components/form/Inventory/Update/VariantProductForm'

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

const forms = {
  'service': ServiceForm,
  'serviceVariant': ServiceVariantForm,
  'product': ProductForm,
  'productVariant': ProductVariantForm,
};

const Table = ({ COLUMNS, dataTable, dataLoaded, dataFetched, moduleType }) => {
  const [filter, setFilter] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [formPK, setFormPK] = useState(null);
  const [selectedData, setSelectedData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (dataLoaded && dataFetched) {
      setLoading(false);
    }
  }, [dataTable, dataLoaded, dataFetched]);

  function modifyColumns(columns, newColumn) {
    const updatedColumns = [...columns];
    updatedColumns.push(newColumn);
    return updatedColumns;
  }

  const actionColumn = {
    Header: "acción",
    accessor: "action",
    Cell: (row) => {
      return (
        <div>
          <Dropdown
            classMenuItems="right-0 w-[140px] top-[110%] "
            label={
              <span className="text-xl text-center block w-full">
                <Icon icon="heroicons-outline:dots-vertical" />
              </span>
            }
          >
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {actions.map((item, i) => (
                <Menu.Item key={i}>
                  <div
                    onClick={() => handleEdit(row.cell.row.index, row.data)}
                    className={`${
                      item.name === "delete"
                        ? "bg-danger-500 text-danger-500 bg-opacity-30   hover:bg-opacity-100 hover:text-white"
                        : "hover:bg-slate-900 hover:text-white dark:hover:bg-slate-600 dark:hover:bg-opacity-50"
                    }
                      w-full border-b border-b-gray-500 border-opacity-10 px-4 py-2 text-sm  last:mb-0 cursor-pointer 
                      first:rounded-t last:rounded-b flex  space-x-2 items-center rtl:space-x-reverse 
                    `}
                  >
                    <span className="text-base">
                      <Icon icon={item.icon} />
                    </span>
                    <span>{item.name}</span>
                  </div>
                </Menu.Item>
              ))}
            </div>
          </Dropdown>
        </div>
      );
    },
  };

  const actions = [
    {
      name: "edit",
      icon: "heroicons:pencil-square",
    },
  ];

  const clearColumns = modifyColumns(COLUMNS, actionColumn);

  const closeModal = () => {
    setShowModal(false);
  };

  const columns = useMemo(() => clearColumns, []);
  const data = useMemo(() => dataTable, [dataTable]);

  const handleEdit = (rowIndex, actionData) => {
    setFormPK(actionData[rowIndex].id);
    setShowModal(true);
  };

  const filteredData = useMemo(() => {
    if (!filter) return data;
    return data.filter((row) =>
      Object.values(row).some((val) =>
        String(val).toLowerCase().includes(filter.toLowerCase())
      )
    );
  }, [filter, data]);

  const tableInstance = useTable(
    {
      columns,
      data: filteredData,
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

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    footerGroups,
    page,
    nextPage,
    previousPage,
    canNextPage,
    canPreviousPage,
    pageOptions,
    state: { globalFilter, pageIndex, pageSize, selectedRowIds },
    gotoPage,
    pageCount,
    setPageSize,
    setGlobalFilter,
    prepareRow,
    selectedFlatRows,
  } = tableInstance;

  useEffect(() => {
    const selectedData = selectedFlatRows.map((row) => row.original);
    setSelectedData(selectedData);
  }, [selectedRowIds, selectedFlatRows]);

  const handleButtonClick = () => {
    if (selectedData.length > 0) {
      // Procesar los datos seleccionados
      console.log("Selected Data:", selectedData);
    }
  };

  const ActiveForm = forms[moduleType];

  return (
    <>
      <Card noborder>
        <div className="md:flex justify-between items-center mb-6">
          <h4 className="card-title"></h4>
          {selectedData.length > 0 && (
            <Button
              className="text-oxanium bg-danger-500 text-white hover:bg-black-100 hover:text-danger-500 shadow-md px-6 smc:px-4 smc:py-2 smc:text-xs"
              onClick={handleButtonClick}
            >
              Eliminar
            </Button>
          )}
          <div>
            <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} />
          </div>
        </div>
        <div className="overflow-x-auto -mx-6">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden">
              <table
                className="min-w-full divide-y divide-slate-100 table-fixed dark:divide-slate-700"
                {...getTableProps()}
              >
                <thead className="border-t border-slate-100 dark:border-slate-800">
                  {headerGroups.map((headerGroup) => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                      {headerGroup.headers.map((column) => (
                        <th
                          {...column.getHeaderProps(
                            column.getSortByToggleProps()
                          )}
                          scope="col"
                          className="table-th"
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
                  {...getTableBodyProps()}
                >
                  {loading || filteredData.length === 0 ? (
                    // Render loading or empty state
                    <tr>
                      <td colSpan={columns.length} style={{ textAlign: "center" }}>
                        {loading ? (
                          <div className="loader-table"></div>
                        ) : (
                          <div>No data available</div>
                        )}
                      </td>
                    </tr>
                  ) : (
                    // Render table rows when data is loaded
                    page.map((row) => {
                      prepareRow(row);
                      return (
                        <tr {...row.getRowProps()}>
                          {row.cells.map((cell) => {
                            return (
                              <td {...cell.getCellProps()} className="table-td">
                                {cell.render("Cell")}
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="md:flex md:space-y-0 space-y-5 justify-between mt-6 items-center">
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <span className="flex space-x-2 rtl:space-x-reverse items-center">
              <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
                Go
              </span>
              <span>
                <input
                  type="number"
                  className="form-control py-2"
                  defaultValue={pageIndex + 1}
                  onChange={(e) => {
                    const pageNumber = e.target.value
                      ? Number(e.target.value) - 1
                      : 0;
                    gotoPage(pageNumber);
                  }}
                  style={{ width: "50px" }}
                />
              </span>
            </span>
            <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
              Page{" "}
              <span>
                {pageIndex + 1} of {pageOptions.length}
              </span>
            </span>
          </div>
          <ul className="flex items-center space-x-3 rtl:space-x-reverse">
            <li className="text-xl leading-4 text-slate-900 dark:text-white rtl:rotate-180">
              <button
                className={`${
                  !canPreviousPage ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={() => previousPage()}
                disabled={!canPreviousPage}
              >
                <Icon icon="heroicons-outline:chevron-left" />
              </button>
            </li>
            {pageOptions.map((page, pageIdx) => (
              <li key={pageIdx}>
                <button
                  href="#"
                  aria-current="page"
                  className={`${
                    pageIdx === pageIndex
                      ? "bg-slate-900 dark:bg-slate-600  dark:text-slate-200 text-white font-medium "
                      : "bg-slate-100 dark:bg-slate-700 dark:text-slate-400 text-slate-900  font-normal  "
                  }    text-sm rounded leading-[16px] flex h-6 w-6 items-center justify-center transition-all duration-150`}
                  onClick={() => gotoPage(pageIdx)}
                >
                  {pageIdx + 1}
                </button>
              </li>
            ))}
            <li className="text-xl leading-4 text-slate-900 dark:text-white rtl:rotate-180">
              <button
                className={`${
                  !canNextPage ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={() => nextPage()}
                disabled={!canNextPage}
              >
                <Icon icon="heroicons-outline:chevron-right" />
              </button>
            </li>
          </ul>
        </div>
      </Card>
      <Modal
        activeModal={showModal}
        onClose={closeModal}
        centered={true}
        className="max-w-4xl modal-scroll"
        title="Editar Datos"
        themeClass="bg-indigo-900"
        scrollContent={true}
      >
      {ActiveForm && <ActiveForm objID={formPK} />}
      </Modal>
    </>
  );
};

export default Table;