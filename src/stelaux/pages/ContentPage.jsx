import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import HeaderGrid from "../layouts/creator/header/HeaderGrid";

export function ContentPage() {
  return (
    <>
      <DndProvider backend={HTML5Backend}>
        <HeaderGrid />
      </DndProvider>
    </>
  );
}
