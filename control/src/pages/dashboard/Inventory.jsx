import React, { useState, useEffect, useCallback } from "react";
import DynamicTable from "@/pages/table/react-tables/DynamicTable";
import { productData, serviceData } from '@/constant/apiData';
import HomeBredCurbs from "@/components/inventory/InventoryBredCurbs";

const Ecommerce = ({ mainTitle, buttonSet, tableType }) => {
  const [dataFetched, setDataFetched] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [dataProductTable, setDataProductTable] = useState([]);
  const [dataServiceTable, setDataServiceTable] = useState([]);
  const [service, setService] = useState([]);
  const [product, setProduct] = useState([]);
  const [productVariant, setProductVariant] = useState([]);
  const [serviceVariant, setServiceVariant] = useState([]);
  const [dataProductVariantTable, setProductVariantDataTable] = useState([]);
  const [dataServiceVariantTable, setDataServiceVariantTable] = useState([]);
  const [filterMap, setFilterMap] = useState("usa");

  const updateTableData = (data, setDataFunction) => {
  
    const table = [];
    data.forEach(item => {
      // Define the object structure based on the tableType
      let tableRow;
      if (tableType === 'services') {
        tableRow = {
          id: item.id,
          service: item.title,
          image: item.image,
          profit: item.profit,
          status: item.status,
          action: null,
        };
      } else if (tableType === 'products') {
        tableRow = {
          id: item.id,
          product: item.title,
          image: item.image,
          stock: item.total_stock,
          status: item.status,
          action: null,
        };
      } else if (tableType === 'products') {
        tableRow = {
          id: item.id,
          sku: item.sku,
          variant: item.parent,
          color: item.render_color,
          size: item.size,
          image: item.image,
          stock: item.stock,
          price: item.price,
          status: item.status,
          action: null,
        };
      } else if (tableType === 'services') {
        tableRow = {
          id: item.id,
          parent: item.parent,
          variantService: item.title,
          image: item.image,
          price: item.price,
          status: item.status,
          action: null,
        };
      }
      table.push(tableRow);
    });
    setDataFunction(table);
  };

  const updateTableChildData = (data, setDataFunction) => {
    const table = [];
    data.forEach(item => {
      // Define the object structure based on the tableType
      let tableRow;
      if (tableType === 'products') {
        tableRow = {
          id: item.id,
          sku: item.sku,
          variant: item.parent,
          color: item.render_color,
          size: item.size,
          image: item.image,
          stock: item.stock,
          price: item.price,
          status: item.status,
          action: null,
        };
      } else if (tableType === 'services') {
        tableRow = {
          id: item.id,
          parent: item.parent,
          variantService: item.title,
          image: item.image,
          price: item.price,
          status: item.status,
          action: null,
        };
      }
      table.push(tableRow);
    });
    setDataFunction(table);
  };

  const fetchData = useCallback(async () => {
    if (tableType === 'services') {
      try {
        const res = await serviceData();
        if (res.services && res.variants) { 
          setService(res.services);
          setServiceVariant(res.variants);
          updateTableData(res.services, setDataServiceTable); 
          updateTableChildData(res.variants, setDataServiceVariantTable);
          
          setDataFetched(true);
        } else {
          // Handle case where either services or variants is null or undefined
          console.warn("Missing data in serviceData response. Services:", res.services, "Variants:", res.variants);
          setDataFetched(true);
        }
      } catch (error) {
        setDataFetched(true);
      }
    } else if (tableType === 'products') {
      try {
        const res = await productData();
        if (res.products && res.variants) { // Check if both products and variants exist
          setProduct(res.products);
          setProductVariant(res.variants);
          updateTableData(res.products, setDataProductTable); 
          updateTableChildData(res.variants, setProductVariantDataTable);
          setDataFetched(true);
        } else {
          // Handle case where either products or variants is null or undefined
          console.warn("Missing data in productData response. Products:", res.products, "Variants:", res.variants);
          setDataFetched(true);
        }
      } catch (error) {
        setDataFetched(true);
      }
    }
  }, [tableType]);
  
  useEffect(() => {
    fetchData(); 
  }, [fetchData, tableType]);

  useEffect(() => {
    setDataLoaded(true);
  }, [service, product, productVariant, serviceVariant]);

  const SERVICECOLUMNS = [
    {
      Header: "Id",
      accessor: "id",
      Cell: (row) => {
        return <span>{row?.cell?.value}</span>;
      },
    },
    {
      Header: "servicio",
      accessor: "service",
      Cell: (row) => {
        return <span>{row?.cell?.value}</span>;
      },
    },
    {
      Header: "imagen",
      accessor: "image",
      Cell: (row) => {
        return (
          <div>
            <span className="inline-flex items-center">
              <span className="w-7 h-7 rounded-full ltr:mr-3 rtl:ml-3 flex-none bg-slate-600">
                <img
                  src={row?.cell?.value}
                  alt=""
                  className="object-cover w-full h-full rounded-full"
                />
              </span>
            </span>
          </div>
        );
      },
    },
    {
      Header: "profit",
      accessor: "profit",
      Cell: (row) => {
        return <span>{row?.cell?.value}</span>;
      },
    },
    {
      Header: "status",
      accessor: "status",
      Cell: (row) => {
        return (
          <span className="block w-full">
            <span
              className={` inline-block px-3 min-w-[90px] text-center mx-auto py-1 rounded-[999px] bg-opacity-25 ${
                row?.cell?.value === "active"
                  ? "text-success-500 bg-success-500"
                  : ""
              } 
              ${
                row?.cell?.value === "inactive"
                  ? "text-warning-500 bg-warning-500"
                  : ""
              }
              
               `}
            >
              {row?.cell?.value}
            </span>
          </span>
        );
      },
    },
  ];

  const PRODUCTCOLUMNS = [
    {
      Header: "Id",
      accessor: "id",
      Cell: (row) => {
        return <span>{row?.cell?.value}</span>;
      },
    },
    {
      Header: "producto",
      accessor: "product",
      Cell: (row) => {
        return <span>{row?.cell?.value}</span>;
      },
    },
    {
      Header: "imagen",
      accessor: "image",
      Cell: (row) => {
        return (
          <div>
            <span className="inline-flex items-center">
              <span className="w-7 h-7 rounded-full ltr:mr-3 rtl:ml-3 flex-none bg-slate-600">
                <img
                  src={row?.cell?.value}
                  alt=""
                  className="object-cover w-full h-full rounded-full"
                />
              </span>
            </span>
          </div>
        );
      },
    },
    {
      Header: "stock",
      accessor: "stock",
      Cell: (row) => {
        return <span>{row?.cell?.value}</span>;
      },
    },
    {
      Header: "status",
      accessor: "status",
      Cell: (row) => {
        return (
          <span className="block w-full">
            <span
              className={` inline-block px-3 min-w-[90px] text-center mx-auto py-1 rounded-[999px] bg-opacity-25 ${
                row?.cell?.value === "active"
                  ? "text-success-500 bg-success-500"
                  : ""
              } 
              ${
                row?.cell?.value === "inactive"
                  ? "text-warning-500 bg-warning-500"
                  : ""
              }
              
               `}
            >
              {row?.cell?.value}
            </span>
          </span>
        );
      },
    },
  ];

  const VARIANTPRODUCTCOLUMNS = [
    {
      Header: "Id",
      accessor: "id",
      Cell: (row) => {
        return <span>{row?.cell?.value}</span>;
      },
    },
    {
      Header: "sku",
      accessor: "sku",
      Cell: (row) => {
        return <span>{row?.cell?.value}</span>;
      },
    },
    {
      Header: "variante",
      accessor: "variant",
      Cell: (row) => {
        return <span>{row?.cell?.value}</span>;
      },
    },
    {
      Header: "color",
      accessor: "color",
      Cell: (row) => {
        const colorClass = row?.cell?.value ? `${row?.cell?.value}` : "";
        return (
          <div className={`rounded w-6 h-6 ${colorClass}`}>

          </div>
        );
      },
    },
    {
      Header: "tamaño",
      accessor: "size",
      Cell: (row) => {
        return <span>{row?.cell?.value}</span>;
      },
    },
    {
      Header: "imagen",
      accessor: "image",
      Cell: (row) => {
        return (
          <div>
            <span className="inline-flex items-center">
              <span className="w-7 h-7 rounded-full ltr:mr-3 rtl:ml-3 flex-none bg-slate-600">
                <img
                  src={row?.cell?.value}
                  alt=""
                  className="object-cover w-full h-full rounded-full"
                />
              </span>
            </span>
          </div>
        );
      },
    },
    {
      Header: "stock",
      accessor: "stock",
      Cell: (row) => {
        return <span>{row?.cell?.value}</span>;
      },
    },
    {
      Header: "status",
      accessor: "status",
      Cell: (row) => {
        return (
          <span className="block w-full">
            <span
              className={` inline-block px-3 min-w-[90px] text-center mx-auto py-1 rounded-[999px] bg-opacity-25 ${
                row?.cell?.value === "active"
                  ? "text-success-500 bg-success-500"
                  : ""
              } 
              ${
                row?.cell?.value === "inactive"
                  ? "text-warning-500 bg-warning-500"
                  : ""
              }
              
               `}
            >
              {row?.cell?.value}
            </span>
          </span>
        );
      },
    },
    {
      Header: "precio",
      accessor: "price",
      Cell: (row) => {
        return <span>{row?.cell?.value}</span>;
      },
    },
  ];

  const VARIANTSERVICECOLUMNS = [
    {
      Header: "Id",
      accessor: "id",
      Cell: (row) => {
        return <span>{row?.cell?.value}</span>;
      },
    },
    {
      Header: "parent",
      accessor: "parent",
      Cell: (row) => {
        return <span>{row?.cell?.value}</span>;
      },
    },
    {
      Header: "Variante",
      accessor: "variantService",
      Cell: (row) => {
        return <span>{row?.cell?.value}</span>;
      },
    },
    {
      Header: "image",
      accessor: "image",
      Cell: (row) => {
        return (
          <div>
            <span className="inline-flex items-center">
              <span className="w-7 h-7 rounded-full ltr:mr-3 rtl:ml-3 flex-none bg-slate-600">
                <img
                  src={row?.cell?.value}
                  alt=""
                  className="object-cover w-full h-full rounded-full"
                />
              </span>
            </span>
          </div>
        );
      },
    },
    {
      Header: "status",
      accessor: "status",
      Cell: (row) => {
        return (
          <span className="block w-full">
            <span
              className={` inline-block px-3 min-w-[90px] text-center mx-auto py-1 rounded-[999px] bg-opacity-25 ${
                row?.cell?.value === "active"
                  ? "text-success-500 bg-success-500"
                  : ""
              } 
              ${
                row?.cell?.value === "inactive"
                  ? "text-warning-500 bg-warning-500"
                  : ""
              }
              
               `}
            >
              {row?.cell?.value}
            </span>
          </span>
        );
      },
    },
    {
      Header: "price",
      accessor: "price",
      Cell: (row) => {
        return <span>{row?.cell?.value}</span>;
      },
    },
  ];

  const tableComponent = tableType === 'services'

    ? (
      <>
        <DynamicTable
          COLUMNS={SERVICECOLUMNS}
          dataTable={dataServiceTable}
          dataLoaded={dataLoaded}
          dataFetched={dataFetched}
          refreshData={fetchData} // Add this line
          moduleType="service"
        />
        <br />
        <DynamicTable
          COLUMNS={VARIANTSERVICECOLUMNS}
          dataTable={dataServiceVariantTable}
          dataLoaded={dataLoaded}
          dataFetched={dataFetched}
          refreshData={fetchData} // Add this line
          moduleType="serviceVariant"
        />

      </>
    )
    : tableType === 'products'
      ? (
        <>
          <DynamicTable
            COLUMNS={PRODUCTCOLUMNS}
            dataTable={dataProductTable}
            dataLoaded={dataLoaded}
            dataFetched={dataFetched}
            refreshData={fetchData} // Add this line
            moduleType="product"
          />
          <br />
          <DynamicTable
            COLUMNS={VARIANTPRODUCTCOLUMNS}
            dataTable={dataProductVariantTable}
            dataLoaded={dataLoaded}
            dataFetched={dataFetched}
            refreshData={fetchData} // Add this line
            moduleType="productVariant"
          />
        </>
      )
      : null;
  return (
    <div>
      <HomeBredCurbs title={mainTitle} setID={buttonSet} refreshData={fetchData} />
      {tableComponent}

    </div>
  );
};

export default Ecommerce;
