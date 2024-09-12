import { useEffect, useState } from 'react';
import Card from "@/components/ui/Card";
import HomeBredCurbs from "@/components/portals/PortalBredCurbs";
import { getPortal, apiDeletePortal } from '@/constant/apiData';
import Loading from "@/components/Loading";
import Button from "@/components/ui/Button";
import { useNavigate } from 'react-router-dom';

const Portals = ({ mainTitle, subtitle, buttonSet }) => {
    const [portals, setPortals] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getPortal();
                if (data) {
                    setPortals(data);
                }
            } catch (error) {
                setError(error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleEditarPortal = (portal) => {
        navigate(`/portals/${portal.requirement_data.id}`);
    };

    const handleDeletePortal = async (portal) => {
        try {
            setIsLoading(true);
            await apiDeletePortal(portal.id);
            setPortals(portals.filter((p) => p.id !== portal.id));
        } catch (error) {
            setError(error);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="grid place-items-center h-[40vh]">
                <Loading />
            </div>
        );
    }

    if (error) {
        return (
            <div className="grid place-items-center h-[40vh]">
                <p>Error al cargar los portales: {error.message}</p>
            </div>
        );
    }

    return (
        <>
            <HomeBredCurbs title={mainTitle} subtitle={subtitle} setID={buttonSet} />

            {portals.length > 0 ? (
                <section className="container mx-auto px-4 py-8 grid grid-cols-4 gap-4">
                    {portals.map((portal, index) => (
                        <div key={index} className="grid grid-cols-1 gap-4 mb-4">
                            <Card bodyClass="p-0">
                                <div className="h-[140px] w-full">
                                    <img
                                        src={portal.status === "Pending" ? portal.requirement_data.file_image : portal.imageUrl}
                                        alt={portal.domain}
                                        className={`block w-full h-full object-cover rounded-t-md ${portal.status === "Pending" ? "opacity-50" : ""}`}
                                    />
                                </div>
                                <div className="p-6">
                                    <header className="mb-4">
                                        <div className="card-title font-semibold font-oxanium text-lg">
                                            {portal.requirement_data.project_type}
                                        </div>
                                        <span
                                            className={`badge ${portal.status === 'Pending' ? 'bg-yellow-400 text-yellow-900' :
                                                portal.status === 'Active' ? 'bg-success-500 text-white' :
                                                    portal.status === 'Inactive' ? 'bg-danger-500 text-white' : ''}`}
                                        >
                                            {portal.status === "Pending" ? "Draft" : portal.status === "Active" ? "Activo" : portal.status === "Inactive" ? "Inactivo" : portal.status}
                                        </span>
                                    </header>
                                    <div className="px-6 flex justify-between space-x-2">
                                        <Button
                                            icon="mdi:magic"
                                            iconPosition="left"
                                            iconClass="text-[20px]"
                                            className="bg-none border border-indigo-900 dark:border-sky-500 text-indigo-900 dark:text-sky-500 hover:bg-indigo-900 hover:text-white font-bold py-1 px-2 rounded text-xs"
                                            onClick={() => handleEditarPortal(portal.requirement_data.id)}
                                        />

                                        <Button
                                            icon="mdi:trash"
                                            iconPosition="left"
                                            iconClass="text-[20px]"
                                            className="bg-none border border-danger-500 text-danger-500 hover:bg-danger-500 hover:text-white font-bold py-1 px-2 rounded text-xs"
                                            onClick={() => handleDeletePortal(portal.id)}
                                        />
                                    </div>
                                </div>
                            </Card>
                        </div>
                    ))}
                </section>
            ) : (
                <div className="grid place-items-center h-[40vh]">
                    <p>Aun no tienes portales desplegados.</p>
                </div>
            )}
        </>
    );
};

export default Portals;
