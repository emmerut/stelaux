import CardGrid from "../layouts/dashboard/TopContainer";
import BottomContainer from "../layouts/dashboard/BottomContainer";
import { CardUsageExample } from "../components/Card";

export function HomePage() {
  return (
    <>
      <div>Bienvenido a Stela Control Dynamic</div>
      <p>Tablero Principal</p>
      <CardGrid>
        <CardUsageExample className="order-2 lg:order-1" name="Tráfico" />
        <CardUsageExample className="order-3 lg:order-2" name="Ventas" />
        <CardUsageExample
          className="col-span-2 order-1 row-span-5 lg:row-span-1 lg:order-3"
          name="Notificaciones del Sitio"
        />
      </CardGrid>
      <BottomContainer>
        <CardUsageExample name="Cobros"/>
        <CardUsageExample name="Usuarios nuevos"/>
        <CardUsageExample name="Mensajería"/>
      </BottomContainer>
    </>
  );
}
