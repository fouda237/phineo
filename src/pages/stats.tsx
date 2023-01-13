import {AdminLayout} from '../layouts';
import React from 'react';
import Icon from "../assets/images/stats.png"
import {Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis} from 'recharts';


const data = [
    {
        name: 'Lundi',
        uv: 10,
        pv: 2400,
        amt: 2400,
    },
    {
        name: 'Mardi',
        uv: 17,
        pv: 1398,
        amt: 2210,
    },
    {
        name: 'Mercredi',
        uv: 19,
        pv: 9800,
        amt: 2290,
    },
    {
        name: 'Jeudi',
        uv: 13,
        pv: 3908,
        amt: 2000,
    },
    {
        name: 'Vendredi',
        uv: 27,
        pv: 4800,
        amt: 2181,
    },
    {
        name: 'Samedi',
        uv: 4,
        pv: 3800,
        amt: 2500,
    },
    {
        name: 'Dimanche',
        uv: 9,
        pv: 4300,
        amt: 2100,
    },
];

const Stats = () => {
    const demoUrl = 'https://codesandbox.io/s/simple-area-chart-4ujxw';

    return (
        <AdminLayout>
            <section>
                <div className={"flex space-x-3 items-center "}>
                    <img src={Icon} alt={"icon"} className={"w-9"}/>
                    <h3 className={"text-gray-500"}>Statistiques</h3>
                </div>
                <hr className={"my-6"}/>
            </section>
            <section className={"flex flex-wrap items-center justify-between w-full space-y-6"}>
                <section className={"w-1/2 p-4 h-96"}>
                    <h1 className={"text-center my-4 text-gray-500"}>Temps moyen de session</h1>
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                            width={500}
                            height={400}
                            data={data}
                            margin={{
                                top: 10,
                                right: 30,
                                left: 0,
                                bottom: 0,
                            }}
                        >
                            <CartesianGrid strokeDasharray="3 3"/>
                            <XAxis dataKey="name"/>
                            <YAxis/>
                            <Tooltip/>
                            <Area type="monotone" dataKey="uv" stroke="#8884d8" fill="#8884d8"/>
                        </AreaChart>
                    </ResponsiveContainer>
                </section>
                <section className={"w-1/2 p-4 h-96"}>
                    <h1 className={"text-center my-4 text-gray-500"}>Nombre de formation créées</h1>
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                            width={500}
                            height={400}
                            data={data}
                            margin={{
                                top: 10,
                                right: 30,
                                left: 0,
                                bottom: 0,
                            }}
                        >
                            <CartesianGrid strokeDasharray="3 3"/>
                            <XAxis dataKey="name"/>
                            <YAxis/>
                            <Tooltip/>
                            <Area type="monotone" dataKey="uv" stroke="#8884d8" fill="#8884d8"/>
                        </AreaChart>
                    </ResponsiveContainer>
                </section>
                <section className={"w-full p-4 h-96"}>
                    <h1 className={"text-center my-4 text-gray-500"}>Nombre d'étudiants</h1>
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                            width={500}
                            height={400}
                            data={data}
                            margin={{
                                top: 10,
                                right: 30,
                                left: 0,
                                bottom: 0,
                            }}
                        >
                            <CartesianGrid strokeDasharray="3 3"/>
                            <XAxis dataKey="name"/>
                            <YAxis/>
                            <Tooltip/>
                            <Area type="monotone" dataKey="uv" stroke="#8884d8" fill="#8884d8"/>
                        </AreaChart>
                    </ResponsiveContainer>
                </section>
            </section>
        </AdminLayout>
    );
};

export default Stats;
