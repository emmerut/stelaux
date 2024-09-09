import React, { useState } from 'react'
import Card from "@/components/ui/Card"
import Button from "@/components/ui/Button"
import Icon from "@/components/ui/Icon"
import { Link } from "react-router-dom"
import { Search, Globe, CheckCircle, XCircle, Plus } from 'lucide-react'
import HomeBredCurbs from "@/components/finance/FinanceBredCurbs";

export default function DomainsPage({ mainTitle }) {
    const [searchQuery, setSearchQuery] = useState('')
    const [domains, setDomains] = useState([])
    const [newDomain, setNewDomain] = useState('')
    const [registeredDomains, setRegisteredDomains] = useState([])

    const handleSearch = (e) => {
        e.preventDefault()
        console.log('Buscando:', searchQuery)
    }

    const handleRegister = (e) => {
        e.preventDefault()
        setDomains([...domains, { name: newDomain, status: 'Registrado' }])
        setNewDomain('')
    }

    return (
        <div className="container mx-auto p-4 space-y-6">
            <p>¡Hola! Vamos a crearle un nombre a tu sitio.</p>
            <Card title="Registra tu Dominio" noborder>
                <div className="flex gap-2">
                <input
                    type="text"
                    placeholder="Buscar dominio..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-grow lg:p-2 border rounded"
                />
                <Button text="Buscar" className="text-oxanium bg-indigo-900 text-white hover:bg-black-100 hover:text-indigo-900 shadow-md smc:px-2 smc:py-2 smc:text-xxs" />
                </div>
                
            </Card>

            {domains.length > 0 ? (
                <Card title="Resultados de Búsqueda" noborder>
                    <ul className="divide-y divide-gray-200">
                        {domains.map((domain, index) => (
                            <li key={index} className="py-3 flex justify-between items-center">
                                <span>{domain.name}</span>
                                <span
                                    className={`px-2 py-1 rounded-full text-xs ${domain.status === 'Disponible'
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-red-100 text-red-800'
                                        }`}
                                >
                                    {domain.status}
                                </span>
                            </li>
                        ))}
                    </ul>
                </Card>
            ) : (
                ''
            )}

            <Card title="Dominios Registrados" noborder>
                {registeredDomains.length > 0 ? (
                    <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                        {registeredDomains.map((domain, index) => (
                            <li key={index} className="py-3 flex justify-between items-center">
                                <div className="flex items-center space-x-3">
                                    <Globe className="text-green-500" />
                                    <span>{domain.name}</span>
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                    Expira: {domain.expirationDate}
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-center">No hay dominios registrados.</p>
                )}
            </Card>
        </div>
    )
}
