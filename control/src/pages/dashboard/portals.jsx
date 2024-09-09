import Card from "@/components/ui/Card";
import HomeBredCurbs from "@/components/portals/PortalBredCurbs";

const portals = [

];

export default function Portals({ mainTitle, subtitle, buttonSet }) {
    return (
        <>
            <HomeBredCurbs title={mainTitle} subtitle={subtitle} setID={buttonSet} />
            <section className="container mx-auto px-4 py-8">
                {portals.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {portals.map((portal, index) => (
                            <Card key={index} className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                                <img src={portal.imageUrl} alt={portal.domain} className="w-full h-48 object-cover" />
                                <h3 className="font-semibold font-oxanium text-lg">{portal.domain}</h3>
                                <p className="text-sm text-gray-600">{portal.businessType}</p>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <div className="grid place-items-center h-[40vh]">
                        <p>Aun no tienes portales desplegados.</p>
                    </div>
                )}
            </section>
        </>

    );
}
