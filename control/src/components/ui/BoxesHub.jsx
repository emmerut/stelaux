import React from 'react'
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

export default function BoxesHub({ objects, handleEditeObj, handleDeleteObj, portals, accounts }) {
    return (
        <>
            {objects.length > 0 ? (
                <section className="container mx-auto px-4 py-8 grid grid-cols-4 gap-4">
                    {objects.map((obj, index) => (
                        <div key={index} className="grid grid-cols-1 gap-4 mb-4">
                            <Card bodyClass="p-0">
                                <div className="h-[140px] w-full">
                                    <img
                                        src={obj.status === "Pending" ? objects.requirement_data.file_image : objects.imageUrl}
                                        alt={obj.domain}
                                        className={`block w-full h-full object-cover rounded-t-md ${objects.status === "Pending" ? "opacity-50" : ""}`}
                                    />
                                </div>
                                {
                                    portals ? (
                                        <div className="p-6">
                                            <header className="mb-4">
                                                <div className="card-title font-semibold font-oxanium text-lg">
                                                    {obj.requirement_data.project_type}
                                                </div>
                                                <span
                                                    className={`badge ${obj.status === 'Pending' ? 'bg-yellow-400 text-yellow-900' :
                                                        obj.status === 'Active' ? 'bg-success-500 text-white' :
                                                            obj.status === 'Inactive' ? 'bg-danger-500 text-white' : ''}`}
                                                >
                                                    {obj.status === "Pending" ? "Draft" : obj.status === "Active" ? "Activo" : obj.status === "Inactive" ? "Inactivo" : obj.status}
                                                </span>
                                            </header>
                                            <div className="px-6 flex justify-between space-x-2">
                                                <Button
                                                    icon="mdi:magic"
                                                    iconPosition="left"
                                                    iconClass="text-[20px]"
                                                    className="bg-none border border-indigo-900 dark:border-sky-500 text-indigo-900 dark:text-sky-500 hover:bg-indigo-900 hover:text-white font-bold py-1 px-2 rounded text-xs"
                                                    onClick={() => handleEditeObj(obj.requirement_data.id)}
                                                />

                                                <Button
                                                    icon="mdi:trash"
                                                    iconPosition="left"
                                                    iconClass="text-[20px]"
                                                    className="bg-none border border-danger-500 text-danger-500 hover:bg-danger-500 hover:text-white font-bold py-1 px-2 rounded text-xs"
                                                    onClick={() => handleDeleteObj(obj.id)}
                                                />
                                            </div>
                                        </div>
                                    ) : accounts ? (
                                        <div className="p-6">
                                            <header className="mb-4">
                                                <div className="card-title font-semibold font-oxanium text-lg">
                                                    {obj.requirement_data.project_type}
                                                </div>
                                                <span
                                                    className={`badge ${obj.status === 'Pending' ? 'bg-yellow-400 text-yellow-900' :
                                                        obj.status === 'Active' ? 'bg-success-500 text-white' :
                                                            obj.status === 'Inactive' ? 'bg-danger-500 text-white' : ''}`}
                                                >
                                                    {obj.status === "Pending" ? "Draft" : obj.status === "Active" ? "Activo" : obj.status === "Inactive" ? "Inactivo" : obj.status}
                                                </span>
                                            </header>
                                            <div className="px-6 flex justify-between space-x-2">
                                                <Button
                                                    icon="mdi:magic"
                                                    iconPosition="left"
                                                    iconClass="text-[20px]"
                                                    className="bg-none border border-indigo-900 dark:border-sky-500 text-indigo-900 dark:text-sky-500 hover:bg-indigo-900 hover:text-white font-bold py-1 px-2 rounded text-xs"
                                                    onClick={() => handleEditeObj(obj.requirement_data.id)}
                                                />

                                                <Button
                                                    icon="mdi:trash"
                                                    iconPosition="left"
                                                    iconClass="text-[20px]"
                                                    className="bg-none border border-danger-500 text-danger-500 hover:bg-danger-500 hover:text-white font-bold py-1 px-2 rounded text-xs"
                                                    onClick={() => handleDeleteObj(obj.id)}
                                                />
                                            </div>
                                        </div>
                                    ) : null
                                }
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
    )
}
