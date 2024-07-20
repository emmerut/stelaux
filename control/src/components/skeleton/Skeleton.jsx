import React from "react";

export const Grid = ({ items, count = 6 }) => {
    // set items length by count
    items = items || Array.from({ length: count });
    return (
        <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-5">
            {items.map((item, i) => (
                <div
                    className="rounded-md bg-white dark:bg-slate-700 h-full p-6 shadow-base"
                    key={i}
                >
                    <div className="animate-pulse">
                        <header className="flex justify-between items-center space-x-6">
                            <div className="flex-1 flex items-center space-x-4">
                                <div className="flex-none flex space-x-2 items-center">
                                    <div className="h-10 w-10 rounded bg-[#C4C4C4] dark:bg-slate-500"></div>
                                </div>
                                <div className="flex-1 bg-[#C4C4C4] dark:bg-slate-500 h-2 rounded-full"></div>
                            </div>
                            <div className="flex-none">
                                <div className="h-6 w-6 rounded-full bg-[#C4C4C4] dark:bg-slate-500"></div>
                            </div>
                        </header>
                        <div className="py-6 space-y-2">
                            <div className="h-[6px] bg-[#C4C4C4] dark:bg-slate-500"></div>
                            <div className="h-[6px] bg-[#C4C4C4] dark:bg-slate-500"></div>
                            <div className="h-[6px] bg-[#C4C4C4] dark:bg-slate-500"></div>
                        </div>
                        <div className="grid grid-cols-2 gap-5">
                            <div className="space-y-2">
                                <span className="h-[4px] bg-[#C4C4C4] dark:bg-slate-500 block"></span>
                                <span className="h-[4px] bg-[#C4C4C4] dark:bg-slate-500 block"></span>
                            </div>

                            <div className="space-y-2">
                                <span className="h-[4px] bg-[#C4C4C4] dark:bg-slate-500 block"></span>
                                <span className="h-[4px] bg-[#C4C4C4] dark:bg-slate-500 block"></span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-5 mt-6">
                            <div className="flex -space-x-1">
                                <div className="h-6 w-6 bg-[#C4C4C4] dark:bg-slate-500 rounded-full"></div>
                                <div className="h-6 w-6 bg-[#C4C4C4] dark:bg-slate-500 rounded-full"></div>
                                <div className="h-6 w-6 bg-[#C4C4C4] dark:bg-slate-500 rounded-full"></div>
                            </div>
                            <div>
                                <span className="h-[18px] bg-[#C4C4C4] dark:bg-slate-500 w-[130px] inline-block rounded-full"></span>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export const ListLoading = ({ items, count }) => {
    items = items || Array.from({ length: count });
    return (
        <div className="divide-y divide-slate-100 dark:divide-slate-700">
            {items.map((item, i) => (
                <div className="p-4 w-full mx-auto" key={i}>
                    <div className="animate-pulse flex items-center space-x-4">
                        <div className="flex-none flex space-x-2 items-center">
                            <div className="rounded h-5 w-5 bg-[#C4C4C4] dark:bg-slate-500"></div>
                            <div className="rounded h-5 w-5 bg-[#C4C4C4] dark:bg-slate-500"></div>
                            <div className="h-8 w-8 rounded-full bg-[#C4C4C4] dark:bg-slate-500"></div>
                        </div>
                        <div className="flex-1 bg-[#C4C4C4] dark:bg-slate-500 h-2"></div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export const SkeletionTable = ({ items, count }) => {
    items = items || Array.from({ length: count });
    return (
        <div className="w-full bg-white dark:bg-slate-700 shadow-base p-6 rounded-md">
            <table className="animate-pulse w-full border-separate border-spacing-4 table-fixed">
                <thead>
                    <tr>
                        <th scope="col">
                            <div className="h-4 bg-[#C4C4C4] dark:bg-slate-500"></div>
                        </th>
                        <th scope="col">
                            <div className="h-4 bg-[#C4C4C4] dark:bg-slate-500"></div>
                        </th>
                        <th scope="col">
                            <div className="h-4 bg-[#C4C4C4] dark:bg-slate-500"></div>
                        </th>
                        <th scope="col">
                            <div className="h-4 bg-[#C4C4C4] dark:bg-slate-500"></div>
                        </th>
                        <th scope="col">
                            <div className="h-4 bg-[#C4C4C4] dark:bg-slate-500"></div>
                        </th>
                    </tr>
                </thead>
                <tbody className="table-group-divider">
                    {items.map((item, i) => (
                        <tr key={i}>
                            <td>
                                <div className="h-2 bg-[#C4C4C4] dark:bg-slate-500"></div>
                            </td>
                            <td>
                                <div className="h-2 bg-[#C4C4C4] dark:bg-slate-500"></div>
                            </td>
                            <td>
                                <div className="h-2 bg-[#C4C4C4] dark:bg-slate-500"></div>
                            </td>
                            <td>
                                <div className="h-2 bg-[#C4C4C4] dark:bg-slate-500"></div>
                            </td>
                            <td>
                                <div className="h-2 bg-[#C4C4C4] dark:bg-slate-500"></div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export const SkeletionTitle = ({ className }) => {
    return (
        <div className="animate-pulse">
            <div className={`h-4 bg-[#C4C4C4] dark:bg-slate-500 rounded-full ${className}`}></div>
        </div>
    );
};

export const SkeletionGrid = ({count = 3}) => {
    return (
        <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-6">
            {Array.from({ length: count }).map((_, index) => (
                <SkeletionCard key={index} />
            ))}
        </div>
    );
};

const SkeletionCard = () => {
    return (
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6">
            <div className="space-y-6">
                <SkeletionTitle className="w-40 mb-2" />
                <SkeletionTitle className="w-24 mb-2" />
                <SkeletionTitle className="w-16 mb-2" />
                <div className="animate-pulse h-4 bg-[#C4C4C4] dark:bg-slate-500 rounded-full w-24"></div>
            </div>
        </div>
    );
};

export const SkeletionAvatar = ({ width }) => {
    return (
        <div className={`animate-pulse rounded-full bg-[#C4C4C4] dark:bg-slate-500 ${width ? width : `h-10 w-10`}`}></div>
    );
};

export const SkeletionParagraph = () => {
    return (
        <div className="animate-pulse h-4 bg-[#C4C4C4] dark:bg-slate-500 rounded-full"></div>
    );
};