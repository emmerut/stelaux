import React, { useState, useEffect } from "react";
import DynamicTable from "@/pages/table/react-tables/DynamicTable";
import { productData, serviceData } from '@/constant/inventoryData';
import HomeBredCurbs from "@/components/inventory/InventoryBredCurbs";

const Ecommerce = ({ mainTitle, buttonSet, tableType }) => {
  const [service, setService] = useState([]);
  const [product, setProduct] = useState([]);
  const [dataFetched, setDataFetched] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [productVariant, setProductVariant] = useState([]);
  const [serviceVariant, setServiceVariant] = useState([]);
  const [dataProductTable, setDataProductTable] = useState([]);
  const [dataServiceTable, setDataServiceTable] = useState([]);
  const [dataProductVariantTable, setProductVariantDataTable] = useState([]);
  const [dataServiceVariantTable, setDataServiceVariantTable] = useState([]);
  const [filterMap, setFilterMap] = useState("usa");

  useEffect(() => {
    const catchFetchService = async () => {
      try {
        const res = await serviceData();
        if (res) {
          setService(res.services);
        }
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };

    catchFetchService();
  }, []);

  useEffect(() => {
    const catchFetchProduct = async () => {
      try {
        const res = await productData();
        if (res) {
          setProduct(res.products);
          setDataFetched(true);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        setDataFetched(true);

      }
    };

    catchFetchProduct();
  }, []);

  useEffect(() => {
    const catchFetchProductVariant = async () => {
      try {
        const res = await productData();
        if (res) {
          setProductVariant(res.variants);
          setDataFetched(true);
        }
      } catch (error) {
        console.error("Error fetching variants:", error);
        setDataFetched(true);
      }
    };

    catchFetchProductVariant();
  }, []);

  useEffect(() => {
    const catchFetchServiceVariant = async () => {
      try {
        const res = await serviceData();
        if (res) {
          setServiceVariant(res.variants);

        }
      } catch (error) {
        console.error("Error fetching variants:", error);

      }
    };

    catchFetchServiceVariant();
  }, []);

  useEffect(() => {

    const table = [];

    service.forEach(item => {
      table.push({
        id: item.id,
        service: item.title,
        image: item.image,
        profit: item.profit,
        status: item.status,
        action: null,
      });
    });
    setDataServiceTable(table);
    setDataLoaded(true);

  }, [service]);

  useEffect(() => {

    const table = [];
    if (dataFetched) {
      product.forEach(item => {
        table.push({
          id: item.id,
          product: item.title,
          image: item.image,
          stock: item.total_stock,
          status: item.status,
          action: null,
        });
      });

      setDataProductTable(table);
      setDataLoaded(true);
    }

  }, [product, dataFetched]);

  useEffect(() => {

    const table = [];
    if (dataFetched) {
      productVariant.forEach(item => {
        table.push({
          id: item.id,
          sku: item.sku,
          variant: item.parent,
          color: item.render_color,
          size: item.size,
          image: item.image,
          stock: item.stock,
          price: item.price,
          action: null,
        });
      });

      setProductVariantDataTable(table);
      setDataLoaded(true);
    }

  }, [productVariant, dataFetched]);

  useEffect(() => {

    const table = [];

    serviceVariant.forEach(item => {
      table.push({
        id: item.id,
        parent: item.parent,
        service: item.title,
        image: item.profit,
        price: item.status,
        action: null,
      });
    });
    setDataServiceVariantTable(table);
    setDataLoaded(true);
  }, [serviceVariant]);

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
        return <span>{row?.cell?.value}</span>;
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
        return <span>{row?.cell?.value}</span>;
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
      Header: "service",
      accessor: "service",
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
          moduleType="service"
        />
        <br />
        <DynamicTable
          COLUMNS={VARIANTSERVICECOLUMNS}
          dataTable={dataServiceVariantTable}
          dataLoaded={dataLoaded}
          dataFetched={dataFetched}
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
            moduleType="product"
          />
          <br />
          <DynamicTable
            COLUMNS={VARIANTPRODUCTCOLUMNS}
            dataTable={dataProductVariantTable}
            dataLoaded={dataLoaded}
            dataFetched={dataFetched}
            moduleType="productVariant"
          />
        </>
      )
      : null;
  return (
    <div>
      <HomeBredCurbs title={mainTitle} setID={buttonSet} />
      {tableComponent}

    </div>
  );
};

export default Ecommerce;
