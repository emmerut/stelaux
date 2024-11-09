import HomeBredCurbs from "@/components/inventory/InventoryBredCurbs";
import InventoryTable from "@/pages/components/tables/TableData";

const Ecommerce = ({ mainTitle, buttonSet, tableType }) => {
  
  return (
    <div>
      <HomeBredCurbs title={mainTitle} setID={buttonSet} />
      <InventoryTable tableType={tableType}/>
    </div>
  );
};

export default Ecommerce;
