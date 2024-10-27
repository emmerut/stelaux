import { useEffect, useState } from 'react';
import HomeBredCurbs from "@/components/portals/PortalBredCurbs";
import { getPortal, apiDeletePortal } from '@/constant/apiData';
import Loading from "@/components/Loading";
import { useNavigate } from 'react-router-dom';
import BoxesHub from '@/components/ui/BoxesHub';

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
            <BoxesHub
                objects={portals}
                handleEditarPortal={handleEditarPortal}
                handleDeletePortal={handleDeletePortal}
                portals={true}
            />
        </>
    );
};

export default Portals;
